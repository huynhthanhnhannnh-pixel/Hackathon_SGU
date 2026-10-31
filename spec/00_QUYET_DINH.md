# 00 — NHẬT KÝ QUYẾT ĐỊNH & CÂU HỎI MỞ

> Nơi **duy nhất** ghi trạng thái "đã chốt / đang mở / chờ chốt". Các file khác trong `spec/` viết ở dạng quy phạm (đã quyết), không ghi "đề xuất". Cả nhóm đọc.
> File này không có code. Kiểu ở `02_CONTRACTS.md`, hằng số ở bảng `CONFIG` của file đó.
> Cập nhật lần cuối: **31/10/2026**.

## Đọc nhanh

- **Mục 1 — Quyết định đang có hiệu lực:** gồm mọi D chưa hủy, xếp theo mã tăng dần (D-01 … D-10, D-12, D-13, D-15, D-16, D-18 … D-20, D-22 … D-24, D-27 … D-52). Viết thẳng theo nội dung hiện hành, không giữ chữ cũ đã bị bãi bỏ.
- **Mục 2 — Chờ chốt:** hiện không còn quyết định nào.
- **Mục 3 — Câu hỏi còn mở:** Q-03, Q-10, Q-13. Không chặn việc code; có người chịu trách nhiệm và mặc định nếu chưa trả lời.
- **Mục 4 — Lịch sử:** các D đã hủy hoặc thay thế (D-11, D-14, D-17, D-21, D-25, D-26) và các câu hỏi đã đóng (Q-01, Q-02, Q-04 … Q-09, Q-11, Q-12).
- **Đổi một quyết định:** sửa dòng D-xx ở file này trước, rồi mới sửa file đích (cột "Áp dụng ở").

| Mục | Nội dung | File được trỏ tới |
| :-: | :-- | :-- |
| 1 | Quyết định đang có hiệu lực (46 quyết định) | `01`, `02`, `03`, `04`, `10`, `11`, `20`, `21`, `22`, `30`, `50`, `doc-de-hieu/`, `pitch/` |
| 2 | Chờ chốt (không còn) | — |
| 3 | Câu hỏi còn mở (Q-03, Q-10, Q-13) | `02`, `50` |
| 4 | Lịch sử (6 D đã hủy/thay thế, 10 Q đã đóng) | — |

---

## 1. Quyết định đang có hiệu lực (D-xx)

| Mã | Quyết định | Áp dụng ở |
| :-- | :-- | :-- |
| **D-01** | **Mô hình học theo thiết kế "03_VI_DU" (28/10/2026):**<br>• AI chạy ở **4 lời gọi**: `analyze-node` (1 lần / node / phiên bản repo, cache dùng chung mọi người học), `analyze-overview` (1 lần / phiên bản repo), `enrich-node` (chỉ đặt câu hỏi), `evaluate-feynman` (chấm).<br>• Tab 1 hiện **cả điểm hay lẫn điểm dở**; điểm dở gắn nhãn "Nhận định của AI".<br>• Mỗi node hỏi **1 câu cho mỗi kỹ năng chưa thạo**; nếu mọi kỹ năng đã thạo vẫn hỏi 1 câu cho kỹ năng có điểm thấp nhất của node.<br>• Mỗi câu có 4 góc hỏi `focus`, thang 3 nấc gợi ý riêng và **1 lần cập nhật BKT riêng**.<br>• Node XANH khi mọi câu đạt, ĐỎ khi ≥ 1 câu trượt.<br>• Đáp án = `reference_answer` + `must_have_points` + `fix`. Bỏ `hidden_challenge`.<br>• Kỹ năng do AI gắn kèm bằng chứng, code kiểm. | `01`, `02`, `20`, `21`, `22`, `30` |
| **D-02** | **Server là nguồn chân lý duy nhất của tiến độ học:**<br>• Lập kế hoạch câu hỏi (`planNodeQuestions`), BKT, đếm lượt, mở khóa, quyết định mở đáp án đều chạy ở server, đọc/ghi Postgres.<br>• Trình duyệt chỉ gửi `{ session_id, node_id }` và hiển thị bản sao chỉ đọc.<br>• Ngoại lệ duy nhất: chế độ Offline (`Ctrl+Shift+D`) chạy `bkt-engine` trên trình duyệt, không ghi Postgres. | `01`, `03`, `22`, `30` |
| **D-03** | **Chấp nhận các đề xuất của 03_VI_DU:**<br>• #1 regex chống tấn công chỉ bắt mẫu *câu lệnh*.<br>• #6 bỏ câu dự phòng AST (câu hỏng ⇒ gọi lại 1 lần ⇒ bỏ câu đó; hỏng hết ⇒ nút "Thử lại").<br>• #9 AI lỗi khi chấm ⇒ không tính lượt; hết quota ⇒ khóa nộp, báo rõ.<br>• #15 nút **"Bỏ qua câu này"** ⇒ `FAILED` cho kỹ năng của câu đó.<br>• #20 phân tích lỗi ⇒ node giữ VÀNG + "Thử lại phân tích", node con mở kèm tam giác.<br>• #21 chốt tên = whitelist ∪ tên trong code của node ∪ tên file repo.<br>• #23 tối đa 1 điểm dở / kỹ năng.<br>• #24 từ cấm so theo **tên gói**, quét **nguyên từ**.<br>• #25b nút **"Báo sai"**.<br>• #25d AI trích câu của người học cho từng ý bắt buộc, code kiểm đoạn trích có thật. | `20`, `21`, `22`, `30` |
| **D-04** | **Phạm vi phải chạy ở vòng 2 = toàn bộ spec:**<br>• Lõi học.<br>• Tầng lưu trữ: đăng nhập GitHub, mở lại phiên theo commit SHA, persona demo, lịch sử học.<br>• Language Registry theo `10`/`11`.<br>• Relaxed Mode và câu thứ 2 cho NOVICE được đặc tả đủ để code, xếp sau lõi trong hàng đợi build.<br>• `doc-de-hieu/07_ke_hoach_21h.md` có **thứ tự cắt dự phòng** chỉ dùng khi trễ mốc giờ. | `doc-de-hieu/07` |
| **D-05** | **Tài liệu hợp nhất thành `spec/` (để code) + `pitch/` (để thuyết trình).**<br>File cũ chuyển nguyên vẹn vào `archive/2026-10-28_truoc-hop-nhat/`, không còn là căn cứ. | toàn repo |
| **D-06** | **Định nghĩa node:** 1 node = 1 lát cắt mở đầu bằng **1 hàm entry đã đăng ký** (route handler / controller method / command / screen).<br>• Đi xuôi đồ thị gọi hàm tối đa `SLICE_MAX_HOPS` bước; **1 step = 1 hàm** được giữ.<br>• Layer gán theo luật cố định (`11` ENG-82):<br>– entry ⇒ `ENTRY_POINT`;<br>– hàm đăng ký làm middleware của route ⇒ `MIDDLEWARE`;<br>– hàm nằm trong file vai trò repository/dao/model, hoặc tự gọi DATA_SINK mà không qua hàm repository nào trong repo ⇒ `DATA_ACCESS`;<br>– còn lại ⇒ `BUSINESS_LOGIC`.<br>• Hàm VIP (độ phức tạp > `VIP_COMPLEXITY_MIN`) chưa thuộc lát cắt nào ⇒ node `ALGORITHMIC_CORE`. | `11` |
| **D-07** | **Cạnh giữa các node:** A → B khi lát cắt A và B **dùng chung ≥ 1 hàm** và A "dễ hơn" B.<br>• A "dễ hơn" B: độ phức tạp nhỏ hơn; hòa ⇒ Rank Score lớn hơn; hòa ⇒ `id` tăng dần.<br>• Sau đó rút gọn bắc cầu (transitive reduction).<br>• Node không chung hàm với ai là gốc. | `11` |
| **D-08** | **`node.id` tất định:**<br>• `slice-<slug(title)>-<hash6(entry_symbol_key)>`<br>• `algo-<slug>-<hash6>`<br>• `vroot-algorithms`<br>• `vnode-<hash6(file_path + "#" + nhãn chặng)>` (1 file sinh nhiều chặng `PROCEDURAL`)<br>• `hash6` = 6 ký tự hex đầu của SHA-1. | `11` |
| **D-09** | **Hub chỉ được bầu trong tập file Ingress**; PageRank chỉ dùng để xếp hạng lát cắt. | `11` |
| **D-10** | **Engine tất định tuyệt đối:**<br>• Bỏ việc cắt file theo thời gian chạy (`ENGINE_BUDGET_MS` chỉ còn là ngưỡng cảnh báo).<br>• `ARCHIVE_HASH` băm **toàn bộ** buffer.<br>• Thêm `engine_version` vào kết quả, khóa cache và `learning_sessions`.<br>• Phiên tạo bằng `engine_version` khác ⇒ chỉ xem lịch sử, không học tiếp. | `02`, `03`, `10`, `11` |
| **D-12** | **`cognitive_complexity` của node = max** độ phức tạp các hàm trong lát cắt.<br>**Capstone** = node có `cognitive_complexity` lớn nhất (hòa ⇒ Rank Score lớn nhất ⇒ `id` nhỏ nhất); đúng 1 Capstone / đồ thị.<br>Trường `is_capstone` nằm trên `HybridArchitecturalNode`. | `02`, `11`, `22` |
| **D-13** | **So khớp lỏng và luật Đạt:**<br>• Đoạn AI trích chỉ cần là đoạn con có trong câu trả lời sau chuẩn hóa.<br>• **Luật Đạt** = `core_accuracy ≥ PASS_CORE_ACCURACY` **và** `intent = "ANSWER"` **và** mọi `must_have_points` được AI đánh dấu `covered` kèm đoạn trích **có thật** trong câu trả lời (so sau chuẩn hóa).<br>• AI đánh dấu `covered` mà đoạn trích không có thật ⇒ ý đó tính là chưa có. | `20`, `21` |
| **D-15** | **Cache AI lưu ở Postgres** (bảng `ai_cache`: bản phân tích node và tổng quan; không cache câu hỏi, chấm bài không cache).<br>Chỉ chứa văn bản AI **đã qua kiểm** (có thể chứa tên hàm/biến), **không** chứa `snippet` hay file code.<br>Client không có quyền đọc bảng này. | `03`, `20` |
| **D-16** | **Tiến độ lưu theo lượt học (`node_runs`):**<br>• Mỗi lần học một node là 1 run có kế hoạch câu hỏi cố định.<br>• Kết quả từng câu nằm trong run; mọi lần nộp ghi vào `question_attempts`.<br>• Bỏ `node_progress.retry_count` chung và chuyển trạng thái `FAILED → AVAILABLE`. | `03` |
| **D-18** | **Thứ tự `evaluate-feynman`:** kiểm tra (không khóa) ⇒ gọi AI ⇒ transaction khóa run + kiểm lại số lượt ⇒ ghi.<br>Lệch số lượt ở bước khóa ⇒ `ERR_ATTEMPT_OUT_OF_SYNC`, bỏ kết quả chấm. | `03` |
| **D-19** | **Whitelist symbol ở phạm vi repo** (`symbol_whitelist` của `StaticEngineResult`).<br>Chốt tên dùng whitelist ∪ tên trong code của node ∪ `file_index`. | `11`, `21` |
| **D-20** | **`overall_tier`** (chỉ để hiển thị) = tier của **trung bình** điểm đã decay trên các kỹ năng có `practice_count > 0`.<br>Chưa luyện kỹ năng nào ⇒ `NOVICE`.<br>Tier ≥ `FAST_TRACK_MIN` vẫn hiển thị `ARCHITECT`. | `22` |
| **D-22** | **Báo sai:** chỉ dùng cho câu có kết quả `FAILED`.<br>Hệ quả:<br>• Câu chuyển 🚩.<br>• Nếu `p_mastery` hiện tại của kỹ năng vẫn đúng bằng giá trị câu đó đã ghi thì hoàn lại giá trị trước.<br>• Node tính lại màu bỏ qua câu 🚩.<br>Ghi log cho nhóm. | `03`, `22` |
| **D-23** | **Prompt chấm luôn nhận** `feynman_question`, `reference_answer`, `must_have_points`, các bước, số lần nộp hiện tại và câu trả lời (không nhận `code_context`).<br>Mọi lời gọi AI dùng **responseSchema** JSON cố định. | `20` |
| **D-24** | **Node gom nhóm `vroot-*` chỉ để hiển thị** (`is_group_root = true`):<br>• không có `trace_steps`;<br>• không phân tích, không học;<br>• không tính vào Display Budget;<br>• không nằm trong `prerequisites` của node khác (node con của nó là node gốc).<br>Node ảo `vnode-*` của chế độ `PROCEDURAL` có code thật ⇒ học như node thường. | `02`, `11`, `30` |
| **D-27** | **Host = Vercel (gói free), region `sin1`.**<br>• Cache RAM chỉ giúp nhanh hơn, **không được dựa vào**: mất cache ⇒ tải lại zip theo commit SHA + chạy lại engine (`03` Mục 4).<br>• Upload zip bị Vercel chặn theo giới hạn body ⇒ `CONFIG.MAX_UPLOAD_BYTES`; link GitHub không bị chặn.<br>• Bỏ Railway. | `02`, `03` API-08, `04`, `10` |
| **D-28** | **Logging:** Pino xuất JSON 1 dòng ra stdout (Vercel thu log); cấu hình `serverExternalPackages: ['pino']` trong `next.config.ts`; cấm ghi mã nguồn, snippet, bí mật, token, câu trả lời người học. | `04` |
| **D-29** | **Monitoring:** log + Observability có sẵn của Vercel + dashboard Supabase. | `04` |
| **D-30** | **CI/CD và triển khai Vercel:** Vercel Hobby chỉ cho chủ tài khoản deploy ⇒ mọi người làm nhánh riêng + PR; chỉ người giữ Vercel merge vào `main` bằng merge commit; GitHub Actions chạy `typecheck` (`tsc --noEmit`), `lint` (`eslint`), test (`vitest run`). Cách merge phải thử thật trước ngày thi. | `04`, `doc-de-hieu/07` |
| **D-31** | **Không dùng queue ngoài** (Redis / BullMQ / RabbitMQ): semaphore in-memory `CONFIG.MAX_CONCURRENT_INGESTIONS` (trong 1 instance) và in-flight promise map; pgmq / BullMQ / Redis chỉ nằm trong lộ trình sau thi. | `04` |
| **D-32** | **Thống nhất hướng xử lý lệch ABI Tree-sitter WASM (Ghi chú a):** Nếu lệch ABI, đổi phiên bản `web-tree-sitter` trong `package.json` cho khớp với grammar `.wasm` đã có sẵn; tuyệt đối không tự build lại grammar trong giờ thi. | `04` |
| **D-33** | **Định hướng:** mã nguồn mở cho cộng đồng (tự clone, tự điền API key trong `.env`) + nghiên cứu học thuật (AI ảo giác, độ tin cậy AI chấm bài, BKT) + CV. Không thương mại hóa, không bán cho trường.<br>Bản nhóm host là bản dùng thử có giới hạn, chỉ dùng cho repo công khai; dùng lâu dài thì tự chạy theo README. Trước khi đưa link rộng rãi phải có trần lượt AI toàn web mỗi ngày. | `pitch/ROADMAP`, `pitch/PHAN_BIEN_BGK` |
| **D-34** | **Bỏ Fast-Track** và persona `SENIOR_ACTIVE` (hủy D-21).<br>• Kế hoạch câu hỏi rỗng (mọi kỹ năng của node đã thạo) ⇒ **vẫn hỏi 1 câu cho kỹ năng có điểm thấp nhất của node**.<br>• Không còn node miễn thi, không còn `is_auto_mastered`.<br>• BKT vẫn dùng để chọn kỹ năng hỏi và hiển thị danh hiệu (D-20). | `01`, `02`, `03`, `22`, `30`, `50`, `pitch/` |
| **D-35** | **Bỏ ôn tập:** bỏ run `REMEDIATION`, `DECAY_REVIEW`, bỏ viền cam. Node đỏ giữ đỏ.<br>• Không làm bảng 16 kỹ năng; mài mòn chỉ hiện ở kỹ năng của node đang mở.<br>• Thanh kỹ năng nhạt dần theo điểm đã decay + nhãn "đang mài mòn" chỉ hiện khi bậc (`tierOf`) của điểm đã decay thấp hơn bậc của điểm gốc (dùng ngưỡng `CONFIG.TIER_*` sẵn có, không thêm hằng số); thanh nhạt dần liên tục theo tỉ lệ.<br>• Chỉ hiển thị, không có nút ôn. | `01`, `02`, `03`, `20`, `22`, `30`, `50`, `doc-de-hieu/07`, `pitch/` |
| **D-36** | **Bỏ vé chấm bài** (`challenge_token`).<br>• Câu hỏi + đáp án mẫu + ý bắt buộc lưu ở DB (`node_runs`; chữ, không phải code); client không đọc trực tiếp.<br>• AI chấm **không nhận `code_context`**.<br>• Kiểm quyền / số lượt qua DB như D-18. Bỏ khóa `CHALLENGE_TOKEN_*`. | `01`, `02`, `03`, `04`, `20`, `21`, `30`, `50` |
| **D-37** | **Cache AI:** giữ cache bản phân tích node + tổng quan; **bỏ cache câu hỏi**; chấm bài không cache. | `03`, `20` |
| **D-38** | **Chỉ nhận link gốc repo** `https://github.com/<chủ>/<repo>` (cho phép `/` cuối, `.git`, thiếu `https://`).<br>• Link có `/tree/…`, `/blob/…` ⇒ tự cắt phần sau tên repo + ghi chú "Chỉ hỗ trợ nhánh mặc định".<br>• Bỏ `MAX_REF_CANDIDATES`. | `02`, `10`, `30` |
| **D-39** | **Phiên gắn commit SHA:** tải lại trong phiên luôn theo đúng SHA; repo có commit mới ⇒ bản đồ / phiên mới.<br>• Bỏ `ERR_SESSION_SOURCE_EXPIRED`.<br>• Zip không có SHA ⇒ giữ cảnh báo "phiên không mở lại được" sẵn có (Q-12). | `02`, `03`, `04`, `10`, `30` |
| **D-40** | **Bỏ biên nhận + `sync/replay`:** DB lỗi ⇒ `ERR_PERSISTENCE_UNAVAILABLE` + nút "Thử lại". | `01`, `02`, `03`, `04`, `22`, `30` |
| **D-41** | **Tăng `CONFIG.MAX_CLEAN_FILES`** (giá trị ở `02`); chỉnh lại sau khi chạy thử repo thật. | `02` |
| **D-42** | **"Học lại từ đầu"** = tạo phiên mới cho cùng repo; tiến độ node làm lại; **điểm kỹ năng giữ nguyên**; câu hỏi sinh mới. | `03`, `30` |
| **D-43** | **Dữ liệu nghiên cứu:** Không làm `llm_calls` và ô đồng ý nghiên cứu ở bản thi; để lộ trình (`pitch/ROADMAP` mục 5). | `pitch/ROADMAP` |
| **D-44** | **Đăng nhập và tài khoản:** Bắt buộc đăng nhập GitHub trước khi dùng; bỏ tài khoản khách, `signInAnonymously`, `linkIdentity`, `is_guest`. Menu tài khoản có nút "Đăng xuất" (`signOut()`, không thêm endpoint). | `01`, `02`, `03`, `04`, `30`, `50`, `doc-de-hieu/01`, `pitch/` |
| **D-45** | **Tự cài đặt:** Repo thi có `.env.example` và README mục "Tự cài đặt". | `04` |
| **D-46** | **Tải trước node kế tiếp:** Client tải trước 1–2 node kế tiếp, lần lượt, không tải tất cả. Nhận định AI ở Tab Tổng quan chỉ hiện khi mọi node đã phân tích. | `01`, `03`, `20`, `30`, `50`, `pitch/` |
| **D-47** | **Lịch thi mới:** vòng 2 ngày 7–8/11/2026, vòng 3 ngày 9/11/2026, thay lịch trong `references/thele.md`. Giờ chi tiết theo BTC; giả định vòng 2 vẫn 12:00 → 09:00. | toàn repo |
| **D-48** | **Giao diện nhập repo:** Không làm ô "Thư mục" cạnh ô link. | `02`, `30` |
| **D-49** | **Giấy phép mã nguồn:** Mã nguồn repo thi dùng giấy phép MIT. | `04`, repo thi |
| **D-50** | **Model AI:** `gemini-3.5-flash-lite`, gọi bằng `generateContent` + `responseSchema` (đã thử thật 31/10). `gemini-2.5-flash` không còn mở cho người dùng mới; `gemini-3.8-flash` hạn mức quá thấp. Dự phòng: Groq `openai/gpt-oss-120b`. Gói free nên chỉ dùng repo công khai. Web deploy dùng key riêng; mỗi người test bằng key của mình. | `02`, `20`, `21`, `doc-de-hieu/07`, `pitch/` |
| **D-51** | **Giảm lỗi lặp lại của AI, không đổi model** (chốt 31/10/2026):<br>• **Gọi lại kèm lý do:** analyze, overview, questions bị cổng gác chặn thì request kế tiếp có khối lý do do code dựng; lỗi mạng và JSON hỏng thì không. Chấm giữ mẫu tĩnh, không gọi lại. Số request không đổi.<br>• **Ghi mã lỗi:** mỗi lần chặn ghi 1 dòng log, không lưu code, văn bản AI, bài làm; không thêm bảng Postgres.<br>• **Lỗi thành ca test:** mỗi lỗi ❌ có ít nhất 1 ca trong `review/loi_da_gap.md`; đổi `PROMPT_VERSION` phải chạy lại, tụt thì không nhận.<br>• **Bài học vào prompt:** chỉ sau khi qua ca test, do nhóm tự viết, nạp đúng lời gọi liên quan, ghi model và `PROMPT_VERSION`; trần số bài ở Q-13.<br>• **Trình bày:** 2 mục "Lỗi thành ca test" và "Bài học vào prompt" là định hướng tương lai; không demo, chỉ nói khi BGK hỏi. | `02`, `04`, `20`, `21`, `pitch/` |
| **D-52** | **Định hướng câu hỏi:** câu hỏi nêu 1 tình huống rồi hỏi vì sao, từ đâu hoặc chuyện gì xảy ra, để người học tự giải thích bằng lời của mình. Ý bắt buộc là ý giải thích; không đòi số dòng hay tên hàm, trừ góc `CHANGE` cần nêu file. Luật Đạt, BKT, cổng gác giữ nguyên. | `20`, `22`, `50`, `doc-de-hieu/`, `pitch/` |

---

## 2. Quyết định chờ chốt

Hiện không còn quyết định nào chờ chốt. D-08, D-09, D-16, D-24 đã chốt ngày 31/10/2026 và chuyển lên Mục 1.

---

## 3. Câu hỏi còn mở — không chặn việc code, có người chịu trách nhiệm và hạn

| ID | Câu hỏi | Người | Hạn | Mặc định nếu chưa trả lời |
| :-- | :-- | :-- | :-- | :-- |
| **Q-03** | **Repo demo thật** (thay repo minh họa `shop-api`).<br>Tiêu chí:<br>• public<br>• TS/JS Express hoặc NestJS<br>• 20–50 file code<br>• có ≥ 1 điểm dở rõ (truy vấn trong vòng lặp / thiếu transaction / secret viết thẳng)<br>• ≤ 15 MB nén | Cả nhóm | Trước ngày thi | Dùng repo mẫu tự viết theo `50_TEST_VA_FIXTURE.md` Mục 1, đẩy lên GitHub cá nhân trước giờ thi (đây là repo **dữ liệu demo**, không phải code sản phẩm) |
| **Q-10** | **Giới hạn tốc độ tải zip không xác thực từ `codeload.github.com`:** GitHub không công bố quota số cụ thể cho codeload ngoài secondary rate limits / abuse detection (trả 429 / 403 khi quá nhiều request từ 1 IP/dải IP). Cần kiểm chứng hành vi probe và tải zip ở giờ H+1. | Vai B | Trước ngày thi | Giữ semaphore `MAX_CONCURRENT_INGESTIONS` và cache RAM để giảm thiểu số lần tải; gặp 429 trả `ERR_GITHUB_RATE_LIMIT_CDN` |
| **Q-13** | **Trần số bài học nạp vào prompt (D-51):** chưa có số đo nên chưa đặt số. | _chờ điền_ | _chờ điền_ | Chưa nạp bài học nào vào prompt |

---

## 4. Lịch sử

### 4.1. Quyết định đã hủy hoặc thay thế (mỗi dòng 1 câu)

- **D-11:** Thử ref theo thứ tự ngắn → dài (hủy, thay bởi D-38: chỉ nhận link gốc repo).
- **D-14:** Vé chấm bài `challenge_token` mang theo `code_context` (hủy, thay bởi D-36: lưu DB, AI chấm không nhận `code_context`).
- **D-17:** Sync receipt khi lỗi ghi DB (hủy, thay bởi D-40: bỏ biên nhận, DB lỗi trả `ERR_PERSISTENCE_UNAVAILABLE` + nút "Thử lại").
- **D-21:** Thêm persona `SENIOR_ACTIVE` để demo Fast-Track (hủy, thay bởi D-34: bỏ Fast-Track).
- **D-25:** Câu ôn biến thể `|v{n}` tránh trùng câu đã lộ đáp án (hủy, thay bởi D-35: bỏ ôn tập).
- **D-26:** Phiên GitHub rơi về `ARCHIVE_HASH` khi cache RAM trượt (hủy, thay bởi D-39: phiên gắn commit SHA).

### 4.2. Câu hỏi đã đóng

- **Q-01:** Model AI (đóng bởi D-50: chọn `gemini-3.5-flash-lite`, dự phòng Groq `openai/gpt-oss-120b`).
- **Q-02:** Hỏi BTC buổi họp (đóng: bỏ việc hỏi BTC, dùng giả định: Q-02a không commit sau giờ thi, Q-02b 5 phút, Q-02c được mang tài liệu, Q-02d được dùng AI).
- **Q-04:** Vai B xác nhận D-08, D-09 (đóng 31/10/2026: nhóm chốt cả hai, xem Mục 1).
- **Q-05:** Bảng giá token để tính chi phí / phiên (đóng bởi D-50: dùng gói free của Gemini, model `gemini-3.5-flash-lite`).
- **Q-06:** Câu ôn trùng câu đã lộ đáp án (đóng bởi D-35: bỏ ôn tập).
- **Q-07:** Kế hoạch câu hỏi khi mọi kỹ năng đã thạo (đóng bởi D-34: bỏ Fast-Track, vẫn hỏi 1 câu cho kỹ năng điểm thấp nhất).
- **Q-08:** Dấu hiệu node khi điểm mài mòn (đóng bởi D-35: bỏ ôn khi phai và viền cam, chỉ hiện mài mòn ở kỹ năng node đang mở khi rớt bậc).
- **Q-09:** Gộp tài khoản khách vào GitHub (đóng bởi D-44: bắt buộc đăng nhập GitHub, bỏ tài khoản khách).
- **Q-11:** Model Gemini thật cho `CONFIG.LLM_MODEL` (đóng bởi D-50: chốt `gemini-3.5-flash-lite`).
- **Q-12:** Xử lý phiên upload `.zip` khi trượt cache RAM (đóng: zip chỉ giữ được khi còn cache, mất thì upload lại; demo dùng link GitHub tải theo SHA).
