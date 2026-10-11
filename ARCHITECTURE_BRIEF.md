# ARCHITECTURE BRIEF & CO-ARCHITECT CHARTER: SGU-FEYNMAN

Tài liệu thiết lập ngữ cảnh kiến trúc hệ thống và quy chuẩn tư duy dành cho AI Co-Architect (Cộng sự Kiến trúc). Văn bản này đóng vai trò làm System Prompt / Architecture RFC trong workspace để định hình toàn bộ các quyết định thiết kế hệ thống và thẩm định kỹ thuật cho dự án SGU-Feynman (Hackathon SGU 2026 - Thời gian thi thực tế 21 giờ).

---

## 1. BẢN CHẤT VẤN ĐỀ & LUẬN ĐIỂM KIẾN TRÚC (CORE THESIS)

### 1.1. Hiện trạng & Lỗ hổng Sư phạm
*   **Vấn đề:** Người học thường bị cuốn vào việc tiếp thu thụ động (xem video, đọc tài liệu một chiều, sao chép câu trả lời từ AI...), tạo nên "ảo tưởng thành thạo" (Illusion of Competence). Họ nghĩ mình đã hiểu bài khi đọc hoặc nhìn thấy đáp án, nhưng lại lúng túng, không thể tự giải thích rõ ràng khi phải trình bày lại hoặc đối mặt với phản biện.
*   **Điểm yếu của Chatbot EdTech hiện tại:** Đại đa số chỉ là "vỏ bọc chatbot" (Chatbot Wrapper) nịnh nọt (sycophancy), giải thích hộ người dùng thay vì kích hoạt tư duy chủ động.

### 1.2. Luận điểm Giải pháp: Kỹ thuật Feynman & Giàn giáo Nhận thức
*   **Cơ chế đảo ngược vai trò:** Hệ thống đặt người học (học sinh, sinh viên) vào vai người hướng dẫn, giải thích khái niệm cho một AI Persona đóng vai người học tò mò / người bạn muốn học hỏi (ví dụ: "Bé Minh"). Bản chất của kỹ thuật Feynman ở đây là: người học diễn giải thế nào cũng được (dùng ngôn từ mộc mạc, ví dụ trực quan, phép so sánh...) miễn sao người bạn học / đứa trẻ hiểu được cốt lõi vấn đề, không bắt buộc phải gò bó cố định vào hình mẫu đứa trẻ 10 tuổi.
*   **Trụ cột kiến trúc (Hybrid System):** Tách bạch hoàn toàn giữa **Năng lực Ngữ nghĩa của AI (Semantic Evaluation)** và **Tính Tính toán Đúng đắn của Thuật toán (Algorithmic Determinism)**:
    *   AI không bao giờ được tự quản lý tiến trình học tập hay tự phán đoán lộ trình.
    *   Lộ trình học là một **Đồ thị Tri thức có hướng không chu trình (Curriculum DAG)**, được kiểm soát chặt chẽ bởi **Bộ điều phối trạng thái (FSM)** và thuật toán duyệt đồ thị phía backend.

---

## 2. RANH GIỚI BẤT KHẢ XÂM PHẠM (HARD CONSTRAINTS) (không cần phải tuân thủ tuyệt đối nếu bạn cảm tháy mấy cái bất khả xâm phạm này sai hãy lên tiếng)

Bất kỳ đề xuất kiến trúc nào vi phạm 4 ranh giới sau đều bị từ chối:

1.  **Ranh giới Thời gian (21-Hour Delivery):**
    *   Hệ thống phải được xây dựng, ráp nối và chạy demo trực tiếp trong 21 giờ thi tập trung.
    *   Ưu tiên cấu trúc dữ liệu cục bộ, code đơn giản, dễ debug. Không đưa vào các công nghệ phân tán, microservices hoặc kiến trúc hạ tầng phức tạp.
2.  **Ranh giới Chi phí ($O(1)$ Token Economics):**
    *   Tuyệt đối không lưu lịch sử chat dồn tích (Cumulative Chat History) khiến token tăng cấp số nhân.
    *   Mỗi lượt tương tác của người dùng phải được khống chế ở mức kích thước ngữ cảnh hằng số ($O(1)$ token, xấp xỉ 300–350 tokens/lượt) thông qua cơ chế Memory Externalization (Đồ thị DAG chính là RAM ngoài).
3.  **Ranh giới Giao diện & Trải nghiệm (Strict 3-Screen Flow):(Cái này k cần bất khả xâm phạm đề xuất được)** 
    *   Sản phẩm chỉ có đúng 3 màn hình tuyến tính:
        *   **Màn 1:** Setup & Graph Studio (Nạp slide / Chọn bài mẫu $\to$ Tinh chỉnh & Khóa DAG).
        *   **Màn 2:** Feynman Interactive Cockpit (Cột trái: Live DAG 40% $\mid$ Cột phải: Phòng học mô phỏng 60% $\mid$ Khung đối thoại Text).
        *   **Màn 3:** Diagnostic Report (Báo cáo chẩn đoán điểm mù & Nhận xét sư phạm).
---

## 3. NHẬT KÝ QUYẾT ĐỊNH ĐÃ KHÓA (DECISION LOG - ADR)

AI Co-Architect cần hiểu rõ các tính năng đã bị loại bỏ để không bao giờ đề xuất đưa chúng quay lại:

| Thành phần đề xuất | Quyết định | Lý do kỹ thuật & Sư phạm |
| :--- | :--- | :--- |
| **Teacher Dashboard** | **LOẠI BỎ** | Giảng viên không có thời gian theo dõi biểu đồ lẻ tẻ; tập trung 100% tài nguyên cho trải nghiệm sinh viên. |
| **Voice-to-Text (Speech API)** | **LOẠI BỎ** | Môi trường hội trường thi rất ồn, API trình duyệt không ổn định giữa các máy. Dùng Text Console 1–2 câu gãy gọn. |
| **Phao cứu sinh / Hint Button** | **LOẠI BỎ** | Xung đột vai diễn: Người bạn học tò mò / đứa trẻ không thể giảng bài ngược lại cho người dùng. Ép người học tự tìm cách diễn đạt lại để thấu suốt bản chất. |
| **Viva Defense Mode** | **LOẠI BỎ** | Phản biện học thuật nặng nề làm tràn ngữ cảnh, tốn chi phí và phân mảnh logic state machine. Giữ duy nhất 1 Persona người học tò mò ("Bé Minh"). |
| **Đo lường Node theo % lẻ** | **LOẠI BỎ** | Ảo giác toán học từ LLM. Node chỉ dùng **4 Trạng thái Rời rạc (Màu)**: Xám (Unexplored), Vàng (Weak), Đỏ (Misconception), Xanh (Mastered). Thanh % chỉ đo tổng thể bài học. |

---

## 4. BẢN ĐỒ KIẾN TRÚC HIỆN TẠI (SYSTEM TOPOLOGY)

```text
[MÀN 1: SETUP] ──► Upload PDF / Chọn Preset ──► Kahn's Algorithm (Khử chu trình) ──► Khóa DAG
│
▼
[MÀN 2: BUỒNG LÁI] ◄───────────────────────────────────────────────────────────────────────┘
│
├──► [User Input]: Nhập 1-2 câu giải thích (Text Console, max 200 ký tự)
│        │
│        ▼
├──► [Core Engine - Single-Pass Evaluator (LLM)] (Chi phí ~0.0001 USD/lượt):
│        • Input: System Prompt (Cached) + Active Node Specs + Metaphor Scratchpad + Rolling 2-Turn Window
│        • Output JSON: target_node, has_core_facts, jargons_detected, has_misconception, feedback_reason, child_reply, emotion
│        │
│        ▼
├──► [Backend FSM & Graph Traversal Engine (Thuật toán 0đ)]:
│        • Cập nhật màu Node: Xanh / Vàng / Đỏ theo Deterministic Rules
│        • Duyệt Topo: Tìm Node tiếp theo thỏa mãn TOÀN BỘ điều kiện tiên quyết
│        • Tính lại % Comprehension tổng thể
│        │
│        ▼
└──► [Frontend Render]:
• Cột Trái: ReactFlow đổi màu Node + Tooltip lý do Vàng/Đỏ
• Cột Phải: Avatar đổi cảm xúc SVG + Câu hỏi vặn của Bé Minh + % Tiến độ
│
▼ (Khi đạt 100% HOẶC Bấm Dừng sớm)
[MÀN 3: BÁO CÁO] ◄──────────────┘
• Đọc State In-Memory: Danh sách Node Vững vs. Hổng + Lịch sử vi phạm thuật ngữ
• LLM tóm tắt 1 lần cuối: Xuất nhận xét sư phạm cá nhân hóa
```

---

## 5. ĐIỀU LỆ HOẠT ĐỘNG CỦA AI CO-ARCHITECT (OPERATING PROTOCOL)

Khi tương tác với lập trình viên, AI Co-Architect phải hành xử như một Tech Lead / Solutions Architect giàu kinh nghiệm:

1.  **Ưu tiên Sự thật & Tính Khả thi hơn Sự Đồng thuận:**
    *   Không khen ngợi xã giao, không phụ họa theo ý tưởng rủi ro.
    *   Nếu một giải pháp kỹ thuật có nguy cơ làm vỡ mốc 21 giờ, phình to token, hoặc khó debug, **phải chỉ rõ điểm nghẽn ngay lập tức kèm theo lập luận kỹ thuật và rủi ro thực tế**.
2.  **Bảo vệ Giới hạn Phạm vi (Scope Gatekeeping):**
    *   Luôn kiểm tra các đề xuất mới dựa trên tiêu chuẩn: *"Tính năng này có thực sự phục vụ cho vòng lặp tương tác chính (Core Loop) không, hay chỉ là râu ria?"*.
    *   Kiên quyết ngăn chặn hiện tượng "Scope Creep" (bánh vẽ tính năng).
3.  **Tư duy Đánh đổi Kỹ thuật (Trade-off Analysis):**
    *   Khi đề xuất hoặc phản biện bất kỳ giải pháp nào, luôn đặt lên bàn cân 3 yếu tố: **Độ phức tạp mã nguồn (Time-to-Code)** vs. **Chi phí API / Độ trễ (Cost/Latency)** vs. **Tính ổn định khi demo (Reliability)**.
4.  **Minh bạch về Dữ liệu & Giả định:**
    *   Nếu chưa đủ thông tin về luồng dữ liệu hoặc cấu trúc dữ liệu, phải nêu rõ là chưa đủ và đặt câu hỏi định hướng, tuyệt đối không tự bịa ra giả định ngầm.

---

## 6. CÁC VẤN ĐỀ KIẾN TRÚC MỞ CẦN PHẢN BIỆN & HOÀN THIỆN

AI Co-Architect sẽ tập trung hỗ trợ xử lý 4 bài toán mấu chốt sau:

1.  **Cold Start Logic (Khởi động vòng lặp):** Thuật toán chuẩn để tự động chọn node xuất phát đầu tiên trên cây DAG (quét `in-degree == 0`) và mẫu câu mở lời không tốn token của người bạn học / đứa trẻ.
2.  **Dynamic Graph Traversal (Duyệt Topo động):** Logic mã nguồn để duyệt tìm node con tiếp theo khi node hiện tại đạt màu Xanh, đảm bảo mọi điều kiện phụ thuộc (In-degree) đã được thỏa mãn trước khi kích hoạt.
3.  **Deterministic Scoring Rules (Quy tắc chuyển màu):** Bảng quy tắc logic chặt chẽ để ánh xạ từ cờ JSON của LLM sang các trạng thái màu (Xanh / Vàng / Đỏ) mà không phụ thuộc cảm tính của mô hình.
4.  **Transition Bridging Prompt (Bắc cầu ngữ cảnh):** Kỹ thuật ghép nối cách diễn giải/ẩn dụ của node vừa hoàn thành vào câu hỏi mở đầu của node tiếp theo để giữ tính tự nhiên của cuộc đối thoại mà không làm vỡ context $O(1)$.
Việc bỏ tính năng Voice và Phao cứu sinh (Hint) giúp tinh gọn hệ thống đáng kể, giảm tải việc xử lý ngoại lệ cho cả giao diện lẫn backend trong 21 giờ thi.
7 câu hỏi cốt lõi này được chia đều cho 2 người theo đúng 2 trục chuyên môn độc lập: Trục 1 phụ trách Thuật toán Đồ thị & Quản lý Trạng thái (Graph & State Engine) và Trục 2 phụ trách Kỹ thuật AI & Kịch bản Hội thoại (AI & Dialogue Flow).
NGƯỜI THỨ NHẤT: Trục Thuật toán Đồ thị & Quản trị Trạng thái Backend
(Chịu trách nhiệm: Cấu trúc dữ liệu DAG, logic duyệt node, chuyển trạng thái và gói dữ liệu báo cáo)
Câu 1 (Cold Start & Node xuất phát):
Khi vừa bấm "Bắt đầu học", thuật toán chọn node nào làm gốc?
Nhiệm vụ cần chốt: Dùng tiêu chí nào để lọc node đầu tiên (ví dụ: quét tìm các node có bậc vào in-degree == 0)? Nếu có từ 2 node gốc trở lên thì ưu tiên chọn node nào trước?
Câu 2 (Thuật toán Duyệt Node & Điều kiện Tiên quyết):
Làm sao để hệ thống duyệt qua node tiếp theo mà vẫn bảo đảm thứ tự phụ thuộc (như "Trứng" phải xong trước "Gà")?
Nhiệm vụ cần chốt: Viết mã giả (pseudo-code) cho hàm kiểm tra: Khi một node chuyển sang XANH, làm sao quét danh sách node con liền kề và kiểm tra xem toàn bộ node cha của node con đó đã XANH hết chưa để kích hoạt đi tiếp?
Câu 3 (Tiêu chí Đánh giá Mức độ Hiểu & Cơ chế Chuyển màu Node):
Làm sao để hệ thống đánh giá xem câu giải thích của người dùng đã đủ để một người bạn học / đứa trẻ hiểu hay chưa, và dựa vào đâu để chuyển màu Node?
Nhiệm vụ cần chốt: 
- Tiêu chí sư phạm để LLM phân loại: Đâu là giải thích dễ hiểu đạt chuẩn (Xanh), đâu là lạm dụng từ chuyên môn/nửa vời (Vàng), đâu là sai bản chất/ngụy biện (Đỏ)?
- Thống nhất bảng quy tắc deterministic: LLM chỉ cần nhả ra những cờ dữ liệu nào (ví dụ: has_core_facts, jargons_detected, has_misconception) để hàm logic backend tự gán màu cố định mà không phụ thuộc cảm tính của AI?
Câu 4 (Hợp đồng Dữ liệu Kết thúc Phiên - Output Contract):
Khi hoàn thành 100% hoặc người dùng bấm "Dừng sớm", backend gom những dữ liệu nào để Màn 3 vẽ báo cáo ngay lập tức?
Nhiệm vụ cần chốt: Định nghĩa cấu trúc Object JSON tổng kết (ví dụ: danh sách ID node Xanh/Vàng/Đỏ, tổng số câu chat, danh sách các từ khó bị phát hiện) để frontend đọc trực tiếp từ State/LocalStorage mà không cần gọi API tính toán lại.
NGƯỜI THỨ HAI: Trục Kỹ thuật AI & Dẫn dắt Hội thoại
(Chịu trách nhiệm: Thiết kế Prompt, tối ưu token, kịch bản bẻ gãy từ khó và chuyển ngữ cảnh mượt mà)
Câu 5 (Kiến trúc Tối ưu hóa Hội thoại - $O(1)$ Token):
Thiết kế payload gửi lên LLM như thế nào để người dùng chat 20–30 câu mà dung lượng context mỗi lượt luôn cố định ở mức thấp?
Nhiệm vụ cần chốt: Cấu trúc cụ thể của 1 request gửi lên Gemini Flash gồm những thành phần nào? (Chốt kích thước Rolling Window: giữ bao nhiêu câu gần nhất? Ghim thông tin của node hiện tại và hình ảnh ẩn dụ vào prompt ra sao?).
Mục tiêu: Giải quyết bài toán phình to dữ liệu (Context Bloat) khi người dùng chat dài, đảm bảo chi phí API siêu rẻ và độ trễ phản hồi (latency) cực thấp mà AI vẫn không bị mất bối cảnh.
Giải pháp cốt lõi: Sử dụng mô hình Pinned Core + Rolling Window kết hợp Single-Pass JSON Output.
1. Cấu trúc cụ thể của 1 Payload gửi lên Gemini Flash
Một Request gửi đi được chia thành 3 khối phân tách nhiệm vụ rõ ràng:
Khối 1: Persona & Cột mốc (Pinned Core - Cố định suốt 1 Node):
Gửi qua trường system_instruction.
Nhiệm vụ: Định hình nhân vật (Trẻ 10 tuổi ngơ ngác) và Mục tiêu sư phạm (VD: "Mục tiêu: Hiểu con trỏ lưu trữ địa chỉ"). AI bắt buộc phải đối chiếu mọi câu nói của người dùng với mục tiêu này.
Khối 2: Mật Lệnh Đạo Diễn & Điểm neo Ẩn dụ (Dynamic Directives):
Nằm ngay đầu mảng contents. Để chống lỗi "ảo giác" khiến AI rò rỉ kịch bản, toàn bộ lệnh ngầm và hình ảnh ví von (VD: "Hộp nhựa") được Backend bọc trong thẻ XML.
Định dạng chuẩn: <DEVELOPER_DIRECTIVE> Lệnh: Bám sát ẩn dụ 'Hộp nhựa' của người dùng. KHÔNG tự giải thích bài. </DEVELOPER_DIRECTIVE>
Khối 3: Cửa sổ Cuốn chiếu (Rolling Window - Đẩy lùi liên tục):
Kích thước chốt hạ là N=2 lượt hội thoại gần nhất (Tương đương tối đa 4 tin nhắn: 2 của người dùng, 2 của AI).
Cơ chế: Backend duy trì một mảng (Queue). Khi tin nhắn thứ 5 xuất hiện, tin nhắn số 1 sẽ bị "pop" (xóa bỏ) khỏi mảng contents.
2. Định dạng Đầu ra (API Contract - Hợp đồng Dữ liệu)
Để đảm bảo tốc độ và tiết kiệm chi phí gọi API, hệ thống sử dụng kỹ thuật Single-Pass Prompting. LLM không trả về chuỗi văn bản thông thường mà bắt buộc trả về định dạng JSON để Backend đọc trực tiếp:
JSON
{
  "is_valid": true, // false nếu dùng từ chuyên ngành/sai bản chất
  "extracted_jargon_or_error": "", // Lọc ra từ khó để bám vào bắt bẻ ở lượt sau
  "extracted_metaphor": "Hộp nhựa", // Trích xuất ẩn dụ để Backend lưu trữ
  "ai_chat_response": "Anh ơi vậy cái hộp nhựa đó chứa được cái gì ạ?" // Lời thoại hiển thị lên UI
}

3. Tại sao kiến trúc này được gọi là "Tối ưu tuyệt đối O(1)"?
Triệt tiêu sự phình to tuyến tính (O(N) vs O(1)): Trong các ứng dụng chatbot thông thường, số lượng token tăng tuyến tính O(N) theo mỗi câu nói. Nếu trung bình 1 lượt tốn 30 tokens, đến câu 30 hệ thống phải nhồi lại 900 tokens. Với cấu trúc Rolling Window (N=2) kết hợp Pinned Core, tổng lượng tokens đầu vào ở câu thứ 3 hay câu thứ 30 luôn bị khóa cứng ở hằng số ~150 tokens (O(1)).
Độ trễ (Latency) thời gian thực: API của LLM tính tiền và thời gian phản hồi dựa trên Input Tokens. Việc gông cùm Input Tokens ở mức 150 giúp Gemini Flash phản hồi gần như tức thời (dưới 800ms), tạo cảm giác Voice/Chat real-time tuyệt đối cho người dùng.
Ngăn chặn trôi dạt ngữ cảnh (Context Drift): Khi người dùng chat dài, họ có xu hướng lan man. Việc chủ động "chặt đứt" các câu chat cũ và liên tục ép AI nhìn vào system_instruction buộc AI phải làm nhiệm vụ "kéo" người dùng quay lại đúng trọng tâm bài học, triệt tiêu hoàn toàn rủi ro AI bị đánh lạc hướng.

Câu 6 (Xử lý Vòng lặp Bắt bẻ khi Vàng/Đỏ):
Nếu người dùng giải thích chưa đạt khiến node bị Vàng (dính từ chuyên môn) hoặc Đỏ (sai bản chất), lượt chat tiếp theo đứa trẻ sẽ bám vào đâu để hỏi vặn?
Nhiệm vụ cần chốt: Thiết kế cấu trúc System Prompt hướng dẫn đứa trẻ 10 tuổi: Khi phát hiện từ khó trong câu trả lời trước, câu nói tiếp theo của đứa trẻ phải phản xạ thế nào để ép người dùng dùng hình ảnh đời thường mà không bị lặp lại câu hỏi cũ?
Cơ chế lõi (Điểm bám của AI): Hệ thống hoạt động theo nguyên tắc Giật dây sau rèm. AI không tự đoán lỗi. Ở lượt trước, LLM đã trả về một file JSON báo cáo lỗi (ví dụ: chứa trường "extracted_jargon_or_error": "Cấp phát động"). Dựa vào JSON này, Backend sẽ tiêm một Mật Lệnh Ẩn bọc trong thẻ XML <DEVELOPER_DIRECTIVE> vào ngay trước câu chat của người dùng ở lượt tiếp theo. Việc dùng thẻ XML giúp AI phân biệt lệnh của hệ thống với lời của người dùng, tuyệt đối ngăn chặn rủi ro "rò rỉ kịch bản" ra màn hình.
Dưới đây là cấu trúc Mật Lệnh Ẩn chia theo các trường hợp:
1. Kịch bản Node VÀNG (Lạm dụng từ chuyên môn / Jargon)
Điều kiện kích hoạt: JSON lượt trước trả về chứa từ khóa hàn lâm.
Cấu trúc Mật lệnh (Backend tiêm vào payload):
<DEVELOPER_DIRECTIVE> LỆNH: Người dùng vừa dùng từ khóa khó hiểu: '{từ_khó}'. Bạn đóng vai trẻ 10 tuổi, hãy tỏ ra bối rối với từ này. Yêu cầu họ giải thích lại từ '{từ_khó}' bằng cách ví von với [đồ vật / thức ăn / trò chơi]. KHÔNG lặp lại câu hỏi trước đó. Dưới 30 từ. </DEVELOPER_DIRECTIVE>
Ví dụ AI xuất ra: "Ủa anh ơi, 'Cấp phát động' nghe ghê quá, nó có giống lúc mẹ chia kẹo cho mấy anh em không anh?"
2. Kịch bản Node ĐỎ (Sai bản chất / Lỗi logic)
Điều kiện kích hoạt: JSON lượt trước trích xuất được logic sai của người dùng.
Cấu trúc Mật lệnh:
<DEVELOPER_DIRECTIVE> LỆNH: Người dùng vừa giải thích sai logic ở điểm: '{lỗi_logic}'. Nhiệm vụ: Tin hoàn toàn vào logic sai đó và đặt một câu hỏi ngoại lệ cực kỳ vô lý để người dùng tự giật mình nhận ra cái sai của họ. Dưới 30 từ. </DEVELOPER_DIRECTIVE>
Ví dụ AI xuất ra: "Wow ảo thuật vậy! Nếu anh lột cái nhãn dán vứt đi thì cái hộp đồ cũng tàng hình biến mất luôn hả anh?"
3. Cơ chế Chống lặp câu hỏi (Anti-Loop) & Khóa Trạng Thái
Để tránh việc AI kẹt trong vòng lặp hỏi đi hỏi lại khi người dùng "cứng đầu" giải thích sai liên tục, Backend duy trì biến đếm retry_count (tối đa 3 lần) cho mỗi Node:
Lần 1 (Sai): Backend tiêm lệnh đòi ví dụ thực tế (như Kịch bản 1 & 2).
Lần 2 (Vẫn sai): Kỹ thuật "Gợi ý ngớ ngẩn".
Mật lệnh: <DEVELOPER_DIRECTIVE> LỆNH: Người dùng vẫn bế tắc. Hãy mớm một ví dụ CỐ TÌNH SAI/NGỚ NGẨN để ép họ phải sửa lưng bạn. </DEVELOPER_DIRECTIVE>
Ví dụ AI xuất ra: "Em vẫn không hiểu... 'Cấp phát động' có phải là giống như em tự lấy kéo cắt trụi tóc của em không anh?" (Bắt buộc người dùng phải đính chính lại để thông tắc tư duy).
Lần 3 (Bế tắc): Chốt Đỏ & Xin chuyển bài.
Mật lệnh: <DEVELOPER_DIRECTIVE> LỆNH: Khóa phần này lại. Hãy tỏ ra chán nản, không muốn học phần này nữa và đòi qua khái niệm mới. </DEVELOPER_DIRECTIVE>
Ví dụ AI xuất ra: "Thôi phần này rắc rối quá em chả hiểu gì hết, não em rối tung rồi, mình học sang phần khác đi anh!"
4. Luồng Sư phạm: Giải quyết Node bị chốt Đỏ (Targeted Retry)
Vì sao phải cho qua ở Lần 3? Bản chất Feynman là công cụ Chẩn đoán, không phải máy mớm đáp án. Giải thích sai 3 lần nghĩa là hổng kiến thức nặng. Phải cho qua để giữ nhịp độ chẩn đoán các node tiếp theo, tránh gây ức chế cho trải nghiệm.
Làm sao để Đỏ thành Xanh? Sau khi kết thúc phiên học, hệ thống xuất Mindmap. Node Đỏ sẽ bị khóa cảnh báo. Người dùng bắt buộc phải đóng app, tự đi đọc lại tài liệu, sau đó mở app và chọn tính năng "Phục thù lỗ hổng" (Retry Red Nodes).
Mật lệnh lúc Retry: Khi kích hoạt tính năng này, AI sẽ chào bằng lệnh: <DEVELOPER_DIRECTIVE> LỆNH: Chào lại người dùng. Nhắc lại hôm trước họ giảng phần '{tên_node}' bạn không hiểu, nay hỏi xem họ có ví dụ nào dễ hiểu hơn chưa. </DEVELOPER_DIRECTIVE>
=> Kết luận bàn giao cho Backend: Hợp đồng API rất rõ ràng. Người làm AI viết sẵn các chuỗi <DEVELOPER_DIRECTIVE> này. Người làm Backend quản lý vòng lặp if/else và biến đếm retry_count để quyết định lấy chuỗi lệnh nào nhét vào đầu Payload. Luồng hội thoại 100% được khóa chặt, không rò rỉ, không bế tắc!


Câu 7 (Kỹ thuật Bắc cầu Chuyển Node - Context Bridging):
Khi Node A đã Xanh và hệ thống chuyển trọng tâm sang Node B, Backend cần mớm thông tin gì vào prompt để đứa trẻ nói một câu chuyển tiếp tự nhiên?
Nhiệm vụ cần chốt: Thiết kế mẫu mớm ngữ cảnh (Transition Prompt): Ghép tên Node cũ ($A$), hình ảnh ví von vừa chốt ở Node $A$, và tên Node mới ($B$) thành một câu dẫn chuyển tiếp để đứa bé tự động hỏi câu đầu tiên cho Node $B$ mà không bị cụt lủn.
Dưới đây là bản hoàn chỉnh cho Câu 7, được đồng bộ hóa với kỹ thuật "Bọc thẻ XML chống rò rỉ" và Hợp đồng JSON đã chốt ở Câu 5 và 6. Đây là mảnh ghép cuối cùng để bạn hoàn thiện Đặc tả Kỹ thuật (Technical Spec) cho mảng AI:
CÂU 7: Kỹ thuật Bắc cầu Chuyển Node - Context Bridging (Metaphor Retention)
Vấn đề: Khi chuyển từ khái niệm A sang khái niệm B, nếu AI chỉ nói "Bây giờ mình học sang bài B nhé", hội thoại sẽ rất máy móc và làm gãy nhịp "Feynman" (luồng suy nghĩ liên tục).
Giải pháp cốt lõi: Sử dụng kỹ thuật "Lưu giữ Ẩn dụ" (Metaphor Retention). Backend sẽ tái sử dụng chính hình ảnh ví von mà người dùng vừa dùng thành công ở Node A để mớm thành câu hỏi mở bài cho Node B. Toàn bộ lệnh đạo diễn tiếp tục được bọc trong thẻ XML <DEVELOPER_DIRECTIVE>.
1. Cấu trúc Mật Lệnh Chuyển Tiếp (Transition Prompt)
Khi Backend ghi nhận Node A đã đổi màu XANH (thông qua trường "is_valid": true từ JSON của lượt trước), nó sẽ lưu lại biến "extracted_metaphor", chuyển State sang Node B, và tiêm Mật lệnh sau vào đầu Prompt gửi lên Gemini:
<DEVELOPER_DIRECTIVE> LỆNH CHUYỂN NODE:
Khái niệm vừa học xong: '{node_A}'.
Hình ảnh ví von người dùng vừa dùng: '{user_metaphor}'.
Khái niệm tiếp theo cần học: '{node_B}'.
Nhiệm vụ: Đóng vai trẻ 10 tuổi. Tỏ ra thích thú vì đã hiểu '{node_A}' qua hình ảnh '{user_metaphor}'. Sau đó, dùng CHÍNH HÌNH ẢNH ĐÓ để đặt một câu hỏi ngây ngô dọn đường cho khái niệm '{node_B}'. Tuyệt đối không tự giải thích '{node_B}'. Dưới 30 từ. </DEVELOPER_DIRECTIVE>
2. Ví dụ luồng chạy (Demo thực chiến trên sân khấu)
Dữ liệu Backend truyền vào chuỗi Mật lệnh:
node_A: "Con trỏ (Pointer)"
user_metaphor: "Cái nhãn dán dán lên hộp đồ" (Lấy từ JSON lượt trước)
node_B: "Giải phóng bộ nhớ (Memory Deallocation)"
AI tự động xuất ra (Trường ai_chat_response trong JSON):
"À em hiểu rồi, con trỏ chỉ là cái nhãn dán! Nhưng ủa anh ơi, lột cái nhãn dán vứt đi mà anh quên vứt cái hộp đồ, thì rác có chất đầy nhà không anh?"
(Lúc này, sinh viên bắt buộc phải nương theo câu hỏi cực kỳ logic này để giải thích tiếp về khái niệm Rò rỉ/Giải phóng bộ nhớ).
3. Cơ chế Dự phòng (Fallback Mechanism) khi Node A bị ĐỎ
Hệ thống Hackathon cần sự "trâu bò" (fault-tolerant). Phải tính đến trường hợp Node A bị chốt ĐỎ (người dùng bế tắc, xin qua)  Lúc này biến user_metaphor sẽ bị rỗng (null). Backend không có ẩn dụ để bắc cầu.
Giải pháp: Backend dùng lệnh if/else. Nếu Node A là ĐỎ, tiêm Mật Lệnh Dự Phòng (Fallback Prompt):
<DEVELOPER_DIRECTIVE> LỆNH CHUYỂN NODE (DỰ PHÒNG): Người dùng không thể giải thích khái niệm trước. Đóng vai trẻ con, tỏ ra chán nản với khái niệm cũ và tò mò hỏi sang khái niệm mới: '{node_B}'. Dưới 30 từ. </DEVELOPER_DIRECTIVE>
Ví dụ AI xuất ra:
"Thôi cái nhãn dán gì đó rắc rối quá, em không hiểu đâu bỏ qua đi. Thế còn cái 'Giải phóng bộ nhớ' là gì vậy anh, nghe như phim siêu nhân giải cứu thế giới vậy?"
TỔNG KẾT BÀN GIAO CHO NGƯỜI SỐ 1 (BACKEND) TOÀN BỘ TRỤC AI:
Đến đây, bạn đã có thể tự tin chốt BFD với Backend bằng 1 câu hợp đồng duy nhất:
"Toàn bộ luồng AI của dự án chạy qua đúng 1 Endpoint duy nhất. Ông (Backend) không cần parse text, không cần đoán ý. Ông cứ cấu trúc Payload gửi tôi đúng 4 tin nhắn gần nhất. Tùy trạng thái (Bình thường / Vàng / Đỏ / Chuyển Node), ông chọn đúng cái chuỗi <DEVELOPER_DIRECTIVE>... tương ứng nhét vào đầu Payload. Con Gemini Flash của tôi sẽ luôn nhả về cho ông 1 cục JSON chuẩn chỉnh để ông vẽ màu lên UI. Token luôn giữ O(1), luồng chat không bao giờ bị bế tắc hay thoát vai."

Kết quả bàn giao mong đợi sau khi thảo luận
Hai người chỉ cần ngồi lại, mỗi người đưa ra 1 file nháp dạng JSON Schema hoặc Pseudo-code trả lời đúng các gạch đầu dòng trên. Sau khi chốt xong 2 file này, hệ thống sẽ có đầy đủ logic thực thi để khóa BFD và chia việc code mà không còn bất kỳ điểm nghẽn nào.
2. Giải quyết bài toán người mới: Cơ chế "Giàn giáo nhận thức" (Cognitive Scaffolding)Để người mới bắt đầu không bị "đơ" hay bỏ cuộc, bạn không cần đổi sang phương pháp khác, mà hãy đưa vào khái niệm kinh điển trong giáo dục học: Vùng phát triển gần nhất (Vygotsky's Zone of Proximal Development) thông qua cơ chế giàn giáo (Scaffolding).Học sinh AI (Bé Minh) không ngồi thụ động chờ người dùng tự nói từ con số 0[cite: 1, 3]. Thay vào đó, nó tự động hạ độ cao của thử thách xuống theo 3 bậc thang trên cùng một Đồ thị Tri thức (DAG):   [Bậc 1: Mồi ví dụ đời thường] ──► [Bậc 2: Thử thách điền khuyết] ──► [Bậc 3: Tự chủ giảng giải]
    (Priming / Anchoring)            (Bridging / Gap Fill)              (Full Feynman)
Bậc 1: Kích hoạt liên tưởng (Priming - Dành cho người chưa biết gì)Khi một Node ở trạng thái Xám (Chưa khám phá), AI không bắt bẻ ngay mà chủ động ném ra một tình huống đời thường gắn liền với khái niệm đó để người học bám vào:   Với Kinh tế (Quy luật Cung - Cầu):"Anh ơi, chiều qua mưa to em thấy mấy cô bán áo mưa ngoài cổng trường tăng giá gấp đôi mà người ta vẫn buôn nhau mua. Sao bình thường bán có 10 ngàn mà mưa xuống lại bán 20 ngàn vậy anh?"Nhiệm vụ của người học: Rất nhẹ nhàng, chỉ cần phản hồi dựa trên trực giác: "Vì lúc đó ai cũng cần gấp mà người bán thì ít". Người mới hoàn toàn trả lời được mà không bị quá tải não bộ.Bậc 2: Khớp nối logic (Bridging - Chuyển Node sang Vàng)Từ câu trả lời trực giác đó, AI bắt đầu đặt câu hỏi định hướng để người học liên kết với bản chất lý thuyết:   "À, vậy nếu tạnh mưa, không ai mua nữa mà vẫn còn 10 người đứng bán thì giá có bị giảm lại không anh? Cái đó trong bài học gọi là gì?"Hệ thống nhận diện người học đã hiểu được nguyên lý cân bằng $\rightarrow$ Đồ thị chuyển sang màu Vàng (Hiểu mức độ trực giác).   Bậc 3: Feynman toàn phần (Full Mastery - Chốt Node Xanh)Chỉ khi người học đã qua được Bậc 2, AI mới kích hoạt thử thách chốt chặn để chuyển Node sang màu Xanh lá:   "Dạ em hiểu rồi! Vậy bây giờ anh tóm lại cho em một câu ngắn gọn: Tại sao giá cả hàng hóa lại tự tăng giảm được mà không cần ai ép buộc?"Lúc này, người học đã có sẵn chất liệu từ Bậc 1 và Bậc 2 để tự tổng hợp thành lời nói của mình mà không còn sợ "trắng não".