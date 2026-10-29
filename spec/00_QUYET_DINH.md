# 00 — NHẬT KÝ QUYẾT ĐỊNH & CÂU HỎI MỞ

> **Vai trò của file:** đây là nơi **duy nhất** ghi trạng thái "đã chốt / đang mở / mặc định chờ xác nhận". Các file khác trong `spec/` viết ở dạng quy phạm (đã quyết), không ghi "đề xuất".
> Khi một quyết định đổi: sửa dòng D-xx ở đây trước, rồi sửa file spec được trỏ tới.
> Cập nhật lần cuối: **28/10/2026** (hợp nhất spec, thay toàn bộ tài liệu cũ — xem `archive/2026-10-28_truoc-hop-nhat/`).

---

## 1. Quyết định đã chốt (D-xx)

| ID | Quyết định | Áp dụng ở |
| :-- | :-- | :-- |
| **D-01** | **Mô hình học theo thiết kế "03_VI_DU" (28/10/2026).** AI chạy ở **4 lời gọi**: `analyze-node` (1 lần / node / phiên bản repo, cache dùng chung mọi người học), `analyze-overview` (1 lần / phiên bản repo), `enrich-node` (chỉ đặt câu hỏi), `evaluate-feynman` (chấm). Tab 1 hiện **cả điểm hay lẫn điểm dở**, điểm dở gắn nhãn "Nhận định của AI". Mỗi node hỏi **1 câu cho mỗi kỹ năng chưa thạo** (< `FAST_TRACK_MIN`), mỗi câu có 4 góc hỏi `focus`, thang 3 nấc gợi ý riêng và **1 lần cập nhật BKT riêng**. Node XANH khi mọi câu đạt, ĐỎ khi ≥ 1 câu trượt. Đáp án = `reference_answer` + `must_have_points` + `fix`. Bỏ `hidden_challenge`. Kỹ năng do AI gắn kèm bằng chứng, code kiểm. | `01`, `02`, `20`, `21`, `22`, `30` |
| **D-02** | **Server là nguồn chân lý duy nhất của tiến độ học.** Lập kế hoạch câu hỏi (`planNodeQuestions`), BKT, Fast-Track, đếm lượt, mở khóa, quyết định mở đáp án đều chạy ở server, đọc/ghi Postgres. Trình duyệt chỉ gửi `{ session_id, node_id }` và hiển thị bản sao chỉ đọc. Ngoại lệ duy nhất: chế độ Offline (`Ctrl+Shift+D`) chạy `bkt-engine` trên trình duyệt, không ghi Postgres. | `01`, `03`, `22`, `30` |
| **D-03** | **Chấp nhận toàn bộ đề xuất còn chờ của 03_VI_DU:** #1 regex chống tấn công chỉ bắt mẫu *câu lệnh* · #6 bỏ câu dự phòng AST (câu hỏng ⇒ gọi lại 1 lần ⇒ bỏ câu đó; hỏng hết ⇒ nút "Thử lại") · #9 AI lỗi khi chấm ⇒ không tính lượt; hết quota ⇒ khóa nộp, báo rõ · #15 nút **"Bỏ qua câu này"** ⇒ `FAILED` cho kỹ năng của câu đó · #17 chấp nhận cache câu hỏi dùng chung cho demo · #19 viền cam chỉ khi điểm gốc ≥ 0.45 **và** điểm đã decay < 0.45 · #20 phân tích lỗi ⇒ node giữ VÀNG + "Thử lại phân tích", node con mở kèm tam giác · #21 chốt tên = whitelist ∪ tên trong code của node ∪ tên file repo · #22 bỏ tải ngầm (prefetch) · #23 tối đa 1 điểm dở / kỹ năng · #24 từ cấm so theo **tên gói**, quét **nguyên từ** · #25b nút **"Báo sai"** · #25d AI trích câu của người học cho từng ý bắt buộc, code kiểm đoạn trích có thật. | `20`, `21`, `22`, `30` |
| **D-04** | **Phạm vi phải chạy lúc 09g00 01/11 = toàn bộ spec**: lõi học (🟢 cũ), tầng lưu trữ (khách ẩn danh, liên kết GitHub, mở lại phiên theo commit SHA, sync receipt, persona demo, lịch sử học) và Language Registry theo `10`/`11`. Các luồng ôn (ôn node đỏ, ôn khi phai, Relaxed Mode, nhiều phiên bản câu hỏi, câu thứ 2 cho NOVICE, xoáy ý hổng) được đặc tả đủ để code, xếp sau lõi trong hàng đợi build. `40_KE_HOACH_21H.md` có **thứ tự cắt dự phòng** chỉ dùng khi trễ mốc giờ. | `40` |
| **D-05** | **Tài liệu hợp nhất thành `spec/` (để code) + `pitch/` (để thuyết trình).** File cũ chuyển nguyên vẹn vào `archive/2026-10-28_truoc-hop-nhat/`, không còn là căn cứ. | toàn repo |

---

## 2. Mặc định do audit 28/10 đặt (đã ghi vào spec — người phụ trách xác nhận trước **30/10**)

Những chỗ spec cũ bỏ trống hoặc mâu thuẫn. Spec mới đã viết theo mặc định dưới đây; muốn đổi thì sửa ở đây rồi sửa file đích.

| ID | Mặc định | Lý do ngắn | File | Xác nhận |
| :-- | :-- | :-- | :-- | :-- |
| **D-06** | **Định nghĩa node:** 1 node = 1 lát cắt mở đầu bằng **1 hàm entry đã đăng ký** (route handler / controller method / command / screen). Đi xuôi đồ thị gọi hàm tối đa `SLICE_MAX_HOPS` bước; **1 step = 1 hàm** được giữ; layer gán theo luật cố định (entry ⇒ `ENTRY_POINT`; hàm đăng ký làm middleware của route ⇒ `MIDDLEWARE`; hàm nằm trong file vai trò repository/dao/model, hoặc tự gọi DATA_SINK mà không qua hàm repository nào trong repo ⇒ `DATA_ACCESS`; còn lại ⇒ `BUSINESS_LOGIC` — `11` ENG-82). Hàm VIP (độ phức tạp > `VIP_COMPLEXITY_MIN`) chưa thuộc lát cắt nào ⇒ node `ALGORITHMIC_CORE`. | Spec cũ dựng node từ file Hub, mâu thuẫn bất biến "node không bao giờ là 1 file" | `11` | Người 2 |
| **D-07** | **Cạnh giữa các node:** A → B khi lát cắt A và B **dùng chung ≥ 1 hàm** và A "dễ hơn" B (độ phức tạp nhỏ hơn; hòa ⇒ Rank Score lớn hơn; hòa ⇒ `id` tăng dần); sau đó rút gọn bắc cầu (transitive reduction). Node không chung hàm với ai là gốc. | Spec cũ không nói cạnh lấy từ đâu; mở khóa và BKT phụ thuộc vào nó | `11` | Người 2 |
| **D-08** | **`node.id` tất định:** `slice-<slug(title)>-<hash6(entry_symbol_key)>`, `algo-<slug>-<hash6>`, `vroot-algorithms`, `vnode-<hash6(file_path + "#" + nhãn chặng)>` (1 file sinh nhiều chặng `PROCEDURAL`). `hash6` = 6 ký tự hex đầu của SHA-1. | Resume theo commit SHA cần id ổn định; `vnode-<basename>` cũ trùng khi 2 file cùng tên | `11` | Người 2 |
| **D-09** | **Hub chỉ được bầu trong tập file Ingress**; PageRank chỉ dùng để xếp hạng lát cắt. | Tự tính PageRank chuỗi Controller → Service → Repository hội tụ về 0.184 / 0.341 / **0.474**: Repository vượt lên làm Hub | `11` | Người 2 |
| **D-10** | **Engine tất định tuyệt đối:** bỏ việc cắt file theo thời gian chạy (`ENGINE_BUDGET_MS` chỉ còn là ngưỡng cảnh báo); `ARCHIVE_HASH` băm **toàn bộ** buffer; thêm `engine_version` vào kết quả, khóa cache và `learning_sessions`. Phiên tạo bằng `engine_version` khác ⇒ chỉ xem lịch sử, không học tiếp. | Spec cũ cắt file theo đồng hồ ⇒ cùng repo ra đồ thị khác ⇒ mất khớp `node_id` | `02`, `03`, `10`, `11` | Người 2 |
| **D-11** | **Thử ref theo thứ tự ngắn → dài** (tối đa `MAX_REF_CANDIDATES`). | Thử dài → ngắn với trần 4 lần thì link sâu không bao giờ tới được `main` | `10` | Người 2 |
| **D-12** | **`cognitive_complexity` của node = max** độ phức tạp các hàm trong lát cắt. **Capstone** = node có `cognitive_complexity` lớn nhất (hòa ⇒ Rank Score lớn nhất ⇒ `id` nhỏ nhất); đúng 1 Capstone / đồ thị; trường `is_capstone` nằm trên `HybridArchitecturalNode`. | Spec cũ không có công thức và không có trường | `02`, `11`, `22` | Người 2, 3 |
| **D-13** | **Luật Đạt** = `core_accuracy ≥ PASS_CORE_ACCURACY` **và** `intent = "ANSWER"` **và** mọi `must_have_points` được AI đánh dấu `covered` kèm đoạn trích **có thật** trong câu trả lời (so sau chuẩn hóa). AI đánh dấu `covered` mà đoạn trích không có thật ⇒ ý đó tính là chưa có. | Cụ thể hóa #25d; `must_have_points` là ý **bắt buộc** | `20`, `21` | Người 3 |
| **D-14** | **`challenge_token` mang theo đoạn code các bước liên quan** (`code_context`, đã che secret), gắn `session_id` + `user_id` + `run_id`, có hạn `exp`. Chấm bài không cần cache RAM. | Giải CẤN #2 của 03_VI_DU (cache 10 phút / 1 máy chủ) mà không lưu code xuống đĩa | `02`, `03` | Người 1, 3 |
| **D-15** | **Cache AI lưu ở Postgres** (bảng `ai_cache`: bản phân tích, tổng quan, câu hỏi). Chỉ chứa văn bản AI **đã qua kiểm** (có thể chứa tên hàm/biến), **không** chứa `snippet` hay file code. Client không có quyền đọc bảng này. | Cache dùng chung giữa nhiều người học, không mất khi khởi động lại | `03` | Người 1 |
| **D-16** | **Tiến độ lưu theo lượt học (`node_runs`)**: mỗi lần học / ôn một node là 1 run có kế hoạch câu hỏi cố định; kết quả từng câu nằm trong run; mọi lần nộp ghi vào `question_attempts`. Bỏ `node_progress.retry_count` chung và chuyển trạng thái `FAILED → AVAILABLE`. | Mỗi node nhiều câu; chuyển FAILED → AVAILABLE cũ khóa ngược node con | `03` | Người 1 |
| **D-17** | **Sync receipt chỉ phát khi server đã đọc được trạng thái** (bước kiểm trước khi gọi AI thành công) mà bước ghi thất bại. Postgres sập ngay từ đầu ⇒ `ERR_PERSISTENCE_UNAVAILABLE`, không gọi AI. | Spec cũ phát receipt cả khi không đọc được số lượt ⇒ mở lại lỗ hổng xem đáp án sớm | `03` | Người 1 |
| **D-18** | **Thứ tự `evaluate-feynman`:** kiểm tra (không khóa) ⇒ gọi AI ⇒ transaction khóa run + kiểm lại số lượt ⇒ ghi. Lệch số lượt ở bước khóa ⇒ `ERR_ATTEMPT_OUT_OF_SYNC`, bỏ kết quả chấm. | Spec cũ gọi AI trước khi kiểm trạng thái (tốn token) và khóa dòng chưa tồn tại | `03` | Người 1 |
| **D-19** | **Whitelist symbol ở phạm vi repo** (`symbol_whitelist` của `StaticEngineResult`). Chốt tên dùng whitelist ∪ tên trong code của node ∪ `file_index`. | Spec cũ mâu thuẫn repo / lát cắt | `11`, `21` | Người 2, 3 |
| **D-20** | **`overall_tier`** (chỉ để hiển thị) = tier của **trung bình** điểm đã decay trên các kỹ năng có `practice_count > 0`; chưa luyện kỹ năng nào ⇒ `NOVICE`. Tier ≥ `FAST_TRACK_MIN` vẫn hiển thị `ARCHITECT`. | Spec cũ có trường mà không có công thức, và bỏ hở khoảng ≥ 0.92 | `22` | Người 3 |
| **D-21** | **Thêm persona `SENIOR_ACTIVE`** (P = 0.95, 0 ngày nghỉ) để demo Fast-Track. `SENIOR_RUSTY` (0.95, 30 ngày) decay về 0.4085 nên không bao giờ Fast-Track. | Không persona nào cũ minh họa được Fast-Track | `02`, `03` | Người 1 |
| **D-22** | **Báo sai (#25b):** chỉ dùng cho câu có kết quả `FAILED`. Hệ quả: câu chuyển 🚩; nếu `p_mastery` hiện tại của kỹ năng vẫn đúng bằng giá trị câu đó đã ghi thì hoàn lại giá trị trước; node tính lại màu bỏ qua câu 🚩. Ghi log cho nhóm. | Cụ thể hóa #25b | `03`, `22` | Người 1, 3 |
| **D-23** | **Prompt chấm luôn nhận** `feynman_question`, `reference_answer`, `must_have_points`, `code_context`, các bước, số lần nộp hiện tại và câu trả lời. Mọi lời gọi AI dùng **responseSchema** JSON cố định. | Prompt chấm cũ không nhận câu hỏi và không có schema | `20` | Người 3 |
| **D-24** | **Node gom nhóm `vroot-*` chỉ để hiển thị** (`is_group_root = true`): không có `trace_steps`, không phân tích, không học, không tính vào Display Budget, không nằm trong `prerequisites` của node khác (node con của nó là node gốc). Node ảo `vnode-*` của chế độ `PROCEDURAL` có code thật ⇒ học như node thường. | Node không có code thì không phân tích được ⇒ không có cách thông node con | `02`, `11`, `30` | Người 2 |
| **D-25** | **Câu ôn không trúng lại câu đã lộ đáp án:** với `REMEDIATION` / `DECAY_REVIEW`, khóa cache câu hỏi có biến thể `|v{n}` (n ≥ 2); server dùng biến thể đầu tiên mà câu hỏi chưa từng hiện cho người học (cùng node, cùng kỹ năng — `20` AI-24), gặp khóa chưa có thì sinh câu mới vào khóa đó. | Giải câu hỏi mở cũ Q-06 | `03` Mục 3.3, `20` AI-22 | Người 3 |
| **D-26** | **Phiên GitHub rơi về `ARCHIVE_HASH`** (comment EOCD không có SHA): khi cache RAM trượt, tải lại zip theo `ref_label` và so SHA-256 toàn bộ buffer; khớp ⇒ mở lại bình thường; lệch ⇒ `ERR_SESSION_SOURCE_EXPIRED` với thông điệp "repo đã thay đổi kể từ lần học trước". Không bắt người học upload zip cho nguồn GitHub. | Trải nghiệm cũ bắt upload zip cho repo GitHub | `03` Mục 4 | Người 1 |

---

## 3. Câu hỏi mở (Q-xx) — không chặn việc code, có người chịu trách nhiệm và hạn

| ID | Câu hỏi | Người | Hạn | Mặc định nếu chưa trả lời |
| :-- | :-- | :-- | :-- | :-- |
| **Q-01** | **Model AI.** Ghi nhận cũ: `gemini-2.5-flash` trả lỗi 404 với API key của nhóm; `gemini-3.5-flash-lite` chạy được qua Gemini CLI. Cần đo: giới hạn free tier (lượt/phút, lượt/ngày), độ trễ, kết quả bộ duyệt tay (`21` Mục 6). | Người 3 | 30/10 | Code đọc `CONFIG.LLM_MODEL`; đổi model = đổi 1 hằng số + duyệt tay lại |
| **Q-02** | **Hỏi BTC buổi họp 30/10:** (a) sau 09g00 01/11 có được commit tiếp tới chung kết 15/11 không; (b) mỗi đội thuyết trình bao nhiêu phút; (c) có được mang tài liệu spec / prompt vào phòng thi không; (d) có được dùng trợ lý AI khi code không. | Người 1 | 30/10 | Giả định (a) không, (b) 5 phút, (c) có, (d) có |
| **Q-03** | **Repo demo thật** (thay repo minh họa `shop-api`). Tiêu chí: public, TS/JS Express hoặc NestJS, 20–50 file code, có ≥ 1 điểm dở rõ (truy vấn trong vòng lặp / thiếu transaction / secret viết thẳng), ≤ 15 MB nén. | Cả nhóm | 30/10 | Dùng repo mẫu tự viết theo `50_TEST_VA_FIXTURE.md` Mục 1, đẩy lên GitHub cá nhân trước giờ thi (đây là repo **dữ liệu demo**, không phải code sản phẩm) |
| **Q-04** | Người 2 xác nhận D-06 … D-12 sau khi chạy tay trên repo demo. | Người 2 | 30/10 | Giữ mặc định |
| **Q-05** | Bảng giá token của model chốt ở Q-01 (để tính lại chi phí / phiên trong `02` Mục CONFIG — "Mục tiêu & ước lượng"). | Người 3 | 30/10 | Giữ ước lượng theo giá Gemini 2.5 Flash, ghi rõ "ước lượng" |
| **Q-06** | *(Đã đóng bằng D-25: câu ôn trùng câu đã lộ đáp án.)* | — | — | — |
| **Q-07** | Capstone khi mọi kỹ năng đã thạo: hỏi kỹ năng yếu nhất theo điểm đã decay (hòa ⇒ ít luyện hơn ⇒ thứ tự bản phân tích), không ưu tiên kỹ năng có điểm dở — xác nhận? Câu `ARCHITECTURE` gửi thêm bước 1 (entry) — xác nhận? | Người 3 | 30/10 | Giữ như `22` |
| **Q-08** | Ôn khi phai trượt làm viền cam biến mất, bản đồ không còn dấu hiệu (chỉ thấy ở Tab 2 / lịch sử). Có cần dấu nhỏ trên node không? | Người 1 | 30/10 | Không thêm (D-03 #19) |
| **Q-09** | Tài khoản GitHub đã gắn với một tài khoản khác khi khách bấm "Lưu tiến độ bằng GitHub": gộp tiến độ khách hay chuyển tài khoản? Có nút "Đăng xuất" cho tài khoản GitHub không? | Người 1 | 30/10 | Không gộp: báo lỗi, giữ tài khoản khách; không có nút đăng xuất |

---

## 4. Đối chiếu danh sách "CẤN" của 03_VI_DU

| # | Trạng thái | Xử lý ở |
| :-: | :-- | :-- |
| 1 | Chốt (D-03) | `21` Mục regex |
| 2 | Giải bằng D-14 + D-15 + `getOrRebuildStaticResult` | `03` |
| 3 | Giải: contract đủ request/response mọi endpoint | `02` |
| 4 | Ôn node đỏ = run `REMEDIATION` | `22`, `03` |
| 5 | Ôn khi phai = run `DECAY_REVIEW`, không đổi màu node | `22`, `03` |
| 6 | Chốt (D-03) | `20`, `21` |
| 7 | Chốt: từ cấm quét cả `reference_answer`, `must_have_points`, `fix` | `21` |
| 8 | Chốt: server xóa `misconception`; server trả về theo **danh sách trường cho phép** | `03` |
| 9 | Chốt (D-03) | `03`, `20` |
| 10 | Giải: mỗi câu đúng 1 `skill` | `02` |
| 11 | Chốt: nhặt tên trong dấu `` ` `` ở mọi đoạn chữ | `21` |
| 12 | Chốt | `02` |
| 13 | Chốt (D-01) | `20`, `30` |
| 14 | Giữ "QUY TẮC FEEDBACK" | `20` |
| 15, 17, 19–25 | Chốt (D-03, D-13, D-22) | `20`, `21`, `22`, `30` |
| 16, 18 | Không còn (bỏ `hidden_challenge`) | — |
| 26 | Chốt: 4 góc `FLOW` / `ARCHITECTURE` / `WEAKNESS` / `CHANGE` | `22` |
| 27 | Đặc tả, bật bằng cờ `CONFIG.NOVICE_SECOND_QUESTION` (mặc định `false`) | `22` |
| 28 | Đặc tả, bật bằng cờ `CONFIG.GAP_TARGETING` (mặc định `false`) | `22` |

---

## 5. Tóm tắt audit 28/10 (vì sao phải hợp nhất)

Audit đọc từng dòng 19 file tài liệu cũ (≈ 825 KB). Ba nhóm lỗi chính, đều đã xử lý trong `spec/`:

1. **Ba thiết kế chấm điểm / BKT cùng tồn tại** (v1.1 server-side; thang gợi ý cho client tự tính BKT; thiết kế 03_VI_DU) và **hai lược đồ DB** (`04_LUU_TRU` vs `02_BAYES §5` có ghi chú "lưu localStorage"). ⇒ D-01, D-02, D-15, D-16.
2. **Engine thiếu định nghĩa cốt lõi:** node dựng từ file Hub (trái bất biến), không có luật `node.id` và cạnh, 7 trường contract không có thuật toán sinh, engine không tất định, PageRank bầu Repository làm Hub. ⇒ D-06 … D-12.
3. **Luồng gãy & lỗ hổng:** ôn node đã xanh bị chặn, "ôn lại" khóa ngược node con, viền cam bật ngay sau khi đạt, gọi AI trước khi kiểm trạng thái, khóa dòng chưa tồn tại, token không có hạn và không gắn phiên, sync receipt không chạy được khi DB sập, prompt chấm không nhận câu hỏi, câu dự phòng AST không chấm được, gác tên tin danh sách do AI tự khai, từ cấm so chuỗi con. ⇒ D-13, D-14, D-17, D-18, D-19, D-23 và D-03.

Ngoài ra: số liệu trôi giữa các file (quota 10k / 50k / 80k; Fast-Track 0.85 / 0.92; 3 nơi dùng công thức decay cũ; temperature 0 / 0.1 / 0.2) ⇒ gom về **một bảng `CONFIG`** trong `02_CONTRACTS.md`. Lỗi tính toán đã sửa: bảng "Case 4" của BKT cũ (chuỗi đúng, tính không làm tròn giữa chừng: 0.25 → 0.4202 → 0.5957 → 0.7439 → 0.8495), Trace C của 03_VI_DU bỏ qua node tiên quyết.
