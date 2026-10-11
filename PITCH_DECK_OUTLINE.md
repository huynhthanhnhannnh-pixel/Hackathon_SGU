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

## 2. ĐỊNH VỊ SẢN PHẨM & GIÁ TRỊ CỐT LÕI (PRODUCT POSITIONING)

### 2.1. Định vị: "Trạm Chẩn đoán Nhận thức" theo Chuyên đề (Micro-Session Diagnostic Checkpoint)
- **Không phải kho bách khoa toàn thư hay nền tảng học từ số 0:** Hệ thống không cạnh tranh với sách giáo khoa hay Coursera để truyền tải kiến thức từ đầu (vốn đòi hỏi Database cồng kềnh và lưu trữ lịch sử nặng nề).
- **Định vị chính xác:** Là **Trạm Chẩn đoán Nhận thức (Cognitive Diagnostic Checkpoint)** dành cho học sinh, sinh viên **sau khi vừa nghe giảng hoặc vừa đọc xong một bài học**, muốn kiểm tra xem mình thực sự thấu suốt hay chỉ đang "ảo tưởng thành thạo".
- **Đơn vị học tập tinh gọn (Topic-based Micro-session):** Mỗi phiên kéo dài **10 – 15 phút tập trung cao độ**, giới hạn trên một chuyên đề gồm **5 – 7 khái niệm cốt lõi (Curriculum DAG)**. Toàn bộ phiên học vận hành trọn vẹn trong In-Memory/LocalStorage, không nợ kỹ thuật, không phụ thuộc Database bên ngoài.

### 2.2. Bản chất giải pháp: Đảo ngược vai trò theo Kỹ thuật Feynman
- **Biến người học thành người dạy:** Đặt người học vào vai trò **người hướng dẫn**, có nhiệm vụ giải thích bài học cho một **AI Persona đóng vai người bạn học tò mò / đứa trẻ ham học hỏi** (ví dụ: "Bé Minh").
- **Kỹ thuật Feynman cốt lõi:** Người học có thể dùng bất kỳ cách diễn đạt nào — từ ví dụ đời thường, hình ảnh so sánh đến ngôn từ mộc mạc — **miễn sao người bạn học / đứa trẻ hiểu được bản chất**.

### 2.3. Bản chất của "Câu hỏi Bait" (Bẫy Nhận thức & Thử thách Ngoại suy)
Câu hỏi Bait không dùng cho người chưa biết gì, mà dùng cho người **tưởng mình đã biết nhưng còn hiểu nông / học vẹt**:
1. **Bait Thử Lửa (Application Probe):** Kích hoạt khi người học copy định nghĩa sách vở trơn tru $\to$ Đứa trẻ đặt tình huống ngoại suy cụ thể để kiểm tra xem họ có thực sự áp dụng được không hay chỉ là "con vẹt copy-paste".
2. **Bait Tự Vấp Ngã (Absurd Reductio):** Kích hoạt khi người học giải thích sai bản chất $\to$ Đứa trẻ tin sái cổ và đẩy logic sai lên mức vô lý cực độ để người học tự giật mình nhận ra lỗ hổng.

---

## 3. ĐIỂM SÁNG TẠO & ĐỘNG LỰC "TIẾT KIỆM CHI PHÍ" (ALIGNMENT WITH THEME)

Dự án bám sát trực diện tiêu chí của chủ đề Hackathon: **"Ứng dụng AI sáng tạo & Tiết kiệm chi phí"**:

| Tiêu chí | Tiếp cận truyền thống (Chatbot thông thường) | Giải pháp SGU-Feynman |
| :--- | :--- | :--- |
| **Sáng tạo Sư phạm** | AI nói – Người nghe (Thụ động). | Đảo ngược vai trò: Người dạy – AI hỏi vặn (Kỹ thuật Feynman + Giàn giáo nhận thức 3 bậc). |
| **Kiểm soát Lộ trình** | Trò chuyện tự do, dễ lan man, mất kiểm soát. | **Curriculum DAG + FSM**: Bản đồ tri thức kiểm soát chặt chẽ bằng thuật toán đồ thị, AI không được tự phán đoán lộ trình. |
| **Chi phí Vận hành (Token Economics)** | Lưu toàn bộ lịch sử chat dồn tích $\to O(N)$ chi phí token tăng vọt theo thời gian chat. | **Kiến trúc $O(1)$ Token**: Khóa cứng kích thước ngữ cảnh (~150 tokens/lượt) bằng Rolling Window kết hợp Pinned Core, cắt giảm >85% chi phí API. |
| **Độ tin cậy Kỹ thuật** | Dễ bị ảo giác (hallucination), rò rỉ prompt đạo diễn. | **Thẻ XML Directive & Single-Pass JSON**: Tách bạch lệnh ngầm và hội thoại, thẩm định lỗi tiền định. |

---

## 4. ĐỐI TƯỢNG HƯỚNG TỚI & KHẢ NĂNG ỨNG DỤNG THỰC TIỄN
- **Đối tượng:** Toàn thể học sinh, sinh viên ở mọi lĩnh vực (Khoa học tự nhiên, Khoa học xã hội, Kinh tế, Kỹ thuật...).
- **Tính thực tiễn:** Áp dụng cho mọi bài học có thể mô hình hóa thành Đồ thị Tri thức (DAG): từ nguyên lý Cung - Cầu trong Kinh tế học, Chu trình tế bào trong Sinh học, Định luật Newton trong Vật lý, đến Cấu trúc dữ liệu & Thuật toán trong CNTT.

---

## 5. DÀN Ý NỘI DUNG THUYẾT MINH SƠ KHẢO (CHUYỂN GIAO CHO NHÓM THUYẾT TRÌNH)
1. **Mở đầu (The Hook):** Nghịch lý của việc học trong kỷ nguyên AI — "Copy code/text chạy được nhưng thi vấn đáp điểm 0".
2. **Giải pháp cốt lõi:** Trải nghiệm Feynman đảo ngược vai trò kết hợp Giàn giáo nhận thức.
3. **Trụ cột Công nghệ:** Mô hình lai (Hybrid Architecture) = Thuật toán Đồ thị tiền định + Đánh giá ngữ nghĩa từ AI.
4. **Hiệu quả kinh tế & Khả thi:** Kiến trúc token $O(1)$, chi phí siêu rẻ (~0.0001 USD/lượt chat), sẵn sàng vận hành thực tế.
5. **Kế hoạch phát triển:** Lộ trình hoàn thiện bản mẫu tại Vòng Thử thách 24 giờ.
