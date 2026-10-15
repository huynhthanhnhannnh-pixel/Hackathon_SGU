# ĐẶC TẢ Ý TƯỞNG & ĐỀ CƯƠNG BẢO VỆ SƠ KHẢO
## DỰ ÁN: SGU-FEYNMAN (NỀN TẢNG LUYỆN TƯ DUY QUA KỸ THUẬT FEYNMAN & ĐỒ THỊ TRI THỨC)

> **Cuộc thi:** HACKATHON SGU 2026 – 2027 (BCH Đoàn Khoa CNTT - ĐH Sài Gòn)  
> **Chủ đề dự thi:** *"AI - Kỷ nguyên vươn mình: Ứng dụng AI sáng tạo, tiết kiệm chi phí vào học tập, dạy học thông minh, giải pháp an toàn đô thị hoặc cuộc sống thường ngày."*  
> **Giai đoạn:** Vòng Sơ loại (17/10/2026) – Thuyết minh Ý tưởng & Thẩm định Tính khả thi

---

## 1. BỐI CẢNH & VẤN ĐỀ THỰC TIỄN (PROBLEM STATEMENT)

### 1.1. Hiện trạng học tập của học sinh, sinh viên thời kỳ Generative AI
- **Sự bùng nổ của việc học thụ động:** Người học ngày càng phụ thuộc vào video giảng bài ngắn, tài liệu tóm tắt một chiều và các câu trả lời soạn sẵn từ AI (ChatGPT, Claude...).
- **"Ảo tưởng thành thạo" (Illusion of Competence):** Khi đọc lời giải hoặc xem AI giải bài, não bộ người học tạo ra cảm giác "mình đã hiểu". Nhưng khi đối mặt với việc tự trình bày lại, thi vấn đáp hoặc giải quyết bài toán thực tế, họ hoàn toàn lúng túng vì chưa từng thực sự tự cấu trúc lại tri thức trong não.

### 1.2. Lỗ hổng của các Chatbot EdTech hiện tại
- **Bệnh nịnh nọt (Sycophancy) & Giải thích hộ:** Hầu hết các ứng dụng AI gia sư hiện nay hoạt động như một "vỏ bọc chatbot" (Chatbot Wrapper). Thay vì kích hoạt tư duy người học, chatbot làm hộ, mớm sẵn câu trả lời hoặc khen ngợi dễ dãi dù người học trả lời hời hợt.
- **Thiếu cấu trúc lộ trình sư phạm:** Tương tác chat tự do làm trôi dạt ngữ cảnh, không đo lường được điểm mù tri thức một cách định lượng và khoa học.

---

## 2. ĐỊNH VỊ SẢN PHẨM & PHƯƠNG PHÁP FEYNMAN (PRODUCT POSITIONING)

### 2.1. Phương pháp Feynman là gì và tại sao lại hiệu quả?
- **Nguồn gốc:** Được đặt theo tên nhà vật lý đoạt giải Nobel Richard Feynman.
- **Triết lý cốt lõi:** 
  > *"Nếu bạn không thể giải thích một khái niệm cho một đứa trẻ hiểu bằng ngôn ngữ bình dị nhất, thì chính bạn vẫn chưa thực sự hiểu nó."*
- **4 bước của Kỹ thuật Feynman:**
  1. *Chọn một khái niệm* cần nắm vững.
  2. *Giải thích khái niệm đó cho một đứa trẻ 10 tuổi* bằng ngôn từ mộc mạc, tuyệt đối tránh dùng thuật ngữ chuyên môn đao to búa lớn.
  3. *Nhận diện lỗ hổng:* Chỗ nào mình bị ngắc ngứ, lúng túng hoặc buộc phải đọc chép văn mẫu sách giáo khoa $\to$ Đó chính là điểm mù kiến thức.
  4. *Đơn giản hóa và đúc kết lại* bằng các ví dụ đời thường cho đến khi người nghe thực sự thấu suốt.
- **Ứng dụng vào SGU-Feynman:** Thay vì để AI đứng giảng bài cho sinh viên, hệ thống **đảo ngược vai trò**: Sinh viên đóng vai người dạy/người giải thích, còn AI đóng vai một người bạn học tò mò ("Bé Minh") liên tục lắng nghe và hỏi vặn để người học tự nhận diện lỗ hổng kiến thức.

### 2.2. Luồng trải nghiệm từ nạp bài giảng đến sơ đồ học tập:
1. **Nạp tài liệu & AI sinh sơ đồ bài học:**
   - Người dùng tải lên file slide bài giảng (PDF) hoặc chọn bài mẫu có sẵn.
   - AI đọc hiểu tài liệu, bóc tách các khái niệm trọng tâm cùng mối liên hệ trước-sau, từ đó **tự động sinh ra cây sơ đồ bài học (Curriculum Graph)**.
2. **Người dùng xem lại & Tinh chỉnh sơ đồ:**
   - Người dùng có thể kiểm tra trực quan, chỉnh sửa tên node, thêm/bớt hoặc sắp xếp lại các node theo mục tiêu học tập của mình trước khi khóa sơ đồ bắt đầu học.
3. **Vào buồng lái tương tác (Interactive Session):**
   - Màn hình hiển thị cây sơ đồ trực quan (màu Xám: chưa học, Vàng: đang thảo luận, Xanh: đã thấu suốt).
   - Người dùng giải thích từng node cho người bạn học AI. Khi giải thích đạt yêu cầu bản chất, node chuyển sang màu XANH và mở khóa bài tiếp theo.

### 2.3. Tình huống minh họa: Bắt bẫy học vẹt & Kích hoạt hiểu sâu
- **Tình huống 1 - Thấu suốt bản chất (Node XANH):**  
  *Người học copy câu định nghĩa sách giáo khoa:*  
  > *"Giá cả hàng hóa biến động do mối tương quan giữa cung và cầu trên thị trường."*
  - **Phản xạ của AI:** AI nhận biết đây là câu học vẹt, không khen ngợi dễ dãi mà đặt một tình huống đời thường:  
    > *"Dạ nghe giống trong sách quá anh ơi! Nhưng ví dụ trời mưa to, trước cổng trường chỉ còn đúng 1 cái áo mưa mà có 10 bạn muốn mua, thì giá cái áo mưa đó tăng hay giảm ạ?"*
  - **Chuyển hóa nhận thức:** Khi người học dùng trực giác thực tế trả lời:  
    > *"Giá tăng gấp đôi vì ai cũng cần gấp mà có mỗi 1 cái áo thôi."*  
    $\to$ AI xác nhận đã hiểu đúng bản chất $\to$ **Node trên sơ đồ lập tức chuyển sang màu XANH và mở khóa bài tiếp theo!**

---
### Bổ sung: Tình huống 2 - Xử lý Lạc đề & Đóng dấu Node ĐỎ (Early Termination)
* **Lượt 1 - Người học nói nhảm / Lạc đề:** 
  - Người học nhập: *"Trời mưa thì ở nhà ngủ hoặc đi ăn lẩu cho sướng chứ mua áo mưa chi cho ướt người em ơi."*
  - **Phản xạ của AI & FSM Backend:** AI bắt cờ `is_off_topic: true`, `core_accuracy < 30`. Backend nhận định người học đang né tránh câu hỏi, gán/giữ Node màu **VÀNG**, tăng biến đếm `retry_count = 1`. Bé Minh nghiêm túc kéo lại bài học: 
    > *"Ơ anh ơi, đang hỏi chuyện mua bán áo mưa tự nhiên rủ đi ăn lẩu là sao nè! Tập trung trả lời giúp em: Nếu có 1 cái áo mưa mà 10 người giành mua thì giá tăng hay giảm ạ?"*
* **Lượt 2 - Người học ngoan cố suy luận sai bản chất:**
  - Người học tiếp tục nói đùa: *"Bán rẻ 2 ngàn cho người ta lấy phước, ai lại đi tăng giá cơ hội thế em."*
  - **Phản xạ của AI & FSM Backend:** `analogy_grounding < 20`, vi phạm nguyên tắc cân bằng cung cầu thị trường. Backend tăng `retry_count = 2`. Bé Minh mớm ví dụ bẫy ngô nghê (Bậc 2): 
    > *"Nếu bán rẻ 2 ngàn mà có 10 người nhào vô giành giật đánh nhau thì sao anh? Lúc đó ai trả giá cao hơn để được lấy trước chứ?"*
* **Lượt 3 - Người học bế tắc / Đầu hàng (`user_surrendered`):**
  - Người học gõ: *"Chịu rồi, nhức đầu quá không biết giải thích sao nữa."* (hoặc bấm nút *Tạm bỏ qua / Ôn sau*).
  - **Chuyển hóa & Chốt chặn Sư phạm:** 
    - Đạt ngưỡng `retry_count >= 3` hoặc `user_surrendered: true`. 
    - Backend lập tức chuyển Node sang màu **ĐỎ (Lỗ hổng kiến thức nghiêm trọng)**.
    - Bé Minh tháo ngòi nổ tâm lý nhẹ nhàng: *"Dạ phần này rắc rối quá, em ghi sổ tay rồi lát anh xem lại sau nha."*
    - **Kích hoạt Dừng khẩn cấp (Early Termination):** Do "Cung - Cầu" là Node Gốc (Root Node), hệ thống khóa buồng lái và bật thông báo: *"⚠️ Cảnh báo hổng kiến thức nền tảng. Bạn cần đọc lại tài liệu trước khi tiếp tục dựng các mắt xích tiếp theo."*
---

### 2.4. Bản chất "Dạy Học Thông Minh" (Smart Pedagogy) khi AI không đứng giảng bài
Nhiều người lầm tưởng: *"Dạy học là phải có một ông thầy hoặc con bot đứng giảng nhồi kiến thức vào đầu học sinh"*. Trong Khoa học Giáo dục hiện đại (Pedagogy & Cognitive Science), SGU-Feynman ứng dụng mô hình **Dạy học thông minh bậc cao**:
1. **Hiệu ứng Người bảo hộ (Protégé Effect / Learning by Teaching):** Dạy học thông minh nhất là dạy cách **Tự nhận thức (Metacognition)**. Khi AI giảng bài $\to$ Người học nghe gật gù tạo ra ảo tưởng thành thạo. Nhưng khi bắt người học giảng lại cho đứa trẻ $\to$ Ép não bộ phải tự truy xuất, tái cấu trúc và phát hiện lỗ hổng của chính mình.
2. **"Giảng viên vô hình" (The Invisible Tutor):** Đứa trẻ 10 tuổi ở mặt nổi là người nghe ngây ngô, nhưng ở phía sau là một **Hệ thống chẩn đoán thích ứng**: Bắt bẻ từ chuyên môn, phản biện logic sai và ép người học phải suy nghĩ để tự sửa sai.
3. **Chẩn đoán điểm mù thời gian thực:** Cây đồ thị chỉ ra chính xác sinh viên bị "gãy" tư duy ở mắt xích nào, thay vì chỉ chấm điểm đúng/sai chung chung.

---

## 3. CƠ CHẾ VẬN HÀNH TINH GỌN & TIẾT KIỆM CHI PHÍ THỰC TẾ

Dự án bám sát trực diện tiêu chí **"Ứng dụng AI sáng tạo, tiết kiệm chi phí"** của Hackathon bằng thiết kế kiến trúc thông minh và thực tế:

### 3.1. Hạn chế của mô hình Chatbot thông thường
- Các chatbot thông thường phải gửi dồn toàn bộ lịch sử trò chuyện cũ vào mỗi câu hỏi mới.
- Càng trò chuyện dài thì dữ liệu gửi đi càng phình to, dẫn đến tốn nhiều chi phí gọi API và tốc độ phản hồi ngày càng chậm.

### 3.2. Giải pháp kiến trúc của SGU-Feynman
- **Lưu tiến độ trên cây sơ đồ ở Backend:** Tiến độ và trạng thái học tập đã được lưu trực tiếp trên cây sơ đồ ở Backend, chứ không cần nhồi nhét toàn bộ lịch sử chat vào prompt.
- **Gửi dữ liệu tinh gọn theo từng lượt:** Mỗi lượt trao đổi với AI chỉ cần gửi tin nhắn gần nhất kết hợp với nội dung/tiêu chuẩn của khái niệm đang học.
- **Hiệu quả thực tế:**
  - Dữ liệu gửi đi mỗi lượt luôn giữ ở mức gọn nhẹ, không bị phình to theo thời gian.
  - Tiết kiệm chi phí gọi API đáng kể cho mỗi phiên học.
  - Tốc độ phản hồi nhanh, duy trì cuộc trò chuyện liền mạch và ổn định.

---

## 4. ĐỐI TƯỢNG HƯỚNG TỚI & KHẢ NĂNG ỨNG DỤNG THỰC TIỄN
- **Đối tượng:** Toàn thể học sinh, sinh viên ở mọi lĩnh vực (Khoa học tự nhiên, Khoa học xã hội, Kinh tế, Kỹ thuật...).
- **Tính thực tiễn:** Áp dụng cho mọi bài học có hệ thống khái niệm logic: từ nguyên lý Cung - Cầu trong Kinh tế học, Định luật Newton trong Vật lý, đến Con trỏ trong Lập trình.

---

## 5. DÀN Ý 7 SLIDE THUYẾT TRÌNH VÒNG SƠ KHẢO (CHUYỂN GIAO CHO TEAM LÀM SLIDE)

```text
SLIDE 1: TIÊU ĐỀ & ĐỊNH VỊ DỰ ÁN
• Tiêu đề: SGU-FEYNMAN – NỀN TẢNG LUYỆN TƯ DUY & CHẨN ĐOÁN LỖ HỔNG TRI THỨC
• Subtitle: Ứng dụng Kỹ thuật Feynman & Đồ thị bài học Đảo ngược vai trò
• Tagline chủ đề: "Ứng dụng AI sáng tạo, tiết kiệm chi phí vào dạy và học thông minh"
• Hình ảnh gợi ý: Logo SGU + Mockup giao diện chia 2 cột (Cột trái cây sơ đồ Node - Cột phải khung trò chuyện).

SLIDE 2: NỖI ĐAU THỰC TIỄN – "ẢO TƯỞNG THÀNH THẠO"
• Thực trạng: Sinh viên thời GenAI làm bài tập rất nhanh nhờ AI, nhưng đối mặt câu hỏi vấn đáp thì lúng túng vì chưa từng tự cấu trúc lại tri thức (Illusion of Competence).
• Lỗ hổng Chatbot hiện tại: Đóng vai "người làm hộ" giải thích thay và mớm sẵn câu trả lời -> Biến người học thành người nghe thụ động.
• Hình ảnh gợi ý: So sánh hình ảnh "Đọc lời giải AI gật gù" vs. "Lúng túng khi tự giải thích lại".

SLIDE 3: PHƯƠNG PHÁP FEYNMAN & ĐẢO NGƯỢC VAI TRÒ
• Kỹ thuật Feynman: "Nếu không thể giải thích đơn giản cho một đứa trẻ hiểu, bạn chưa thực sự hiểu nó".
• Đảo ngược vai trò: Người học đóng vai người dạy/người giải thích; AI đóng vai bạn học tò mò ("Bé Minh") hỏi vặn.
• Luồng học tập: Người dùng đẩy file slide PDF vào -> AI đọc và sinh sơ đồ bài học -> Người dùng kiểm tra và tinh chỉnh sơ đồ trước khi học.
• Hình ảnh gợi ý: Quy trình 3 bước từ Nạp tài liệu -> Sinh sơ đồ -> Buồng lái tương tác.

SLIDE 4: KIẾN TRÚC HỆ THỐNG & PHÂN CHIA VAI TRÒ
• Phía AI: Đọc tài liệu PDF sinh sơ đồ ban đầu; trong phiên học thì đánh giá câu giải thích và đưa ra câu hỏi tiếp theo.
• Phía Backend: Quản lý tiến độ bài học trên cây sơ đồ, tiếp nhận kết quả từ AI để tự động đổi màu Node (Xám/Vàng/Xanh) và mở khóa bài tiếp theo theo đúng thứ tự logic.
• Hình ảnh gợi ý: Sơ đồ luồng dữ liệu 3 bên: Người học <-> Backend điều phối <-> Mô hình AI.

SLIDE 5: CƠ CHẾ VẬN HÀNH TINH GỌN & TIẾT KIỆM CHI PHÍ
• Vấn đề của Chatbot thông thường: Gửi dồn dập toàn bộ lịch sử trò chuyện -> Càng chat càng nặng, tốn kém chi phí API và phản hồi chậm.
• Giải pháp SGU-Feynman: Tiến độ lưu trên cây sơ đồ ở Backend; mỗi lượt trao đổi chỉ gửi tin nhắn gần nhất kèm tiêu chuẩn của node hiện tại.
• Hiệu quả thực tế: Dữ liệu gửi đi luôn tinh gọn, giảm chi phí API đáng kể, phản hồi nhanh và mượt mà.
• Hình ảnh gợi ý: Biểu đồ so sánh dữ liệu phình to của Chatbot thường vs. Dữ liệu tinh gọn ổn định của SGU-Feynman.

SLIDE 6: ĐÁNH GIÁ ĐA TIÊU CHÍ & TÌNH HUỐNG MINH HỌA
• Chống học vẹt: AI nhận biết câu sao chép sách vở, đặt tình huống đời thường (ví dụ: áo mưa cổng trường) để kiểm tra độ hiểu bản chất.
• Xử lý tình huống linh hoạt:
  - Hiểu đúng bản chất -> Node đổi màu XANH và mở khóa bài tiếp theo.
  - Nhầm lẫn kiến thức phụ ngoài lề -> Giữ màu VÀNG, hướng người học quay lại trọng tâm và lưu vào báo cáo cuối phiên.
• Hình ảnh gợi ý: Đoạn hội thoại minh họa bắt bẫy học vẹt và Node chuyển màu xanh trên sơ đồ.

SLIDE 7: TÍNH THỰC TIỄN & KẾ HOẠCH BÀN GIAO 24 GIỜ
• Khả năng ứng dụng rộng rãi: Áp dụng cho mọi môn học có hệ thống khái niệm (Kinh tế, Lập trình, Vật lý...).
• Phiên học vi mô (Micro-session): Mỗi phiên 10-15 phút tập trung vào 5-7 khái niệm cốt lõi để rà soát nhanh kiến thức sau buổi học.
• Sẵn sàng cho 24h Hackathon: Đã hoàn thiện toàn bộ cấu trúc dữ liệu, luồng điều phối và kịch bản AI, sẵn sàng ráp nối giao diện trong 24 giờ.
• Hình ảnh gợi ý: Lộ trình triển khai 24 giờ của đội ngũ và lời kết thuyết phục trước Ban Giám khảo.
```

