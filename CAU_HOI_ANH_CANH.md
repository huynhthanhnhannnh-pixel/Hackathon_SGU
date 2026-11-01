# BẢNG CÂU HỎI THAM VẤN ANH CẢNH (MENTOR KỸ THUẬT)
**Dự án:** SimpliFey — Nền tảng học hiểu kiến trúc mã nguồn & hỗ trợ sinh viên giải thích đồ án  
**Thời gian:** Chuẩn bị trước vòng thử thách 21 giờ (Hackathon SGU 2026)  

> **Mục đích:** Bộ câu hỏi tinh gọn gồm **6 câu trọng tâm nhất** để trao đổi nhanh (khoảng 10–15 phút) với **anh Cảnh** (mentor hỗ trợ chuyên môn cho sinh viên), tập trung vào:
> 1. Tính hợp lệ khi thu hẹp phạm vi đề tài so với vòng sơ khảo.
> 2. Kinh nghiệm phân bổ thời gian trong 21 giờ để kịp tiến độ.
> 3. Hướng giải thích kiến trúc và xử lý rủi ro khi demo trước Ban Giám khảo (BGK).
> 4. Định hướng phát triển sau cuộc thi (Đồ án tốt nghiệp / Nghiên cứu).

---

## 🎙️ LỜI MỞ ĐẦU GỢI Ý KHI GẶP ANH CẢNH

> *"Chào anh Cảnh, nhóm em là nhóm SimpliFey. Trước khi bước vào 21 giờ thi, nhóm đã chuẩn bị trước tài liệu thiết kế và kế hoạch chi tiết. Nhóm cũng có gửi tin nhắn hỏi BTC một số thắc mắc nhưng hiện BTC chưa phản hồi vì đang bận chuẩn bị cho cuộc thi. Hôm nay nhóm xin phép được tham khảo nhanh kinh nghiệm thực chiến của anh qua 5–6 vấn đề quan trọng nhất để nhóm triển khai an toàn và bám sát tiêu chí của BGK ạ."*

---

## ⭐ 6 CÂU HỎI TRỌNG TÂM THAM VẤN ANH CẢNH

### 1. Thu hẹp bài toán từ "tài liệu/PDF" sang "đọc hiểu repo code IT (chống vibe-coding)":
- **Bối cảnh của nhóm:**  
  Ở vòng sơ loại, nhóm đăng ký ý tưởng hỗ trợ học tập chung qua tài liệu/PDF. Khi bắt tay vào làm cụ thể, nhóm nhận thấy xử lý tài liệu chung quá rộng và khó kiểm chứng người học có thực sự hiểu hay không.  
  Vì vậy, nhóm quyết định thu hẹp phạm vi vào đúng chuyên ngành: **tập trung cho sinh viên IT giải quyết vấn đề "vibe coding"** (dùng AI sinh code chạy được nhưng không giải thích được luồng khi thi vấn đáp đồ án). Nhóm chuyển đầu vào sang **phân tích mã nguồn (link GitHub hoặc file zip)** để bóc tách luồng gọi hàm thành bài học và hỏi đáp theo phương pháp Feynman bám sát dòng code.  
- **Tình trạng:** Nhóm đã gửi hỏi BTC nhưng chưa nhận được phản hồi.
- **Câu hỏi tham vấn anh Cảnh:**  
  *Thưa anh, việc nhóm thu hẹp bài toán từ tài liệu chung sang mã nguồn của sinh viên IT như vậy có được nhìn nhận là phát triển tiếp từ ý tưởng sơ loại không, hay có bị xem là làm sang đề tài khác ạ? Khi thuyết trình, nhóm nên dẫn dắt lý do thu hẹp này thế nào để BGK thấy tự nhiên và hợp lý ạ?*

---

### 2. Phân bổ các mốc thời gian (milestones) trong 21 giờ để kịp tiến độ:
- **Bối cảnh của nhóm:**  
  Về mặt lập kế hoạch (tiêu chí Planning), nhóm không dùng công cụ bên ngoài mà xây dựng workflow nội bộ: từ tài liệu đặc tả, nhóm phân rã thành **mấy chục task nhỏ có tiêu chí kiểm tra rõ ràng**, rồi kết hợp công cụ tự động hóa để AI hỗ trợ code và kiểm thử từng phần.
- **Câu hỏi tham vấn anh Cảnh:**  
  *1. Theo kinh nghiệm thực chiến của anh, trong 21 giờ thi thì nhóm nên chia các mốc thời gian (timeline) như thế nào là an toàn nhất? Mốc mấy giờ thì nên dừng code tính năng mới để tập trung chốt ổn định hệ thống, làm slide và tập dượt demo ạ?*  
  *2. Việc nhóm chia nhỏ dự án thành các task cụ thể theo quy trình kiểm thử để quản lý tiến độ thì khi báo cáo, nhóm nên trình bày thế nào để ghi điểm ở tiêu chí "Planning và quản lý công việc" của BTC ạ?*

---

### 3. Trình bày giải pháp kiến trúc để làm rõ tính thực tế:
- **Bối cảnh của nhóm:**  
  Thay vì đưa toàn bộ repo cho AI đọc (rất tốn chi phí, phản hồi chậm và dễ bị ảo giác), nhóm dùng **phân tích tĩnh để bóc tách luồng gọi hàm và kiến trúc trước**, sau đó AI chỉ nhận lát cắt code rất nhỏ của bài học đang mở để đặt câu hỏi và chấm điểm.
- **Câu hỏi tham vấn anh Cảnh:**  
  *Dưới góc nhìn của anh, hướng tiếp cận "phân tích tĩnh trước, AI đi sau" này có hợp lý không ạ? Khi BGK hỏi về kiến trúc và khả năng mở rộng (scale) khi có nhiều người dùng hoặc repo lớn, nhóm nên nhấn mạnh vào những điểm nào để làm rõ sự khác biệt kỹ thuật so với các ứng dụng chỉ đơn thuần bọc (wrapper) API của AI?*

---

### 4. Kịch bản demo và xử lý RỦI RO khi BGK yêu cầu thử repo lạ tại chỗ:
- **Bối cảnh & Rủi ro kỹ thuật:**  
  Nhóm chuẩn bị sẵn một repo thực tế (Web Bookstore khoảng 150–200 file) để demo 1 luồng trọn vẹn: Đọc repo -> Hiện bản đồ bài học -> Mở 1 luồng nghiệp vụ -> AI hỏi câu hỏi bám code -> Sinh viên trả lời -> AI chấm theo ý bắt buộc.  
  Tuy nhiên, rủi ro lớn nhất là trong lúc demo, **BGK có thể bất ngờ yêu cầu: "Dán thử link repo của thầy vào xem nào!"**. Các rủi ro tiềm ẩn:
  - Repo của BGK có thể dùng ngôn ngữ/framework ngoài phạm vi nhóm đã kiểm chứng kỹ (nhóm mới tối ưu tốt nhất cho TypeScript/JavaScript và Python).
  - Cấu trúc repo lạ có thể làm thời gian phân tích lâu hơn bình thường.
  - Nguy cơ mạng tại hội trường thi bị nghẽn hoặc chạm giới hạn gọi API của AI.
- **Câu hỏi tham vấn anh Cảnh:**  
  *Theo anh, nếu rơi vào tình huống BGK yêu cầu thử ngay một repo lạ của thầy, nhóm nên ứng biến thế nào cho khéo léo ạ? Nhóm có nên chủ động xin phép demo luồng chuẩn bị sẵn trước rồi mới thử nghiệm repo ngoài, hay có cách nào để vừa thể hiện sự tự tin nhưng vẫn kiểm soát được rủi ro kỹ thuật không anh?*

---

### 5. Định vị điểm mới và lợi thế cạnh tranh trước BGK:
- **Bối cảnh của nhóm:**  
  Hiện tại trên thị trường đã có các công cụ như DeepWiki, GitDiagram (giúp *đọc* và vẽ sơ đồ kiến trúc), hay Copilot, Cursor (giúp *viết code hộ*). SimpliFey định vị ở chiều ngược lại: **Kiểm tra xem sinh viên có thực sự HIỂU code của chính mình hay không** (chống học vẹt, chống vibe-coding).
- **Câu hỏi tham vấn anh Cảnh:**  
  *Anh thấy cách định vị "không dừng lại ở việc đọc code, mà tập trung kiểm tra mức độ hiểu code của sinh viên" đã đủ sắc bén để tạo sự khác biệt rõ ràng chưa ạ? Nhóm nên nhấn mạnh giá trị thực tế nào nhất để thuyết phục BGK ở tiêu chí "Điểm mới và lợi thế cạnh tranh"?*

---

### 6. Định hướng phát triển sau cuộc thi (Đồ án tốt nghiệp / Nghiên cứu):
- **Bối cảnh của nhóm:**  
  Nhóm xác định SimpliFey là sản phẩm mã nguồn mở phục vụ cộng đồng sinh viên, và nhóm muốn tiếp tục phát triển đề tài này thành **Đồ án tốt nghiệp / Đề tài Nghiên cứu khoa học** (nghiên cứu về độ tin cậy của AI trong giáo dục lập trình), chưa đặt mục tiêu thành lập startup kinh doanh ngay.
- **Câu hỏi tham vấn anh Cảnh:**  
  *Trong tiêu chí "Tính ứng dụng và khả năng phát triển sau cuộc thi", BGK có bắt buộc đề tài phải có mô hình kinh doanh/thương mại hóa kiếm tiền không ạ? Nếu nhóm định hướng phát triển tiếp thành Đồ án tốt nghiệp và đề tài nghiên cứu chuyên sâu thì có được đánh giá cao không anh?*

---

## 📝 BẢNG GHI NHẬN Ý KIẾN CỦA ANH CẢNH

| STT | Vấn đề hỏi | Lời khuyên của Anh Cảnh | Việc nhóm cần làm ngay |
| :-: | :--- | :--- | :--- |
| **1** | Thu hẹp phạm vi đề tài sang repo code | | |
| **2** | Phân bổ mốc thời gian trong 21 giờ | | |
| **3** | Cách giải thích kiến trúc & mở rộng | | |
| **4** | Ứng phó khi BGK yêu cầu thử repo lạ | | |
| **5** | Định vị điểm mới (chống vibe-coding) | | |
| **6** | Định hướng Đồ án tốt nghiệp / Nghiên cứu | | |
