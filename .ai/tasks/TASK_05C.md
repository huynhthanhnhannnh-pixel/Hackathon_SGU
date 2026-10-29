# TASK_05C — Áp dụng CHỐT CUỐI vào triển khai, engine, kế hoạch, test, pitch

Đọc `AGENTS.md` trước. Chỉ bắt đầu khi đã có `.ai/tasks/DONE_05B`. Đọc 2 báo cáo `TASK_05A.report.md`, `TASK_05B.report.md`.

## Đầu vào
- `.ai/CHOT_CUOI.md` — **chỉ áp dụng dòng `✅` / `✏️`**.
- `spec/02` là nguồn tên `CONFIG` / kiểu — không dùng tên đã bỏ.

## Được ghi
`spec/04_KIEN_TRUC_TRIEN_KHAI.md`, `spec/10_ENGINE_INGEST.md`, `spec/40_KE_HOACH_21H.md`, `spec/50_TEST_VA_FIXTURE.md`, `pitch/KICH_BAN_DEMO.md`, `pitch/PHAN_BIEN_BGK.md`, `pitch/ROADMAP.md`, `pitch/KIEN_TRUC_BGK.md`, `pitch/LUONG_DE_HIEU.md`, `.ai/tasks/TASK_05C.report.md`, `.ai/tasks/DONE_05C`. Không file nào khác.

## Việc
1. **`spec/04`** — Railway ⇒ **Vercel** (D-27) ở mọi sơ đồ / bảng; Pino ra stdout (D-28); monitoring (D-29); CI/CD (D-30); bỏ challenge token, receipt, `ERR_SESSION_SOURCE_EXPIRED`. **V-2:** xóa "< 2 giây" và mọi số không có trong `CONFIG` (`= 4`, `QUEUE_TIMEOUT_MS = 10000`, `tracesSampleRate ≤ 0.1`) ⇒ gọi bằng tên `CONFIG.*` hoặc bỏ. ≤ 25 000 byte.
2. **`spec/10`** — D-38 (chỉ link gốc, cắt `/tree`, `/blob`, bỏ luật thử ref / `MAX_REF_CANDIDATES`); upload kiểm `CONFIG.MAX_UPLOAD_BYTES` (D-27); D-39 (tải lại theo SHA, bỏ `ERR_SESSION_SOURCE_EXPIRED`). Phần "Test bắt buộc": xóa test của luật đã bỏ.
3. **`spec/40`** — Mục 1: tài khoản Vercel thay Railway. Mục 3: thêm `pino` vào bảng gói. Mục 6: bỏ các mục đã cắt hẳn khỏi danh sách "cắt nếu trễ" (`sync/replay`, `DECAY_REVIEW`, `REMEDIATION`, nếu D-44 ✅ thì cả liên kết GitHub); bỏ "Fast-Track" khỏi "không bao giờ cắt". Mục 10: sửa dòng Railway nếu có.
4. **`spec/50`** — xóa / sửa fixture và kịch bản dùng Fast-Track, `SENIOR_ACTIVE`, `REMEDIATION`, `DECAY_REVIEW`, receipt, challenge token, viền cam.
5. **Pitch**
   - `KICH_BAN_DEMO`: thay đoạn 3:20–3:50 (persona `SENIOR_ACTIVE` ⇒ Fast-Track) bằng **V-1: khoe cổng gác chặn 1 câu AI bịa tên hàm**; gỡ Fast-Track / viền cam ở chỗ khác.
   - `PHAN_BIEN_BGK`: **V-3** (dòng "dán link tới thư mục con", câu A1 "miễn thi … nhắc ôn", thêm hỏi–đáp "lấy gì duy trì" theo D-33).
   - `ROADMAP`: trục chính = mã nguồn mở + cộng đồng + nghiên cứu (D-33); thương mại hóa / B2B / trường học hạ thành "khả năng, chưa theo đuổi"; Fast-Track chỉ còn là ý tương lai nếu có.
   - `KIEN_TRUC_BGK`: Railway ⇒ Vercel (cả câu Q4); **V-2** (xóa "1.2–1.8 s", "ping < 10 ms"); ≤ 15 000 byte.
   - `LUONG_DE_HIEU`: gỡ Fast-Track, viền cam, ôn tập; thêm 1 câu về "mài mòn" kiểu Duolingo.

## Kiểm
Từng file spec / pitch đã sửa:
```
node .ai/tools/mmcheck/check.mjs <file>
tr -d '\r' < <file> | wc -c
```
Spec còn chạy thêm `node .ai/tools/preserve.mjs <file>` (token mất phải thuộc thứ đã bỏ). Cuối cùng chạy 1 lần:
```
node .ai/tools/refcheck.mjs --diff .ai/tools/refcheck_baseline.txt
```
Lỗi tham chiếu mới **trong file của task này** ⇒ sửa. Lỗi ở file khác ⇒ chỉ ghi vào báo cáo.

## Báo cáo `.ai/tasks/TASK_05C.report.md`
Như 05A + toàn bộ output refcheck cuối.

## Kết thúc
1. Tạo file rỗng `.ai/tasks/DONE_05C`.
2. Chạy đúng lệnh:
```
git add spec/04_KIEN_TRUC_TRIEN_KHAI.md spec/10_ENGINE_INGEST.md spec/40_KE_HOACH_21H.md spec/50_TEST_VA_FIXTURE.md pitch/KICH_BAN_DEMO.md pitch/PHAN_BIEN_BGK.md pitch/ROADMAP.md pitch/KIEN_TRUC_BGK.md pitch/LUONG_DE_HIEU.md .ai/tasks/TASK_05C.report.md .ai/tasks/DONE_05C
git commit -m "docs: TASK_05C áp dụng CHOT_CUOI vào 04, 10, 40, 50, pitch"
```
3. Dừng. **Không push** — người chạy push vào sáng mai.
