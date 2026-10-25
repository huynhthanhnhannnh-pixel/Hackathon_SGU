# ĐẶC TẢ ĐỘNG CƠ NHẬN THỨC BAYES, q-MATRIX & THANG TIẾN HÓA (TẦNG 5)
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN
### *Đặc tả Toán học & Thuật toán Đánh giá Năng lực Nhận thức Người học (Phụ trách: NGƯỜI 3)*

---

| **Thuộc tính** | **Thông số kỹ thuật** |
| :--- | :--- |
| **Phân hệ** | `02_AI_VA_BAYES/02_BAYES_COGNITIVE_BKT.md` |
| **Người phụ trách** | **NGƯỜI 3 (AI & COGNITIVE ENGINEER)** |
| **Nền tảng toán học** | Bayesian Knowledge Tracing (Corbett & Anderson, 1995), Ebbinghaus Forgetting Curve (1885) |
| **Thời gian tính toán** | **< 0.002 giây** chạy thuần trên Client Store (Zustand) • Tiêu tốn: **0 Token AI** |
| **Mục tiêu cốt lõi** | Cá nhân hóa độ khó câu hỏi, theo dõi lỗ hổng kiến thức đa chiều, kích hoạt câu hỏi ôn tập điểm mù |

---

# 1. MÔ HÌNH BAYESIAN KNOWLEDGE TRACING (BKT) KHÉP KÍN

Mỗi kỹ năng trong bộ 16 Kỹ năng Kỹ nghệ Phần mềm Chuẩn (SWE Skills) được theo dõi bằng một chuỗi Markov ẩn BKT với 4 tham số chuẩn hóa:

| Tham số | Ký hiệu | Ý nghĩa sư phạm | Giá trị khởi tạo |
| :--- | :---: | :--- | :---: |
| **Prior** | $P(L_0)$ | Xác suất người học đã làm chủ kỹ năng trước khi vào bài. | $0.20$ |
| **Transit** | $P(T)$ | Xác suất người học hiểu ra vấn đề sau mỗi lượt phản hồi của AI. | $0.20$ |
| **Guess** | $P(G)$ | Xác suất người học chưa hiểu sâu nhưng đoán mò trúng. | $0.15$ |
| **Slip** | $P(S)$ | Xác suất người học đã hiểu bài nhưng lỡ tay thao tác nhầm/sơ suất. | $0.05$ |

---

### 1.1. Quy tắc Ánh xạ Kết quả Chấm từ AI sang Quan sát BKT
Khi người học nộp câu trả lời giải thích Feynman, Gemini Flash chấm theo thang điểm Rubric:
* `core_accuracy` $\in [0, 100]$: Điểm đúng bản chất kỹ thuật.
* `simplicity` $\in [0, 100]$: Điểm bình dân, không nói vẹt thuật ngữ.

Trạng thái quan sát $\text{Obs} \in \{\text{Correct}, \text{Incorrect}\}$ được xác định tất định:
$$\text{Obs} = \begin{cases} \text{Correct} & \text{nếu } \text{core\_accuracy} \ge 70 \text{ VÀ } \text{simplicity} \ge 70 \\ \text{Incorrect} & \text{ngược lại} \end{cases}$$

---

### 1.2. Công thức Cập nhật Xác suất Bản thể $P(L_t)$

1. **Khi sinh viên trả lời ĐÚNG ($\text{Obs} = \text{Correct}$):**
   $$P(L_{t-1} \mid \text{Correct}) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$

2. **Khi sinh viên trả lời SAI ($\text{Obs} = \text{Incorrect}$):**
   $$P(L_{t-1} \mid \text{Incorrect}) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$

3. **Bước Dự phóng Tiếp thu (Learning Transition):**
   $$P(L_t) = P(L_{t-1} \mid \text{Obs}) + \Big(1 - P(L_{t-1} \mid \text{Obs})\Big) \times P(T)$$

---

# 2. MA TRẬN KỸ NĂNG $q$-MATRIX (16 CHIỀU)

Hệ thống theo dõi người học trên không gian 16 Kỹ năng Kỹ nghệ Phần mềm chuẩn:
$$\mathcal{K} = \{ k_1: \text{HTTP\_ROUTING}, \dots, k_5: \text{DB\_OPTIMIZATION}, \dots, k_{16}: \text{PERFORMANCE\_BOTTLENECK} \}$$

Khi AI sinh câu hỏi ở Tầng 4 kèm trường `target_skills: ["DB_OPTIMIZATION", "ASYNC_CONCURRENCY"]`, hệ thống kích hoạt vector nhị phân:
$$q_j \in \{0, 1\}^{16} \quad \text{với } q_{j5} = 1, q_{j7} = 1$$
Thuật toán BKT sẽ cập nhật đồng thời xác suất làm chủ $P(L_t)$ cho cả hai kỹ năng $k_5$ và $k_7$.

---

# 3. THANG TIẾN HÓA CÂU HỎI 3 BẬC (3-TIER COGNITIVE ESCALATION)

Hệ thống không hỏi ngẫu nhiên mà tự động điều tiết độ sâu câu hỏi của AI dựa vào điểm số năng lực hiện tại của người học:

```text
┌──────────────────────────┬───────────────────────┬─────────────────────────────────────┐
│ CẤP ĐỘ NHẬN THỨC         │ NGƯỠNG NĂNG LỰC       │ DẠNG CÂU HỎI SOCRATIC FEYNMAN       │
├──────────────────────────┼───────────────────────┼─────────────────────────────────────┤
│ TIER 1: NOVICE           │ P(L_t) < 0.50         │ DATA-FLOW TRACING                   │
│ (Người mới bắt đầu)      │                       │ Truy vết đường đi của biến số, kiểu │
│                          │                       │ dữ liệu DTO qua các hàm liên kết.   │
├──────────────────────────┼───────────────────────┼─────────────────────────────────────┤
│ TIER 2: PRACTITIONER     │ 0.50 ≤ P(L_t) < 0.85  │ DESIGN CRITIQUE & AI SMELLS         │
│ (Lập trình viên thực thụ)│                       │ Bắt bệnh N+1 query, thiếu rollback, │
│                          │                       │ phân tích lý do chia tách tầng.     │
├──────────────────────────┼───────────────────────┼─────────────────────────────────────┤
│ TIER 3: ARCHITECT        │ P(L_t) ≥ 0.85         │ DEEP INVARIANTS & CONCURRENCY EDGE  │
│ (Kỹ sư trưởng kiến trúc) │                       │ Xoáy sâu vào Race Condition, Dead-  │
│                          │                       │ lock, phá vỡ toàn vẹn đa luồng.     │
└──────────────────────────┴───────────────────────┴─────────────────────────────────────┘
```

---

# 4. QUY LUẬT BÁN RÃ TRÍ NHỚ (HALF-LIFE DECAY) & ÔN TẬP ĐIỂM MÙ

Dựa trên đường cong quên lãng Ebbinghaus (1885), mức độ làm chủ kiến thức suy giảm theo hàm mũ khi người học không ôn tập:

$$P(L_{\text{current}}) = P(L_{\text{last}}) \times 2^{-\frac{\Delta t}{h}}$$

Trong đó:
* $\Delta t$: Số ngày người học không tương tác với Node/Kỹ năng này.
* $h = 14 \text{ ngày}$: Chu kỳ bán rã trí nhớ của sinh viên.

### Phản ứng trên Giao diện:
* Nếu một Node từng đạt **XANH LÁ** nhưng sau 30 ngày điểm tụt từ $0.95$ xuống còn:
  $$0.95 \times 2^{-\frac{30}{14}} \approx 0.95 \times 0.226 = 0.215 < 0.50$$
* Node sẽ tự động đổi sang viền **VÀNG CAM (Cảnh báo Trí nhớ Bào Mòn)**. Khi người dùng click vào, AI Co-Architect sẽ mồi lại **Câu hỏi Ôn tập Điểm mù Cũ** để củng cố vùng nhớ dài hạn.

---

# 5. CÔNG CỤ PITCHING: BỘ GIẢ LẬP PERSONA SIMULATOR (DEMO 5 PHÚT)

Để chứng minh tính năng toán học này chạy mượt mà trước Ban Giám khảo mà không cần đợi 30 ngày:
* **Persona 1 (Sinh viên Năm 2 - $P(L_0) = 0.20$):** AI chỉ đưa ra câu hỏi Tier 1 (Truy vết biến).
* **Persona 2 (Mid-Level Dev - $P(L_0) = 0.65$):** AI lập tức đưa câu hỏi Tier 2 (Bắt lỗi N+1 Query).
* **Persona 3 (Senior sau 30 ngày nghỉ):** Bấm nút, điểm số lập tức tụt từ $0.95$ xuống $0.43$, đồ thị đổi viền vàng cam và AI kích hoạt câu hỏi ôn tập ngay trước mắt Ban Giám khảo!
