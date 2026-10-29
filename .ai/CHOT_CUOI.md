# CHỐT CUỐI — quyết định áp dụng cho TASK_05 (30/10/2026)

> Cột **Chốt**: `✅` áp dụng · `✏️ <cách khác>` áp dụng theo cách ghi · `❌` không làm · `⏳` chưa quyết (giữ spec như cũ). Các ✅ dưới đây là quyết định của nhóm trong buổi họp tối 29/10; các ⏳ sẽ được soát **sáng 30/10** rồi làm bằng task bổ sung.
> **Agent (TASK_05A/B/C):** chỉ áp dụng dòng có `✅` hoặc `✏️`. Dòng `❌` / `⏳` / trống ⇒ KHÔNG đổi spec ở điểm đó.
> Giải thích khái niệm: `CHOT_MUC2_29-10.md` Mục C. Mã D mới đã đánh số sẵn — dùng đúng mã này, không tự đặt mã khác.

## 1. Quyết định ghi vào `spec/00` và áp dụng

| Mã | Nội dung | File bị ảnh hưởng | Chốt |
| :-- | :-- | :-- | :-- |
| **D-33** | **Định hướng:** mã nguồn mở cho cộng đồng (tự clone, tự điền API key trong `.env`) + nghiên cứu học thuật (AI ảo giác, độ tin cậy AI chấm bài, BKT) + CV. Không theo thương mại hóa, không bán cho trường. | `00`, `pitch/ROADMAP`, `pitch/PHAN_BIEN_BGK` | ✅ |
| **D-27** (viết lại) | **Host = Vercel free**, region `sin1`. Cache RAM chỉ giúp nhanh hơn, **không được dựa vào**: mất cache ⇒ tải lại zip theo commit SHA + chạy lại engine. Upload zip bị Vercel chặn ở 4,5 MB ⇒ thêm hằng số `CONFIG.MAX_UPLOAD_BYTES` (giá trị trong `02`), link GitHub không bị chặn. Bỏ Railway. | `00`, `02`, `03` API-08, `04`, `10`, `40`, `pitch/KIEN_TRUC_BGK` | ✅ |
| **D-28** (viết lại) | Log bằng **Pino**, JSON 1 dòng ra stdout (Vercel thu log); giữ danh sách cấm ghi. | `00`, `04` | ✅ |
| **D-29** (viết lại) | Monitoring = log + Observability có sẵn của Vercel + dashboard Supabase. | `00`, `04` | ✅ |
| **D-30** (viết lại) | Vercel tự deploy khi vào `main` (+ preview mỗi PR); GitHub Actions chạy typecheck + lint + vitest. | `00`, `04` | ✅ |
| **D-31** (giữ) | Không dùng queue ngoài (Redis / BullMQ / RabbitMQ). Bỏ con số trong dòng D-31 (số chỉ ở `CONFIG`). | `00` | ✅ |
| **D-34** | **Bỏ Fast-Track** và persona `SENIOR_ACTIVE` (hủy D-21). Kế hoạch câu hỏi rỗng (mọi kỹ năng của node đã thạo) ⇒ **vẫn hỏi 1 câu cho kỹ năng có điểm thấp nhất của node**; không còn "node miễn thi", không còn `is_auto_mastered`. BKT vẫn dùng để chọn kỹ năng hỏi + hiển thị danh hiệu (D-20). | `00`, `01`, `02`, `03`, `22`, `30`, `40`, `50`, pitch | ✅ |
| **D-35** | **Bỏ ôn tập:** bỏ run `REMEDIATION`, `DECAY_REVIEW`, hủy D-25, bỏ viền cam. Node đỏ giữ đỏ. **Thay bằng hiển thị "mài mòn" kiểu Duolingo** ở bảng kỹ năng: thanh kỹ năng nhạt dần theo điểm đã decay + nhãn "đang mài mòn" khi điểm đã decay thấp hơn điểm gốc; **chỉ hiển thị**, không có nút ôn. **Sửa 30/10:** nhãn "đang mài mòn" chỉ hiện khi bậc (`tierOf`) của điểm đã decay thấp hơn bậc của điểm gốc (dùng ngưỡng `CONFIG.TIER_*` sẵn có, không thêm hằng số); thanh vẫn nhạt dần liên tục theo tỉ lệ. | `00`, `01`, `02`, `03`, `20`, `22`, `30`, `40`, `50`, pitch | ✏️ nhãn chỉ khi rớt bậc (TASK_06) |
| **D-36** | **Bỏ vé chấm bài** (`challenge_token`, hủy D-14). Câu hỏi + đáp án mẫu + ý bắt buộc lưu ở DB (chữ, không phải code). AI chấm **không nhận `code_context`** (sửa D-23). Kiểm quyền / số lượt qua DB như D-18. Bỏ khóa `CHALLENGE_TOKEN_*`. | `00`, `01`, `02`, `03`, `04`, `20`, `21`, `30`, `50` | ✅ |
| **D-37** | **Cache AI** (sửa D-15): giữ cache bản phân tích node + tổng quan; **bỏ cache câu hỏi**; chấm bài không cache. | `00`, `03`, `20` | ✅ |
| **D-38** | **Chỉ nhận link gốc repo** `https://github.com/<chủ>/<repo>` (cho phép `/` cuối, `.git`, thiếu `https://`); link có `/tree/…`, `/blob/…` ⇒ tự cắt phần sau tên repo + ghi chú "Chỉ hỗ trợ nhánh mặc định". Hủy D-11, bỏ `MAX_REF_CANDIDATES`. | `00`, `02`, `10`, `30` | ✅ |
| **D-39** | **Phiên gắn commit SHA** (hủy D-26): tải lại trong phiên luôn theo đúng SHA; repo có commit mới ⇒ bản đồ / phiên mới. Bỏ `ERR_SESSION_SOURCE_EXPIRED`. Zip bị cắt (không có SHA) ⇒ giữ cảnh báo "phiên không mở lại được" sẵn có. | `00`, `02`, `03`, `04`, `10`, `30` | ✅ |
| **D-40** | **Bỏ biên nhận + `sync/replay`** (hủy D-17). DB lỗi ⇒ `ERR_PERSISTENCE_UNAVAILABLE` + nút "Thử lại". | `00`, `01`, `02`, `03`, `04`, `22`, `30`, `40` | ✅ |
| **D-41** | `CONFIG.MAX_CLEAN_FILES` = **100** (chỉnh sau khi chạy thử repo thật). | `02` | ✅ |
| **D-13** (sửa) | So khớp **lỏng**: đoạn AI trích chỉ cần là đoạn con có trong câu trả lời sau chuẩn hóa. | `00`, `20`, `21` | ✅ |
| **D-42** | **"Học lại từ đầu"** = tạo phiên mới cho cùng repo; tiến độ node làm lại; **điểm kỹ năng giữ nguyên**; câu hỏi sinh mới. | `00`, `03`, `30` | ✅ |
| **D-43** | **Dữ liệu nghiên cứu:** bảng `llm_calls` (model, `PROMPT_VERSION`, token vào/ra, độ trễ, cổng gác chặn gì) + ô đồng ý "cho dùng dữ liệu ẩn danh để nghiên cứu" ở lần dùng đầu. | `00`, `02`, `03`, `30` | ⏳ |
| **D-44** | **Bỏ liên kết tài khoản GitHub**, chỉ tài khoản khách. | `00`, `03`, `30`, `40` | ⏳ |
| **D-45** | Repo thi có `.env.example` + README mục "Tự cài đặt". | `40` | ⏳ |
| **D-46** | **Tải trước 1–2 node kế tiếp** (client gọi `analyze-node` lần lượt cho node sắp mở) — không tải tất cả. | `00`, `30` | ⏳ |

## 2. Giữ nguyên spec (không đổi) — chờ người phụ trách đọc lại

D-08 (mã node cố định) · D-09 (Hub) · D-16 (lượt học) · D-24 (node nhóm) — giải thích ở `CHOT_MUC2_29-10.md` Mục C. Các D khác không nhắc ở trên: giữ.

## 3. Việc khác

| # | Việc | Chốt |
| :-: | :-- | :-- |
| V-1 | Kịch bản demo phút 3:20–3:50 thay bằng: **khoe cổng gác chặn 1 câu AI bịa tên hàm** (`pitch/KICH_BAN_DEMO.md`). | ✅ |
| V-2 | Sửa 3 lỗi TASK_04: xóa số bịa ("1.2–1.8 s", "< 10 ms", "< 2 giây"); bỏ số nằm ngoài `CONFIG` (`= 4`, `QUEUE_TIMEOUT_MS = 10000`, `tracesSampleRate ≤ 0.1`); `pitch/KIEN_TRUC_BGK.md` ≤ 15 000 byte. | ✅ |
| V-3 | `pitch/PHAN_BIEN_BGK.md`: dòng "dán link tới thư mục con" (D-38), câu A1 "miễn thi … nhắc ôn" (D-34, D-35); thêm hỏi–đáp "lấy gì duy trì" (D-33: mã nguồn mở, người dùng tự mang key). | ✅ |
| V-4 | Rút gọn `spec/03` (mục tiêu ≤ 32 000 byte) — chỉ cắt câu thừa, không mất quy định. | ✅ |
| V-5 | **Q-12 chốt 30/10:** phiên upload `.zip` chỉ đảm bảo trong lúc instance còn cache (best-effort). Mất ⇒ báo rõ "phiên upload không mở lại được, hãy upload lại .zip". Demo và test dùng link GitHub (tải lại theo SHA). Không thêm tính năng, không thêm mã lỗi. | ✅ (TASK_06) |
