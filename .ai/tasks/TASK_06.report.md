# TASK_06 — Báo cáo

Nhánh: `docs/cau-truc-spec` (đúng). Có `DONE_05A`, `DONE_05B`, `DONE_05C`; đã đọc mục "Chỗ chưa làm / không chắc" của 3 báo cáo 05. `git status` lúc bắt đầu: sạch (không thấy thay đổi chưa commit của planner) — chỉ `git add` đúng danh sách trong task.

Byte đo bằng `tr -d '\r' < <file> | wc -c` (trước: đo trước khi sửa; sau: đo sau khi sửa).

## 1. Từng file

| File | Byte trước → sau | mmcheck | Token `preserve` báo mất | Lý do |
| :-- | :-- | :-- | :-- | :-- |
| `spec/00_QUYET_DINH.md` | 25 323 → 25 927 | 0/0 | `AI-24` | Mục 5: D-25 bỏ con trỏ tới `20` AI-24 (đã xóa), ghi "quy tắc ở `20` đã xóa theo D-35" |
| `spec/01_KIEN_TRUC_VA_LUONG.md` | 16 548 → 16 806 | 4/4 OK | `SyncReceipt`, `challenge_token` | Mục 7: INV-05 bỏ `SyncReceipt` (D-40); INV-07 bỏ `challenge_token` (D-36) |
| `spec/03_API_VA_LUU_TRU.md` | 32 104 → 32 254 | 3/3 OK | 0 token; 1 khối code đổi (`// src/server/evaluate.ts`) | Mục 2: dòng gọi `gradeWithAI` / `decideFollowUp` (đúng chủ đích) |
| `spec/20_AI_GOI_VA_PROMPT.md` | 44 088 → 44 088 (không sửa) | — | — | AI-22 không truyền `previous` (chỉ nhắc `checkQuestions`); AI-27 đã đúng chữ ký `GradeContext` |
| `spec/21_AI_KIEM_VA_DUYET.md` | 39 382 → 39 244 | 1/1 OK | `normText(feynman_question)`, `previous`, ` ⇒ qua. 1 ý bắt buộc ⇒ hỏng. Câu trùng ` ; 1 khối code đổi (`checkQuestions`) | Mục 3: bỏ hàng Q9, tham số `previous`, ca test "Câu trùng `previous`" |
| `spec/22_BKT_VA_KE_HOACH_CAU_HOI.md` | 32 723 → 33 195 | 2/2 OK | `getDecayedMastery(state, now) < state.p_mastery` | Mục 1: luật mài mòn cũ (D-35 ✏️) thay bằng so bậc |
| `spec/30_UI.md` | 38 127 → 38 660 | 1/1 OK | `GithubRepoInfo.path_trimmed` | Mục 11: `IngestResponse` (`02`) không trả trường này ⇒ đổi thành "client tự nhận `/tree/…`, `/blob/…` trong ô link" |
| `spec/40_KE_HOACH_21H.md` | 15 031 → 15 210 | 1/1 OK | 0 | — |
| `spec/50_TEST_VA_FIXTURE.md` | 22 735 → 23 321 | 0/0 | 0 | — |
| `pitch/PHAN_BIEN_BGK.md` | 27 405 → 27 514 | 0/0 | (không chạy `preserve` cho pitch) | — |
| `pitch/KICH_BAN_DEMO.md` | 22 597 → 22 944 | 0/0 | — | — |
| `pitch/LUONG_DE_HIEU.md` | 16 809 → 16 809 (không sửa) | 1/1 OK | — | Không có câu nêu luật cũ "điểm thấp hơn điểm gốc" |

Giới hạn byte: mọi spec ≤ 40 000; `spec/20` ≤ 47 433. `spec/03` = 32 254 > 32 000 (mục tiêu "cố gắng"; trước task đã 32 104, phần thêm đã rút gọn tối đa).

## 2. Đã làm theo mục

1. **Mài mòn (D-35 ✏️).**
   - `22`: Mục nguyên tắc, câu "Mọi quyết định dùng điểm đã decay", BKT-24 (`isDecaying` = có state ∧ `tierOf(getDecayedMastery(state, now)) < tierOf(state.p_mastery)`, thứ tự `NOVICE < PRACTITIONER < ARCHITECT`, ngưỡng `CONFIG.TIER_*`, không thêm hằng số; thanh nhạt dần liên tục theo tỉ lệ điểm đã decay / `p_mastery`; đã decay mà chưa rớt bậc ⇒ chỉ thanh nhạt, không nhãn), BKT-25 ("cùng bậc ⇒ hết nhãn"). T-MM tính lại: 6 ca, có ca 0.5767 @9 (đã decay, chưa rớt bậc ⇒ `false`) và các ca rớt bậc 0.5767 @10, 0.8413 @7 (⇒ `true`). T-PER `SENIOR_RUSTY` `true` vẫn đúng (`ARCHITECT ⇒ NOVICE`), giữ.
   - `30` Mục 6.1 (chip kỹ năng Tab X-Ray) + T4 ("Δt = 0 ⇒ không rớt bậc"), T5 ("`ARCHITECT` ⇒ `NOVICE`").
   - `50` A7 ("Δt = 0 ⇒ không rớt bậc"), E1 (cả hai nhãn vì rớt bậc: `ARCHITECT ⇒ NOVICE`, `ARCHITECT ⇒ PRACTITIONER`). E3a, 3.6 `SENIOR_RUSTY` vẫn đúng, không sửa.
   - `00` D-35: thêm dòng **Sửa 30/10** như `CHOT_CUOI.md`.
   - `01` Mục 5.3: câu luật cũ đổi sang so bậc (chỗ khác nói luật cũ).
   - `pitch/LUONG_DE_HIEU.md`, `pitch/KICH_BAN_DEMO.md`: không có câu nêu luật cũ ⇒ giữ.
2. **`gradeWithAI`.** `03` 6.2 dựng `const t = { ...q, steps: run.steps, forbidden_external_keywords: run.forbidden_external_keywords }; // GradeContext (20 AI-27)` rồi gọi `gradeWithAI(t, req.student_answer, req.attempt_number, maxAttempts, session)`. Cùng lúc sửa `decideFollowUp(grading, req.attempt_number, maxAttempts, isPassed, t, req.student_answer)` cho khớp chữ ký ở `20` (trước đó `03` truyền `q, run.steps, run.forbidden_external_keywords` rời). Sơ đồ Mục 6.2 không có chữ ký ⇒ không sửa. Đã đối chiếu: `20` AI-27 `gradeWithAI(t: GradeContext, answer, attempt, maxAttempts, session)`, `decideFollowUp(g, attempt, maxAttempts, isPassed, t: GradeContext, answer)`; `21` `gradeScope(t: GradeContext, answer)`, `verifyFollowUp(g, t: GradeContext, answer, isPassed)`, `leaksNumbers(text, t: GradeContext, answer)` — một chữ ký duy nhất.
3. **`21` GUARD-12.** Bỏ hàng Q9, tham số `previous` của `checkQuestions`, ca test "Câu trùng `previous` ⇒ hỏng"; "Q1–Q5, Q9" ⇒ "Q1–Q5". Không đánh số lại. `20` AI-22 không có nơi gọi truyền `previous`.
4. **`ERR_BRANCH_NOT_FOUND`** (`30` Mục 10), nguyên văn mới:
   > Không tải được nhánh mặc định của repo. Repo có thể đang trống hoặc vừa đổi nhánh mặc định — vui lòng thử lại sau.
5. **`00`.** D-25 (xem bảng Mục 1). Q-12: thêm đầu ô "*(Đã chốt 30/10 theo V-5: best-effort — phiên upload `.zip` chỉ đảm bảo khi instance còn cache; mất ⇒ báo rõ "phiên upload không mở lại được, hãy upload lại .zip"; demo + test dùng link GitHub (tải lại theo SHA). Không thêm tính năng, không thêm mã lỗi.)*", giữ nguyên câu hỏi cũ như Q-08; dòng tóm tắt Mục 3 "(Q-06, Q-08, Q-12 đã đóng)".
6. **Q-12 / zip.**
   - `03` Mục 4 bảng `getOrRebuildStaticResult`, dòng "Trượt, `ARCHIVE_HASH`": thêm V-5, "Nguồn `ZIP` chỉ best-effort: UI báo "phiên upload không mở lại được, hãy upload lại .zip" (`30` Mục 10)".
   - `30`: dòng `ZIP_SOURCE` của bảng "Tiếp tục học" thêm dòng chữ "Phiên upload không mở lại được — hãy upload lại file .zip."; `ERR_SESSION_NOT_FOUND` ở Mục 10 thêm biến thể thông điệp cho phiên nguồn `ZIP` (cùng mã, không thêm mã lỗi).
   - `50`: mục "Chung cho mọi kịch bản" thêm "`ingest` repo mẫu bằng **link GitHub** (phiên `COMMIT_SHA`) … Upload `.zip` chỉ có ca best-effort D19 (Q-12)"; thêm ca **D19** (best-effort zip); X-04 ghi rõ "Phiên link GitHub".
   - `pitch/KICH_BAN_DEMO.md`: kịch bản đã dùng link GitHub (dán link, checklist "Copy sẵn link repo demo") ⇒ không sửa phần này.
7. **`01`.** Mục 1 (theo D-34, D-35); INV-05 bỏ Fast-Track, `SyncReceipt`; INV-07 đáp án chỉ ở server: cột câu hỏi của `node_runs` (`03` Mục 3.1), client không có quyền đọc (RLS), bỏ `ai_cache` / `challenge_token`; INV-11 bỏ Fast-Track ⚡, viền cam, thêm "đang mài mòn" (bảng kỹ năng) vào lớp hiển thị; Mục 3 sơ đồ: subgraph "Vercel Functions (Next.js route handlers, D-27)", cache "RAM 1 instance, `INGESTION_CACHE_TTL_MS`, không được dựa vào"; Mục 4 tầng 5 bỏ Fast-Track. Bảng luồng Mục 5 không có chữ "Fast-Track" (chỉ ở Mục 4 tầng 5).
8. **`PHAN_BIEN_BGK`** bảng "Không nói": bỏ "≈ $0.03/phiên" khỏi cột không nói; cột nói đổi thành "Người đầu tiên học 1 repo ~0,05 USD; người học sau cùng repo ~0,03 USD (câu hỏi không cache, D-37) — ước lượng, chưa đo" (`02` Mục 1.1).
9. **`KICH_BAN_DEMO` D-37.** Mục 3 trước nói "sinh câu hỏi 3 lần, chép lại câu hỏi thật và chỉnh câu trả lời cho khớp" (khác D-37 đã chốt) ⇒ đổi: câu trả lời soạn sẵn lấy theo câu hỏi trong Offline bundle đã duyệt (`mock_bundle.json`), không theo lần sinh trực tiếp; H+17 sinh online 3 lần, lệch ý với bundle ⇒ Offline. Khối 3:20–3:50 (V-1) giữ nguyên, chỉ thêm 1 câu ở mục 10.
10. **V-1 / `GUARD-04`.**
    - `spec/40` Mục 7 (DoD, "kiểm ở H+17" ghi ở tiêu đề mục, các dòng không có giờ riêng), dòng đã thêm ngay sau dòng "Mọi test `50` xanh":
      > - [ ] Repo thi có test tên bắt đầu bằng `GUARD-04` (`21` Test bắt buộc, `50` Mục 2.1), chạy xanh (`npx vitest run -t "GUARD-04"` — dùng cho demo cổng gác).
    - `KICH_BAN_DEMO` đoạn 3:20–3:50: thêm "*Terminal lỗi hoặc không chuyển được cửa sổ ⇒ mở ảnh chụp kết quả test đã chụp sẵn (Mục 5) và nói rõ đó là ảnh chụp.*"; Mục 4 dòng "Test cổng gác không chạy": dấu hiệu thêm "không chuyển được cửa sổ", việc làm thêm "(Mục 5)".

## 3. Lệnh `node -e` cho T-MM

Đọc hằng từ `spec/02` (CONFIG), cài `dec` / `tierOf` như `22` Mục 3–4 (chạy ở gốc repo, bash):

```
node -e '
const s=require("fs").readFileSync("spec/02_CONTRACTS.md","utf8");
const c=k=>Number(s.match(new RegExp(k+": *([0-9._]+)"))[1].replace(/_/g,""));
const F=c("DECAY_FLOOR"),h=c("DECAY_HALF_LIFE_DAYS"),D=c("MS_PER_DAY"),P=c("TIER_PRACTITIONER_MIN"),A=c("TIER_ARCHITECT_MIN"),L0=c("BKT_P_L0");
const T0=1774000000000;
const dec=(st,now)=>{if(!st)return L0;const p=st.p_mastery,dt=Math.max(0,now-st.last_practiced_at)/D;return p<=F?p:F+(p-F)*Math.pow(2,-dt/h)};
const tierOf=p=>p<P?"NOVICE":p<A?"PRACTITIONER":"ARCHITECT";
const R={NOVICE:0,PRACTITIONER:1,ARCHITECT:2};
const isDecaying=(st,now)=>!!st&&R[tierOf(dec(st,now))]<R[tierOf(st.p_mastery)];
for(const [p,d] of [[0.5767,0],[0.5767,9],[0.5767,10],[0.8413,7],[0.9532,30],[0.95,30],[0.0791,30],[null,30]]){
 const st=p==null?undefined:{p_mastery:p,last_practiced_at:T0};const now=T0+d*D;
 console.log(p,"@"+d,dec(st,now).toFixed(4),st?tierOf(p):"-","->",tierOf(dec(st,now)),isDecaying(st,now));}'
```

Output:
```
0.5767 @0 0.5767 PRACTITIONER -> PRACTITIONER false
0.5767 @9 0.4592 PRACTITIONER -> PRACTITIONER false
0.5767 @10 0.4491 PRACTITIONER -> NOVICE true
0.8413 @7 0.6681 ARCHITECT -> PRACTITIONER true
0.9532 @30 0.4092 ARCHITECT -> NOVICE true
0.95 @30 0.4085 ARCHITECT -> NOVICE true
0.0791 @30 0.0791 NOVICE -> NOVICE false
null @30 0.2500 - -> NOVICE false
```
(Ca 0.9532 @30 dùng cho `50` E1, 0.95 @30 cho T-PER / T5.)

## 4. Mục 11 — chỉ rà

- **`30` đọc trực tiếp `node_runs` / `question_attempts`:** không có (grep `node_runs`, `question_attempts`, `.from(` trong `30`: 0 dòng). Đúng.
- **`GithubRepoInfo.path_trimmed` ở `30`:** Mục 2 (ô link) viện dẫn như thể quyết định tô `--amber`, trong khi `IngestResponse` (`02`) không trả trường này ⇒ đã sửa: "(server cắt về gốc repo); client tự nhận `/tree/…`, `/blob/…` trong ô link ⇒ ghi chú tô `--amber`".
- **`node_runs.steps` / `forbidden_external_keywords` (INV-04):** `03` (cột SQL: "`RunStepRef[]` — chỉ tên, không code"; từ cấm là tên gói), `02` `RunStepRef` (`step_index`, `layer`, `file_path`, `function_name`), `20` AI-27 ("không có code") — đều chỉ tên. Không sửa.
- **Token cũ còn lại** (grep `Fast-Track|challenge_token|SyncReceipt|REMEDIATION|DECAY_REVIEW|viền cam|sync/replay|Railway|AI-24` trong `spec/`, `pitch/`):

| Chỗ | Token | Cố ý / sót |
| :-- | :-- | :-- |
| `spec/00` dòng 9 (tóm tắt Mục 1) | Fast-Track | Cố ý: "bỏ Fast-Track" |
| `spec/00` D-01, D-02 (đầu ô "Sửa bởi D-34" + nội dung cũ giữ) | Fast-Track | Cố ý (dòng D đã sửa giữ nguyên chữ cũ) |
| `spec/00` D-03 | viền cam | Cố ý ("Sửa bởi D-35 … bỏ #19 (viền cam)") |
| `spec/00` D-34, D-35, D-36, D-40 | Fast-Track, `REMEDIATION`, `DECAY_REVIEW`, viền cam, `challenge_token`, `sync/replay` | Cố ý (chính dòng quyết định bỏ) |
| `spec/00` D-14, D-21, D-25 (Hủy) | `challenge_token`, Fast-Track, `REMEDIATION`, `DECAY_REVIEW` | Cố ý (dòng D đã hủy) |
| `spec/00` D-27 | Railway | Cố ý ("Bỏ Railway") |
| `spec/00` Q-08 (đã đóng) | viền cam | Cố ý (câu hỏi đã đóng giữ chữ cũ) |
| `spec/03` Mục 5.3 | Fast-Track | Cố ý ("Không có Fast-Track") |
| `spec/22` Mục nguyên tắc + Mục 5 | Fast-Track | Cố ý ("Không Fast-Track (D-34)") |
| `pitch/ROADMAP.md` dòng 113 | Fast-Track | Cố ý (mục "ý tương lai") — ngoài file được ghi |
| `pitch/ROADMAP.md` Mục 11 (dòng "Fast-Track `P ≥ 0.85`", "Railway, tiến trình Node sống lâu") | Fast-Track, Railway | Cố ý (bảng "số cũ đã sửa": cột "tài liệu cũ ghi") — ngoài file được ghi |
| `pitch/KIEN_TRUC_BGK.md` | Railway | Cố ý (cột "Không chọn") — ngoài file được ghi |

  Không còn token sót trong các file được ghi. `AI-24`: 0 chỗ. Tên hằng `CONFIG.FAST_TRACK_MIN` giữ (không tính).

## 5. Chỗ chưa làm / không chắc

1. **`03` 6.2 dùng biến `t`** thay vì viết object literal ngay trong lời gọi `gradeWithAI({ ...q, … }, …)` như đề: cùng nội dung, nhưng để `decideFollowUp` dùng chung đúng một `GradeContext` (tránh lặp literal). Nếu planner cần đúng chữ của đề thì đổi lại.
2. **Mã giả `isDecaying` ở `22`** chỉ là khai báo chữ ký (không có thân) ⇒ không đổi; luật nằm ở BKT-24.
3. **`30` dòng `ZIP_SOURCE` ghi "chỉ nguồn `ZIP`"** nhưng `03` `GET /api/sessions` cho `ZIP_SOURCE` cả với GitHub `ARCHIVE_HASH` (05A mục 2) — vẫn lệch, ngoài các điểm task cho sửa.
4. **`01` Mục 5.4** "Phiên từ `.zip` ⇒ mời kéo thả lại đúng file" chưa ghi best-effort (mục 6 không liệt kê `01`); không sai, chỉ thiếu chữ "best-effort".
5. **`01` INV-04** còn nhắc `code_context` (khái niệm không còn sau D-36) — ngoài các điểm mục 7.
6. **`50` X-03** "không có chuỗi … ngoài `ai_cache`": nay `node_runs` cũng chứa văn bản AI (câu hỏi, đáp án) — có thể cần "ngoài `ai_cache`, `node_runs`". Chưa sửa (ngoài điểm task).
7. **`50` D19** là ca test mới (best-effort zip) — thêm để thỏa mục 6(b) "zip chỉ có ca test best-effort", vì trước đó `50` không có ca zip nào.
8. **`00` Q-12** cột "Mặc định" giữ nguyên chữ cũ ("UI mời kéo thả lại file (ZIP)…"), như Q-08 giữ nội dung cũ sau khi đóng.
9. **`spec/03`** 32 254 byte > 32 000 (mục tiêu V-4, không bắt buộc).
10. **`30` `ERR_SESSION_NOT_FOUND` biến thể zip**: cột hành động giữ "về màn hình trống" (màn hình trống đã có vùng thả) — không thêm hành động mới.

## 6. Output `refcheck` cuối

Lệnh: `node .ai/tools/refcheck.mjs --diff .ai/tools/refcheck_baseline.txt`

```
Không có lỗi tham chiếu mới so với baseline.
```
(exit 0; không còn dòng `AI-24`.)
