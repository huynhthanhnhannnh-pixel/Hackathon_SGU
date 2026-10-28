# ĐẶC TẢ ĐỘNG CƠ NHẬN THỨC BAYES, q-MATRIX & THANG TIẾN HÓA (TẦNG 5)
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN

---

| **Thuộc tính** | **Thông số kỹ thuật chuẩn** |
| :--- | :--- |
| **Tài liệu** | `02_AI_VA_BAYES/02_BAYES_COGNITIVE_BKT.md` |
| **Người phụ trách** | **NGƯỜI 3 (AI & COGNITIVE ENGINEER)** |
| **Nền tảng lý thuyết** | **Bayesian Knowledge Tracing (Corbett & Anderson, 1995)**, **Ebbinghaus Decay (1885)** |
| **Môi trường thực thi** | **Server** (trong transaction `evaluate-feynman`, lưu Postgres) • Client dùng chung hàm thuần chỉ để vẽ decay • Thời gian tính toán: **< 0.002s** • Chi phí: **0 Token AI** |
| **Mục tiêu kỹ thuật** | Mô hình hóa năng lực người học, phân phối độ khó 3-Tier, tự động miễn thi Fast-Track |

---

# 1. KHÔNG GIAN TRẠNG THÁI & MA TRẬN 16 KỸ NĂNG ($q$-MATRIX)

### 1.1. Danh mục Cố định 16 Kỹ năng Kỹ nghệ Phần mềm Chuẩn (SWE Skills)

Hệ thống định lượng trình độ người học trên không gian véctơ 16 chiều $\mathcal{K} = \{k_1, k_2, \dots, k_{16}\}$. Mỗi kỹ năng được nhận diện sơ bộ qua bộ lọc AST tĩnh (Tầng 2) với chi phí $0\text{ Token}$:

| STT | Mã Enum Kỹ năng | Tên Kỹ năng & Trọng tâm Đánh giá | Dấu hiệu Nhận diện AST Tĩnh tại Tầng 2 (Static AST Heuristics) |
| :---: | :--- | :--- | :--- |
| **$k_1$** | `HTTP_ROUTING` | Định tuyến HTTP, RESTful URL mapping, Controller endpoints | Decorator `@Get()`, `@Post()`, `router.get()`, `app.post()`, `@Controller()` |
| **$k_2$** | `DTO_VALIDATION` | Kiểm thực dữ liệu đầu vào, schema integrity, type casting | Khai báo Zod `z.object()`, class-validator `@IsString()`, `@IsNotEmpty()`, Joi schema |
| **$k_3$** | `AUTH_SECURITY` | Xác thực & phân quyền, Guard bảo vệ, xử lý JWT/Session | Decorator `@UseGuards()`, `passport.authenticate()`, `jwt.verify()`, middleware auth |
| **$k_4$** | `DEPENDENCY_INJECTION` | Tiêm phụ thuộc, IoC Container, loose coupling giữa các tầng | Decorator `@Injectable()`, `@Inject()`, constructor parameter injection |
| **$k_5$** | `LAYERED_SEPARATION` | Phân tầng kiến trúc sạch (Controller $\to$ Service $\to$ Repo) | Import/gọi hàm chéo giữa controller/service/repo, interface abstractions |
| **$k_6$** | `DB_OPTIMIZATION` | Tối ưu hóa truy vấn CSDL, chống N+1 query, Indexing | Lệnh query trong vòng lặp (`for`/`map` chứa `repo.find`), missing relations/join |
| **$k_7$** | `ASYNC_CONCURRENCY` | Lập trình bất đồng bộ, Promise chain, await, non-blocking | Từ khóa `async`/`await`, `Promise.all()`, `Promise.race()`, EventEmitter |
| **$k_8$** | `TRANSACTION_INTEGRITY` | Toàn vẹn giao dịch ACID, transaction commit/rollback | `queryRunner.startTransaction()`, `prisma.$transaction()`, `db.beginTransaction()` |
| **$k_9$** | `ERROR_HANDLING` | Bắt và xử lý ngoại lệ, Global Exception Filters, Error Envelopes | Khối `try/catch`, `throw new HttpException()`, middleware `(err, req, res, next)` |
| **$k_{10}$** | `STATE_MANAGEMENT` | Quản lý trạng thái ứng dụng, state transitions, domain state | Các biến trạng thái module, in-memory Map/Set, Finite State Machine, Zustand store |
| **$k_{11}$** | `ALGORITHMIC_COMPLEXITY` | Tối ưu độ phức tạp thuật toán, cấu trúc dữ liệu, Big-O | Vòng lặp lồng nhau $\ge 2$ cấp, đệ quy, sắp xếp, duyệt đồ thị/cây, Map tra cứu $O(1)$ |
| **$k_{12}$** | `MEMORY_MANAGEMENT` | Quản lý bộ nhớ, Streams, Buffer, chống rò rỉ (memory leak) | `fs.createReadStream()`, `stream.pipe()`, `Buffer.from()`, `emitter.removeListener()` |
| **$k_{13}$** | `API_CONTRACT_DESIGN` | Thiết kế giao tiếp API, chuẩn hóa response format, HTTP status | `res.status(200).json()`, Swagger `@ApiResponse()`, OpenAPI schema tags |
| **$k_{14}$** | `CACHING_STRATEGY` | Chiến lược bộ nhớ đệm, Cache-Aside, thiết lập TTL, invalidate | `redisClient.get()`, `cacheManager.set()`, TTL options, memory-cache |
| **$k_{15}$** | `RATE_LIMIT_RESILIENCE` | Khả năng chịu tải, Rate Limiting, Throttling, Circuit Breaker | Middleware `express-rate-limit`, ThrottlerGuard, retry logic exponential backoff |
| **$k_{16}$** | `DATA_SERIALIZATION` | Tuần tự hóa dữ liệu, JSON transform, DTO mapping, Marshalling | `JSON.parse()`, `classToPlain()`, `plainToInstance()`, custom serialization |

---

### 1.2. Cơ chế Gán nhãn Tĩnh Sơ bộ (`preliminary_skills`) Khử Nghịch lý "Con gà - Quả trứng"
* **Bản chất vấn đề:** Nếu phải chờ Gemini Flash phân tích ở `/api/enrich-node` mới có danh sách kỹ năng, hệ thống buộc phải tiêu tốn token và chịu độ trễ $1.5\text{s}$ trước khi biết người học có đủ điều kiện miễn thi hay không.
* **Giải pháp Kỹ thuật:**
  1. Tại **Tầng 2 (Static AST Parsing - 0 Token, < 1.5s)**: Parser tự động đối sánh mã nguồn Node với bảng heuristics ở trên để gán mảng `preliminary_skills: SWESkill[]` (từ 1 đến 3 kỹ năng) vào metadata của từng Node trên đồ thị DAG.
  2. Ngay khi Node **đủ điều kiện mở khóa** (mọi node cha đã COMPLETED hoặc FAILED): server (hàm `applyUnlocksAndFastTrack` trong cùng transaction, `00_CORE_SPEC/04_LUU_TRU_VA_DONG_BO.md` Mục 6.2) kiểm tra điều kiện Auto-Pass ($\ge 0.92$, tính trên điểm **đã decay**) với `preliminary_skills`. Nếu thỏa mãn (và node không bị Capstone Lock, Mục 3.3), Node chuyển thẳng sang `COMPLETED` với `is_auto_mastered = true` mà **hoàn toàn không cần gọi API AI**; ngược lại chuyển sang `AVAILABLE`.
  3. AI chỉ được chọn `target_skills` **trong** `preliminary_skills` (Cổng gác kiểm tra, xem `01_LLM_PIPELINE_GUARDRAIL.md` Mục 3), để BKT cập nhật đúng tập kỹ năng mà Fast-Track xét.

---

### 1.3. Cấu trúc Dữ liệu Lưu trữ `LearnerCognitiveProfile` (Postgres, bản sao ở Zustand)

Kiểu dữ liệu định nghĩa duy nhất trong [`00_CORE_SPEC/02_DATA_CONTRACTS.md`](../00_CORE_SPEC/02_DATA_CONTRACTS.md) Mục 3: `SWESkill`, `CognitiveSkillState`, `NodeProgressRecord`, `LearnerCognitiveProfile`. Quy tắc quan trọng: `p_mastery` là giá trị **gốc** sau lần cập nhật BKT gần nhất; giá trị đã decay **không được lưu**, chỉ tính khi đọc (Mục 2.4).

Hồ sơ được lưu ở Postgres: `skills` ⇔ bảng `skill_states` (đi theo người học, dùng chung mọi repo), `node_history` ⇔ bảng `node_progress` của **phiên học đang mở** (xem [`00_CORE_SPEC/04_LUU_TRU_VA_DONG_BO.md`](../00_CORE_SPEC/04_LUU_TRU_VA_DONG_BO.md) Mục 4). JSON dưới đây là hình dạng server trả về cho client.

```json
{
  "user_id": "usr_dev_4091",
  "overall_tier": "PRACTITIONER",
  "last_updated_at": 1774000000000,
  "skills": {
    "HTTP_ROUTING": { "skill": "HTTP_ROUTING", "p_mastery": 0.82, "last_practiced_at": 1773900000000, "practice_count": 4, "correct_count": 3 },
    "DB_OPTIMIZATION": { "skill": "DB_OPTIMIZATION", "p_mastery": 0.25, "last_practiced_at": 1773800000000, "practice_count": 1, "correct_count": 0 },
    "ASYNC_CONCURRENCY": { "skill": "ASYNC_CONCURRENCY", "p_mastery": 0.74, "last_practiced_at": 1773950000000, "practice_count": 3, "correct_count": 3 }
  },
  "node_history": {
    "slice-order-checkout": {
      "node_id": "slice-order-checkout",
      "status": "COMPLETED",
      "is_auto_mastered": false,
      "has_warning": false,
      "retry_count": 1,
      "last_attempt_at": 1773950000000
    }
  }
}
```

---

# 2. MÔ HÌNH TOÁN HỌC BKT & SUY GIẢM TRÍ NHỚ (HALF-LIFE DECAY)

### 2.1. Bảng Tham số BKT Chuẩn hóa (Khắc phục Triệt để Lỗi Logic Cũ)

| Tham số | Ký hiệu | Giá trị Chuẩn | Ý nghĩa Sư phạm Kỹ thuật |
| :--- | :---: | :---: | :--- |
| **Prior** | $P(L_0)$ | **$0.25$** | Xác suất tiên nghiệm người học đã làm chủ kỹ năng trước khi vào bài. |
| **Transit (Correct)** | $P(T \mid \text{Correct})$ | **$0.08$** | Tỷ lệ tiếp thu tri thức sau khi người học giải thích đúng. Giữ nhỏ để mỗi lần đúng chỉ nâng 1 bậc Tier. |
| **Transit (Incorrect)** | $P(T \mid \text{Incorrect})$ | **$0.03$** | Tỷ lệ tiếp thu nhỏ từ câu hỏi gợi mở và đáp án được mở khi người học trả lời sai. |
| **Guess** | $P(G)$ | **$0.25$** | Xác suất chưa hiểu sâu nhưng vẫn đạt: ăn may trúng rubric, hoặc nhờ AI khác trả lời hộ (rủi ro thực tế với nhóm người dùng vibecoder). |
| **Slip** | $P(S)$ | **$0.12$** | Xác suất đã làm chủ nhưng không đạt: gõ thiếu ý, hoặc bộ chấm LLM chấm nhiễu. Nằm trong dải $0.10 - 0.15$ để một lần sơ suất không xóa sạch thành tích. |

> [!NOTE]
> **Vì sao chọn bộ tham số này (thay cho bộ cũ $P(T)=0.20, P(G)=0.15, P(S)=0.05$):** Bộ cũ cho $0.25 \to 0.7429 \to 0.9585$, tức là 2 lần đúng đã vượt ngưỡng Fast-Track $0.92$, nên người học **không bao giờ gặp Tier 3 (ARCHITECT)**. Đồng thời, đang ở $0.90$ mà trượt 1 lần thì tụt về $0.36$. Bộ mới đảm bảo **mỗi lần đúng leo đúng 1 bậc** (Tier 1 → 2 → 3 → Fast-Track, xem Mục 2.3), còn một lần sơ suất ở $0.90$ chỉ tụt về $0.60$. Đây vẫn là tham số **đặt tay có lý do**; Giai đoạn 2 sẽ fit lại bằng dữ liệu thật (xem Roadmap).

---

### 2.2. Hệ thống Công thức Cập nhật Hậu nghiệm & Chuyển trạng thái

1. **Quy tắc Ánh xạ Quan sát ($\text{Obs}$):**
   $$\text{Obs} = \begin{cases} \text{Correct} & \text{nếu } \text{core\_accuracy} \ge 70 \\ \text{Incorrect} & \text{ngược lại} \end{cases}$$
   * `core_accuracy` đo việc người học **hiểu đúng vì sao code được viết như vậy và bám đúng code thật** (nhắc đúng hàm, biến, luồng). `simplicity` (dùng ẩn dụ đời thường) **chỉ là điểm cộng**, không tham gia quyết định Đạt/Trượt (xem `01_LLM_PIPELINE_GUARDRAIL.md` Mục 4.2).

2. **Cập nhật Hậu nghiệm Bayes (Posterior Step):**
   * Khi trả lời **ĐÚNG** ($\text{Obs} = \text{Correct}$):
     $$P(L_{t-1} \mid \text{Correct}) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$
   * Khi trả lời **SAI** ($\text{Obs} = \text{Incorrect}$):
     $$P(L_{t-1} \mid \text{Incorrect}) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$

3. **Bước Chuyển Trạng thái Tiếp thu có Điều kiện (Conditional Transition Step):**
   $$P(L_t) = P(L_{t-1} \mid \text{Obs}) + \Big(1 - P(L_{t-1} \mid \text{Obs})\Big) \times P(T \mid \text{Obs})$$

---

### 2.3. Ví dụ Chạy Tay Bằng Số (Dry-Run Proof)

Khởi tạo kỹ năng với $P(L_0) = 0.25$, các tham số $P(G) = 0.25$, $P(S) = 0.12$, $P(T \mid \text{Correct}) = 0.08$, $P(T \mid \text{Incorrect}) = 0.03$:

#### Trường hợp 1: Người học trả lời ĐÚNG ($\text{Obs} = \text{Correct}$)
1. Tính xác suất hậu nghiệm:
   $$P(L_0 \mid \text{Correct}) = \frac{0.25 \times (1 - 0.12)}{0.25 \times 0.88 + (1 - 0.25) \times 0.25} = \frac{0.2200}{0.2200 + 0.1875} = \frac{0.2200}{0.4075} \approx 0.5399$$
2. Áp dụng chuyển trạng thái với $P(T \mid \text{Correct}) = 0.08$:
   $$P(L_1) = 0.5399 + (1 - 0.5399) \times 0.08 = 0.5399 + 0.4601 \times 0.08 = 0.5399 + 0.0368 = \mathbf{0.5767}$$
* **Kết quả:** $P(L_t)$ **tăng từ $0.25 \to 0.5767$** ($+32.7$ điểm phần trăm), lên đúng **Tier 2 (PRACTITIONER)**.

#### Trường hợp 2: Người học trả lời SAI ($\text{Obs} = \text{Incorrect}$)
1. Tính xác suất hậu nghiệm:
   $$P(L_0 \mid \text{Incorrect}) = \frac{0.25 \times 0.12}{0.25 \times 0.12 + (1 - 0.25) \times (1 - 0.25)} = \frac{0.0300}{0.0300 + 0.5625} = \frac{0.0300}{0.5925} \approx 0.0506$$
2. Áp dụng chuyển trạng thái với $P(T \mid \text{Incorrect}) = 0.03$:
   $$P(L_1) = 0.0506 + (1 - 0.0506) \times 0.03 = 0.0506 + 0.9494 \times 0.03 = 0.0506 + 0.0285 = \mathbf{0.0791}$$
* **Kết quả:** $P(L_t)$ **giảm từ $0.25 \to 0.0791$** ($-17.1$ điểm phần trăm).
* **Khẳng định tính đúng đắn:** Trả lời sai luôn làm $P(L_t)$ giảm, không lặp lại nghịch lý của mô hình cũ ($P(T)=0.20$ cố định làm $P(L_1) = 0.2116 > 0.20$ khi trả lời sai).

#### Trường hợp 3: Hành trình qua đủ 3 Tier (kiểm chứng không nhảy cóc)

| Sự kiện | $P(L_t)$ | Tier tương ứng (Mục 3.2) |
| :--- | :---: | :--- |
| Bắt đầu | $0.2500$ | Tier 1: NOVICE |
| Đúng lần 1 | $0.5767$ | Tier 2: PRACTITIONER |
| Đúng lần 2 | $0.8413$ | Tier 3: ARCHITECT |
| Đúng lần 3 | $0.9532$ | FAST-TRACK ($\ge 0.92$) |
| *Đang ở $0.90$, sơ suất trượt 1 lần* | $0.6025$ | Tụt 1 bậc về Tier 2, không về sàn |

* Người học phải trả lời đúng **3 lần** cho cùng một kỹ năng, mỗi lần ở một Tier khó hơn, mới được miễn thi kỹ năng đó ở các Node sau.

---

### 2.4. Công thức Suy giảm Trí nhớ Ebbinghaus (Half-Life Decay)

Mức độ làm chủ tri thức suy giảm tự nhiên theo thời gian nếu không được tái kích hoạt:

$$P(L_{\text{current}}) = \max\Big(P(L_0),\; P(L_{\text{last}}) \times 2^{-\frac{\Delta t}{h}}\Big)$$

* $\Delta t$: Thời gian trôi qua kể từ `last_practiced_at` (tính theo ngày).
* $h = 14\text{ ngày}$: Chu kỳ bán rã trí nhớ chuẩn.
* **Sàn suy giảm (Decay Floor):** $P(L_0) = 0.25$ — bỏ bẵng bao lâu cũng chỉ tụt về mức khởi điểm, không về 0. Sàn này chỉ áp cho decay; bước cập nhật BKT vẫn kẹp trong $[0.01, 0.99]$.
* **Tính khi đọc, không ghi đè:** $P(L_{\text{last}})$ là `p_mastery` gốc. Hàm decay là hàm thuần trả về giá trị đã decay, **không** ghi lại vào store — nếu ghi đè mà giữ nguyên `last_practiced_at`, mỗi lần mở app sẽ trừ chồng thêm một lần (lỗi đã sửa).
* **Cảnh báo Trí nhớ Bào mòn (chỉ là lớp hiển thị):** Nếu một node `COMPLETED` có $P_{\text{node}}$ (Mục 3.1, tính trên điểm đã decay) tụt dưới ngưỡng $0.45$:
  $$\max\big(0.25,\; 0.9532 \times 2^{-\frac{30}{14}}\big) = \max(0.25,\; 0.9532 \times 0.2266) = \max(0.25,\; 0.216) = 0.25 < 0.45$$
  Node **giữ nguyên trạng thái `COMPLETED`** nhưng đổi sang viền **VÀNG CAM (Decay Warning)**. Khi người học click vào, enrich-node được gọi với Tier tính từ điểm đã decay để ôn lại kỹ năng yếu nhất.
* Lưu ý: chỉ 1 lần đạt ($0.5767$) sẽ tụt dưới $0.45$ sau khoảng $14 \times \log_2(0.5767/0.45) \approx 5$ ngày — ngưỡng này cố ý nhạy để nhắc ôn sớm.

---

# 3. MA TRẬN ĐIỀU PHỐI ĐỘ KHÓ (3-TIER ESCALATION) & FAST-TRACK AUTO-PASS

### 3.1. Điểm số Đại diện của Node Đa Kỹ năng (Weakest-Link Principle)
Mỗi Node $u$ bao gồm tập hợp kỹ năng $\mathcal{K}_u \subseteq \mathcal{K}$. Điểm đại diện $P_{\text{node}}(u)$ luôn lấy theo **kỹ năng yếu nhất**:

$$P_{\text{node}}(u) = \min_{k \in \mathcal{K}_u} P(L_t, k)$$

*Luận cứ sư phạm:* Hệ thống không nâng độ khó lên cấp Architect khi người học vẫn còn lỗ hổng ở cấp Novice trong cùng một luồng nghiệp vụ.

---

### 3.2. Bảng Phân định 4 Ngưỡng Không Chồng Lấn

| Cấp độ Nhận thức | Ngưỡng Năng lực Toán học | Trọng tâm Câu hỏi Socratic Feynman | Hành vi Hệ thống |
| :--- | :---: | :--- | :--- |
| **Tier 1: NOVICE** | $P_{\text{node}} < 0.45$ | **Data-Flow Tracing:** Truy vết luồng di chuyển của biến số, kiểu dữ liệu DTO, tham số giữa các hàm. | Kích hoạt bộ gợi ý định vị dòng code cơ bản. |
| **Tier 2: PRACTITIONER** | $0.45 \le P_{\text{node}} < 0.75$ | **Design Critique & AI Smells:** Bắt bệnh N+1 Query, thiếu giao dịch Database, vi phạm phân tầng. | Yêu cầu phân tích tác động hệ thống; khuyến khích (không bắt buộc) dùng ẩn dụ đời thường. |
| **Tier 3: ARCHITECT** | $0.75 \le P_{\text{node}} < 0.92$ | **Deep Invariants & Concurrency Edge:** Xoáy sâu vào Race Condition, Deadlock, phá vỡ toàn vẹn dữ liệu đa luồng. | Thử thách phản biện đa chiều ở mức kỹ sư trưởng. |
| **FAST-TRACK AUTO-PASS** | $\forall k \in \mathcal{K}_u, P(L_t, k) \ge 0.92$ | **Miễn thi hoàn toàn (Exempt):** Không cần làm bài tập. | Gắn cờ `is_auto_mastered = true`, đổi màu **XANH LÁ NHẠT**, mở khóa nhánh tiếp theo ($0\text{ Token}, 0\text{ms}$). |

---

### 3.3. Khóa Fast-Track ở Node Trọng Yếu (Capstone Lock — audit Case 4.4)
Trong mỗi đồ thị, node có `cognitive_complexity` cao nhất (hòa ⇒ node có Rank Score cao nhất) **không bao giờ được Auto-Pass**. Người học giỏi vẫn phải trả lời ít nhất một câu hỏi Tier 3 trên repo đó thay vì "3 click là xong".

---

# 4. ĐẶC TẢ GIAO DIỆN HÀM (MODULE INTERFACE CHO NGƯỜI 3 CODE)

Toàn bộ logic toán học của Tầng 5 được đóng gói thành các hàm thuần túy (Pure Functions) trong file `src/lib/bkt-engine.ts`. File này **dùng chung** hai phía: server gọi cả 3 hàm (là nơi **duy nhất** gọi `updateBKTState` và ghi kết quả vào Postgres); client chỉ gọi `getDecayedMastery` / `evaluateNodeTierAndAutoPass` để vẽ viền cam và nhãn Tier. Hàm không đổi khi chuyển từ client lên server vì không đọc/ghi store nào.

```typescript
import { SWESkill, CognitiveSkillState, LearnerCognitiveProfile } from "./types"; // từ 02_DATA_CONTRACTS.md

const P_L0 = 0.25;              // Prior & sàn suy giảm
const MS_PER_DAY = 86_400_000;

export interface NodeEvaluationResult {
  tier: "NOVICE" | "PRACTITIONER" | "ARCHITECT";
  is_auto_pass: boolean;
  representative_score: number;
  weakest_skill: SWESkill | null;  // null khi node không có kỹ năng gán tĩnh
}

/**
 * 1. Hàm THUẦN tính điểm đã suy giảm (Ebbinghaus) — KHÔNG ghi lại vào store
 */
export function getDecayedMastery(
  record: CognitiveSkillState | undefined,
  currentTimestamp: number,
  halfLifeDays: number = 14
): number {
  if (!record || record.last_practiced_at <= 0) return P_L0;
  const deltaDays = Math.max(0, (currentTimestamp - record.last_practiced_at) / MS_PER_DAY);
  const decayed = record.p_mastery * Math.pow(2, -deltaDays / halfLifeDays);
  return Number(Math.max(P_L0, decayed).toFixed(4)); // sàn P(L0) = 0.25
}

/**
 * 2. Hàm đánh giá cấp độ Tier câu hỏi và cờ Fast-Track Auto-Pass cho một Node
 */
export function evaluateNodeTierAndAutoPass(
  preliminarySkills: SWESkill[],
  profile: LearnerCognitiveProfile,
  currentTimestamp: number = Date.now(),
  isCapstone: boolean = false        // Capstone Lock (Mục 3.3)
): NodeEvaluationResult {
  if (preliminarySkills.length === 0) {
    return {
      tier: "NOVICE",
      is_auto_pass: false,
      representative_score: P_L0,
      weakest_skill: null
    };
  }

  // Tìm kỹ năng có điểm năng lực thấp nhất (Nguyên lý Thùng Gỗ), trên điểm ĐÃ DECAY
  let minScore = 1.0;
  let weakestSkill: SWESkill = preliminarySkills[0];
  let allAboveAutoPass = true;

  for (const skill of preliminarySkills) {
    const score = getDecayedMastery(profile.skills[skill], currentTimestamp);
    if (score < 0.92) {
      allAboveAutoPass = false;
    }
    if (score < minScore) {
      minScore = score;
      weakestSkill = skill;
    }
  }

  // Xác định Tier dựa trên 4 ngưỡng không chồng lấn
  let tier: "NOVICE" | "PRACTITIONER" | "ARCHITECT" = "NOVICE";
  if (minScore >= 0.75) {
    tier = "ARCHITECT";
  } else if (minScore >= 0.45) {
    tier = "PRACTITIONER";
  }

  return {
    tier,
    is_auto_pass: !isCapstone && allAboveAutoPass && minScore >= 0.92,
    representative_score: Number(minScore.toFixed(4)),
    weakest_skill: weakestSkill
  };
}

/**
 * 3. Hàm cập nhật trạng thái BKT sau khi nhận kết quả chấm từ Gemini Flash
 */
export function updateBKTState(
  targetSkills: SWESkill[],
  isPassed: boolean,
  profile: LearnerCognitiveProfile,
  currentTimestamp: number = Date.now()
): LearnerCognitiveProfile {
  const BKT_PARAMS = {
    P_G: 0.25,
    P_S: 0.12,
    P_T_CORRECT: 0.08,
    P_T_INCORRECT: 0.03
  };

  const updatedSkills = { ...profile.skills };

  targetSkills.forEach(skill => {
    const currentRecord: CognitiveSkillState = updatedSkills[skill] ?? {
      skill,
      p_mastery: P_L0,
      last_practiced_at: currentTimestamp,
      practice_count: 0,
      correct_count: 0
    };

    // Prior của lần cập nhật = điểm đã decay tại thời điểm nộp bài (quên rồi thì học lại từ mức đã quên)
    const pL = getDecayedMastery(currentRecord, currentTimestamp);
    let posterior = 0;

    if (isPassed) {
      // Công thức Posterior khi Đúng
      const numerator = pL * (1 - BKT_PARAMS.P_S);
      const denominator = numerator + (1 - pL) * BKT_PARAMS.P_G;
      posterior = denominator > 0 ? numerator / denominator : pL;
    } else {
      // Công thức Posterior khi Sai
      const numerator = pL * BKT_PARAMS.P_S;
      const denominator = numerator + (1 - pL) * (1 - BKT_PARAMS.P_G);
      posterior = denominator > 0 ? numerator / denominator : pL;
    }

    // Bước Transition phân nhánh theo kết quả quan sát
    const pTransit = isPassed ? BKT_PARAMS.P_T_CORRECT : BKT_PARAMS.P_T_INCORRECT;
    const newPL = posterior + (1 - posterior) * pTransit;

    updatedSkills[skill] = {
      skill,
      p_mastery: Math.max(0.01, Math.min(0.99, Number(newPL.toFixed(4)))),
      last_practiced_at: currentTimestamp,
      practice_count: currentRecord.practice_count + 1,
      correct_count: currentRecord.correct_count + (isPassed ? 1 : 0)
    };
  });

  return {
    ...profile,
    last_updated_at: currentTimestamp,
    skills: updatedSkills
  };
}
```
