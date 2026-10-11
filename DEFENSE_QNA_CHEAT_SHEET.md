# BỘ CÂU HỎI & HƯỚNG DẪN BẢO VỆ KỸ THUẬT (DEFENSE Q&A CHEAT SHEET)
## DỰ ÁN: SGU-FEYNMAN - VÒNG SƠ LOẠI HACKATHON SGU 2026

Tài liệu chuẩn bị các luận điểm phản biện kỹ thuật sắc bén, ngắn gọn, tự tin dành cho đội thi khi đối mặt với các câu hỏi đào sâu từ Hội đồng Ban Giám khảo (BGK).

---

### CÂU HỎI 1: TẠI SAO PHẢI LÀM HỆ THỐNG LAI (HYBRID) MÀ KHÔNG DÙNG THẲNG LLM ĐỂ ĐIỀU KHIỂN TẤT CẢ?
- **Thách thức từ BGK:** *"Hiện nay các mô hình ngôn ngữ lớn (LLM) rất thông minh, tại sao không prompt để LLM tự quyết định xem người học hiểu bài chưa và tự chuyển bài tiếp theo?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Nếu để LLM tự điều khiển tiến trình, hệ thống sẽ mắc phải 2 tử huyệt: **Tính bất định (Non-deterministic)** và **Ảo giác sư phạm (Hallucination)**. LLM có thể dễ dãi bỏ qua cho người học hoặc quyết định nhảy cóc các khái niệm tiên quyết mà không theo thứ tự logic khoa học. 
  > Vì vậy, kiến trúc SGU-Feynman phân định rạch ròi: LLM chỉ làm nhiệm vụ duy nhất là **Thẩm định ngữ nghĩa (Semantic Evaluation)** ở từng lượt nói. Còn toàn bộ lộ trình, điều kiện tiên quyết và việc chuyển trạng thái màu sắc đều do **Thuật toán Đồ thị (Curriculum DAG) và Bộ điều phối trạng thái (FSM) ở Backend** kiểm soát 100% bằng toán học. Điều này bảo đảm tính sư phạm chặt chẽ và nhất quán tuyệt đối."

---

### CÂU HỎI 2: DỰ ÁN TIẾT KIỆM CHI PHÍ NHƯ THẾ NÀO? KHI HÀNG NGHÌN NGƯỜI CHAT CÙNG LÚC THÌ SAO?
- **Thách thức từ BGK:** *"Mỗi lượt chat đều gọi API mô hình AI thì chi phí có bị phình to khi người dùng trò chuyện dài không?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Đây chính là điểm đột phá về mặt kiến trúc của đội em, bám sát trực diện tiêu chí **'Tiết kiệm chi phí'** của cuộc thi. Các chatbot thông thường tích lũy toàn bộ lịch sử trò chuyện, khiến số lượng token tăng theo cấp số nhân $O(N)$ — chat càng dài càng tốn tiền và chậm.
  > SGU-Feynman ứng dụng kiến trúc **$O(1)$ Token Economics**: Chúng em dùng cơ chế *Bộ nhớ ngoài (Memory Externalization)* — toàn bộ trạng thái tiến độ đã được lưu trên Đồ thị DAG ở Backend, do đó mỗi request gửi lên AI chỉ gồm thông số node hiện tại và một Cửa sổ Cuốn chiếu (Rolling Window) đúng 2 lượt chat gần nhất. Token đầu vào luôn bị khóa cứng ở mức ~150 tokens cho mọi câu nói. Chi phí chỉ khoảng **0.0001 USD/lượt** (dưới 3 đồng VNĐ) và phản hồi cực nhanh dưới 800ms."

---

### CÂU HỎI 3: NẾU NGƯỜI DÙNG CỐ TÌNH NÓI NHẢM HOẶC LẠC ĐỀ THÌ SAO?
- **Thách thức từ BGK:** *"Làm sao hệ thống xử lý khi sinh viên nói linh tinh, trêu chọc AI hoặc cố tình không đi vào bài học?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Ở mỗi node, System Instruction của AI luôn được ghim chặt mục tiêu sư phạm của node đó (Pinned Core). Khi phân tích Single-Pass, nếu câu trả lời không chứa thông tin liên quan hoặc cố tình lạc đề, cờ `is_valid` trả về sẽ là `false` kèm lỗi tương ứng.
  > Đồng thời, AI Persona đóng vai người bạn học sẽ hỏi vặn lại: *'Ơ cái này đâu có liên quan đến [Khái niệm] đâu anh, anh giải thích lại giúp em với!'*. Backend duy trì biến `retry_count`. Nếu lạc đề quá 3 lần, hệ thống sẽ đánh dấu node đó là màu ĐỎ, khóa cảnh báo và chuyển bài để không làm nghẽn tiến trình."

---

### CÂU HỎI 4: VÌ SAO BỎ PHAO CỨU SINH (HINT) VÀ VOICE API?
- **Thách thức từ BGK:** *"Tại sao ứng dụng học tập lại không có nút gợi ý đáp án (Hint) hay hỗ trợ giọng nói (Voice)?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Chúng em đã cân nhắc kỹ dựa trên góc nhìn Sư phạm và Kỹ thuật thực chiến:
  > 1. **Về mặt sư phạm (Tránh xung đột vai diễn):** Kỹ thuật Feynman cốt lõi là người học đóng vai người giảng, còn AI đóng vai người học chưa biết gì. Một đứa trẻ tò mò không thể 'mớm đáp án ngược lại' cho người dạy. Nếu cho nút Hint, người học sẽ ỷ lại và quay lại lối mòn học thụ động. Thay vào đó, chúng em giải quyết rào cản bằng cơ chế **Giàn giáo nhận thức 3 bậc (Scaffolding)** để AI mồi tình huống đời thường.
  > 2. **Về mặt kỹ thuật thực tế:** Môi trường thi đấu và phòng học thường ồn ào, Web Speech API của trình duyệt hoạt động thiếu ổn định giữa các thiết bị. Khung Text Console 1–2 câu cô đọng giúp người học rèn luyện tư duy gãy gọn và bảo đảm độ ổn định tối đa."

---

### CÂU HỎI 5: KẾ HOẠCH TRIỂN KHAI THỰC TẾ TRONG 24 GIỜ VÒNG THỬ THÁCH (HACKATHON DELIVERY)?
- **Thách thức từ BGK:** *"Ý tưởng nghe rất hay nhưng liệu các bạn có kịp hiện thực hóa sản phẩm hoàn chỉnh trong 24 giờ thi tập trung không?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Hệ thống đã được chúng em module hóa cực kỳ tinh gọn và độc lập thành 2 trục:
  > - **Trục Backend/Đồ thị:** Chỉ cần quản lý cấu trúc dữ liệu DAG trên bộ nhớ (In-memory) và thuật toán duyệt Topo/Kahn đơn giản, không phụ thuộc vào Database bên ngoài phức tạp.
  > - **Trục AI:** Toàn bộ tương tác được thu gọn vào đúng 1 Endpoint duy nhất với Single-Pass JSON Contract.
  > Nhờ phân tách rõ ràng qua các Hợp đồng Dữ liệu (Data Contracts), nhóm lập trình viên Frontend, Backend và AI có thể ráp nối giao diện ReactFlow với Core Engine chỉ trong vài giờ đầu và dành toàn bộ thời gian còn lại để tinh chỉnh trải nghiệm sư phạm."

---

### CÂU HỎI 6: LÀM SAO BIẾT NGƯỜI HỌC THỰC SỰ HIỂU HAY CHỈ COPY SÁCH GIÁO KHOA? VÀ LỠ AI CHẤM SAI THÌ SAO?
- **Thách thức từ BGK:** *"Nếu sinh viên copy nguyên văn định nghĩa trong sách mà không có từ khó, hệ thống có bị lừa cho qua không? Và nếu AI đánh giá sai lệch thì sao?"*
- **Câu trả lời chuẩn kỹ thuật:**
  > "Chúng em giải quyết trọn vẹn cả 2 vấn đề này bằng mô hình **Thẩm định Đa tiêu chí (Rubric Scoring)** và **Cơ chế Kháng sai (Fault Tolerance)**:
  > 1. **Chống học vẹt sách giáo khoa:** AI không chỉ chấm đúng/sai, mà lượng hóa thành 3 điểm số: *Độ chính xác (Accuracy)*, *Độ bình dị (Simplicity)*, và *Độ liên hệ thực tế (Analogy Grounding)*. Nếu người học copy sách giáo khoa, điểm chính xác có thể cao nhưng điểm liên hệ thực tế sẽ dưới 60. Backend lập tức giữ màu VÀNG và kích hoạt câu hỏi ngoại suy tình huống của đứa trẻ để thử thách độ thấu suốt thực sự.
  > 2. **Kháng sai lệch AI:** AI không bao giờ được phép tự phán quyết màu, mà chỉ cung cấp điểm số cho bộ luật Backend gán màu toán học. Hơn nữa, AI đóng vai một đứa trẻ học hỏi, phản xạ 'chưa hiểu' của đứa trẻ chỉ là cơ hội để người học thử nghiệm thêm một cách diễn đạt mới. Nếu bế tắc quá 3 lần, hệ thống tự động cho qua để bảo vệ trải nghiệm và lưu vào danh sách chẩn đoán cuối phiên."
