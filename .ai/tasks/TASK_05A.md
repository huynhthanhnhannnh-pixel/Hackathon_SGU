# TASK_05A — Áp dụng CHỐT CUỐI vào lõi spec: 00, 01, 02, 03

Đọc `AGENTS.md` trước. Nhánh phải là `docs/cau-truc-spec` (sai ⇒ dừng, ghi báo cáo). Làm xong task này mới sang `TASK_05B`.

## Đầu vào
- `.ai/CHOT_CUOI.md` — **chỉ áp dụng dòng có `✅` hoặc `✏️`**. Dòng `❌` / `⏳` / trống ⇒ không đổi spec ở điểm đó.
- Giải thích khái niệm: `CHOT_MUC2_29-10.md` Mục C.

## Được ghi
`spec/00_QUYET_DINH.md`, `spec/01_KIEN_TRUC_VA_LUONG.md`, `spec/02_CONTRACTS.md`, `spec/03_API_VA_LUU_TRU.md`, `.ai/tasks/TASK_05A.report.md`, `.ai/tasks/DONE_05A`. Không file nào khác.

## Việc
1. **`spec/00`**
   - Thêm các D mới đã chốt (D-33 … D-46, chỉ dòng ✅/✏️) vào **Mục 1 "Quyết định đã chốt"**, đúng mã trong `CHOT_CUOI.md`.
   - Viết lại D-27 … D-31 theo `CHOT_CUOI.md` (Vercel, Pino ra stdout, …). Xóa con số khỏi các dòng D (số chỉ ở `CONFIG`).
   - D bị hủy (D-11, D-14, D-17, D-21, D-25, D-26) và D bị sửa (D-13, D-15, D-23): **không xóa dòng**; thêm ở đầu ô nội dung: `**Hủy bởi D-xx.**` hoặc `**Sửa bởi D-xx:** …`. Giữ mã để file khác không trỏ vào chỗ trống.
2. **`spec/02`** (nguồn duy nhất của kiểu + `CONFIG`)
   - `CONFIG`: `MAX_CLEAN_FILES` = 100; thêm `MAX_UPLOAD_BYTES` (4,5 MB = `4.5 * 1024 * 1024`, chú thích "giới hạn body của Vercel Functions, D-27"); bỏ `MAX_REF_CANDIDATES`, mọi hằng của Fast-Track (`FAST_TRACK_MIN` …), `REMEDIATION_*`, `DECAY_REVIEW_*`, `CHALLENGE_TOKEN_*`, receipt. Hằng nào còn được dùng ở chỗ khác ngoài mục đích đã bỏ ⇒ giữ và ghi vào báo cáo.
   - Kiểu: bỏ `challenge_token` khỏi request/response; bỏ `is_auto_mastered`, persona `SENIOR_ACTIVE`, loại run `REMEDIATION` / `DECAY_REVIEW`, kiểu receipt / `sync/replay`; bỏ mã lỗi `ERR_SESSION_SOURCE_EXPIRED` và mã lỗi chỉ thuộc tính năng đã bỏ.
   - Nếu D-43 ✅: thêm kiểu `LlmCallLog` tương ứng bảng `llm_calls`.
3. **`spec/03`**
   - API-08 + Mục 1: viết lại theo D-27 (Vercel, cache RAM không được dựa vào).
   - Bỏ endpoint `sync/replay`, bỏ biên nhận, bỏ cột `receipt_id`, bỏ luồng challenge token; chấm bài đọc câu hỏi / đáp án mẫu / ý bắt buộc từ DB (D-36).
   - Mục 5 "Suy ra trạng thái & Fast-Track": bỏ Fast-Track, áp luật kế hoạch rỗng của D-34.
   - Bỏ cache câu hỏi (D-37); "Học lại từ đầu" = phiên mới (D-42); D-39 thay D-26 ở Mục 4.
   - Nếu D-43 ✅: thêm bảng `llm_calls` + cột đồng ý nghiên cứu. Nếu D-44 ✅: bỏ liên kết GitHub.
   - **V-4:** sau khi sửa xong, rút gọn `spec/03` (mục tiêu ≤ 32 000 byte) bằng cách cắt câu lặp / giải thích thừa — **không bỏ quy định nào**. Không đạt cũng được, ghi số byte vào báo cáo.
4. **`spec/01`** — gỡ nhánh Fast-Track trong sơ đồ Mục 5 (thay bằng luật D-34), gỡ `REMEDIATION`, `DECAY_REVIEW`, "đã ôn đạt", `sync/replay`, `challenge_token` ở Mục 5–8. Giữ nguyên phần còn lại (luồng nhiều câu / lượt, `DROPPED`, Bỏ qua, Báo sai).

## Kiểm (chạy cho từng file 00, 01, 02, 03)
```
node .ai/tools/mmcheck/check.mjs spec/<file>.md
node .ai/tools/preserve.mjs spec/<file>.md
tr -d '\r' < spec/<file>.md | wc -c
```
Đạt khi: mọi sơ đồ OK; mỗi file ≤ 40 000 byte; **mọi token mà `preserve` báo mất đều thuộc thứ đã bỏ theo `CHOT_CUOI.md`** (liệt kê trong báo cáo). Token mất ngoài danh sách đó ⇒ đưa lại đúng chỗ.

## Báo cáo `.ai/tasks/TASK_05A.report.md`
Từng file: byte trước → sau (đo bằng lệnh) · kết quả mmcheck · danh sách token mất + lý do (mã D) · chỗ chưa làm / không chắc. Cuối: danh sách tên đã bỏ khỏi `02` (để TASK_05B, 05C gỡ ở file khác).

## Kết thúc (đúng thứ tự)
1. Tạo file rỗng `.ai/tasks/DONE_05A`.
2. Chạy đúng lệnh:
```
git add spec/00_QUYET_DINH.md spec/01_KIEN_TRUC_VA_LUONG.md spec/02_CONTRACTS.md spec/03_API_VA_LUU_TRU.md .ai/tasks/TASK_05A.report.md .ai/tasks/DONE_05A
git commit -m "docs: TASK_05A áp dụng CHOT_CUOI vào 00, 01, 02, 03"
```
3. Sang `.ai/tasks/TASK_05B.md`.
