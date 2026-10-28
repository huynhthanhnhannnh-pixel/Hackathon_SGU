# BẢN ĐỒ PHÂN CHIA THƯ MỤC THEO TẦNG KIẾN TRÚC (MASTER DIRECTORY MAP)
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN
### *Hệ Thống Bản Sao Nhận Thức Mã Nguồn Dành Cho Sinh Viên CNTT (Hackathon SGU 2026 - 2027)*

---

> 🎯 **DÀNH CHO THÀNH VIÊN VÀ CÁC CON AI ANTIGRAVITY:**  
> Bảng dưới đây quy định chính xác **từng thư mục tương ứng với Tầng nào** trong kiến trúc 6 tầng của hệ thống, ai chịu trách nhiệm và nhiệm vụ kỹ thuật cụ thể là gì để anh em mở ra code không bao giờ bị dẫm chân lên nhau!

---

# 1. BẢNG ÁNH XẠ TOÀN DIỆN: THƯ MỤC $\Longleftrightarrow$ TẦNG HỆ THỐNG

| Thư mục | Tầng Kiến Trúc Tương Ứng | Thành Viên Phụ Trách | Tài Liệu Quy Định Chi Tiết | Trọng Tâm Kỹ Thuật |
| :--- | :--- | :---: | :--- | :--- |
| **`00_CORE_SPEC/`** | **TẦNG QUẢN TRỊ KIẾN TRÚC & DATA CONTRACTS** *(Chi phối toàn bộ Tầng 0 đến Tầng 5)* | 👑 **NGƯỜI 1**<br/>*(Lead Architect)* | • `00_AUDIT_VA_PHAN_VIEC_3_NGUOI.md`<br/>• `01_TONG_QUAN_KIEN_TRUC.md` (Mục 5 = bảng số liệu chuẩn)<br/>• `02_DATA_CONTRACTS.md` (nguồn chân lý về kiểu)<br/>• `03_SYSTEM_EDGE_CASES_AUDIT.md`<br/>• `Kich_Ban_UseCase.md` (file tổng hợp, chỉ đồng bộ từ file nguồn) | • Khóa bộ Hợp đồng Dữ liệu TypeScript bất biến.<br/>• Quản lý ngân sách độ trễ (Latency Budget).<br/>• Duy trì tính toàn vẹn kiến trúc toàn dự án. |
| **`01_ENGINE_THUAT_TOAN/`** | **TẦNG 0, TẦNG 1 & TẦNG 2**<br/>*(Động cơ Phân tích Tĩnh 0 Token, < 1.5s)* | ⚙️ **NGƯỜI 2**<br/>*(Static Engine Dev)* | • `01_INGESTION_STREAM.md`<br/>• `02_AST_SLICING_GRAPH.md` | • **TẦNG 0:** Tải zip stream vào RAM + TreePruner lọc rác.<br/>• **TẦNG 1:** Tree-sitter WASM bóc hàm + Tarjan khử chu trình (100% DAG).<br/>• **TẦNG 2:** PageRank Sink Filter bầu file sếp + Scoped Def-Use Slicing + Uncle Bob + Dagre Layout $(x, y)$. |
| **`02_AI_VA_BAYES/`** | **TẦNG 3, TẦNG 4 & TẦNG 5**<br/>*(AI Phản Biện Feynman & Động cơ Nhận thức Bayes)* | 🧠 **NGƯỜI 3**<br/>*(AI & Cognitive Dev)* | • `01_LLM_PIPELINE_GUARDRAIL.md`<br/>• `02_BAYES_COGNITIVE_BKT.md` | • **TẦNG 3:** Đóng gói Context Sandwich (≤ 30 dòng/step, ≤ 100 dòng/node).<br/>• **TẦNG 4:** Gemini Flash CoT Structured JSON + Cổng Gác Nhị Phân 2 Chốt.<br/>• **TẦNG 5:** Bayesian Knowledge Tracing (BKT) + $q$-Matrix 16 chiều + Half-Life Decay. |
| **`03_UI_VA_KICH_BAN/`** | **TẦNG GIAO DIỆN & BUỒNG LÁI NHẬN THỨC** *(Tri-Pane Cockpit & Demo)* | 👑 **NGƯỜI 1**<br/>*(Fullstack & UI)* | • `01_UI_TRI_PANE_FSM.md`<br/>• `02_KICH_BAN_PITCH_DEMO.md` | • Cột 1: ReactFlow Branched DAG Canvas 4 màu.<br/>• Cột 2: Monaco Interactive Code Viewer.<br/>• Cột 3: Buồng lái 2 Pha (Tab X-Ray & Tab Feynman).<br/>• Kịch bản Pitching 5 phút & Persona Simulator. |
| **`04_ROADMAP_KY_THUAT/`** | **LỘ TRÌNH KỸ THUẬT 4 GIAI ĐOẠN PHÁT TRIỂN** *(Sau Hackathon)* | 👥 **CẢ 3 NGƯỜI** | • `ROADMAP_KY_THUAT_CHI_TIET.md` | • Nâng cấp công nghệ, thuật toán bổ sung và cách đo cho từng giai đoạn Pilot → ĐATN → Thương mại hóa → DevTool. |
| **`references/`** | **TÀI LIỆU NỀN TẢNG & GIÁO TRÌNH HỌC THUẬT TOÁN** | 👥 **CẢ 3 NGƯỜI** | • `GIAO_TRINH_THUAT_TOAN_CHUAN.md`<br/>• `thele.md` | • Giáo trình chạy tay bằng số (Dry-run) 7 thuật toán cốt lõi.<br/>• Thể lệ cuộc thi Hackathon SGU 2026-2027. |
| **Thư mục gốc** | **ĐỊNH VỊ, THẨM ĐỊNH & PROTOTYPE** | 👥 **CẢ 3 NGƯỜI** | • `KyVong45.md`<br/>• `BAO_CAO_THAM_DINH_GIAM_KHAO.md`<br/>• `index.html`, `cockpit_demo.html`<br/>• `CLAUDE.md` | • Định vị cạnh tranh & cẩm nang phản biện BGK.<br/>• Thẩm định giả lập kèm bảng trạng thái xử lý.<br/>• Prototype giao diện dữ liệu giả (chỉ tham chiếu thiết kế, **không** chép vào repo thi).<br/>• Hướng dẫn cho trợ lý AI. |
| **`archive/`** | **KHO LƯU TRỮ TÀI LIỆU CŨ & BẢN NHÁP SƠ KHAI** | 🗄️ *Hệ thống* | • `docchoi.md`, `enterprise_arch.md`, `atp.md`, `SYSTEM_SPEC...` | Lưu trữ lịch sử thảo luận, **không** dùng làm căn cứ. |

---

# 2. SƠ ĐỒ DÒNG DỮ LIỆU LIÊN THÔNG GIỮA CÁC THƯ MỤC

```mermaid
flowchart TD
    subgraph S0 ["00_CORE_SPEC (NGƯỜI 1 - LEAD)"]
        Contracts["02_DATA_CONTRACTS.md<br/>(Định nghĩa Types & Schemas chuẩn)"]
    end

    subgraph S1 ["01_ENGINE_THUAT_TOAN (NGƯỜI 2 - STATIC ENGINE)"]
        direction TB
        T0["TẦNG 0: 01_INGESTION_STREAM.md<br/>(Stream RAM Unzip & TreePruner)"] --> T1["TẦNG 1: 02_AST_SLICING_GRAPH.md<br/>(Tree-sitter WASM & Tarjan SCC)"]
        T1 --> T2["TẦNG 2: 02_AST_SLICING_GRAPH.md<br/>(PageRank Sink Filter, Uncle Bob, Dagre)"]
    end

    subgraph S3 ["03_UI_VA_KICH_BAN (NGƯỜI 1 - LEAD)"]
        direction TB
        UI1["CỘT 1: ReactFlow Canvas 4 Màu<br/>(Nhận tọa độ x,y từ Tầng 2)"]
        UI2["CỘT 2: Monaco Code Viewer<br/>(Nhận code hạt nhân từ Tầng 3)"]
        UI3["CỘT 3: Buồng Lái Nhận Thức 2 Pha<br/>(Tab 1 X-Ray & Tab 2 Feynman)"]
    end

    subgraph S2 ["02_AI_VA_BAYES (NGƯỜI 3 - AI & COGNITIVE)"]
        direction TB
        T3["TẦNG 3: 01_LLM_PIPELINE_GUARDRAIL.md<br/>(Context Sandwich ≤ 100 dòng / ≤ 1,500 token)"]
        T4["TẦNG 4: 01_LLM_PIPELINE_GUARDRAIL.md<br/>(Gemini Flash CoT + Cổng Gác Nhị Phân)"]
        T5["TẦNG 5: 02_BAYES_COGNITIVE_BKT.md<br/>(Động cơ BKT + q-Matrix + Half-Life Decay)"]
    end

    Contracts -.->|"Ép kiểu dữ liệu"| S1
    Contracts -.->|"Ép kiểu dữ liệu"| S2
    Contracts -.->|"Ép kiểu dữ liệu"| S3

    T2 ==>|"Xuất đồ thị DAG & Lát cắt"| UI1
    UI1 -->|"Click Node Vàng"| T3
    T3 -->|"Nạp code hạt nhân"| UI2
    T3 -->|"Gửi Payload Sandwich"| T4
    T4 -->|"Xuất X-Ray & Câu hỏi Socratic"| UI3
    UI3 -->|"Nộp bài giải thích"| T5
    T5 ==>|"Đổi Node sang XANH & Mở khóa"| UI1
```

---

# 3. QUY TRÌNH PHỐI HỢP KHI BẮT ĐẦU CODE (CODE IMPLEMENTATION PROTOCOL)

1. **BƯỚC 1 (Đọc kỹ hợp đồng dữ liệu):**  
   Mọi thành viên mở file [`00_CORE_SPEC/02_DATA_CONTRACTS.md`](00_CORE_SPEC/02_DATA_CONTRACTS.md) để đọc cấu trúc JSON và Type mà mình phải nhận vào / trả ra, và bảng số liệu chuẩn ở [`00_CORE_SPEC/01_TONG_QUAN_KIEN_TRUC.md`](00_CORE_SPEC/01_TONG_QUAN_KIEN_TRUC.md) Mục 5.
2. **BƯỚC 2 (Người 2 triển khai Tầng 0, 1, 2):**  
   Mở thư mục `01_ENGINE_THUAT_TOAN/`, code theo đúng 5 mục: *Input $\to$ Logic $\to$ Fallback $\to$ Output $\to$ SLA < 0.25s*.
3. **BƯỚC 3 (Người 3 triển khai Tầng 3, 4, 5):**  
   Mở thư mục `02_AI_VA_BAYES/`, code Prompt Gemini Flash JSON Schema, Cổng Gác Nhị Phân 2 Chốt và Động cơ Bayes BKT.
4. **BƯỚC 4 (Người 1 dựng Giao diện Cockpit 3 Cột):**  
   Mở thư mục `03_UI_VA_KICH_BAN/`, gắn ReactFlow, Monaco Editor và kết nối Zustand Store để đổi màu Node và chạy Demo 5 phút.
5. **NẾU CẦN ÔN LẠI THUẬT TOÁN:**  
   Mở ngay [`references/GIAO_TRINH_THUAT_TOAN_CHUAN.md`](references/GIAO_TRINH_THUAT_TOAN_CHUAN.md) để xem ví dụ chạy tay bằng số (Dry-run trace) minh bạch!
