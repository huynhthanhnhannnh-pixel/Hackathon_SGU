# Báo cáo TASK_05C — áp dụng CHỐT CUỐI vào 04, 10, 40, 50, pitch

Nhánh: `docs/cau-truc-spec`. Đã có `DONE_05B`, đã đọc `TASK_05A.report.md`, `TASK_05B.report.md`. Chỉ áp dụng dòng ✅ của `.ai/CHOT_CUOI.md` (D-27 … D-31, D-33 … D-42, D-13, V-1, V-2, V-3). **Không áp dụng** D-43, D-44, D-45, D-46 (⏳) ⇒ giữ liên kết GitHub (cả trong danh sách "cắt nếu trễ" của `40`), không thêm `llm_calls` vào spec, không tải trước node.

Byte đo bằng `tr -d '\r' < <file> | wc -c` (trước: `git show HEAD:<file> | tr -d '\r' | wc -c`). mmcheck: `node .ai/tools/mmcheck/check.mjs`. Token mất (chỉ spec): `node .ai/tools/preserve.mjs`.

## 1. `spec/04_KIEN_TRUC_TRIEN_KHAI.md`

- Byte: **22 206 → 23 112** (≤ 25 000). mmcheck: **6/6 OK**.
- Đã làm:
  - D-27: Railway ⇒ Vercel `sin1` ở Đọc nhanh, sơ đồ ngữ cảnh, sơ đồ triển khai (subgraph "Vercel Function (1 instance…)"), 3 sequence diagram (`BE as Server (Vercel)`), Mục 8, 12, 13, 14. Cache RAM / semaphore / in-flight map "chỉ trong 1 instance, không được dựa vào"; trượt cache ⇒ dựng lại theo SHA (D-39). Upload ≤ `CONFIG.MAX_UPLOAD_BYTES` (6.1 thêm 1 đoạn).
  - D-28: Pino ra stdout, Vercel thu log (Mục 1, 9). D-29: Mục 10 viết lại theo log + Vercel Observability + dashboard Supabase. D-30: Mục 12 (Preview mỗi PR, Production `main`, Vercel Git Integration, không deploy tay).
  - D-36: bỏ `challenge_token`, `ChallengeTokenPayload` (Mục 5 dòng "Storage & Sync" ⇒ "Storage"; 6.2: `enrich-node` sinh câu hỏi + lưu `node_runs`; 6.3: `evaluate-feynman (run_id, question_index, student_answer)`, đọc đáp án từ `node_runs`, AI chấm không có code). Mục 7: bỏ dòng `challenge_token`, thêm dòng `node_runs` (chỉ server đọc, đáp án lộ khi câu xong); `question_attempts` đọc qua API (RLS theo 05A). Mục 9.2, 13: bỏ `CHALLENGE_TOKEN_KEY`, `RECEIPT_HMAC_KEY`, `code_context`.
  - D-40: 6.3 nhánh DB lỗi ⇒ `ERR_PERSISTENCE_UNAVAILABLE` + "Thử lại"; bỏ dòng `SyncReceipt`; Mục 11 bỏ `ERR_RECEIPT_INVALID`. D-39: bỏ `ERR_SESSION_SOURCE_EXPIRED`. D-35: bỏ `ERR_MODE_NOT_ALLOWED` (mã đã xóa khỏi `02`).
  - D-37: 6.2 ghi "Sinh câu hỏi (không cache)". D-38: 6.1 "HEAD probe repo & tìm nhánh mặc định".
  - **V-2:** xóa "< 2 giây", "(10 phút)", "(4)", "(20)", `= 4`, `INGEST_QUEUE_TIMEOUT_MS = 10000` (và "10 giây"), `= 1`, `= 500`, `= 100`, `= 80000`, "<= 15MB" ⇒ gọi tên `CONFIG.*`. Không có `tracesSampleRate` trong file. Theo luật "mọi số không có trong `CONFIG`": bỏ thêm ngưỡng tự đặt ở Mục 10 (`> 2000` ms, "> 40%", "RAM < 70%, CPU < 60%") và Mục 14 ("> 80%", "~15 RPM, 1,000,000 TPM", "60 direct, 200 pooler", "Port 6543", "LRU 20 entries, TTL 10 phút"). `gemini-2.5-flash` trong sơ đồ ⇒ `CONFIG.LLM_MODEL`. JSON mẫu log Mục 9.1 giữ nguyên số, thêm câu "chỉ minh họa, không phải số đo".
  - Sơ đồ module Mục 4: bỏ "Token" khỏi `src/server/*`.
- Token mất (22) — tất cả thuộc thứ đã bỏ:
  - D-27 / D-30: `next start`, `npm run build` (thay bằng `next build` của Vercel).
  - D-36: `challenge_token`, `ChallengeTokenPayload`, `CONFIG.CHALLENGE_TOKEN_TTL_MS`, `CHALLENGE_TOKEN_KEY`, `code_context`.
  - D-40: `SyncReceipt`, `/api/sync/replay`, `RECEIPT_HMAC_KEY`, `ERR_RECEIPT_INVALID`. D-39: `ERR_SESSION_SOURCE_EXPIRED`. D-35: `ERR_MODE_NOT_ALLOWED`.
  - V-2: `CONFIG.MAX_CONCURRENT_INGESTIONS = 4`, `MAX_CONCURRENT_INGESTIONS = 4`, `CONFIG.INGEST_QUEUE_TIMEOUT_MS = 10000`, `CONFIG.LLM_MAX_RETRIES = 1`, `CONFIG.LLM_RETRY_DELAY_MS = 500`, `CONFIG.LLM_RETRY_JITTER_MS = 100`, `CONFIG.SESSION_TOKEN_QUOTA = 80000`, `ingest_ms + engine_ms > 2000`, `LLM_MAX_OUTPUT_TOKENS` (đổi thành `CONFIG.LLM_MAX_OUTPUT_TOKENS`). Tên hằng vẫn còn ở dạng `CONFIG.*`.
- Khối code đổi: 0 (theo preserve; sơ đồ Mermaid đổi nhưng preserve không tính).

## 2. `spec/10_ENGINE_INGEST.md`

- Byte: **39 905 → 39 830**. mmcheck: **1/1 OK**.
- Đã làm:
  - D-38: sơ đồ bước 3 "Tìm nhánh mặc định"; ING-04 alias = `owner/repo` + `subdir_override` (khớp `03` §4); ING-13 viết lại: chỉ lấy `owner`/`repo`, cắt mọi phần sau tên repo, `path_trimmed` = link có `/tree`, `/blob`; Mục 3 đổi tên, `ResolvedRef` bỏ `subdir`, `resolveRef(owner, repo)` bỏ tham số `info`; **ING-31** giữ mã, đổi nội dung thành "Không thử ref từ link (D-38)"; ING-32 "Nhánh mặc định"; ING-33, ING-34 (`subdir_override`), Mục 5 bước 4, ING-80 bỏ "`subdir` từ link". Danh sách nơi phát mã lỗi: `ERR_BRANCH_NOT_FOUND` chỉ còn ING-43.
  - D-27: ING-45 upload kiểm `CONFIG.MAX_UPLOAD_BYTES`; ING-04 thêm "cache RAM không được dựa vào".
  - D-39: `GITHUB_COMMIT` "luôn đúng SHA của phiên"; Mục 4 bước 2 + HTTP 404 của `GITHUB_COMMIT` ⇒ `ERR_SESSION_NOT_FOUND` (Q-12) thay `ERR_SESSION_SOURCE_EXPIRED`.
  - D-36: Mục 11 bước 3 bỏ `code_context` ("lát cắt gửi AI").
  - Test: **xóa T-ING-05** (thử 4 ứng viên ref — luật đã bỏ; giữ khoảng trống số để không vỡ mã); T-ING-03, T-ING-04 viết lại thành test D-38 (cắt về gốc, `path_trimmed true`, không HEAD thử ref); T-ING-06 bỏ ca `/tree/x/../y` (nay bị cắt, không còn lỗi), thay bằng `https://github.com/a`; T-ING-01, T-ING-02 `ref_path`/`is_blob_link` ⇒ `path_trimmed false`; T-ING-12 upload 4 718 593 byte (> `MAX_UPLOAD_BYTES`).
  - **Ngoài danh sách việc:** T-ING-13 sửa theo `MAX_CLEAN_FILES` = 100 (D-41, 05A): 60 + 60 file ⇒ `skipped.quota 20` (bản cũ 30 + 30 ⇒ `quota 10` chỉ đúng với 50).
- Token mất (27; preserve báo thêm 1 token "chuyển sang archive") — tất cả thuộc thứ đã bỏ:
  - D-38: `owner/repo@ref_path/subdir`, regex ING-13 cũ, `ref_path`, `decodeURIComponent`, `tree|blob`, `is_blob_link`, `blob`, `s1..sk`, `/blob/`, `s1`, `s1/s2`, `CONFIG.MAX_REF_CANDIDATES`, `D-11`, `ref_path null`, `is_blob_link false`, `release/v2`, `release`, `ref "release/v2"`, `subdir "src"`, `main/src`, `ref "main"`, `ref_path "f/a/b/c/d/x"`, `f/a/b/c/d`, `.../a/b/tree/x/../y`.
  - D-39: `ERR_SESSION_SOURCE_EXPIRED`. D-36: `code_context`. D-41: `skipped.quota 10`.
- Khối code đổi: 2 (`IngestSource` thêm chú thích D-39; `ResolvedRef` / `resolveRef`) — đúng chủ đích.

## 3. `spec/40_KE_HOACH_21H.md`

- Byte: **15 198 → 15 031**. mmcheck: **1/1 OK**.
- Đã làm:
  - Mục 1: tài khoản Vercel (gói free, `sin1`, nối repo thi) thay Railway / Render / Fly.io.
  - Mục 3: thêm dòng `pino` (dòng `9.x`, kiểm lại lúc H+0 như mọi gói); ghi chú đầu Mục 3 "host Vercel".
  - Mục 6: bỏ `sync/replay` + biên nhận, `DECAY_REVIEW`, `REMEDIATION` (đánh số lại 1–5); **giữ** "Liên kết GitHub" vì D-44 ⏳; bỏ "Fast-Track" khỏi "Không bao giờ cắt".
  - Mục 10: không có dòng Railway; sửa dòng "Comment EOCD…" theo D-39 / Q-12.
  - **Ngoài danh sách việc (cùng D-34/D-35/D-36/D-40, `40` nằm trong file bị ảnh hưởng):** sơ đồ Đọc nhanh bỏ "sync"; cây thư mục Mục 2 bỏ `sync/replay/route.ts`, `sync.ts`, `token.ts · receipt.ts`, chữ "Fast-Track" ở `progress.ts`, thêm `log.ts` (pino); H+12 "Fast-Track; viền cam" ⇒ "mài mòn ở bảng kỹ năng"; Mục 7 DoD: dòng `SENIOR_ACTIVE` ⇒ dòng kiểm D-34, dòng `SENIOR_RUSTY` viền cam ⇒ mài mòn; Mục 8 ví dụ commit "tách ref ngắn trước" ⇒ "cắt link về gốc repo" (D-38).
- Token mất (4; + 2 chuyển sang archive): `sync/replay` (D-40), `ERR_PERSISTENCE_UNAVAILABLE` (nằm trong dòng "cắt nếu trễ" của `sync/replay` đã bỏ — hành vi này nay là mặc định ở `03`), `SENIOR_ACTIVE` (D-34), `feat(engine): tách ref ngắn trước` (D-38).
- Khối code đổi: 1 (cây thư mục) — đúng chủ đích.

## 4. `spec/50_TEST_VA_FIXTURE.md`

- Byte: **22 506 → 22 735**. mmcheck: 0/0 sơ đồ.
- Đã làm:
  - A: A1 bỏ "không node nào Fast-Track"; A2 bỏ `FAST_TRACK_MIN`; A3 "2 token" ⇒ câu hỏi + đáp án lưu `node_runs` (D-36); A7 viền cam ⇒ "chưa có nhãn 'đang mài mòn' (Δt = 0, BKT-24)".
  - B: bỏ "rồi ôn lại", xóa B6 (`can_remediate`), B7, B8, B8' (`REMEDIATION`); B6 mới: N2 giữ `FAILED`, không nút ôn, "Học lại từ đầu" (D-42).
  - C (D-34) viết lại: không còn Fast-Track; C2 N1 mọi kỹ năng đã thạo ⇒ 1 câu `DTO_VALIDATION` · ARCHITECT · `CHANGE` (hòa điểm + `practice_count` bằng nhau ⇒ thứ tự phân tích, BKT-31), PF 0.9532 → **0.9873**; C3 N2 ⇒ 1 câu `AUTH_SECURITY` · ARCHITECT · `WEAKNESS`; C4–C6 = C2–C4 cũ (số giữ); C7 = biến thể Capstone cũ, trỏ `22` P-D. Câu cuối: AI đặt câu hỏi ở cả 5 node.
  - D: D11 bỏ "trúng cache câu hỏi" (D-37); D14 `sync_receipt` ⇒ `ERR_PERSISTENCE_UNAVAILABLE` + "Thử lại" (D-40); D16 token hết hạn ⇒ gọi lại `enrich-node` khi run dở trả cùng run; D17 token người A ⇒ `run_id` người A ⇒ `ERR_SESSION_NOT_FOUND` (API-05, `03` §1).
  - E (D-35) viết lại thành mài mòn: E1 nhãn "đang mài mòn" ở 2 kỹ năng, không viền, không nút ôn; E2 "Học lại từ đầu" ⇒ `LEARN` N3: Q1 `DB_OPTIMIZATION` · NOVICE · `WEAKNESS`, Q2 `LAYERED_SEPARATION` · PRACTITIONER · `ARCHITECTURE`; E3a/b/c giữ số 0.7324 / 0.5854 / 0.1268.
  - 3.6: bỏ dòng `SENIOR_ACTIVE`; `SENIOR_RUSTY` ⇒ mài mòn. X-02: bỏ `code_context`, thêm `must_have_points` của câu chưa xong.
- Số đã kiểm bằng `node -e` (cài BKT theo `22` Mục 4 + decay): `upd(0.25,PF)=0.5767`, `PAH=0.4202`, `F=0.0791`, `upd(0.5767,PF)=0.8413` (khớp số cũ); `dec(0.9532,30)=0.4092`, PF 0.7324, PAH 0.5854, F 0.1268 (khớp); `upd(0.9532,PF)=0.9873` (mới, C2).
- Token mất (14; + 3 chuyển sang archive) — tất cả thuộc thứ đã bỏ: D-35 `can_remediate = true`, `REMEDIATION_MIN_OTHER_FINISHED`, `REMEDIATION_MAX_ATTEMPTS`, `remediation_runs = 1`, `mode`; D-34 `applyFastTrackCascade`, `SENIOR_ACTIVE`; D-40 `sync_receipt`, `APPLIED`, `DUPLICATE`; D-36 `exp`, `ERR_CHALLENGE_TOKEN_EXPIRED`, `ERR_CHALLENGE_TOKEN_INVALID`, `code_context`.
- Khối code đổi: 0.

## 5. Pitch

| File | Byte trước → sau | mmcheck |
| :-- | :-- | :-- |
| `pitch/KICH_BAN_DEMO.md` | 21 197 → 22 597 | 0/0 |
| `pitch/PHAN_BIEN_BGK.md` | 25 732 → 27 405 | 0/0 |
| `pitch/ROADMAP.md` | 20 803 → 21 436 | 0/0 |
| `pitch/KIEN_TRUC_BGK.md` | 13 557 → **12 763** (≤ 15 000) | 1/1 OK |
| `pitch/LUONG_DE_HIEU.md` | 16 154 → 16 809 | 1/1 OK |

- **`KICH_BAN_DEMO` (V-1):** 3:20–3:50 thay bằng "Cổng gác chặn 1 câu AI bịa tên hàm": Người 2 chạy `npx vitest run -t "GUARD-04"` trên fixture `50` Mục 2.1 (AI gán `AUTH_SECURITY` với hàm `verifyToken` không có trong code ⇒ bị chặn, `findOne` giữ); có ghi chú dùng bản ghi chặn thật từ `review/run-*.json` nếu có, và nói rõ "dữ liệu mẫu cố ý cài lỗi". 3:50–4:20 viền cam + "Ôn bài" ⇒ `SENIOR_RUSTY` hiện "đang mài mòn" ở bảng kỹ năng Tab X-Ray (giữ đoạn, đổi nội dung). Bỏ "Ôn bài" ở tên nút; câu D Mục 3 ⇒ câu cổng gác; Mục 4 thêm dòng dự phòng test cổng gác, dòng persona đổi theo mài mòn; Mục 5 checklist bỏ câu Capstone `SENIOR_ACTIVE` / câu "Ôn bài", thêm sinh câu hỏi 3 lần (D-37) và chụp ảnh test; Mục 6 bản 3 phút bỏ `SENIOR_ACTIVE` / Fast-Track / viền cam, bản 7 phút bỏ "Ôn bài". Kết: 0,02 ⇒ 0,03 USD (`02` §1.1 sau D-37). Giới hạn repo: thêm link gốc (D-38), upload 4,5 MB, 100 file.
- **`PHAN_BIEN_BGK` (V-3):** dòng giới hạn "có thể dán link tới thư mục con" ⇒ chỉ link gốc, link con cắt về gốc, chọn thư mục / upload `.zip` (D-38), 50 ⇒ 100 file, thêm upload 4,5 MB; câu A1 "miễn thi … nhắc ôn" ⇒ 1 câu khó + "đang mài mòn" (D-34, D-35); **A6 viết lại thành "Không bán thì lấy gì duy trì? Ai trả tiền?"** (D-33: mã nguồn mở, tự mang key trong `.env`, Vercel/Supabase free, nghiên cứu + CV; bán cho trường / doanh nghiệp chỉ là khả năng). Đồng bộ thêm: pitch một đoạn, điểm mới #3, #4 (cache chỉ phân tích + tổng quan), giới hạn "chép câu hỏi" (câu hỏi sinh mới), A5 (dashboard giảng viên = khả năng chưa theo đuổi), B1, B10 (upload 4,5 MB), C6 (câu hỏi không cache; người sau ~38.000 token ≈ 0,03 USD), D3 (không còn miễn thi), bảng Mục 6 (4 dòng sửa / thêm D-33, D-34, D-35, D-37, D-38).
- **`ROADMAP` (D-33):** Mục 0 thêm định hướng; Mục 1 bỏ Fast-Track, viền cam, sync receipt, `sync/replay`, `DECAY_REVIEW`, `REMEDIATION`, "nhiều phiên bản câu hỏi"; R1/R2/R5/R6 viết lại theo Vercel, D-37, tự host; GĐ1 = "Phát hành mã nguồn mở & thu dữ liệu nghiên cứu"; GĐ2 = "Nghiên cứu" + 3 câu hỏi nghiên cứu + Fast-Track chỉ là "ý tương lai"; **GĐ3 mới = "Cộng đồng mã nguồn mở"**; GĐ4 giữ (công cụ mã nguồn mở); **Mục 9 mới "Khả năng, chưa theo đuổi"** gom dashboard giảng viên, bộ tạo đề, Google SGU, B2C, B2B, chi phí 1.000 MAU; KPI và bảng "Số cũ" cập nhật (0,03 USD, D-37, Railway ⇒ Vercel). Số mục đổi (7–11); đã grep: không file nào trỏ số mục của `ROADMAP` (chỉ "roadmap GĐ2", vẫn đúng).
- **`KIEN_TRUC_BGK`:** Railway ⇒ Vercel ở Backend, Monitoring, CI/CD, Deployment, sơ đồ + bảng 4 bậc, **Q4 viết lại** ("Tại sao chọn Vercel? mất cache RAM thì sao" — trả lời bằng D-27, D-39, D-36, D-33, nêu giới hạn zip / Q-12); bỏ dòng "Container" (Nixpacks/Railway). **V-2:** xóa "1.2–1.8 s", "ping < 10 ms"; bỏ thêm số ngoài `CONFIG`: "10 phút", "4 luồng", `= 4`, `= 500`, "Jitter 100 ms", "15 RPM", "~160 repo/phút", "10–30 người", CCU 50/100–500/500–2,000/> 2,000, "CPU > 70%", "p95 > 5 s", "500k commands", "1,000 msg/ngày", "7 ngày". Đổi "Hoàn toàn không" RCE, "loại trừ 100%", "duyệt tay 100%", "100% endpoint" (AGENTS luật 3). Nguồn: bỏ Railway Regions / Pricing, Render, Fly.io; đánh số lại 1–11 (Q7 trỏ nguồn 4 = Supabase Inactivity).
- **`LUONG_DE_HIEU`:** bỏ ⚡ / viền cam / "Ôn bài" / "Ôn lại" (Mục 1, dấu hiệu phụ, sơ đồ B9–B10, Bước 9, 10, từ điển); Bước 9 ⇒ "Ô đã vững vẫn hỏi 1 câu"; Bước 10 ⇒ "Quên và 'mài mòn'" có **câu so sánh mài mòn kiểu Duolingo**; bỏ `challenge_token` / "phong bì" (Bước 6, 7, Mục 5); Mục 4 bỏ biên nhận và "dán link thư mục con"; Bước 2 link gốc (D-38) + `.zip` ≤ 4,5 MB; 50 ⇒ 100 file; Mục 5 cache RAM "có thể mất bất cứ lúc nào".
- Còn nhắc Railway / Fast-Track có chủ đích: `KIEN_TRUC_BGK` cột "Không chọn" (Railway, Render, Fly.io); `ROADMAP` dòng "ý tương lai — miễn thi" và bảng "Số cũ".

## 6. Chỗ chưa làm / không chắc (cần planner xem)

1. **D-37 làm rủi ro demo:** câu hỏi sinh mới mỗi lần mở Tab 2 ⇒ câu trả lời soạn sẵn A–C (`KICH_BAN_DEMO` Mục 3) có thể không khớp câu hỏi lúc lên sân khấu. Đã ghi "sinh 3 lần, lệch ý ⇒ Offline", nhưng có thể cần quyết riêng cho repo demo (vd giữ câu hỏi đã duyệt trong `mock_bundle` hoặc cho phép cache câu hỏi chỉ ở `DEMO_MODE`).
2. **V-1** dựa vào test `GUARD-04` (có trong `21` "Test bắt buộc": `verifyToken` ⇒ không) và fixture `50` Mục 2.1. Repo thi phải có test đó với tên bắt đầu `GUARD-04` (theo quy ước tên test ở `50`). Chiếu terminal trên sân khấu là đổi màn hình — nếu muốn hiện ngay trên UI thì cần thêm thành phần ở `30` (ngoài phạm vi).
3. `spec/50` kịch bản C giả định thứ tự kỹ năng trong bản phân tích N1 là `DTO_VALIDATION, HTTP_ROUTING` (như bảng Mục 1.1) và `practice_count` bằng nhau.
4. `ERR_BRANCH_NOT_FOUND` vẫn phát ở ING-43 (codeload 404 khi tải nhánh mặc định đã phân giải) — thông điệp ở `30` vẫn nói "nhập đúng tên nhánh" (05B mục 8).
5. `spec/04` V-2 làm rộng hơn 3 số được nêu (bỏ ngưỡng giám sát tự đặt, số gói Gemini / Supabase). Nếu nhóm muốn giữ một ngưỡng nào thì đưa vào `CONFIG` trước.
6. Pitch vẫn lặp số từ `CONFIG` (15 MB, 4,5 MB, 100 file, 0,92, 0,05 / 0,03 USD) như cách cũ; đổi `CONFIG` thì phải sửa pitch.
7. `PHAN_BIEN_BGK` bảng "Không nói" còn "≈ $0.03/phiên" (lời hứa cũ theo phiên); dễ nhầm với "~0,03 USD người học sau" mới — chưa sửa vì là danh sách câu cũ.
8. `spec/40` dòng `pino` ghi `9.x` (dòng khuyến nghị như các gói khác) — chốt bản chính xác ở H+0.
9. `ROADMAP` vẫn nhắc `llm_calls` là việc roadmap (đã có từ trước) — không phải áp dụng D-43 (⏳).
10. `refcheck_baseline.txt` có kết thúc dòng CRLF ⇒ `--diff` không khớp được dòng nào và in lại cả các lỗi đã có trong baseline (xem Mục 7). Nên chuyển baseline sang LF.

## 7. Output `refcheck` cuối

Lệnh: `node .ai/tools/refcheck.mjs --diff .ai/tools/refcheck_baseline.txt`

```
pitch/KICH_BAN_DEMO.md | mã không còn trong spec/00_QUYET_DINH.md | Q-02b
pitch/PHAN_BIEN_BGK.md | mã không còn trong spec/00_QUYET_DINH.md | Q-02d
pitch/ROADMAP.md | mã không còn trong spec/00_QUYET_DINH.md | Q-02a
spec/00_QUYET_DINH.md | mã không còn trong spec/20_AI_GOI_VA_PROMPT.md | AI-24
spec/11_ENGINE_DO_THI.md | mục không tồn tại | Mục 10.1 → spec/11_ENGINE_DO_THI.md
spec/11_ENGINE_DO_THI.md | mục không tồn tại | Mục 10.2 → spec/11_ENGINE_DO_THI.md
spec/20_AI_GOI_VA_PROMPT.md | mục không tồn tại | Mục 3.1 → spec/20_AI_GOI_VA_PROMPT.md
spec/21_AI_KIEM_VA_DUYET.md | mục không tồn tại | Mục 6.2 → spec/21_AI_KIEM_VA_DUYET.md
```

Đối chiếu tay với baseline (do lỗi CRLF ở Mục 6 mục 10): mọi dòng trên **đều có trong baseline**, trừ `spec/00_QUYET_DINH.md | … | AI-24` (D-25 đã hủy còn trỏ `20` AI-24 đã xóa — 05B đã báo, file ngoài phạm vi task này). **Không có lỗi tham chiếu mới trong file của task này.** Các dòng baseline của `02`, `03`, `10`, `22` không còn xuất hiện (đã hết lỗi).
