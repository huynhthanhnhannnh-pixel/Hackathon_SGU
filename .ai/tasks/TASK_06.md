# TASK_06 — Dọn chỗ lệch sau TASK_05A/B/C

Đọc `AGENTS.md` trước. Nhánh phải là `docs/cau-truc-spec` (sai ⇒ dừng, ghi báo cáo). Cần có `DONE_05A`, `DONE_05B`, `DONE_05C`. Đọc 3 báo cáo `TASK_05A.report.md`, `TASK_05B.report.md`, `TASK_05C.report.md` (mục "Chỗ chưa làm / không chắc") trước khi sửa.

## Đầu vào
- `.ai/CHOT_CUOI.md` (đã cập nhật 30/10): D-35 nay là `✏️` — **nhãn "đang mài mòn" chỉ hiện khi rớt bậc**; thêm **V-5** (Q-12). Các dòng `⏳` (D-43 … D-46) vẫn **không áp dụng**.
- Cây làm việc có thay đổi chưa commit của planner (`.ai/CHOT_CUOI.md`, `.ai/tools/refcheck.mjs`, `.ai/tasks/TASK_06.md`). **Không sửa, không `git add`** các file đó.

## Được ghi
`spec/00_QUYET_DINH.md`, `spec/01_KIEN_TRUC_VA_LUONG.md`, `spec/03_API_VA_LUU_TRU.md`, `spec/20_AI_GOI_VA_PROMPT.md`, `spec/21_AI_KIEM_VA_DUYET.md`, `spec/22_BKT_VA_KE_HOACH_CAU_HOI.md`, `spec/30_UI.md`, `spec/40_KE_HOACH_21H.md`, `spec/50_TEST_VA_FIXTURE.md`, `pitch/PHAN_BIEN_BGK.md`, `pitch/KICH_BAN_DEMO.md`, `pitch/LUONG_DE_HIEU.md`, `.ai/tasks/TASK_06.report.md`, `.ai/tasks/DONE_06`. Không file nào khác. **Không sửa `spec/02`**: không thêm / đổi hằng, kiểu nào; cần thêm ⇒ dừng, ghi vào báo cáo.

## Việc
Chỉ sửa đúng các điểm dưới; không đổi chữ nào khác (chuỗi hiển thị, khối prompt, schema giữ nguyên). Gọi bằng mã / tên (`BKT-24`, `CONFIG.*`), không tự đặt số.

1. **Luật mài mòn (D-35 ✏️).** Nhãn "đang mài mòn" hiện khi `tierOf(getDecayedMastery(k, now)) < tierOf(state.p_mastery)` (bậc của điểm đã decay thấp hơn bậc của điểm gốc). Thanh kỹ năng vẫn nhạt dần **liên tục** theo tỉ lệ điểm đã decay / `p_mastery`. Không thêm hằng số. Sửa ở:
   - `spec/22` BKT-24 + mã giả `isDecaying`; test **T-MM** tính lại bằng `node -e` (ngưỡng bậc đọc từ `CONFIG.TIER_*` ở `spec/02`, cài `dec`/`tierOf` như `22` Mục 3–4), ghi lệnh vào báo cáo. Giữ ít nhất 1 ca "đã decay nhưng chưa rớt bậc ⇒ không nhãn" và 1 ca "rớt bậc ⇒ nhãn".
   - `spec/30` Mục 6.1 (bảng kỹ năng Tab X-Ray) + test T4, T5.
   - `spec/50` A7, E1 (và chỗ khác nói luật cũ nếu có).
   - `spec/00` dòng D-35: thêm câu **Sửa 30/10** như trong `CHOT_CUOI.md`.
   - `pitch/LUONG_DE_HIEU.md` câu "mài mòn" và `pitch/KICH_BAN_DEMO.md` đoạn mài mòn: nếu có câu nêu luật cũ ("điểm thấp hơn điểm gốc") thì đổi sang rớt bậc; không thì giữ.
2. **`gradeWithAI` (lệch chữ ký).** Giữ `GradeContext` là kiểu nội bộ ở `20` AI-27. Sửa dòng gọi ở `spec/03` Mục 6.2 bước chấm (và sơ đồ nếu có chữ ký) thành truyền ngữ cảnh dựng từ dòng `node_runs`: `gradeWithAI({ ...q, steps: run.steps, forbidden_external_keywords: run.forbidden_external_keywords }, req.student_answer, req.attempt_number, maxAttempts, session)`. Đối chiếu `20` AI-27, `21` (`gradeScope`, `verifyFollowUp`, `leaksNumbers`) cho khớp 1 chữ ký duy nhất.
3. **`21` GUARD-12, Q9 và `previous`.** Bỏ hàng Q9 trong bảng kiểm, bỏ tham số `previous` khỏi `checkQuestions` (khai báo và mọi nơi gọi, kể cả `20` AI-22), bỏ ca test "Câu trùng `previous` ⇒ hỏng", sửa câu "Q1–Q5, Q9" thành "Q1–Q5". **Không đánh số lại** (giữ khoảng trống Q9, như T-ING-05).
4. **`ERR_BRANCH_NOT_FOUND`.** Giữ mã (còn phát ở ING-43 khi tải nhánh mặc định đã phân giải bị 404). Ở `spec/30` Mục 10 đổi thông điệp: bỏ "Hãy nhập đúng tên nhánh…", thay bằng nội dung nói repo trống hoặc nhánh mặc định vừa đổi, thử lại sau. Viết ngắn, cùng giọng với các dòng lân cận. Ghi nguyên văn mới vào báo cáo.
5. **`spec/00`.** Dòng D-25: bỏ con trỏ tới `20` AI-24 (đã xóa), ghi "đã xóa theo D-35". Dòng Q-12: đánh dấu đã chốt theo **V-5** (best-effort: zip chỉ đảm bảo khi instance còn cache; mất ⇒ báo rõ "phiên upload không mở lại được, hãy upload lại .zip"; demo + test dùng link GitHub), theo cách đóng Q-08.
6. **Q-12 / zip ở file khác.** Rà `03` Mục 4, `30` (thông điệp `ERR_SESSION_NOT_FOUND`, `resume_blocker`), `50`, `pitch/KICH_BAN_DEMO.md`: (a) khi phiên zip mất bản đồ, thông điệp phải nói rõ "upload lại .zip" — dùng biến thể thông điệp, **không thêm mã lỗi**; (b) kịch bản demo và fixture end-to-end dùng **link GitHub**, zip chỉ có ca test "best-effort". Không thêm tính năng.
7. **`spec/01`** — chỉ viết lại câu chữ, ý bất biến không đổi:
   - INV-05: bỏ Fast-Track, bỏ `SyncReceipt` (`localStorage` chỉ giữ tiện ích giao diện).
   - INV-07: đáp án (`reference_answer`, `must_have_points`, `fix`) chỉ nằm ở server (đối chiếu `03`: cột câu hỏi của `node_runs`, client không có quyền đọc), bỏ `challenge_token` / `ai_cache` nếu không còn đúng; chỉ gửi xuống client khi câu **xong**.
   - INV-11: bỏ Fast-Track, ⚡, viền cam; thêm "đang mài mòn" vào danh sách lớp hiển thị (không phải trạng thái FSM).
   - Mục 1 (dòng "Từ đó có Fast-Track … cảnh báo khi trí nhớ phai") ⇒ theo D-34, D-35.
   - Mục 3 sơ đồ: "Tiến trình Node.js sống lâu" ⇒ cho khớp D-27 (Vercel Function, 1 instance, cache RAM không được dựa vào); "(RAM, 10 phút)" ⇒ tên `CONFIG.*` đúng nếu có, không có thì bỏ số.
   - Mục 4 tầng 5 và bảng luồng Mục 5 ("… mở khóa, Fast-Track") bỏ Fast-Track.
8. **`pitch/PHAN_BIEN_BGK.md`.** Bảng "Không nói" còn "≈ $0.03/phiên" ⇒ sửa cho khớp `02` Mục 1.1 sau D-37 (người học sau cùng repo ~0,03 USD, ước tính chưa đo; phiên đầu tiên theo cách tính cũ).
9. **`pitch/KICH_BAN_DEMO.md`.** Rà D-37: câu trả lời soạn sẵn dùng cho 3 node demo lấy từ **Offline bundle đã duyệt**, không từ lần sinh câu hỏi trực tiếp; khối "cổng gác chặn câu AI bịa tên hàm" (V-1) giữ nguyên. Chỉ sửa chữ nếu đang nói khác.
10. **V-1 / test `GUARD-04`.** Giữ cách demo chạy lệnh ở terminal (không thêm thành phần UI ở `30`). Thêm:
    - `spec/40` Mục DoD: 1 dòng "repo thi có test tên bắt đầu bằng `GUARD-04` (`21` Test bắt buộc, `50` Mục 2.1), chạy xanh" — đặt cạnh các dòng DoD cùng loại, đặt mốc giờ theo cách các dòng đó đang ghi, không tự đặt giờ mới.
    - `pitch/KICH_BAN_DEMO.md` đoạn 3:20–3:50 và Mục 4 (dự phòng): nếu terminal lỗi hoặc không chuyển cửa sổ được thì mở ảnh chụp kết quả test chụp sẵn (Mục 5 đã nhắc chụp); 1–2 câu, không viết lại đoạn.
11. **Chỉ rà, không sửa trừ khi sai (ghi kết quả vào báo cáo):**
    - `spec/30` không đọc trực tiếp `node_runs` / `question_attempts` qua Supabase client (RLS, `03`).
    - `spec/30` không viện dẫn `GithubRepoInfo.path_trimmed` như thể server trả cho client nếu `02` không trả trường đó; client tự nhận `/tree/…`, `/blob/…` là đủ.
    - `node_runs.steps` / `forbidden_external_keywords` chỉ chứa tên (INV-04) — nếu `03` / `20` có chỗ mô tả như chứa code thì sửa.
    - Còn token cũ trong `spec/` và `pitch/`: `Fast-Track`, `challenge_token`, `SyncReceipt`, `REMEDIATION`, `DECAY_REVIEW`, `viền cam`, `sync/replay`, `Railway`, `AI-24`. Liệt kê chỗ còn lại và nói rõ cố ý hay sót; sót trong file được ghi ⇒ sửa, ngoài ⇒ ghi báo cáo. Giữ nguyên: dòng D đã hủy ở `spec/00`, cột "Không chọn" của `pitch/KIEN_TRUC_BGK.md`, mục "ý tương lai" của `pitch/ROADMAP.md`, tên hằng `CONFIG.FAST_TRACK_MIN` (quyết giữ tên).

## Kiểm
Từng file spec sửa:
```
node .ai/tools/mmcheck/check.mjs spec/<file>.md
node .ai/tools/preserve.mjs spec/<file>.md
tr -d '\r' < spec/<file>.md | wc -c
```
Pitch sửa: `mmcheck` + `wc -c`. Cuối cùng chạy 1 lần:
```
node .ai/tools/refcheck.mjs --diff .ai/tools/refcheck_baseline.txt
```
Đạt khi: mọi sơ đồ OK; `spec/20` ≤ 47 433, các spec khác ≤ 40 000 byte (`spec/03` cố gắng ≤ 32 000, không đạt cũng được); mọi token `preserve` báo mất đều thuộc thứ đã bỏ ở đây (liệt kê + mã); `refcheck` **không còn** dòng `AI-24` và không có dòng mới nào khác.

## Báo cáo `.ai/tasks/TASK_06.report.md`
Từng file: byte trước → sau (đo bằng lệnh) · mmcheck · token mất + lý do · chỗ chưa làm / không chắc. Thêm: lệnh `node -e` đã dùng cho T-MM, thông điệp `ERR_BRANCH_NOT_FOUND` mới, dòng DoD `GUARD-04` đã thêm ở `spec/40`, danh sách token cũ còn lại (mục 11), toàn bộ output `refcheck` cuối.

## Kết thúc (đúng thứ tự)
1. Tạo file rỗng `.ai/tasks/DONE_06`.
2. Chạy đúng lệnh:
```
git add spec/00_QUYET_DINH.md spec/01_KIEN_TRUC_VA_LUONG.md spec/03_API_VA_LUU_TRU.md spec/20_AI_GOI_VA_PROMPT.md spec/21_AI_KIEM_VA_DUYET.md spec/22_BKT_VA_KE_HOACH_CAU_HOI.md spec/30_UI.md spec/40_KE_HOACH_21H.md spec/50_TEST_VA_FIXTURE.md pitch/PHAN_BIEN_BGK.md pitch/KICH_BAN_DEMO.md pitch/LUONG_DE_HIEU.md .ai/tasks/TASK_06.report.md .ai/tasks/DONE_06
git commit -m "docs: TASK_06 dọn lệch sau 05A-C"
```
3. Dừng. **Không push.**
