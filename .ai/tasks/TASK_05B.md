# TASK_05B — Áp dụng CHỐT CUỐI vào AI, BKT, UI: 20, 21, 22, 30

Đọc `AGENTS.md` trước. Chỉ bắt đầu khi đã có `.ai/tasks/DONE_05A`. Đọc `.ai/tasks/TASK_05A.report.md` (danh sách tên đã bỏ khỏi `02`).

## Đầu vào
- `.ai/CHOT_CUOI.md` — **chỉ áp dụng dòng có `✅` hoặc `✏️`**. Dòng `❌` / `⏳` / trống ⇒ không đổi.
- `spec/02` (đã sửa ở 05A) là nguồn tên `CONFIG` / kiểu — không dùng tên đã bị bỏ.

## Được ghi
`spec/20_AI_GOI_VA_PROMPT.md`, `spec/21_AI_KIEM_VA_DUYET.md`, `spec/22_BKT_VA_KE_HOACH_CAU_HOI.md`, `spec/30_UI.md`, `.ai/tasks/TASK_05B.report.md`, `.ai/tasks/DONE_05B`. Không file nào khác.

## Việc
1. **`spec/22`** (nặng nhất)
   - Bỏ Fast-Track (D-34): mọi luật / test / sơ đồ Fast-Track; áp luật **kế hoạch rỗng ⇒ 1 câu cho kỹ năng điểm thấp nhất của node**.
   - Bỏ run `REMEDIATION`, `DECAY_REVIEW`, viền cam (D-35). **Giữ** hàm decay; thêm luật hiển thị "mài mòn" (điểm đã decay < điểm gốc ⇒ nhãn "đang mài mòn", thanh nhạt dần) — chỉ hiển thị.
   - Bỏ `sync/replay` (D-40), persona `SENIOR_ACTIVE`.
   - Phần "Test bắt buộc": xóa test của tính năng đã bỏ; thêm 1 test cho luật kế hoạch rỗng (D-34). Số trong test tự tính lại bằng `node -e` nếu có, ghi lệnh vào báo cáo.
2. **`spec/20`**
   - Bỏ kế hoạch `REMEDIATION` / `DECAY_REVIEW`, biến thể khóa cache câu hỏi `|v{n}` (D-25 hủy), cache câu hỏi (D-37).
   - Prompt chấm **không nhận `code_context`** (D-36, sửa D-23); bỏ mục "Token bảo vệ lượt chấm" (challenge token).
   - **Không sửa nội dung khối prompt / schema** ngoài đúng chỗ phải bỏ trường `code_context` và trường liên quan tính năng đã bỏ.
3. **`spec/21`** — D-13 so khớp lỏng (đoạn trích chỉ cần là đoạn con sau chuẩn hóa); bỏ kiểm liên quan `code_context` / challenge token nếu có.
4. **`spec/30`**
   - Bỏ UI Fast-Track, nút "Ôn lại" / "Ôn bài", viền cam, UI biên nhận / sync, mọi chỗ dùng `challenge_token`.
   - Thêm hiển thị "mài mòn" kiểu Duolingo ở bảng kỹ năng (D-35); nút "Học lại từ đầu" (D-42); ghi chú ô link "Chỉ hỗ trợ nhánh mặc định" + thông báo lỗi link (D-38); thông báo upload quá `CONFIG.MAX_UPLOAD_BYTES` (D-27).
   - Nếu D-43 ✅: ô đồng ý nghiên cứu. Nếu D-44 ✅: bỏ nút liên kết GitHub. Nếu D-46 ✅: tải trước 1–2 node kế tiếp.
   - Chuỗi hiển thị còn giữ (tên nút, thông điệp lỗi) giữ nguyên từng chữ.

## Kiểm (từng file 20, 21, 22, 30)
```
node .ai/tools/mmcheck/check.mjs spec/<file>.md
node .ai/tools/preserve.mjs spec/<file>.md
tr -d '\r' < spec/<file>.md | wc -c
```
Đạt khi: mọi sơ đồ OK; 21, 22, 30 ≤ 40 000 byte, `spec/20` ≤ 47 433; mọi token `preserve` báo mất đều thuộc thứ đã bỏ (liệt kê + mã D). Mất ngoài danh sách ⇒ đưa lại.

## Báo cáo `.ai/tasks/TASK_05B.report.md`
Như 05A: byte trước → sau · mmcheck · token mất + mã D · chỗ chưa làm / không chắc · chỗ thấy cần sửa ở file ngoài phạm vi.

## Kết thúc
1. Tạo file rỗng `.ai/tasks/DONE_05B`.
2. Chạy đúng lệnh:
```
git add spec/20_AI_GOI_VA_PROMPT.md spec/21_AI_KIEM_VA_DUYET.md spec/22_BKT_VA_KE_HOACH_CAU_HOI.md spec/30_UI.md .ai/tasks/TASK_05B.report.md .ai/tasks/DONE_05B
git commit -m "docs: TASK_05B áp dụng CHOT_CUOI vào 20, 21, 22, 30"
```
3. Sang `.ai/tasks/TASK_05C.md`.
