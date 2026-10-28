# SimpliFey V2 Pro — Codebase Cognitive Twin

> Hackathon SGU 2026–2027 · Repo **tài liệu** (đặc tả để code + tài liệu thuyết trình). Code sản phẩm viết trong vòng thử thách 21 giờ (12g00 31/10 → 09g00 01/11/2026) ở một repo thi riêng, trống lúc bắt đầu.

**Sản phẩm:** dán link repo GitHub (hoặc kéo thả `.zip`) ⇒ trong < 1.5 s có bản đồ 6–8 node. Mỗi node là một lát cắt nghiệp vụ xuyên file, dựng bằng code thuần, 0 token. Sau đó AI làm 3 việc:
- phân tích điểm hay / điểm dở của từng node;
- đặt câu hỏi Feynman cho đúng kỹ năng người học còn yếu;
- chấm bài và gợi ý 3 nấc.

Mô hình BKT ghi nhận năng lực 16 kỹ năng lâu dài: phần đã vững được miễn thi (Fast-Track), và hệ thống nhắc ôn khi trí nhớ phai.

**Trạng thái:** spec đóng băng ngày **30/10**. Câu hỏi còn mở và quyết định nằm ở [`spec/00_QUYET_DINH.md`](spec/00_QUYET_DINH.md).

---

## Đọc theo thứ tự nào

| Ai | Đọc |
| :-- | :-- |
| **Cả nhóm (bắt buộc)** | [`00_QUYET_DINH`](spec/00_QUYET_DINH.md) → [`01_KIEN_TRUC_VA_LUONG`](spec/01_KIEN_TRUC_VA_LUONG.md) → [`02_CONTRACTS`](spec/02_CONTRACTS.md) → [`03_API_VA_LUU_TRU`](spec/03_API_VA_LUU_TRU.md) → [`40_KE_HOACH_21H`](spec/40_KE_HOACH_21H.md) |
| **Người 1 — Lead, UI, DB** | + [`30_UI`](spec/30_UI.md), [`50_TEST_VA_FIXTURE`](spec/50_TEST_VA_FIXTURE.md) |
| **Người 2 — Engine** | + [`10_ENGINE_INGEST`](spec/10_ENGINE_INGEST.md), [`11_ENGINE_DO_THI`](spec/11_ENGINE_DO_THI.md) |
| **Người 3 — AI, BKT** | + [`20_AI_GOI_VA_PROMPT`](spec/20_AI_GOI_VA_PROMPT.md), [`21_AI_KIEM_VA_DUYET`](spec/21_AI_KIEM_VA_DUYET.md), [`22_BKT_VA_KE_HOACH_CAU_HOI`](spec/22_BKT_VA_KE_HOACH_CAU_HOI.md) |
| **Thuyết trình / người mới** | [`pitch/LUONG_DE_HIEU`](pitch/LUONG_DE_HIEU.md) → [`pitch/KICH_BAN_DEMO`](pitch/KICH_BAN_DEMO.md) → [`pitch/PHAN_BIEN_BGK`](pitch/PHAN_BIEN_BGK.md) |
| **Trợ lý AI khi code** | `CLAUDE.md` + đúng các file của module đang làm (mỗi file ≤ ~40 KB, đọc trọn) |

## Thư mục

| Thư mục | Nội dung | Có phải nguồn chuẩn? |
| :-- | :-- | :-- |
| `spec/` | Đặc tả để code: quyết định, kiến trúc, contract + `CONFIG`, API/DB, engine, AI, BKT, UI, kế hoạch 21 giờ, test | **Có — nguồn duy nhất** |
| `pitch/` | Kịch bản demo, phản biện BGK, giải thích dễ hiểu, roadmap sau cuộc thi | Không (lệch thì `spec/` đúng) |
| `references/` | Thể lệ cuộc thi (`thele.md`), giáo trình thuật toán minh họa | Thể lệ là ràng buộc ngoài |
| `prototype/` | `cockpit_demo.html` — mẫu giao diện cũ, chỉ tham khảo thiết kế | Không |
| `archive/` | Tài liệu cũ, gồm toàn bộ bản trước hợp nhất (`2026-10-28_truoc-hop-nhat/`) | Không |

## Luật giữ tài liệu không rối lại

1. **Mỗi sự thật chỉ ở một chỗ.**
   - Kiểu dữ liệu và hằng số nằm ở `spec/02_CONTRACTS.md`.
   - Nơi khác chỉ nhắc tên: `CONFIG.X`, tên type, mã luật (`ENG-12`, `BKT-03`…).
2. **Đổi quyết định** ⇒ sửa dòng D-xx trong `00_QUYET_DINH.md` trước, rồi mới sửa file đích.
3. **Không viết thêm file tổng hợp mới vào `spec/`.**
   - Bản dễ hiểu đặt ở `pitch/`.
   - Lịch sử đặt ở `archive/`.
4. **Số liệu độ trễ / token / chi phí là mục tiêu** cho tới khi đo trên code thật.
