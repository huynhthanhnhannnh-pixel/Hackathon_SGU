# KIẾN TRÚC HỆ THỐNG & LUỒNG DỮ LIỆU TỔNG THỂ (SYSTEM ARCHITECTURE RFC)
## DỰ ÁN: SGU-FEYNMAN

Tài liệu đặc tả kiến trúc kỹ thuật cấp cao, phân tách trách nhiệm giữa các phân hệ và mô tả luồng dữ liệu toàn trình cho hệ thống SGU-Feynman.

---

## 1. TRIẾT LÝ THIẾT KẾ: HỆ THỐNG LAI (HYBRID ARCHITECTURE)

Hệ thống SGU-Feynman được xây dựng dựa trên nguyên lý tách bạch tuyệt đối giữa **Năng lực Ngữ nghĩa của AI (Semantic Capability)** và **Tính Tiền định của Thuật toán (Algorithmic Determinism)**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        SGU-FEYNMAN SYSTEM HYBRID                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│   ALGORITHMIC DETERMINISM (0đ)   │      SEMANTIC EVALUATION (AI)       │
│        (Backend Engine)          │        (Gemini Flash LLM)           │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Lưu trữ & Duyệt Đồ thị DAG     │ • Nhận diện cảm xúc & câu nói User  │
│ • Kiểm soát chu trình (Kahn's)   │ • Trích xuất thuật ngữ khó (Jargon) │
│ • FSM chuyển trạng thái màu Node │ • Bắt lỗi logic & nhận diện ẩn dụ   │
│ • Kiểm tra điều kiện tiên quyết  │ • Sinh câu hỏi vặn ngây ngô         │
│ • Quản lý biến đếm (retry_count) │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

**Nguyên tắc vàng:** AI không bao giờ được phép tự quyết định lộ trình bài học hoặc tự ý đổi trạng thái của đồ thị tri thức. Mọi quyết định trạng thái đều do Backend Engine kiểm soát dựa trên hợp đồng dữ liệu tiền định.

---

## 2. SƠ ĐỒ PHÂN TẦNG HỆ THỐNG (LAYERED ARCHITECTURE)

Dựa trên cấu trúc BFD đã tinh gọn (loại bỏ Voice API và Hint theo quyết định ADR):

```text
┌───────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT LAYER (Frontend SPA - React / ReactFlow / Zustand Store)     │
│  - Graph Canvas: Hiển thị DAG, đổi màu node (Xám, Vàng, Đỏ, Xanh)     │
│  - Feynman Cockpit: Khung chat Text Console, Avatar biểu cảm SVG     │
│  - Diagnostic View: Tổng kết năng lực, danh sách lỗ hổng tri thức     │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │ HTTP / JSON Payload
┌──────────────────────────────────▼────────────────────────────────────┐
│ 2. ORCHESTRATION LAYER (Backend State Machine & Graph Engine)          │
│  - Graph Storage: Quản lý cấu trúc Node, Edge và In-degree            │
│  - FSM State Controller: Bộ điều phối chuyển màu và mở khóa Node      │
│  - Directive Injector: Tiêm mã lệnh XML ngầm (<DEVELOPER_DIRECTIVE>)  │
│  - Session Memory: Lưu Rolling Window (N=2) & Metaphor Scratchpad     │
└──────────────────────────────────┬────────────────────────────────────┘
                                   │ Single-Pass JSON Request
┌──────────────────────────────────▼────────────────────────────────────┐
│ 3. INTELLIGENCE LAYER (AI Evaluator - Gemini Flash Engine)             │
│  - Pinned System Instruction: Định hình Persona & Mục tiêu Sư phạm     │
│  - Semantic Evaluator: Phân tích câu trả lời của người dùng           │
│  - JSON Structured Output: Trả về trạng thái & câu thoại ngây ngô     │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 3. LUỒNG DỮ LIỆU TOÀN TRÌNH (END-TO-END DATA FLOW)

Mỗi chu kỳ tương tác (Turn-by-turn Cycle) trong buồng lái mô phỏng diễn ra như sau:

```text
User (Nhập 1-2 câu giải thích)
  │
  ▼
[Frontend]: Gửi { user_message, active_node_id } lên Backend
  │
  ▼
[Backend Orchestrator]:
  ├── 1. Lấy trạng thái hiện tại của Node & biến đếm retry_count.
  ├── 2. Chọn chuỗi <DEVELOPER_DIRECTIVE> phù hợp (Bình thường / Vàng / Đỏ / Chuyển Node).
  ├── 3. Ghép Payload chuẩn $O(1)$: Pinned Core + XML Directive + Rolling Window (N=2).
  └── 4. Gọi API Gemini Flash với cấu hình Structured Output JSON.
  │
  ▼
[AI Evaluator - Gemini Flash]:
  └── Phân tích ngữ nghĩa trong 1 lần duy nhất (Single-Pass), nhả JSON:
      {
        "is_valid": true / false,
        "extracted_jargon_or_error": "...",
        "extracted_metaphor": "...",
        "ai_chat_response": "..."
      }
  │
  ▼
[Backend Engine]:
  ├── 1. Đọc cờ "is_valid" & "extracted_jargon_or_error" để cập nhật màu Node:
  │      - Hợp lệ $\to$ Đổi XANH, reset retry_count.
  │      - Dính từ khó / lỗi logic $\to$ Đổi VÀNG / ĐỎ, tăng retry_count.
  ├── 2. Nếu Node XANH: Duyệt đồ thị tìm Node kế tiếp (quét điều kiện tiên quyết).
  └── 3. Tính toán lại % hoàn thành bài học.
  │
  ▼
[Frontend Response]:
  └── Trả về Client để cập nhật UI ngay lập tức:
      - ReactFlow đổi màu Node & glow node đang học.
      - Avatar đổi cảm xúc & hiển thị câu hỏi vặn mới của AI.
```

---

## 4. CƠ CHẾ BẢO VỆ HẠ TẦNG VÀ DỮ LIỆU TRONG PHÒNG THI HACKATHON
- **Khả năng hoạt động không phụ thuộc Database ngoài:** Trạng thái phiên học hoàn toàn được quản lý thông qua In-Memory Data Store ở Backend và Client LocalStorage/Store ở Frontend.
- **Cờ dự phòng (`USE_MOCK=true`):** Hệ thống tích hợp sẵn chế độ Mock dữ liệu nội bộ. Nếu mạng hội trường mất kết nối với máy chủ AI, toàn bộ phản hồi JSON có thể giả lập ngay tại chỗ để đảm bảo bài thuyết trình không bao giờ bị gián đoạn.
