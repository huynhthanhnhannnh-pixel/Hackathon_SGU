# [TẦNG GIAO DIỆN & TRÌNH DIỄN] ĐẶC TẢ BUỒNG LÁI 3 CỘT & FSM 4 MÀU
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN
### *Đặc tả Thiết kế Giao diện Phản ứng & Trải nghiệm Người dùng (Phụ trách: NGƯỜI 1 - LEAD)*

---

| **Thuộc tính** | **Thông số kỹ thuật** |
| :--- | :--- |
| **Phân hệ** | `03_UI_VA_KICH_BAN/01_UI_TRI_PANE_FSM.md` |
| **Người phụ trách** | **NGƯỜI 1 (LEAD ARCHITECT & FULLSTACK)** |
| **Công nghệ UI** | Next.js 15 App Router, ReactFlow (Canvas DAG), Monaco/Prism Code Editor, TailwindCSS Vanilla, Zustand Store |
| **Thiết kế chủ đạo** | Dark Modern Cockpit (Cyberpunk/Graphite Theme), Glassmorphism, Micro-animations, Solar Amber highlight |

---

# 1. BỐ CỤC BUỒNG LÁI 3 CỘT (TRI-PANE WORKBENCH LAYOUT)

Giao diện được chia thành 3 cột tương tác phản ứng (Reactive Layout) cố định theo tỷ lệ vàng `25% - 45% - 30%`:

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SIMPLIFEY V2 PRO — COGNITIVE WORKBENCH                                           │
├──────────────────────────┬─────────────────────────────────────────────┬───────────────────────────────────────────────┤
│ CỘT 1: DAG CANVAS (25%)   │ CỘT 2: CODE VIEWER TƯƠNG TÁC (45%)          │ CỘT 3: BUỒNG LÁI NHẬN THỨC 2 PHA (30%)        │
├──────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ • ReactFlow Canvas       │ • Monaco/Prism Interactive Code Viewer      │ [TAB 1: X-RAY WALKTHROUGH] [TAB 2: FEYNMAN]   │
│ • Đồ thị phân nhánh DAG: │ • Hiển thị 20 dòng code hạt nhân thật       │                                               │
│                          │ • Tự động cuộn & highlight theo step        │ 🔍 PHA 1: MỔ XẺ TOÀN DIỆN (ĐỌC HIỂU TỰ DO)    │
│       ┌──────────────┐   │                                             │ • Luồng chạy: Controller ➔ Service ➔ Repo     │
│       │ 🟢 Auth      │   │ File: src/services/order.service.ts         │                                               │
│       └───┬──────┬───┘   │ 41  async function checkout(order) {        │ 💡 ĐIỂM HAY KIẾN TRÚC:                        │
│           │      │       │ 42    const items = order.items;            │ • Layered Pattern + Dependency Injection:     │
│       ┌───▼──┐ ┌─▼────┐  │ 43    // Code thật của sinh viên            │   Tách biệt HTTP khỏi logic, giúp dễ test     │
│       │🟢Cat │ │⚪Prom│  │ 44    for (const item of items) {           │   và dễ tái sử dụng cho Bot/Worker.           │
│       └───┬──┘ └──┬───┘  │ 45      await db.updateStock(item);         │                                               │
│           └───┬───┘      │ 46    }                                     │ 📌 BƯỚC THỰC THI (EXECUTION STEPS):           │
│               ▼          │ 47  }                                       │ • Step 1: Controller nhận DTO                 │
│       ┌──────────────┐   │                                             │ • Step 2: Service duyệt mảng items            │
│       │ 🟡 Checkout  │   │                                             │ • Step 3: Repo cập nhật tồn kho               │
│       └───┬──────┬───┘   │                                             │ (TUYỆT ĐỐI GIẤU VỊ TRÍ VÀ TÊN LỖI Ở TAB 1)   │
│           │      │       │                                             │                                               │
│       ┌───▼──┐ ┌─▼────┐  │                                             │ 👉 [NÚT: TÔI ĐÃ HIỂU ➔ BẮT ĐẦU THỬ THÁCH]     │
│       │⚪Inve│ │⚪Pay │  │                                             │───────────────────────────────────────────────│
│       └──────┘ └──────┘  │                                             │ 🎯 PHA 2: THỬ THÁCH FEYNMAN (KHI CHUYỂN TAB 2)│
│                          │                                             │ 1. Spotting: Click dòng code nghi vấn ở Cột 2 │
│ • Click Node ➔ Nạp Cột 2 │ • Bấm Step ở Cột 3 ➔ Cuộn dòng ở Cột 2      │ 2. Feynman: "Dùng ví dụ đời thường (quán ăn)  │
│   và Cột 3 tức thì       │ • Người học vừa đọc code vừa đọc giải thích │    giải thích tại sao lệnh dòng đó gây chậm?" │
│                          │                                             │ [Ô nhập giải thích / Micro] ➔ [Submit Chấm]   │
└──────────────────────────┴─────────────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

# 2. CHI TIẾT CHỨC NĂNG TỪNG CỘT

### 2.1. Cột 1: ReactFlow Branched DAG Canvas (Bản đồ Nhận thức)
* **Tính chất phân nhánh & hội tụ:** Sử dụng thuật toán Dagre để sắp xếp tọa độ các Node. Không chấp nhận đồ thị thẳng tuột một hàng dọc!
* **Máy Trạng Thái 4 Màu (4-Color FSM):**
  * ⚪ **LOCKED (Xám mờ - Viền đứt nét):** Node bị khóa vì các node cha chưa hoàn thành. Không thể click.
  * 🟡 **AVAILABLE (Vàng hổ phách - Có hào quang Pulse sáng):** Node đã mở khóa, sẵn sàng cho sinh viên chọn học.
  * 🟢 **COMPLETED (Xanh ngọc lục bảo):** Đã vượt qua sát hạch Feynman (`is_passed === true`). Tự động kích hoạt mở khóa các node con.
  * 🔴 **FAILED (Đỏ cảnh báo):** Trả lời sai quá 3 lần, ghi nhận vào danh sách điểm mù.
* **Độ tin cậy của cạnh (đa ngôn ngữ):** Cạnh `confidence: "RESOLVED"` (ngôn ngữ có `ImportResolver` riêng) vẽ nét liền. Cạnh `confidence: "INFERRED"` (ngôn ngữ tier `STRUCTURAL`, Universal Resolver) hoặc `ambiguous: true` vẽ **nét đứt** kèm tooltip *"Cạnh suy luận — chưa đảm bảo 100%"*. Thanh trên cùng của canvas hiện huy hiệu `fingerprint.graph_confidence` (Cao / Trung bình / Thấp) và danh sách `language_breakdown`; khi `LOW`, hiển thị cảnh báo từ `ingestion_report.warnings`. Lưu ý: nét đứt của cạnh khác với viền đứt của node LOCKED.

---

### 2.2. Cột 2: Monaco Interactive Code Viewer (Phòng Giải Phẫu Code)
* Hiển thị chính xác **15 – 30 dòng code hạt nhân** của bước thực thi đang chọn (bóc tách từ Tầng 3).
* **Đồng bộ hóa 2 chiều:**
  * Khi người dùng bấm `Step 1 (Controller)` $\to$ Cột 2 tự động cuộn đến file `order.controller.ts` và highlight dải màu vàng sáng các dòng tiếp nhận DTO.
  * Khi bấm `Step 2 (Service)` $\to$ Cột 2 tự động chuyển sang file `order.service.ts` và highlight vòng lặp xử lý.
* **Hiển thị Trích đoạn Mã nguồn Điểm Nút (The Flashpoint Code Snippet):**
  * Đánh số dòng rõ ràng, tô màu cú pháp (Syntax Highlighting) chuyên nghiệp.
  * Chỉ phục vụ mục đích đọc hiểu trực quan, tuyệt đối không bắt học viên chơi trò click từng dòng code.

---

### 2.3. Cột 3: Buồng Lái Nhận Thức 2 Pha (The 2-Phase Mastery Loop)
* **Tab 1: X-Ray Walkthrough (Đọc hiểu luồng):**
  * Trình diễn luồng biến đổi dữ liệu theo từng bước thực thi `execution_steps`.
  * Phân tích **Điểm Hay (Design Pattern & Dependency Injection)**: Lý do phân tầng, lợi ích kiểm thử và mở rộng.
* **Tab 2: Socratic Feynman Challenge (Sát hạch Bản chất):**
  * Hiển thị câu hỏi Socratic từ AI Co-Architect đóng khung trong đoạn code hạt nhân.
  * Người học nhập lời giải thích bằng ẩn dụ đời thường (quán ăn, đi chợ, giao thông) vào ô văn bản và bấm **[Nộp Bài]**.
  * AI chấm điểm Rubric (Đúng bản chất $\ge 70$, Bình dân $\ge 70$) $\implies$ Đổi màu Node sang XANH LÁ (COMPLETED) tức thì và mở khóa `smell_reveal_after_attempt`.

---

# 3. QUY TẮC CHUYỂN DỊCH TRẠNG THÁI (FSM STATE TRANSITION RULES)

```mermaid
stateDiagram-v2
    [*] --> LOCKED: Khởi tạo đồ thị từ Tầng 2
    LOCKED --> AVAILABLE: Tất cả prerequisites đều COMPLETED
    LOCKED --> COMPLETED: Đạt chuẩn Fast-Track (Kỹ năng BKT >= 0.92)
    AVAILABLE --> AVAILABLE: User click vào xem Tab 1 (X-Ray Walkthrough)
    AVAILABLE --> COMPLETED: Vượt qua sát hạch Feynman ở Tab 2 (is_passed === true)
    AVAILABLE --> FAILED: Trả lời sai 3 lần liên tiếp (retry_count >= 3)
    FAILED --> AVAILABLE: Sinh viên bấm "Ôn tập lại từ đầu"
    COMPLETED --> AVAILABLE: Bị hao mòn trí nhớ sau 30 ngày (Half-Life Decay)
```

---

# 4. ĐẶC TẢ TƯƠNG TÁC NÂNG CAO CHO NGƯỜI 1 (FRONTEND DEV)

### 4.1. Hiển thị Node Fast-Track Auto-Pass (Miễn thi)
* Khi Node có cờ `is_auto_mastered === true` (thỏa mãn $\forall k \in \mathcal{K}_u, P(L_t, k) \ge 0.92$):
  * Node hiển thị màu **XANH LÁ NHẠT (Mint Green)** kèm biểu tượng tia sét ⚡ và nhãn: *"Đã làm chủ ở Repo trước (Fast-Track - Cấp Architect)"*.
  * Sinh viên không bắt buộc phải làm bài thi, các Node con phía sau tự động mở khóa ($0\text{ Token}, 0\text{ms}$).
  * Nếu sinh viên vẫn click vào, hệ thống chỉ hiển thị Tab 1 (X-Ray) để đọc tham khảo.

### 4.2. Giao diện Stepper Dành Cho Node Thuật Toán (`ALGORITHMIC_CORE`)
* Nếu `node_type === "ALGORITHMIC_CORE"` (Node Dijkstra, Crypto, Sorting):
  * Cột 3 và Cột 2 không hiển thị Stepper Controller $\to$ Service $\to$ Repo.
  * Thay vào đó, Stepper hiển thị 3 bước giải thuật:
    * **Step 1:** Khởi tạo Cấu trúc dữ liệu & Biến trạng thái (Min-Heap, Mảng 2D).
    * **Step 2:** Vòng lặp Hạt nhân Biến đổi Trạng thái (Thư giãn cạnh, cập nhật khoảng cách).
    * **Step 3:** Điều kiện Dừng & Trả kết quả (Đường đi ngắn nhất).

### 4.3. Cơ Chế Chặn Spam Bấm Nộp Bài Tại Frontend (Client Guardrail)
* **Khóa nút 3 giây (Debounce):** Sau khi bấm [Nộp Bài Chấm Điểm], nút chuyển sang trạng thái Loading và bị vô hiệu hóa (disabled) trong 3 giây.
* **Chặn nộp trùng nội dung ($\ge 80\%$):** Nếu nội dung mới gõ không khác biệt nhiều so với câu vừa bị rớt $\implies$ Báo lỗi đỏ ngay tại form: *"Bạn chưa bổ sung ý mới, hãy diễn giải chi tiết hơn!"* (Tuyệt đối không gửi request lên backend).
* **Khóa cứng sau 3 lần sai:** Khi `retry_count >= 3` $\implies$ Ẩn ô nhập bài, hiển thị đáp án giải thích chuẩn của hệ thống kèm nút *"Tôi đã hiểu, cho tôi đi tiếp sang Node sau!"*.

### 4.4. Hook Nạp Ngầm Tiên Tri (`usePreFetchSuccessor` - Tối Ưu Phản Hồi 0ms)
* Khi sinh viên xem Tab 1 của Node hiện tại được quá **5 giây**:
  * Frontend kích hoạt hook ngầm `usePreFetchSuccessor(activeNodeId)`.
  * Âm thầm gửi request `/api/enrich-node` cho Node con kế tiếp trên đồ thị và lưu kết quả vào `nodeCache[successorId]`.
  * **Trải nghiệm 0ms Latency:** Khi sinh viên hoàn thành Node hiện tại và click sang Node kế tiếp:
    ```typescript
    const cachedData = useNodeStore.getState().nodeCache[targetNodeId];
    if (cachedData) {
      // Dữ liệu đã có sẵn trong Cache ➔ Render tức thì (0ms latency), không cần hiện Skeleton Scanner!
      setCurrentNodeData(cachedData);
    }
    ```


