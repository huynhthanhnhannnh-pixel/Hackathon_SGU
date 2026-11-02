# HƯỚNG DẪN THIẾT KẾ & QUY CHUẨN GIAO DIỆN (UI DESIGN CONTEXT)

> **Tài liệu nguồn tham chiếu UI cho thư mục:** `develop-UI/`  
> **Dự án:** SimpliFey — Codebase Cognitive Twin  
> **Ngày lập:** 02/11/2026

---

## 1. Tổng quan & Phong cách thiết kế chung (Design Philosophy)

* **Phong cách chủ đạo:** Modern EdTech / Cognitive Twin Workspace — Hiện đại, sáng sủa, thân thiện nhưng đậm chất kỹ thuật.
* **Cảm xúc mang lại:** Tươi sáng, đáng tin cậy, kích thích sự tò mò học tập (sử dụng tone cam nhiệt huyết trên nền trắng thanh khiết kết hợp các khối cong bo mềm mại và chi tiết 3D nhẹ).
* **Đặc trưng thị giác:**
  * Khối nội dung chính sử dụng nền trắng (`#FFFFFF`) kết hợp đổ bóng mềm (`drop-shadow`, `box-shadow`) và viền mỏng (`border-gray-100`).
  * Điểm nhấn thương hiệu sử dụng màu Cam rực rỡ (`#FF9640`) cho logo, nút hành động chính (CTA) và viền các module nổi bật.
  * Lớp nền hữu cơ (Organic Fluid Backdrops) sử dụng tone màu đào nhạt (`#FFDCC5`) và tím lam nhạt (`#E2E7FF`) xoay góc nhẹ (`rotate-2`, `-rotate-3`) phía sau ảnh minh họa để phá vỡ sự cứng nhắc của các khối chữ nhật.
  * Các thẻ thông tin nổi (Floating Cards) được đặt góc nghiêng nhẹ (`-rotate-3`, `rotate-4`), hover trở về góc thẳng (`hover:rotate-0`) để tạo chiều sâu và tính tương tác.

---

## 2. Hệ thống Token Giao diện (Design Tokens)

### 2.1. Bảng màu (Color Palette)

| Vai trò | Tên màu / Mã Hex | Ứng dụng thực tế |
| :--- | :--- | :--- |
| **Primary (Chính)** | `#FF9640` | Logo, nút CTA "Quét Dự Án", nút "Đăng ký", viền card giá trị cốt lõi, highlight chữ |
| **Primary Hover** | `#FF8624` | Trạng thái hover của các nút chính |
| **Primary Dark Text** | `#301400` / `#944b00` | Chữ trên nút CTA cam, tiêu đề tag danh mục, phần trăm tiến độ |
| **Text Primary (Nền tối)** | `#131b2e` | Tiêu đề chính H1, H2, H3, nhãn card, chữ trong input |
| **Text Secondary (Phụ)** | `#625e56` / `#554337` | Đoạn văn mô tả, phụ đề, link menu chưa active, text footer |
| **Surface (Nền chính)** | `#FFFFFF` | Nền trang web, nền header, nền các card |
| **Surface Alt / Warm** | `#FFF0E4` | Nền của Footer (tone cam sữa ấm) |
| **Surface Input** | `#F2F3FF` | Nền ô nhập URL repo, thanh track của progress bar |
| **Success / Online** | `#10B981` / `#00B17A` | Chấm online AI, màu thanh tiến độ nắm kiến thức |
| **Border / Divider** | `#E5E7EB` / `#F3F4F6` | Viền Header, viền thẻ card, đường phân cách |

---

### 2.2. Hệ thống Typography (Font Scales & Fonts)

Dự án nạp 3 font thông qua `next/font/google` trong `src/app/layout.tsx`:

| Font | Vai trò | Trọng số (Weights) | Áp dụng cho |
| :--- | :--- | :--- | :--- |
| **Plus Jakarta Sans** | Font chính / Display | 600, 700, 800 | Logo, Tiêu đề H1, H2, Heading Card, Nút bấm CTA |
| **Inter** | Font đọc văn bản (Body) | 400, 500, 600 | Đoạn mô tả, link menu, text hướng dẫn, bản quyền footer |
| **JetBrains Mono** | Font mã nguồn / Kỹ thuật | 500, 600, 700 | Ô URL GitHub, số liệu đo đạc (75%), badge kỹ thuật |

**Kích thước & Khoảng cách dòng tiêu chuẩn:**
* **Hero Heading (H1):** `text-[52px]` (xl: `text-[62px]`), `leading-[1.12]`, `font-extrabold`, `tracking-tight`.
* **Section Heading (H2):** `text-[26px]` (md: `text-[30px]`), `font-extrabold`, `text-[#131b2e]`.
* **Card Heading (H3):** `text-[18px]`, `font-bold`, `text-[#131b2e]`.
* **Sub-headline:** `text-[20px]` (xl: `text-[22px]`), `leading-relaxed`, `text-[#625e56]`.
* **Body / Mô tả:** `text-[16px]`, `leading-relaxed`, `text-[#625e56]`.
* **Nhãn nhỏ / Microcopy:** `text-[11px]` – `text-[14px]`.

---

### 2.3. Bo góc (Border Radius) & Khoảng cách (Spacing)

* **Bo góc Container / Thẻ lớn:** `rounded-2xl` (`16px`) cho Ingestion Card, Feature Card, Floating Card.
* **Bo góc Khung ảnh / Nền hữu cơ:** `rounded-[24px]` cho ảnh hero; `rounded-[40px]` đến `rounded-[48px]` cho organic backdrops.
* **Bo góc Phần tử giao diện (Buttons, Inputs, Icon Boxes):**
  * Nút "Đăng ký": `rounded-[12px]`.
  * Nút "Quét Dự Án" & Khung Input: `rounded-lg` (`8px`).
  * Hộp icon tính năng: `rounded-lg` (`8px`) với viền `border-2 border-[#FF9640]`.
* **Hệ thống Spacing (Lề & Đệm):**
  * Container tối đa: `max-w-[1440px] mx-auto px-6 lg:px-12`.
  * Khoảng cách section: `pt-10 pb-16`, `py-14`.
  * Card Padding: `p-6` (`24px`).

---

### 2.4. Đổ bóng (Shadows) & Hiệu ứng đặc biệt

* **Card Shadow:** `shadow-[0px_10px_30px_rgba(0,0,0,0.06)]` (nhẹ nhàng, không gắt).
* **Floating Card Shadow:** `shadow-[0px_16px_32px_rgba(0,0,0,0.12)]`.
* **Hiệu ứng 3D Chữ (`.text-3d-subtle`):**
  ```css
  text-shadow: 
    0 1px 0 #e6761c,
    0 2px 0 #cc620f,
    0 3px 1px rgba(0, 0, 0, 0.1),
    0 5px 8px rgba(255, 150, 64, 0.25);
  ```
* **Hiệu ứng Marquee Bounce (`.animate-marquee-scroll`):**
  * Chữ trong ô URL tự động trượt ngang và đảo chiều khi chạm biên.
  * Tự động dừng animation khi rê chuột (`hover:animation-play-state: paused`).

---

## 3. Hệ sinh thái Component dùng chung & Quy tắc Tái sử dụng

Để giữ giao diện nhất quán, các lần phát triển trang tiếp theo **phải tái sử dụng các mẫu component sau thay vì tạo mới tùy tiện**:

### 3.1. Các Component Cốt lõi (Shared Components)

1. **Header chung (`AppHeader`):**
   * Giữ cố định trên cùng (`sticky top-0 z-50 bg-white border-b border-[#E5E7EB]`).
   * Logo **SIMPLIFEY** font Plus Jakarta Sans ExtraBold màu `#FF9640` có hiệu ứng 3D nhẹ (`text-3d-subtle`).
   * Cụm nút Auth bên phải: Đăng nhập (text `#554337`), Đăng ký (nút cam bo góc `rounded-[12px]`) và Avatar tròn (`fbd68.svg`).

2. **Nút bấm chính (`ButtonPrimary`):**
   * Nền `#FF9640`, hover `#FF8624`, chữ `#301400` hoặc `#FFFFFF` (tùy kích thước), bo góc `rounded-lg` hoặc `rounded-[12px]`.
   * Hiệu ứng: `hover:scale-105 transform origin-center transition-all duration-200 active:scale-[0.98]`.

3. **Thẻ Tính năng / Giá trị (`FeatureCard`):**
   * Nền trắng, bo góc `rounded-2xl`, viền `border border-gray-100`, shadow mềm.
   * Icon luôn nằm trong hộp vuông `w-12 h-12` có viền đôi cam `border-2 border-[#FF9640] rounded-lg`.

4. **Thanh đo năng lực / Tiến độ (`ProgressBar`):**
   * Track: `bg-[#F2F3FF] h-2 rounded-full overflow-hidden`.
   * Fill bar: `bg-[#00B17A]` (xanh ngọc thành công).

5. **Footer chung (`AppFooter`):**
   * Nền cam nhạt `#FFF0E4`, viền trên `border-t border-[#FFE0CC]`.
   * Dòng bản quyền chuẩn: `© 2025 SimpliFey by MeoMeo Team - Hackathon 2026`.

---

### 3.2. Quy tắc dùng Icon & Tài nguyên Đồ họa

* **Thư viện Icon:** Sử dụng **`lucide-react`** làm thư viện icon chính thống (ví dụ: `Search`, `BookOpenCheck`, `ArrowRight`, `Code2`, `Terminal`...).
* **Định dạng icon:** Thiết lập kích thước chuẩn `w-5 h-5` hoặc `w-6 h-6`, màu sắc kế thừa từ token `text-[#FF9640]` hoặc `text-[#131b2e]`.
* **Assets cục bộ:** Mọi hình ảnh và logo nằm trong thư mục [`public/assets/`](file:///c:/nquyleee/Coding/Hackathon_SGU/develop-UI/public/assets). Tuyệt đối không dùng link ảnh bên ngoài hoặc link tạm Figma.

---

## 4. Hướng dẫn Phát triển Responsive (Breakpoints)

* **Desktop lớn (`≥ 1280px` - xl):**
  * Layout 2 cột cân bằng (6/12 - 6/12), hiển thị trọn vẹn các floating cards xoay góc.
  * Container cố định `max-w-[1440px] px-12`.
* **Laptop / Tablet ngang (`1024px` - lg):**
  * Tự động co chữ H1 xuống `52px`, điều chỉnh lề của floating cards để không tràn mép màn hình.
* **Mobile / Tablet dọc (`< 1024px`):**
  * Chuyển từ bố cục đa cột sang bố cục 1 cột (`grid-cols-1`).
  * Ẩn menu chữ ngang trên Header, thay thế bằng menu dropdown/drawer hoặc icon tinh gọn.
  * Input và nút bấm quét repo chuyển thành xếp dọc (`flex-col sm:flex-row`).

---

## 5. Danh mục cấm (Anti-patterns & Constraints)

1. **Không dùng màu ngẫu nhiên:** Không dùng các màu gradient tím đậm, xanh neon hay các màu nằm ngoài hệ thống token đã liệt kê ở mục 2.1.
2. **Không phá vỡ font family:** Mọi văn bản phải thuộc 1 trong 3 font: `Plus Jakarta Sans`, `Inter`, hoặc `JetBrains Mono`.
3. **Không tạo lại Navbar / Footer khác kiểu:** Khi tạo các route con (ví dụ: `/workspace`, `/history`, `/overview`), phải giữ thanh Header và Footer có phong cách nhất quán.
4. **Không nhúng inline style bừa bãi:** Ưu tiên 100% utility class của Tailwind CSS v4 và các class tiện ích đã định nghĩa trong `globals.css`.
