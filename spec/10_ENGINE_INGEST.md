# 10 — ENGINE TẦNG 0: NHẬN REPO, TẢI, LỌC, VÂN TAY

> **Mục đích:** biến link GitHub hoặc file `.zip` thành bộ mã nguồn sạch trong RAM + vân tay dự án. 0 token, Zero-Disk (INV-03, INV-04).
> **Input:** `IngestSource` (nội bộ, Mục 0), dựng từ `IngestRequest`. **Output:** `IngestOutput` (nội bộ) ⇒ Tầng 1–2 (`11_ENGINE_DO_THI.md`).
> **Trong repo thi:** `src/server/engine/index.ts` (`runIngest`, gọi từ `runEngine`) · `src/server/engine/ingest/{url,probe,refs,download,unzip,prune,priority,special,secrets,fingerprint,snapshot}.ts`.
> **Kiểu:** `02_CONTRACTS.md` · **Hằng số:** `CONFIG.*` · Mã luật: `ING-xx`. Language Registry (bảng đuôi file ⇒ `LanguageId`, tier): `11` Mục 1.

---

## 0. Luồng, kiểu nội bộ, luật chung

```mermaid
flowchart TD
    A["IngestSource"] -->|GITHUB_URL| U["1 parseGithubUrl"] --> P["2 probeRepo"] --> R["3 resolveRef"]
    R --> D["4 downloadArchive"]
    A -->|GITHUB_COMMIT| D
    A -->|ZIP_UPLOAD| D2["4 receiveUpload"]
    D --> S["5 computeSnapshot"]
    D2 --> S
    S --> L["6 listEntries (Central Directory / 2 lượt streaming)"] --> C["7 classifyEntry"] --> SC["8 detectScope + selectFiles"]
    SC --> I["9 inflateSelected + decodeAndFilter"] --> SP["10 extractSpecial"] --> SE["11 redactSecrets + flagInjection"]
    SE --> F["12 buildFingerprint"] --> E["13 assertNotEmpty"] --> O["IngestOutput ⇒ 11"]
```

```typescript
// nội bộ — src/server/engine/index.ts
type IngestSource =
  | { kind: "GITHUB_URL"; repo_url: string; subdir_override: string | null }
  | { kind: "GITHUB_COMMIT"; owner: string; repo: string; sha: string; subdir: string }   // getOrRebuildStaticResult (03 §4)
  | { kind: "ZIP_UPLOAD"; file_name: string; bytes: Uint8Array; subdir_override: string | null };

interface VirtualFileOrigin {           // nội bộ — SourceMapStore
  kind: "NOTEBOOK" | "SFC";
  original_path: string;                // "nb/eda.ipynb"
  line_origin: string[];                // line_origin[i] = nhãn gốc của dòng ảo i+1: "cell 4" | "<script>"
}

interface IngestOutput {                // nội bộ — chỉ sống trong runEngine, không cache riêng
  repo_name: string;
  snapshot: RepoSnapshotKey;
  fingerprint: ProjectFingerprint;
  report: IngestionReport;              // engine_ms = 0, skipped.parse_error = 0 — 11 điền tiếp
  code: Map<string, string>;            // RAMCodeStore: path POSIX ⇒ nội dung đã làm sạch + che secret; chèn theo path tăng dần
  file_language: Map<string, LanguageId>;
  manifests: Map<string, string>;       // ManifestStore (không tính vào CONFIG.MAX_CLEAN_FILES)
  source_map: Map<string, VirtualFileOrigin>;
  module_info: { go_module_path: string | null; dart_package_name: string | null; package_entry_files: string[] };
}

export async function runIngest(src: IngestSource, signal: AbortSignal): Promise<IngestOutput>;
```

- **ING-01 Zero-Disk.** Buffer zip, nội dung file, manifest chỉ nằm trong RAM; không ghi file tạm. Trong `finally`: hủy timer, hủy stream, bỏ tham chiếu buffer.
- **ING-02 Tất định.** Mọi vòng lặp duyệt theo path đã sort (so sánh mã UTF-16, mặc định `Array.prototype.sort`); không dùng thời gian thực hay số ngẫu nhiên để quyết định. Cùng buffer + cùng `IngestSource` ⇒ cùng `IngestOutput`.
- **ING-03 Đo thời gian.** `report.ingest_ms` = `performance.now()` lúc kết thúc Mục 13 − lúc `runIngest` bắt đầu (sau khi đã lấy được semaphore `CONFIG.MAX_CONCURRENT_INGESTIONS`, `03` §6.7), làm tròn ms. Chỉ để hiển thị.
- **ING-04 Cache trước khi tải.** `GITHUB_URL`: sau Mục 1 tra alias `owner/repo@ref_path/subdir` (`03` §4); trúng ⇒ trả kết quả cache, bỏ qua Mục 2–13.

---

## 1. Phân tích link — `url.ts`

**Mục đích:** chuẩn hóa link người dán thành `GithubRepoInfo`. **Input:** `string`. **Output:** `GithubRepoInfo`.

```typescript
export function parseGithubUrl(raw: string): GithubRepoInfo;   // ném IngestionError("ERR_INVALID_GITHUB_URL")
```

1. **ING-10** `trim()`; cắt mọi thứ từ ký tự `?` hoặc `#` đầu tiên.
2. **ING-11** Chuẩn hóa theo thứ tự: `git@github.com:` ⇒ `https://github.com/`; `http://` ⇒ `https://`; thiếu scheme mà bắt đầu bằng `github.com/` hoặc `www.github.com/` ⇒ thêm `https://`; `https://www.github.com` ⇒ `https://github.com`; bỏ mọi `/` ở cuối.
3. **ING-12** Host khác đúng `github.com` (GitLab, `gist.github.com`…) ⇒ `ERR_INVALID_GITHUB_URL`.
4. **ING-13** Khớp `^https://github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+?)(?:\.git)?(?:/(tree|blob)/(.+)|/[^/]+(?:/.*)?)?$`. Không khớp ⇒ `ERR_INVALID_GITHUB_URL`.
   - `owner` = nhóm 1; `repo` = nhóm 2 (đã bỏ `.git`).
   - `ref_path` = nhóm 4 sau `decodeURIComponent`, bỏ `/` thừa; giữ nguyên dấu `/` bên trong (tên nhánh được chứa `/`). Có đoạn `..` ⇒ `ERR_INVALID_GITHUB_URL`. Không có `tree|blob` ⇒ `null` (trang con `/pulls`, `/issues`… bị bỏ qua).
   - `is_blob_link` = nhóm 3 là `blob`.
   - `clean_url` = `https://github.com/{owner}/{repo}`.

---

## 2. Thăm dò repo — `probe.ts`

**Mục đích:** phân biệt "không có repo" với "mạng chậm" trước khi tải. **Input:** `GithubRepoInfo`. **Output:** `{ result: ProbeResult; owner: string; repo: string }`.

```typescript
export async function probeRepo(info: GithubRepoInfo): Promise<{ result: ProbeResult; owner: string; repo: string }>;
```

1. **ING-20** `HEAD https://github.com/{owner}/{repo}`, `redirect: "follow"`, header `User-Agent: SimpliFey`, `AbortController` hết hạn sau `CONFIG.PREFLIGHT_TIMEOUT_MS`. Luôn `clearTimeout` trong `finally`.
2. **ING-21** Ánh xạ:

| Phản hồi | `ProbeResult` | Hành động |
| :-- | :-- | :-- |
| 200, URL cuối cùng trùng | `OK` | Sang Mục 3 |
| 200 sau chuyển hướng (repo đổi tên / chuyển owner) | `OK` | Lấy `owner/repo` **mới** từ path của `res.url`, dùng cho mọi bước sau |
| 404 (GitHub trả 404 cả cho repo private) | `NOT_FOUND_OR_PRIVATE` | `ERR_PREFLIGHT_404_OR_PRIVATE` |
| 451 | `UNAVAILABLE_451` | `ERR_REPO_UNAVAILABLE_451` |
| 429, 403 | `RATE_LIMITED` | `ERR_GITHUB_RATE_LIMIT_CDN` |
| Hết giờ, lỗi DNS/kết nối, 5xx, mã khác | `TIMEOUT` | Chờ `CONFIG.PREFLIGHT_RETRY_DELAY_MS`, thử lại **1 lần** cùng ngưỡng; vẫn `TIMEOUT` ⇒ `ERR_NETWORK_TIMEOUT` |

3. **ING-22** `probeRepo` không bao giờ trả `EMPTY`; giá trị đó do Mục 3 gán (ING-33). `TIMEOUT` không bao giờ được báo thành "repo không tồn tại".

---

## 3. Phân giải ref — `refs.ts`

**Mục đích:** tìm ref tải được và thư mục con. **Input:** `owner`, `repo`, `GithubRepoInfo`. **Output:** `ResolvedRef` (nội bộ).

```typescript
interface ResolvedRef {                 // nội bộ
  download_url: string;                 // codeload.../zip/<ref> hoặc github.com/.../archive/HEAD.zip
  ref: string | null;                   // null ⇒ nhánh mặc định chưa biết tên
  ref_label: string | null;             // → RepoSnapshotKey.ref_label
  subdir: string;                       // "" hoặc "src" (không có "/" cuối)
}
export async function resolveRef(owner: string, repo: string, info: GithubRepoInfo): Promise<ResolvedRef>;
async function refExists(owner: string, repo: string, ref: string): Promise<boolean>; // HEAD codeload
```

1. **ING-30 Kiểm 1 ref.** `HEAD https://codeload.github.com/{owner}/{repo}/zip/{ref}` (ref đã `encodeURI`), timeout `CONFIG.PREFLIGHT_TIMEOUT_MS`. 200 ⇒ có; 404 ⇒ không; 429/403 ⇒ `ERR_GITHUB_RATE_LIMIT_CDN`; 451 ⇒ `ERR_REPO_UNAVAILABLE_451`; hết giờ/5xx ⇒ thử lại 1 lần sau `CONFIG.PREFLIGHT_RETRY_DELAY_MS`, vẫn lỗi ⇒ `ERR_NETWORK_TIMEOUT`.
   > ⚠️ **Phải kiểm chứng ở giờ 0 của cuộc thi:** codeload trả mã trạng thái đúng cho `HEAD`. **Fallback đã định:** nếu `HEAD` trả 405/501, dùng `GET` cùng URL và `abort()` ngay khi nhận header (không đọc body).
2. **ING-31 Link có `ref_path` (D-11).** Tách `ref_path` theo `/` thành `s1..sk`. Với link `/blob/`, bỏ đoạn cuối (tên file) khỏi tập tạo ứng viên. Ứng viên = `s1`, `s1/s2`, …, thử **từ ngắn đến dài**, tối đa `CONFIG.MAX_REF_CANDIDATES` ứng viên. Ứng viên đầu tiên tồn tại là `ref`; phần còn lại của `ref_path` là `subdir`. Với `/blob/`, `subdir` = thư mục chứa file (đường dẫn còn lại bỏ basename; file ở gốc ⇒ `""`). Hết ứng viên ⇒ `ERR_BRANCH_NOT_FOUND`. `ref_label = ref`.
3. **ING-32 Link gốc (không `ref_path`).**
   1. `HEAD https://github.com/{owner}/{repo}/archive/HEAD.zip`, `redirect: "manual"`. Mã 3xx có `Location` khớp `^https://codeload\.github\.com/[^/]+/[^/]+/zip/(?:refs/heads/)?(.+)$` ⇒ `ref` = nhóm 1 (đã decode), `download_url = Location`, `ref_label = ref`. Mã 3xx với `Location` khác mẫu, hoặc 200 ⇒ `download_url` = chính URL `archive/HEAD.zip` (tải theo chuyển hướng), `ref = null`, `ref_label = null`. 404 ⇒ bước 2.
      > ⚠️ **Phải kiểm chứng ở giờ 0:** `archive/HEAD.zip` chuyển hướng tới nhánh mặc định thật. **Fallback đã định:** hành vi khác mô tả ⇒ coi như 404 và chạy bước 2.
   2. Thử lần lượt `CONFIG.DEFAULT_BRANCH_FALLBACKS` bằng ING-30; gặp ref tồn tại ⇒ dùng.
   3. **ING-33** Mọi bước đều 404 ⇒ `ProbeResult = "EMPTY"` ⇒ `ERR_EMPTY_REPOSITORY`.
4. **ING-34** `subdir` được chuẩn hóa như ING-60 bước 3; không có trong mục lục zip ⇒ `ERR_NO_SOURCE_FILES_FOUND` (details `{ subdir }`) ở Mục 8.

---

## 4. Tải về — `download.ts`

**Mục đích:** đưa byte zip vào RAM có trần byte và trần thời gian. **Input:** `ResolvedRef` / commit SHA / body upload. **Output:** `RawArchive` (nội bộ).

```typescript
interface RawArchive { bytes: Uint8Array; stream_cut: boolean; source: "GITHUB" | "ZIP" }  // nội bộ
export async function downloadArchive(url: string, signal: AbortSignal): Promise<RawArchive>;
export async function receiveUpload(body: ReadableStream<Uint8Array>, contentType: string): Promise<{ file_name: string; bytes: Uint8Array; subdir: string | null }>;
```

1. **ING-40 Một timer cho cả Tầng 0 sau ref.** Mỗi lần thử tạo 1 `AbortController` hết hạn sau `CONFIG.STREAM_TIMEOUT_MS`, phủ tải + đọc mục lục + giải nén (Mục 4–11 kiểm `signal.aborted` giữa các entry).
2. **ING-41 Tải.** `GET download_url` (`GITHUB_COMMIT` ⇒ `https://codeload.github.com/{owner}/{repo}/zip/{sha}`). Không tin `Content-Length`. Đọc `res.body` theo chunk, cộng dồn số byte thật nhận.
3. **ING-42 Cắt cụt.** Khi tổng byte vượt `CONFIG.MAX_STREAM_BYTES`: `abort()`, **giữ đúng `CONFIG.MAX_STREAM_BYTES` byte đầu** (bỏ phần thừa của chunk cuối để kết quả không phụ thuộc cách mạng chia chunk), `stream_cut = true`, đi tiếp (không ném lỗi).
4. **ING-43 Mã HTTP khi tải.** 404 ⇒ `ERR_BRANCH_NOT_FOUND` (với `GITHUB_COMMIT`, `03` §4 đổi thành `ERR_SESSION_SOURCE_EXPIRED`); 429/403 ⇒ `ERR_GITHUB_RATE_LIMIT_CDN`; 451 ⇒ `ERR_REPO_UNAVAILABLE_451`.
5. **ING-44 Thử lại.** 5xx, `ECONNRESET`, đứt giữa chừng, hết giờ, hoặc zip hỏng ở Mục 6 ⇒ chờ `CONFIG.STREAM_RETRY_DELAY_MS`, tải lại **1 lần** với timer mới. Vẫn lỗi ⇒ hết giờ: `ERR_STREAM_TIMEOUT`; còn lại: `ERR_STREAM_CORRUPTED`. Không thử lại với 404/429/451.
6. **ING-45 Upload `.zip`.** Route đọc body multipart qua bộ đếm byte; vượt `CONFIG.MAX_STREAM_BYTES` ⇒ hủy đọc, `ERR_STREAM_QUOTA_EXCEEDED` (upload **không** cắt cụt — người dùng tự nén lại được, và khóa phiên phải là hash của cả file). Thiếu trường `archive`, hoặc 4 byte đầu không phải `PK\x03\x04` / `PK\x05\x06` ⇒ `ERR_UPLOAD_INVALID`. Trường `subdir` (tùy chọn) ⇒ `subdir_override`. `repo_name` = tên file bỏ đuôi `.zip`. Không thử lại.

---

## 5. Định danh phiên bản — `snapshot.ts`

**Mục đích:** sinh `RepoSnapshotKey` để mở lại phiên đúng commit (`03` §4). **Input:** `RawArchive`, `ResolvedRef`/SHA, scope tường minh. **Output:** `RepoSnapshotKey`.

```typescript
export function readEocdComment(bytes: Uint8Array): string | null;
export function computeArchiveHash(bytes: Uint8Array): string;          // SHA-256 hex của TOÀN BỘ bytes (D-10)
export function computeSnapshot(a: RawArchive, ctx: { owner?: string; repo?: string; file_name?: string; ref: string | null; ref_label: string | null; explicit_subdir: string }): RepoSnapshotKey;
```

1. **ING-50 Đọc EOCD bằng code tự viết** (không phụ thuộc tên trường của thư viện): dò ngược từ cuối buffer (trong tối đa 22 + 65 535 byte cuối) chữ ký `0x06054b50`; độ dài comment = uint16 LE tại offset 20; comment = các byte từ offset 22, giải mã UTF-8, `trim()`. Không thấy ⇒ `null`.
   > ⚠️ **Phải kiểm chứng ở giờ 0:** zip của codeload có comment EOCD là commit SHA 40 hex. **Fallback đã định:** không có ⇒ `ARCHIVE_HASH` (bước 3) và thêm warning "Không đọc được mã commit — phiên này không mở lại được bằng link".
2. **ING-51** `source = GITHUB`: `ref` khớp `/^[0-9a-f]{40}$/` ⇒ `snapshot_id = ref`, `COMMIT_SHA`. Ngược lại comment EOCD khớp mẫu đó ⇒ `snapshot_id = comment`, `COMMIT_SHA`. `stream_cut = true` thì không có EOCD trong buffer ⇒ bước 3.
3. **ING-52** Còn lại (và mọi upload) ⇒ `snapshot_id = computeArchiveHash(bytes)`, `ARCHIVE_HASH`. Với `stream_cut`, `bytes` là đúng `CONFIG.MAX_STREAM_BYTES` byte đã giữ (ING-42) nên hash vẫn tất định cho cùng zip.
4. **ING-53** `repo_key` = `owner/repo` viết thường (sau chuyển hướng ING-21) hoặc tên file zip; `ref_label` từ Mục 3 (`null` với upload); `subdir` = **scope tường minh** (`subdir_override` hoặc `subdir` từ link), `""` khi scope do Mục 8 tự phát hiện — lúc dựng lại, `subdir` được truyền như `subdir_override` nên kết quả trùng (INV-10).

---

## 6. Mục lục zip & đường dẫn — `unzip.ts`

**Mục đích:** biết **toàn bộ** danh sách file + kích thước trước khi chọn. **Input:** `RawArchive`. **Output:** `ZipEntryMeta[]` (nội bộ).

```typescript
interface ZipEntryMeta {                // nội bộ
  raw_name: string; path: string;       // path = đã chuẩn hóa (ING-60)
  compressed_size: number; size: number;// size = uncompressed (mục lục) hoặc byte giải nén đo ở lượt 1 (streaming)
  method: number; local_offset: number | null;  // null ở chế độ streaming
  is_dir: boolean; is_symlink: boolean; is_encrypted: boolean;
}
export function readCentralDirectory(bytes: Uint8Array): ZipEntryMeta[] | null;
export function listEntriesStreaming(bytes: Uint8Array, signal: AbortSignal): ZipEntryMeta[];   // fflate Unzip, lượt 1
```

1. **ING-60 Chuẩn hóa đường dẫn** (áp cho mọi entry):
   1. Tên file: cờ bit 11 bật ⇒ UTF-8; tắt mà mọi byte < 0x80 ⇒ ASCII; còn lại ⇒ loại, `skipped.binary++`.
   2. Đổi `\` ⇒ `/`.
   3. Nếu **mọi** entry có cùng segment đầu (zip GitHub luôn có `<repo>-<ref>/`) ⇒ cắt segment đó; ngược lại giữ nguyên.
   4. `path.posix.normalize`; kết quả bắt đầu bằng `../` hoặc `/`, hoặc chứa NUL ⇒ loại entry (không "gọt" `../`).
   5. Hai entry trùng path sau chuẩn hóa ⇒ giữ entry đầu theo thứ tự mục lục, entry sau `skipped.garbage++`.
2. **ING-61 Central-Directory-First (mặc định).** Tự đọc EOCD (ING-50) ⇒ offset/kích thước Central Directory ⇒ duyệt các bản ghi chữ ký `0x02014b50`: cờ, `method`, kích thước nén/giải nén, tên, `external_attrs`, offset local header. `is_symlink` = `((external_attrs >>> 16) & 0xF000) === 0xA000`; `is_dir` = tên kết thúc `/`; `is_encrypted` = cờ bit 0. Offset/chữ ký sai ⇒ trả `null`.
3. **ING-62 Chế độ streaming (dự phòng)** khi `readCentralDirectory` trả `null` (zip hỏng mục lục, hoặc `stream_cut` làm mất mục lục ở cuối):
   - **Lượt 1** chạy `fflate.Unzip` + `UnzipInflate` trên buffer, **không lưu** nội dung: chỉ ghi tên và đếm byte giải nén thật của từng entry ⇒ `ZipEntryMeta[]`. Entry chưa trọn (bị cắt giữa chừng) bị bỏ.
   - Sau lượt 1, Mục 7–8 chạy **y như chế độ mục lục** (chọn theo `FilePriorityScore`, **không** theo thứ tự trong zip). **Lượt 2** chạy lại `fflate.Unzip` và chỉ giữ nội dung các entry đã chọn.
   - Không biết symlink ở chế độ này (local header không có thuộc tính) — chấp nhận.
   - Tất định: tập entry trọn vẹn chỉ phụ thuộc buffer, mà buffer đã cố định độ dài (ING-42). Nếu codeload sinh byte khác nhau cho cùng commit thì tập file có thể khác — khi đó `snapshot_id` (ARCHIVE_HASH) cũng khác nên không lẫn phiên.
4. **ING-63** Cả hai chế độ đều không ra entry nào hợp lệ ⇒ GitHub: lỗi hỏng của ING-44 (thử lại 1 lần ⇒ `ERR_STREAM_CORRUPTED`); upload: `ERR_UPLOAD_INVALID`.

---

## 7. Phân loại entry — `prune.ts`

**Mục đích:** tách rác / manifest / code / định dạng đặc biệt / ngôn ngữ không có grammar. **Input:** `ZipEntryMeta`. **Output:** `EntryClass` (nội bộ).

```typescript
type EntryClass = "GARBAGE" | "MANIFEST" | "CODE" | "SPECIAL" | "NO_GRAMMAR" | "OTHER";   // nội bộ
export function classifyEntry(e: ZipEntryMeta, registry: LanguageRegistry): { cls: EntryClass; language: LanguageId | null };
```

Xét theo thứ tự, luật đầu tiên khớp thắng:

| # | Luật | Điều kiện | Lớp |
| :-: | :-- | :-- | :-- |
| 1 | **ING-70** | `is_dir`, `is_symlink`, `is_encrypted`, `method` ∉ {0, 8} | `GARBAGE` (`is_encrypted`/method lạ ⇒ `skipped.binary++`, còn lại `skipped.garbage++`) |
| 2 | **ING-71** | Có segment thư mục (khớp **nguyên segment**, không phân biệt hoa thường) thuộc `node_modules, .git, .github, dist, build, out, .next, .nuxt, .turbo, coverage, vendor, venv, .venv, env, __pycache__, .pytest_cache, .mypy_cache, target, obj, .gradle, .idea, .vscode, Pods, .dart_tool` | `GARBAGE` |
| 3 | **ING-72** | Có segment `bin`: chỉ giữ entry có đuôi thuộc Language Registry (`bin/cli.js` của CLI tool); entry khác dưới `bin/` (`.dll`, `.class`, `.pdb`…) | `GARBAGE` |
| 4 | **ING-73** | Tên khớp `/(\.min\.(js\|css)\|\.d\.ts\|\.map\|\.lock\|-lock\.json\|\.pb\.go\|_pb2\.py\|\.generated\.\w+\|\.g\.dart\|\.freezed\.dart)$/i` hoặc đuôi media/nhị phân `png jpg jpeg gif webp ico svg mp4 mov mp3 wav pdf zip gz jar exe dll so woff woff2 ttf psd class pyc` | `GARBAGE` |
| 5 | **ING-74** | Basename thuộc tập manifest (hợp `manifest_files` của mọi adapter + `tsconfig.json`, `jsconfig.json`, `package.json`, `requirements.txt`, `pyproject.toml`, `setup.py`, `Pipfile`, `pom.xml`, `build.gradle`, `build.gradle.kts`, `go.mod`, `pubspec.yaml`, `Cargo.toml`, `composer.json`, `Gemfile`) và độ sâu thư mục ≤ `CONFIG.MAX_MANIFEST_DEPTH` (file ở gốc có độ sâu 0) | `MANIFEST` |
| 6 | **ING-75** | Đuôi `.ipynb`, `.vue`, `.svelte` | `SPECIAL` (`.ipynb` ⇒ `PYTHON`; `.vue`/`.svelte` ⇒ quyết ở Mục 10) |
| 7 | **ING-76** | Đuôi có trong `extensionMap` của Language Registry | `CODE` + `LanguageId` |
| 8 | **ING-77** | Đuôi thuộc bảng `KNOWN_NO_GRAMMAR` của registry (`11` Mục 1) | `NO_GRAMMAR` + `LanguageId`, `skipped.unsupported_lang++` |
| 9 | — | Còn lại (`.md`, `.json`, `.yml`, `Dockerfile`, `.gitmodules`…) | `OTHER` (bỏ, không đếm) |

- **ING-78** Thư mục test/spec/example/demo/migrations **không** bị loại; chỉ bị trừ điểm ở Mục 8.
- **ING-79** Có entry `.gitmodules` ở gốc ⇒ ghi cờ nội bộ `has_submodules` cho Mục 13.

---

## 8. Phạm vi (monorepo) & chọn file — `fingerprint.ts` (`detectScope`) + `priority.ts`

**Mục đích:** biết thư mục cần phân tích **trước** khi cấp quota, rồi chọn ≤ `CONFIG.MAX_CLEAN_FILES` file code quan trọng nhất. **Input:** `ZipEntryMeta[]` đã phân loại, scope tường minh. **Output:** `ScopeDecision` + danh sách entry được chọn (nội bộ).

```typescript
interface ScopeDecision { root_dir_offset: string; is_monorepo: boolean; candidates: string[]; explicit: boolean }  // nội bộ
export function detectScope(entries: ClassifiedEntry[], explicit_subdir: string | null): ScopeDecision;
export function filePriorityScore(path: string, size: number, scope: string): number;
export function selectFiles(entries: ClassifiedEntry[], scope: ScopeDecision): { manifests: ZipEntryMeta[]; ordered_candidates: ZipEntryMeta[] };
```

**Phát hiện scope** (chỉ dùng path + kích thước, chạy trên danh sách entry):
1. **ING-80 Scope tường minh.** Thứ tự ưu tiên: `subdir_override` (từ `IngestRequest` hoặc trường `subdir` của upload) ⇒ `subdir` từ link (ING-31) ⇒ `subdir` của phiên khi dựng lại. Chuẩn hóa thành dạng `"server/"`. Không có entry `CODE`/`SPECIAL` nào dưới thư mục đó ⇒ `ERR_NO_SOURCE_FILES_FOUND` (details `{ subdir }`). Có scope tường minh ⇒ bỏ qua bước 2–4, `is_monorepo` vẫn tính theo bước 2 để báo.
2. **ING-81 Ứng viên** (so khớp nguyên segment, không phân biệt hoa thường, chỉ đếm entry `CODE`/`SPECIAL`):
   - *Server:* `<x>/` ở gốc với `x ∈ {server, backend, api}`; `apps/<x>/` hoặc `packages/<x>/` với `x ∈ {server, backend, api}` hoặc `x` kết thúc bằng `-api`, `-server`, `-backend`, **và** thư mục đó có manifest; `services/<x>/` (mọi `x`) **có manifest riêng** (microservice).
   - *Client:* `<x>/`, `apps/<x>/`, `packages/<x>/` với `x ∈ {client, frontend, web, ui, mobile, webapp, app-web}` hoặc kết thúc bằng `-web`, `-client`, `-ui`, `-mobile`.
   - `api-docs/`, `apiClient/` không khớp (khớp nguyên segment).
3. **ING-82 Quyết định** (`bytes(d)` = tổng `size` các entry `CODE`/`SPECIAL` dưới `d`; server tốt nhất = `bytes` lớn nhất, hòa ⇒ path nhỏ hơn):
   - ≥ 1 client **và** ≥ 1 server, hoặc ≥ 2 server ⇒ `is_monorepo = true`, `root_dir_offset` = server tốt nhất.
   - Đúng 1 server, không client, `bytes(server) / bytes(toàn repo) > CONFIG.MONOREPO_DOMINANT_RATIO` ⇒ `root_dir_offset` = server đó, `is_monorepo = false`.
   - Còn lại ⇒ `root_dir_offset = ""`, `is_monorepo = false`.
4. **ING-83** ≥ 2 ứng viên server ⇒ warning "Phát hiện nhiều thư mục backend: {danh sách}. Đang phân tích {chọn}; có thể chọn thư mục khác." Giao diện gửi lại `POST /api/ingest` với `subdir_override` (`02` `IngestRequest`).
5. **ING-84 Scope có hiệu lực tới Tầng 1–2.** `root_dir_offset ≠ ""` ⇒ (a) file trong scope được cộng `CONFIG.FPS_IN_SCOPE`; (b) file ngoài scope vẫn được nạp nếu còn chỗ (thư viện dùng chung như `packages/shared`); (c) `11` chỉ lấy entry, hàm VIP và hàm của chế độ suy biến từ file **trong** scope; (d) `language_breakdown`, `primary_language`, `graph_confidence`, archetype tính trong scope.

**Điểm ưu tiên:**

$$\text{FPS}(f) = \texttt{FPS\_IN\_SCOPE}\cdot\mathbf 1_{\text{scope}} + \texttt{FPS\_ROLE\_NAME}\cdot\mathbf 1_{\text{vai trò}} + \frac{1}{\text{depth}(f)+1} + \texttt{FPS\_TEST\_PENALTY}\cdot\mathbf 1_{\text{test}} + \texttt{FPS\_TINY\_PENALTY}\cdot\mathbf 1_{\text{size} < \texttt{FPS\_TINY\_BYTES}}$$

6. **ING-85** `depth(f)` = số segment thư mục (file ở gốc: 0). `1_scope` = path bắt đầu bằng `root_dir_offset` (offset rỗng ⇒ mọi file).
7. **ING-86 Tên vai trò.** `ROLE_NAMES = controller(s), route(s), router(s), handler(s), service(s), usecase(s), repository, repositories, repo(s), model(s), entity, entities, schema(s), middleware(s), api, main, app, server, index`. Khớp khi **một segment thư mục** (viết thường) thuộc tập, **hoặc** stem của basename (bỏ đuôi cuối) tách theo `.`, `_`, `-` và ranh giới camelCase, viết thường, có **token cuối** hoặc **cả stem** thuộc tập (`order.controller.ts`, `OrderController.java`, `user_service.py`, `main.go` khớp; `distance.ts`, `apiClient.ts` không).
8. **ING-87 Cờ test.** Có segment ∈ {test, tests, \_\_tests\_\_, spec, specs, example, examples, demo, demos, e2e, fixtures, \_\_mocks\_\_, migrations, seeds}, hoặc stem kết thúc `.test`/`.spec`/`_test`, hoặc bắt đầu `test_`.
9. **ING-88 Chọn.** Bỏ trước khi giải nén (`skipped.oversized++`): `size > CONFIG.MAX_SINGLE_FILE_BYTES` (`.ipynb`: `> CONFIG.MAX_NOTEBOOK_BYTES`), hoặc `compressed_size > 0` và `size / compressed_size > CONFIG.MAX_COMPRESSION_RATIO`. Ứng viên còn lại sắp **FPS giảm dần, hòa ⇒ path tăng dần** ⇒ `ordered_candidates`. Manifest: mọi entry `MANIFEST` theo path tăng dần.

---

## 9. Giải nén & lọc nội dung — `unzip.ts`

**Mục đích:** giải nén đúng file đã chọn, chống zip bomb, chuẩn hóa văn bản. **Input:** `manifests`, `ordered_candidates`. **Output:** RAMCodeStore / ManifestStore thô.

```typescript
export function inflateSelected(bytes: Uint8Array, plan: ReturnType<typeof selectFiles>, report: IngestionReport, signal: AbortSignal): { code: Map<string, string>; manifests: Map<string, string>; inflated_cap_hit: boolean };
export function decodeAndFilter(buf: Uint8Array, report: IngestionReport, opts: { check_minified: boolean }): string | null;
```

1. **ING-90 Giải nén từng entry** (chế độ mục lục: cắt dữ liệu nén từ local header; method 8 ⇒ `fflate.Inflate` theo chunk; method 0 ⇒ sao chép). Đếm byte ra thật: vượt trần file (ING-88) ⇒ dừng file đó, `skipped.oversized++` (kích thước khai báo có thể giả).
2. **ING-91 Thứ tự & trần tổng.** Giải nén manifest trước (theo path; manifest `> CONFIG.MAX_MANIFEST_BYTES` ⇒ bỏ + warning), rồi ứng viên code theo `ordered_candidates`. Mỗi file nhận vào cộng byte giải nén vào `inflated_total`. Trước khi nhận file kế tiếp: nếu `inflated_total + size > CONFIG.MAX_INFLATED_BYTES` ⇒ dừng toàn bộ, `inflated_cap_hit = true`, **giữ mọi file đã nhận**.
3. **ING-92 Quota.** Dừng khi đã nhận đủ `CONFIG.MAX_CLEAN_FILES` file code (file bị loại ở bước 4 hoặc Mục 10 **không** tốn chỗ — ứng viên kế tiếp thế vào). Ứng viên chưa xét ⇒ `skipped.quota++`.
4. **ING-93 `decodeAndFilter`** (thứ tự cố định):
   1. BOM `FF FE` / `FE FF` ⇒ giải mã UTF-16LE/BE **trước** bước dò null.
   2. Còn byte `0x00` trong `CONFIG.BINARY_SNIFF_BYTES` byte đầu ⇒ `null`, `skipped.binary++`.
   3. Giải mã UTF-8 (byte hỏng thay bằng U+FFFD); cắt BOM UTF-8.
   4. Dòng đầu là `version https://git-lfs.github.com/spec/v1` ⇒ `null`, `skipped.binary++`.
   5. `\r\n` và `\r` ⇒ `\n`.
   6. `check_minified` và (có dòng dài hơn `CONFIG.MAX_LINE_LENGTH` hoặc độ dài dòng trung bình > `CONFIG.MAX_AVG_LINE_LENGTH`) ⇒ `null`, `skipped.oversized++`. File `SPECIAL` kiểm bước này **sau** khi trích xuất (Mục 10).
5. **ING-94 `truncated`** = `stream_cut ∨ inflated_cap_hit ∨ skipped.quota > 0`. Khi `true` thêm warning "Repository lớn — chỉ phân tích {n} tệp mã nguồn được ưu tiên." (`n` = số file code đã nạp).

---

## 10. Định dạng đặc biệt — `special.ts`

**Mục đích:** biến `.ipynb`/`.vue`/`.svelte` thành file code ảo kèm bản đồ dòng. **Input:** path + văn bản. **Output:** `{ virtual_path, code, origin } | null`.

```typescript
export function extractNotebook(path: string, json: string, report: IngestionReport): { virtual_path: string; code: string; origin: VirtualFileOrigin } | null;
export function extractSfcScript(path: string, text: string): { virtual_path: string; code: string; language: LanguageId; origin: VirtualFileOrigin } | null;
export function originNoteFor(origin: VirtualFileOrigin, lines: number[]): string | undefined;   // dùng ở 11 để điền ExecutionTraceStep.origin_note
```

1. **ING-100 Notebook.**
   1. `JSON.parse` lỗi ⇒ bỏ file + warning "Notebook {path} bị hỏng định dạng".
   2. Ngôn ngữ = `metadata.kernelspec.language` ?? `metadata.language_info.name` ?? `"python"`; khác `python` ⇒ bỏ, `skipped.unsupported_lang++`.
   3. Danh sách cell: nbformat 4 ⇒ `cells`; nbformat 3 ⇒ `worksheets[0].cells`. Chỉ lấy `cell_type === "code"`; nội dung = `source` (v4) hoặc `input` (v3), `string[]` ⇒ `join("")`. Bỏ toàn bộ `outputs`.
   4. Với cell code thứ tự `N` (vị trí 1-based trong **toàn bộ** danh sách cell, để khớp cái người dùng thấy): ghi dòng `# %% [cell N]`, rồi các dòng của cell; dòng bắt đầu (sau khoảng trắng) bằng `%` hoặc `!` ⇒ `# [magic] <dòng gốc>`. Mọi dòng ảo của cell có `line_origin = "cell N"`.
   5. `virtual_path = path + ".py"` (VD `nb/eda.ipynb.py`), `LanguageId = PYTHON`.
2. **ING-101 SFC.** Lấy các khối `/<script\b([^>]*)>([\s\S]*?)<\/script>/gi`. Có `lang="ts"` (hoặc `lang="typescript"`) ở bất kỳ khối nào ⇒ `TYPESCRIPT`, `virtual_path = path + ".ts"`; ngược lại `JAVASCRIPT`, `path + ".js"`. Mọi ký tự ngoài nội dung khối `<script>` thay bằng rỗng nhưng **giữ dấu xuống dòng** ⇒ số dòng ảo = số dòng gốc. `line_origin` = `"<script>"` cho dòng thuộc khối, `""` cho dòng khác. Không có khối nào ⇒ bỏ file (không đếm).
3. **ING-102 `origin_note`.** `originNoteFor(origin, lines)` với `lines` = số dòng gốc khác 0 của một bước: tập nhãn khác rỗng, theo thứ tự xuất hiện. Một nhãn ⇒ nhãn đó (`"cell 4"`); nhiều nhãn notebook ⇒ `"cell a–b"` (a, b = số cell nhỏ/lớn nhất); SFC ⇒ `"<script>"`.
4. **ING-103** File ảo thay file gốc trong RAMCodeStore, `file_index` và mọi `file_path` của `11` (đuôi ảo cho biết nguồn gốc). Mỗi file đặc biệt tính 1 file code trong quota.

---

## 11. Che secret & gắn cờ injection — `secrets.ts`

**Mục đích:** không bao giờ gửi secret thật ra ngoài; đánh dấu file có câu lệnh nhắm vào AI. **Input:** RAMCodeStore. **Output:** RAMCodeStore đã che, `redacted_secret_count`, `suspicious_instruction_files`.

```typescript
export function redactSecrets(code: string): { code: string; count: number };
export function hasInjectionText(code: string): boolean;
```

1. **ING-110 Mẫu secret** (chạy theo thứ tự, trên toàn văn bản file; `MASK = "<REDACTED_SECRET>"`):

| Mẫu | Phần được thay |
| :-- | :-- |
| Khối `-----BEGIN (RSA \|EC \|OPENSSH \|DSA )?PRIVATE KEY-----` … `-----END …PRIVATE KEY-----` | **Từng dòng** của khối (kể cả dòng BEGIN/END) thay bằng thụt lề gốc + `MASK`; giữ nguyên ký tự `\n` |
| `AKIA[0-9A-Z]{16}`, `\b(ghp\|gho\|ghs\|ghu)_[A-Za-z0-9]{36}\b`, `\bAIza[0-9A-Za-z_-]{35}\b` | Cả token |
| `(password\|passwd\|pwd\|secret\|api_?key\|token\|private_?key\|access_?key)\s*[:=]\s*(["'])([^"'\s]+)\2` (không phân biệt hoa thường, khớp cả trong `JWT_SECRET`) với độ dài nhóm 3 ≥ `CONFIG.SECRET_MIN_VALUE_LENGTH` | Nội dung trong dấu nháy (giữ tên biến và dấu nháy) |
| `(mongodb(\+srv)?\|postgres(ql)?\|mysql\|redis\|amqp)://([^:/\s]+):([^@\s]+)@` | Phần mật khẩu (nhóm sau `:`) |

2. **ING-111 Bảo toàn dòng.** Sau khi che, số ký tự `\n` của file **không đổi** (kiểm bằng assert; lệch ⇒ bỏ file + warning, không bao giờ giữ bản chưa che). `redacted_secret_count` = tổng số lần khớp (một khối private key = 1).
3. **ING-112** Bản đã che là bản **duy nhất** được lưu trong RAMCodeStore; Tầng 1–2, `snippet`, `code_context` đều đọc từ bản này.
4. **ING-113 Cờ injection** (không sửa code): văn bản khớp `/(ignore|disregard|forget)\s+(all\s+)?(the\s+)?(previous|above|prior)\s+(instructions?|prompts?)|you\s+are\s+now\b|system\s+prompt|<\/?\s*(system|instructions?)\s*>/i` ⇒ thêm path vào `suspicious_instruction_files` (sort, không trùng). Trường này **chỉ server** (`toClientResult` loại bỏ, `11` Mục 15); phần phòng thủ thuộc `20`/`21`.

---

## 12. Vân tay dự án — `fingerprint.ts`

**Mục đích:** sinh `ProjectFingerprint` đủ mọi trường. **Input:** entry đã phân loại, ManifestStore, `ScopeDecision`. **Output:** `ProjectFingerprint` + `module_info`.

```typescript
export function parseManifests(manifests: Map<string, string>, report: IngestionReport): Array<{ path: string; packages: string[]; has_bin: boolean; main: string | null; bin_paths: string[] }>;
export function buildFingerprint(entries: ClassifiedEntry[], manifests: Map<string, string>, scope: ScopeDecision, report: IngestionReport): { fingerprint: ProjectFingerprint; module_info: IngestOutput["module_info"] };
```

1. **ING-120 Đọc manifest.** JSON lỗi ⇒ bỏ comment `//`, `/* */`, dấu phẩy thừa, BOM rồi parse lại; vẫn lỗi ⇒ bỏ manifest + warning.

| Manifest | Tên gói lấy từ |
| :-- | :-- |
| `package.json` | khóa của `dependencies`, `devDependencies`, `peerDependencies`; `bin` (chuỗi hoặc object) ⇒ `has_bin`, `bin_paths`; `main` |
| `requirements.txt` | `^\s*([A-Za-z0-9_.-]+)` mỗi dòng, bỏ dòng `#`, `-r`, `-e` |
| `pyproject.toml` | `[project].dependencies` (tên trước `[<>=!~;\s]`) và khóa của `[tool.poetry.dependencies]` (trừ `python`) |
| `Pipfile` | khóa trong `[packages]`, `[dev-packages]` |
| `pom.xml` | `<artifactId>` bên trong `<dependencies>` |
| `build.gradle(.kts)` | `(implementation\|api\|compile\w*)\s*\(?\s*["']([^"':]+):([^"':]+)` ⇒ nhóm 3 |
| `go.mod` | dòng `module <path>` ⇒ `go_module_path`; đường dẫn module trong `require` |
| `pubspec.yaml` | `name:` ⇒ `dart_package_name`; khóa dưới `dependencies:`, `dev_dependencies:` |
| `Cargo.toml`, `composer.json`, `Gemfile` | khóa `[dependencies]`; khóa `require`; `gem '<tên>'` |
| `tsconfig.json`, `jsconfig.json` | Không lấy gói; giữ nguyên văn cho resolver `11` |

2. **ING-121 `tech_stack`** = hợp tên gói của **mọi** manifest, chuẩn hóa: viết thường, `trim`; gói Python chuẩn hóa PEP 503 (chuỗi `[-_.]` ⇒ `-`); không trùng; sort tăng dần.
3. **ING-122 `deps_scope`** (nội bộ) = gói của manifest nằm trong `root_dir_offset` ∪ manifest ở gốc (offset rỗng ⇒ mọi manifest). Dùng cho archetype và framework.
4. **ING-123 Archetype** — luật đầu tiên khớp thắng (thứ tự là quy phạm):

| # | Archetype | Điều kiện trên `deps_scope` |
| :-: | :-- | :-- |
| 1 | `MOBILE_APP` | `react-native`, `expo`, hoặc có `pubspec.yaml` trong scope với gói `flutter` |
| 2 | `DESKTOP_APP` | `electron`, `@tauri-apps/api`, `pyqt5`, `pyqt6`, `pyside6` |
| 3 | `WEB_BACKEND` | `express`, `koa`, `fastify`, `@nestjs/core`, `@hapi/hapi`, `fastapi`, `flask`, `django`, `spring-boot-starter-web`, `spring-boot-starter-webflux`, gói Go bắt đầu bằng `github.com/gin-gonic/gin`, `github.com/labstack/echo`, `github.com/gofiber/fiber`, `github.com/go-chi/chi` |
| 4 | `WEB_FRONTEND` | `react-dom`, `vue`, `svelte`, `@angular/core`, `next`, `nuxt` |
| 5 | `CLI_TOOL` | `has_bin` ở một `package.json` trong scope, hoặc `commander`, `yargs`, `typer`, `click`, `github.com/spf13/cobra`, `clap` |
| 6 | `ALGORITHM_CORE` | Còn lại (kể cả không có manifest) |

5. **ING-124 `detected_framework`** = nhãn của dòng **đầu tiên** trong bảng sau có gói nằm trong `deps_scope`; không dòng nào ⇒ `null`: `@nestjs/core`⇒NestJS · `express`⇒Express · `fastify`⇒Fastify · `koa`⇒Koa · `fastapi`⇒FastAPI · `flask`⇒Flask · `django`⇒Django · `spring-boot-starter-web`⇒Spring Boot · `github.com/gin-gonic/gin`⇒Gin · `github.com/labstack/echo`⇒Echo · `next`⇒Next.js · `nuxt`⇒Nuxt · `@angular/core`⇒Angular · `react-native`⇒React Native · `expo`⇒Expo · `flutter`⇒Flutter · `electron`⇒Electron · `vue`⇒Vue · `svelte`⇒Svelte · `react-dom`⇒React.
6. **ING-125 Ngôn ngữ.** Trên entry `CODE`/`SPECIAL`/`NO_GRAMMAR` **trong scope**, cộng `size` theo `LanguageId` ⇒ `language_breakdown` (mỗi phần tử có `tier` từ registry; `NO_GRAMMAR` ⇒ `UNSUPPORTED`), sort `code_bytes` giảm dần, hòa ⇒ `language` tăng dần. `primary_language` = phần tử đầu tiên có tier ≠ `UNSUPPORTED` (không có ⇒ phần tử đầu tiên).
7. **ING-126 `graph_confidence`.** Mẫu số = byte tier `RESOLVED` + `STRUCTURAL`. `RESOLVED / mẫu ≥ CONFIG.GRAPH_CONFIDENCE_HIGH_RATIO` ⇒ `HIGH`; ngược lại `STRUCTURAL / mẫu ≥ CONFIG.GRAPH_CONFIDENCE_LOW_RATIO` ⇒ `LOW` + warning "Đồ thị của {ngôn ngữ} được suy luận bằng bộ phân giải phổ quát; cạnh nét đứt có thể chưa chính xác."; còn lại ⇒ `MIXED`.
8. **ING-127** `is_monorepo`, `root_dir_offset` lấy từ `ScopeDecision`. `module_info.package_entry_files` = `main` và `bin_paths` của các `package.json` trong scope, chuẩn hóa tương đối gốc repo (dùng cho entry dự phòng ở `11`).

---

## 13. Kết quả rỗng & mã lỗi Tầng 0

```typescript
export function assertNotEmpty(out: IngestOutput, flags: { stream_cut: boolean; inflated_cap_hit: boolean; has_submodules: boolean; unsupported_ratio: number; top_unsupported: LanguageId | null }): void;
```

1. **ING-130** `report.code_file_count` = số file trong RAMCodeStore (manifest không tính). Khác 0 ⇒ trả `IngestOutput`.
2. **ING-131** `code_file_count = 0`, xét theo thứ tự:
   1. `stream_cut ∨ inflated_cap_hit` ⇒ `ERR_STREAM_QUOTA_EXCEEDED`.
   2. `unsupported_ratio` = byte `NO_GRAMMAR` / byte (`CODE` + `SPECIAL` + `NO_GRAMMAR`) trong scope `> CONFIG.UNSUPPORTED_LANGUAGE_RATIO` ⇒ `ERR_UNSUPPORTED_LANGUAGE`, details `{ language: top_unsupported }` (ngôn ngữ có grammar nhưng chưa có resolver — C#, PHP, Rust… — **không** vào nhánh này: chúng là `STRUCTURAL` và đã được nạp).
   3. `has_submodules` ⇒ `ERR_NO_SOURCE_FILES_FOUND`, details `{ submodule: true }` (zip GitHub không chứa submodule — gợi ý dán link repo con).
   4. Còn lại ⇒ `ERR_NO_SOURCE_FILES_FOUND`.

| Mã | Khi nào | `retryable` |
| :-- | :-- | :-: |
| `ERR_INVALID_GITHUB_URL` | ING-12, ING-13 | ✗ |
| `ERR_PREFLIGHT_404_OR_PRIVATE` | ING-21 (404) | ✗ |
| `ERR_NETWORK_TIMEOUT` | ING-21, ING-30 sau 1 lần thử lại | ✓ |
| `ERR_REPO_UNAVAILABLE_451` | ING-21, ING-30, ING-43 | ✗ |
| `ERR_GITHUB_RATE_LIMIT_CDN` | ING-21, ING-30, ING-43 | ✓ |
| `ERR_BRANCH_NOT_FOUND` | ING-31 hết ứng viên; ING-43 (404 khi tải) | ✗ |
| `ERR_EMPTY_REPOSITORY` | ING-33 | ✗ |
| `ERR_STREAM_TIMEOUT` / `ERR_STREAM_CORRUPTED` | ING-44 sau 1 lần thử lại | ✓ / ✗ |
| `ERR_STREAM_QUOTA_EXCEEDED` | ING-45 (upload quá lớn); ING-131.1 | ✗ |
| `ERR_UPLOAD_INVALID` | ING-45, ING-63 | ✗ |
| `ERR_UNSUPPORTED_LANGUAGE` | ING-131.2 | ✗ |
| `ERR_NO_SOURCE_FILES_FOUND` | ING-34/ING-80 (scope rỗng), ING-131.3–4 | ✗ |
| `ERR_SERVER_BUSY` | Semaphore `03` §6.7 | ✓ |

- **ING-132 Thông điệp.** Bảng chữ hiển thị ở `30_UI`. Cấm khuyên người dùng dán link `/tree/<thư mục>` để "tải ít hơn": codeload luôn nén **cả repo**, link thư mục chỉ đổi scope phân tích. Gợi ý đúng cho repo quá lớn: tải lên `.zip` chỉ chứa thư mục mã nguồn.

---

## Test bắt buộc

Số liệu dưới đây dùng giá trị `CONFIG` hiện tại (`02` Mục 1). Test đặt tên bắt đầu bằng mã luật.

| ID | Input | Kỳ vọng |
| :-- | :-- | :-- |
| T-ING-01 | `"  https://github.com/nestjs/nest.git?tab=readme#x "` | `owner nestjs`, `repo nest`, `ref_path null`, `is_blob_link false`, `clean_url https://github.com/nestjs/nest` |
| T-ING-02 | `git@github.com:a/b.git` · `github.com/a/b/` · `https://www.github.com/a/b` · `https://github.com/a/b/pulls` | Cả 4 ⇒ `a/b`, `ref_path null` |
| T-ING-03 | `https://github.com/a/b/tree/release/v2/src` | `ref_path "release/v2/src"`; codeload chỉ có `release/v2` ⇒ thử `release` (404), `release/v2` (200) ⇒ `ref "release/v2"`, `subdir "src"`, đúng 2 lệnh HEAD |
| T-ING-04 | `https://github.com/a/b/blob/main/src/app.ts` | `is_blob_link true`; ứng viên chỉ `main`, `main/src` ⇒ `ref "main"`, `subdir "src"` |
| T-ING-05 | `ref_path "f/a/b/c/d/x"`, nhánh thật `f/a/b/c/d` (5 đoạn) | Thử đúng 4 ứng viên `f`…`f/a/b/c` ⇒ `ERR_BRANCH_NOT_FOUND` |
| T-ING-06 | `https://gitlab.com/a/b` · `https://github.com/a/b/tree/x/../y` | `ERR_INVALID_GITHUB_URL` |
| T-ING-07 | Probe: 404 · 451 · 429 · 2 lần hết 300 ms · 200 sau chuyển hướng tới `/c/d` | `ERR_PREFLIGHT_404_OR_PRIVATE` · `ERR_REPO_UNAVAILABLE_451` · `ERR_GITHUB_RATE_LIMIT_CDN` · `ERR_NETWORK_TIMEOUT` (đúng 2 lần gọi, cách 1000 ms) · `OK` với `owner c`, `repo d` |
| T-ING-08 | Link gốc; `archive/HEAD.zip` 302 ⇒ `https://codeload.github.com/a/b/zip/refs/heads/develop` | `ref "develop"`, `ref_label "develop"`, không thử `main` |
| T-ING-09 | Link gốc; `HEAD.zip`, `main`, `master`, `dev` đều 404 | `ERR_EMPTY_REPOSITORY` |
| T-ING-10 | Zip GitHub 15 728 641 byte trở lên; 3 file `.ts` trọn vẹn nằm trong 15 728 640 byte đầu | `stream_cut true`, buffer giữ đúng 15 728 640 byte, chế độ streaming 2 lượt, 3 file code, `truncated true`, `snapshot_id_kind ARCHIVE_HASH` = SHA-256 của 15 728 640 byte đó; chạy 2 lần cùng buffer ⇒ kết quả giống hệt |
| T-ING-11 | Như T-ING-10 nhưng phần đầu chỉ có `node_modules/**` | `ERR_STREAM_QUOTA_EXCEEDED` |
| T-ING-12 | Upload 16 MB | `ERR_STREAM_QUOTA_EXCEEDED` ngay khi đếm vượt, không giải nén |
| T-ING-13 | 60 file `.ts`, 30 trong `client/` (path nhỏ hơn) và 30 trong `server/`, có `client/package.json` + `server/package.json` | `is_monorepo true`, `root_dir_offset "server/"`; cả 30 file `server/` được nạp trước mọi file `client/`; `skipped.quota 10`, `truncated true` |
| T-ING-14 | `services/order/` 40 KB + manifest, `services/user/` 60 KB + manifest | `root_dir_offset "services/user/"`, `is_monorepo true`, 1 warning nêu `services/order/` |
| T-ING-15 | Chỉ `backend/` (80% byte code) · chỉ `backend/` (60%) · `api-docs/x.ts` | `"backend/"`, `is_monorepo false` · `""` · không phải ứng viên |
| T-ING-16 | FPS với scope `"server/"`: `server/src/controllers/order.controller.ts` (500 B) · `client/src/App.tsx` (500 B) · `server/tests/order.test.ts` (500 B) · `index.ts` ở gốc (100 B) | 3+2+0.2 = **5.2** · 0+2+0.3333 = **2.3333** · 3+0+0.3333−2 = **1.3333** · 0+2+1−1 = **2** |
| T-ING-17 | `src/distance.ts`, `lib/builder.ts`, `dist/a.js`, `node_modules/x/i.js`, `a.min.js`, `types.d.ts`, `bin/cli.js`, `bin/Debug/app.dll`, symlink `src/link.ts` | Giữ `src/distance.ts`, `lib/builder.ts`, `bin/cli.js`; còn lại `GARBAGE` |
| T-ING-18 | Zip upload không có thư mục bọc (`src/a.ts`, `README.md`) · zip GitHub (`b-main/src/a.ts`, `b-main/README.md`) | Path `src/a.ts` cho cả hai |
| T-ING-19 | Entry `../../etc/x.ts` · `a/../../x.ts` · tên non-UTF8 không cờ bit 11 | Loại · loại · loại + `skipped.binary` |
| T-ING-20 | Entry khai báo 10 KB, nén 50 B (tỉ lệ 200) · file giải nén thật 1.5 MB dù khai báo 10 KB | `skipped.oversized` trước giải nén · dừng ở 1 MB, `skipped.oversized` |
| T-ING-21 | Tổng ứng viên 12 MB, mỗi file 400 KB | Nhận file theo FPS cho tới khi tổng sắp vượt 8 MB (20 file), `inflated_cap_hit true`, `truncated true` |
| T-ING-22 | UTF-16LE có BOM · null byte ở byte 100 · CRLF · 1 dòng 1001 ký tự · LFS pointer | Giữ, giải mã đúng · `binary` · thành LF · `oversized` · `binary` |
| T-ING-23 | Notebook v4: `[markdown, code "import x\n%matplotlib inline", code ["a=1\n","b=2"]]` | `nb.ipynb.py` = `# %% [cell 2]`, `import x`, `# [magic] %matplotlib inline`, `# %% [cell 3]`, `a=1`, `b=2`; `line_origin[4] = "cell 3"`; `originNoteFor(..,[2,5]) = "cell 2–3"` |
| T-ING-24 | Notebook kernel `ir` · JSON hỏng | `skipped.unsupported_lang` · bỏ + warning |
| T-ING-25 | `App.vue` 12 dòng: `<template>` dòng 1–5, `<script lang="ts">` dòng 6–10 | `App.vue.ts` 12 dòng, dòng 1–5 rỗng, `TYPESCRIPT`, `line_origin[6] = "<script>"` |
| T-ING-26 | Khối `-----BEGIN RSA PRIVATE KEY-----` 5 dòng | 5 dòng, mỗi dòng `<REDACTED_SECRET>`, `count 1`, số `\n` không đổi |
| T-ING-27 | `const JWT_SECRET = "abc123xyz";` · `password = "12345"` · `postgres://u:p4ss@h/db` | `const JWT_SECRET = "<REDACTED_SECRET>";` · không che (5 < 6) · `postgres://u:<REDACTED_SECRET>@h/db` |
| T-ING-28 | Comment `// Ignore all previous instructions` trong `src/a.ts` | `suspicious_instruction_files ["src/a.ts"]`; code không đổi |
| T-ING-29 | `deps_scope` {express, react-dom} · {react-native, express} · `package.json` có `bin`, không framework · không manifest · {`@nestjs/core`, express} | `WEB_BACKEND` · `MOBILE_APP` · `CLI_TOOL` · `ALGORITHM_CORE` · framework `"NestJS"` |
| T-ING-30 | `requirements.txt`: `Flask_SQLAlchemy==3.0`, `# x`, `-r base.txt`, `FastAPI` | `tech_stack` chứa `fastapi`, `flask-sqlalchemy` (sort) |
| T-ING-31 | Byte trong scope: TS 70 KB, Python 20 KB, C# 10 KB | `primary_language TYPESCRIPT`; RESOLVED 90% ⇒ `HIGH`. Với C# 60 KB, TS 40 KB ⇒ `LOW` + warning |
| T-ING-32 | Chỉ `.sol` 90 KB + `README.md` · chỉ `README.md` + `.gitmodules` · chỉ `README.md` + `package.json` | `ERR_UNSUPPORTED_LANGUAGE` (`language` = mã của Solidity) · `ERR_NO_SOURCE_FILES_FOUND` `{submodule:true}` · `ERR_NO_SOURCE_FILES_FOUND` |
| T-ING-33 | Comment EOCD = 40 hex `a1…` · comment rỗng · ref người dùng là SHA 40 hex | `COMMIT_SHA` = comment · `ARCHIVE_HASH` = SHA-256 cả buffer + warning · `COMMIT_SHA` = ref |
| T-ING-34 | `subdir_override "web/"` khi `web/` không có code | `ERR_NO_SOURCE_FILES_FOUND` `{subdir:"web/"}` |

---

## Chỉ mục edge case (Phần 1 audit cũ → luật)

| Case | Tình huống | Luật |
| :-: | :-- | :-- |
| 1.2 | Repo lớn, zip bomb, `node_modules`, nhị phân | ING-40–42, ING-71–73, ING-88, ING-90–94, ING-131 |
| 1.3 | Branch có `/`, tag/SHA, nhánh mặc định lạ, repo đổi tên | ING-21, ING-30–33 |
| 1.5 | Notebook `.ipynb` | ING-75, ING-88, ING-100, ING-102 (+ `11` ENG-48) |
| 1.7 | Polyglot / monorepo / nhiều backend | ING-80–85, ING-122, ING-125 |
| 1.8 | Repo rỗng / chỉ README / chỉ manifest | ING-33, ING-74, ING-130–131 |
| 1.9 | URL dị dạng | ING-10–13 |
| 1.10 | Probe sai nghĩa (404 private, timeout, redirect, 429) | ING-20–22 |
| 1.11 | Repo trống, 451, submodule | ING-21, ING-33, ING-79, ING-131.3 |
| 1.12 | Stream đứt / zip hỏng / timeout | ING-40, ING-44, ING-62–63 |
| 1.13 | Lọc rác nhầm / sót | ING-71–73, ING-78 |
| 1.14 | Quota theo thứ tự zip | ING-61–62, ING-85–88, ING-92 |
| 1.15 | Manifest bị lọc / chiếm quota | ING-74, ING-91, ING-120 |
| 1.16 | Ngôn ngữ chưa hỗ trợ, `.mjs`, `.vue`, `.svelte` | ING-76–77, ING-101, ING-131.2 (+ `11` Mục 1) |
| 1.17 | UTF-16, BOM, CRLF, tên non-UTF8 | ING-60.1, ING-93 |
| 1.18 | Symlink, LFS, minified | ING-70, ING-93.4, ING-93.6 |
| 1.19 | Nhiều người nạp cùng lúc / nạp lại | ING-03, ING-04 (`03` §4, §6.7) |
| 1.20 | Secret hardcode | ING-110–112 |
| 1.21 | Prompt injection trong comment | ING-113 |
| Khác | 1.1, 1.4, 1.6, 1.22–1.38 | `11_ENGINE_DO_THI.md` |
