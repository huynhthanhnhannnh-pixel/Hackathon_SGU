# HƯỚNG DẪN THIẾT KẾ GIAO DIỆN & THEME CHO FRONTEND DEVELOPER
## DỰ ÁN: SGU-FEYNMAN (BUỒNG LÁI NHẬN THỨC - COGNITIVE COCKPIT)

Tài liệu này được biên soạn riêng cho thành viên phụ trách **Frontend (Giao diện người dùng)**, bao gồm wireframe bố cục, thư viện tham khảo theme thực tế, bảng mã màu (Design Tokens), thông số component và hiệu ứng chuyển động (Micro-interactions) để xây dựng ứng dụng web hiện đại, mượt mà và gây ấn tượng mạnh với Ban Giám khảo.

---

## 1. SƠ ĐỒ BỐ CỤC GIAO DIỆN (UI LAYOUT WIREFRAME)

### Bố cục Màn hình chính: Buồng lái chia đôi (Split Cockpit)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo SGU-Feynman]   Chuyên đề: Cung - Cầu Kinh tế học      [ Tiến độ: 3/6 Node (50%) ]   │
├────────────────────────────────────────┬─────────────────────────────────────────────────────┤
│  CỘT TRÁI: BẢN ĐỒ TRI THỨC (40%)       │  CỘT PHẢI: VÙNG PHẢN XẠ FEYNMAN (60%)               │
│  (ReactFlow Interactive Canvas)        │  (Focused Node Interactive Stage)                   │
│                                        │                                                     │
│   ┌────────────────┐                   │   ┌─────────────────────────────────────────────┐   │
│   │ [1] Thị trường │ (XANH LÁ - Xong)  │   │ 👶 BÉ MINH (Tò mò):                         │   │
│   └───────┬────────┘                   │   │ "Dạ nghe giống sách quá anh ơi! Nhưng ví    │   │
│           │                            │   │ dụ trời mưa to, trước cổng trường chỉ còn   │   │
│   ┌───────▼────────┐                   │   │ 1 cái áo mưa mà 10 người giành mua thì giá  │   │
│   │ [2] Cung - Cầu │ (VÀNG - Đang học) │   │ tăng hay giảm ạ?"                           │   │
│   └───────┬────────┘ (Viền nhịp thở)   │   └─────────────────────────────────────────────┘   │
│           │                            │                                                     │
│   ┌───────▼────────┐                   │   ┌─────────────────────────────────────────────┐   │
│   │ [3] Giá cân bằng│ (XÁM - Bị khóa)  │   │ 👤 BẠN (Người hướng dẫn):                   │   │
│   └────────────────┘                   │   │ "Giá tăng gấp đôi vì ai cũng cần gấp mà có  │   │
│                                        │   │ mỗi 1 cái duy nhất em nhé!"                 │   │
│                                        │   └─────────────────────────────────────────────┘   │
│                                        │                                                     │
│   [🔍 Thu phóng]  [🔄 Căn giữa đồ thị] │   ┌─────────────────────────────────────────────┐   │
│                                        │   │ ⌨️ [Nhập ví dụ đời thường để giải thích...]  │   │
│                                        │   │                              [ Gửi / Enter ]│   │
│                                        │   └─────────────────────────────────────────────┘   │
└────────────────────────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 2. TOP CÁC WEBSITE / APP THỰC TẾ ĐỂ THAM KHẢO THEME & HỌC HỎI

Để làm giao diện đẹp chuẩn quốc tế mà không bị phèn hay thô, bạn Frontend nên ghé thăm và "sao chép" tư duy thiết kế của các trang sau:

| Tên Website / Ứng dụng | Lý do nên tham khảo | Đường link trực tiếp |
| :--- | :--- | :--- |
| **Linear.app** | **Vua của thiết kế Dark mode hiện đại:** Đường viền mảnh (1px border), hiệu ứng gradient mờ ảo (subtle glow), đổ bóng cao cấp, cảm giác gõ phím cực kỳ nhanh và mượt mà. | [linear.app](https://linear.app/) |
| **Heptabase** | **Bố cục chia đôi hoàn hảo:** Bên trái là bảng trắng với các node liên kết bằng mũi tên, bên phải là thẻ ghi chú/tương tác. Đúng 100% với mô hình Buồng lái SGU-Feynman! | [heptabase.com](https://heptabase.com/) |
| **Brilliant.org** | **Học qua tương tác trực quan:** Nổi tiếng với việc chia nhỏ bài học thành các bước ngắn, bắt người học động não thay vì đọc bài giảng chán ngắt. | [brilliant.org](https://brilliant.org/) |
| **Raycast** | **Độ tinh tế của Typography & Icon:** Khoảng cách lề (padding/margin) cực chuẩn, font chữ sắc nét, phối màu trạng thái (Success, Warning, Danger) rất dịu mắt. | [raycast.com](https://raycast.com/) |
| **shadcn/ui** | **Thư viện Component chuẩn cho React & Tailwind:** Có sẵn code copy-paste cho nút bấm (Button), Hộp thoại (Dialog/Modal), Thẻ (Card), Khung gõ chữ (Textarea)... | [ui.shadcn.com](https://ui.shadcn.com/) |
| **Godly.website & Mobbin** | **Kho cảm hứng UI/UX đỉnh cao:** Nơi tổng hợp các giao diện web app đẹp nhất thế giới hiện nay để xem và lấy ý tưởng làm theme. | [godly.website](https://godly.website/) |

---

## 3. BẢNG MÃ MÀU DESIGN TOKENS (TAILWIND CSS & HEX CODES)

Khuyến khích làm theo phong cách **Sleek Modern Dark Mode** (nền tối sang trọng, làm nổi bật màu sắc của các Node trên đồ thị):

### 3.1. Màu nền & Khung viền (Surfaces & Borders)
* **Nền chính (Background Body):** `#090D16` (Tailwind: `bg-slate-950`)
* **Nền khung phụ (Card / Panel):** `#0F172A` (Tailwind: `bg-slate-900`)
* **Nền khung tương tác (Input / Chat Bubble):** `#1E293B` (Tailwind: `bg-slate-800`)
* **Đường viền mảnh (Subtle Border):** `#334155` với độ trong suốt 50% (Tailwind: `border-slate-700/50`)

### 3.2. Màu sắc Trạng thái 4 Node (Core Concept State Colors)

| Trạng thái Node | Mã màu Hex | Lớp Tailwind CSS | Hiệu ứng thị giác gợi ý |
| :--- | :--- | :--- | :--- |
| **Màu Xám (GRAY - Khóa)** | `#64748B` | `bg-slate-800 text-slate-400 border-slate-700` | Mờ nhẹ (opacity 60%), icon ổ khóa nhỏ |
| **Màu Vàng (YELLOW - Đang học)** | `#F59E0B` | `bg-amber-950/40 text-amber-300 border-amber-500` | **Viền phát sáng (Glow)** + Hiệu ứng nhịp thở (Pulse) |
| **Màu Xanh lá (GREEN - Thấu suốt)** | `#10B981` | `bg-emerald-950/40 text-emerald-300 border-emerald-500` | Icon tích xanh, phát sáng nhẹ viền |
| **Màu Đỏ (RED - Hổng kiến thức)** | `#EF4444` | `bg-rose-950/40 text-rose-300 border-rose-500` | Icon cảnh báo, viền đỏ nổi bật |

### 3.3. Typography (Font chữ)
* **Font chữ chính:** `Inter` hoặc `Outfit` (tải miễn phí từ Google Fonts) – tạo cảm giác hiện đại, công nghệ.
* **Font hiển thị code / số liệu:** `JetBrains Mono` hoặc `Fira Code`.

---

## 4. CHI TIẾT THIẾT KẾ CÁC THÀNH PHẦN (COMPONENT SPECS)

### 4.1. Custom Node trên ReactFlow (`ConceptNodeComponent.tsx`)
* **Hình dạng:** Thẻ bo tròn góc (`rounded-xl`), kích thước cố định khoảng `w-56 h-24`.
* **Cấu trúc bên trong:**
  * Hàng trên: Icon trạng thái + Số thứ tự bài học (vd: `#1`).
  * Hàng giữa: Tên khái niệm in đậm (`font-semibold text-sm`).
  * Hàng dưới: Huy hiệu trạng thái nhỏ (`badge: Đang học / Đã thấu suốt / Chưa mở`).
* **Đường nối mũi tên (Edge):**
  * Dùng `SmoothStep` hoặc `BezierEdge` của ReactFlow.
  * Nếu Node nguồn đã Xanh $\to$ Đường nối sáng màu `stroke-emerald-400`. Nếu chưa $\to$ Đường nét đứt màu xám `stroke-slate-600 stroke-dasharray-4`.

### 4.2. Avatar Biểu Cảm Động của "Bé Minh" (`PersonaAvatar.tsx`)
Dùng 1 component SVG đổi icon / màu mắt theo biến `emotion` trả về từ Backend:
* `CURIOSITY` (Tò mò): Mắt mở to tròn, đầu hơi nghiêng.
* `CONFUSED` (Ngơ ngác / Hỏi vặn): Lông mày nhíu lại, tay gãi đầu nhẹ.
* `DELIGHT` (Thấu suốt / Vỡ lẽ): Miệng cười tươi, hai mắt hình trăng khuyết, có hiệu ứng sao lấp lánh nhẹ.

### 4.3. Khung Chat Feynman (`FeynmanChatStage.tsx`)
* **Không làm scroll vô tận:** Khi chuyển sang node mới, khung chat làm hiệu ứng chuyển cảnh mượt mà (Fade transition) để báo hiệu người học đã bước sang một chặng mới.
* **Bong bóng tin nhắn của AI:** Đặt bên trái, viền màu tím nhạt/indigo (`border-indigo-500/30`), có gắn huy hiệu "Bé Minh".
* **Bong bóng tin nhắn của Người dùng:** Đặt bên phải, nền xanh ngọc đậm (`bg-emerald-900/30`), viền xanh ngọc.
* **Khung gõ chữ (Input Box):**
  * Tự động giãn dòng (Auto-resize textarea).
  * Phím tắt tiện lợi: `Enter` để gửi, `Shift + Enter` để xuống dòng.
  * Nút "Gửi giải thích" có hiệu ứng phát sáng nhẹ khi ô nhập đã có chữ.

### 4.4. Modal Chẩn đoán Nhận thức Cuối phiên (`DiagnosticReportModal.tsx`)
* Xuất hiện dưới dạng popup chiếm 80% màn hình với nền làm mờ (Backdrop blur).
* Gồm 2 phần:
  1. **Tóm tắt kết quả:** Số lượng Node Xanh / Đỏ / Vàng + Thời gian hoàn thành (vd: `11 phút 45 giây`).
  2. **Bản đồ điểm mù:** Liệt kê các lỗi sai bản chất hoặc kiến thức phụ bị nhầm lẫn kèm khuyến nghị cụ thể để người học tự tin đi thi vấn đáp.
  3. **Nút Export:** Cho phép xuất ảnh PNG hoặc sao chép bản tóm tắt nhanh.

---

## 5. CHECKLIST TRẢI NGHIỆM CHO FRONTEND (FE POLISH CHECKLIST)

- [ ] Cài đặt sẵn `@xyflow/react` (ReactFlow v12) và `lucide-react` (Bộ icon hiện đại).
- [ ] Bật `backdrop-blur-md` cho thanh Header và các thanh công cụ nổi để tạo cảm giác kính mờ (Glassmorphism).
- [ ] Thêm hiệu ứng chuyển màu mềm mại bằng CSS `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- [ ] Tạo cảm giác gõ phím nhanh: Disable nút gửi và hiện icon loading xoay tròn khi đang chờ API phản hồi.
