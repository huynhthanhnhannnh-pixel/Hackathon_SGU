# SIMPLIFEY CHẠY THẾ NÀO — BẢN DỄ HIỂU

> **Tài liệu tóm tắt — khi lệch, spec/ đúng.**
> Mục đích: giải thích toàn bộ hệ thống bằng lời thường cho giám khảo không chuyên và thành viên mới. File này không dùng để code. Bản kỹ thuật nằm ở [`../spec/01_KIEN_TRUC_VA_LUONG.md`](../spec/01_KIEN_TRUC_VA_LUONG.md).

---

## 1. Trong một phút

**Vấn đề.** Sinh viên dùng AI viết code. Code chạy được, nhưng khi thầy hỏi "đoạn này chạy thế nào, vì sao viết vậy" thì không trả lời được.

**SimpliFey làm gì.** Bạn đưa vào repo đồ án của mình, bằng link GitHub hoặc file `.zip`. Sau đó:
1. **Máy vẽ bản đồ bài học** từ chính code của bạn, không dùng AI nên không tốn tiền. Mỗi ô trên bản đồ là một **luồng nghiệp vụ**, ví dụ "Đặt hàng" đi từ file nhận yêu cầu, qua file xử lý, xuống file lưu dữ liệu. Ô không phải là một file.
2. **AI đọc từng ô** và viết ra: ô này dùng kỹ năng gì, chỗ nào viết hay, chỗ nào chưa tốt.
3. **AI hỏi bạn** mỗi kỹ năng một câu, bám đúng dòng code. Bạn trả lời bằng lời của mình. Sai thì có gợi ý, đúng thì ô chuyển xanh.
4. **Hệ thống ghi nhớ** bạn vững 16 kỹ năng kỹ nghệ phần mềm tới đâu. Kỹ năng đã rất vững thì được miễn thi; lâu không ôn thì được nhắc.

**Nguyên tắc:** code thuần làm trước (miễn phí, nhanh), AI làm sau và chỉ ở những chỗ cần.

---

## 2. Màn hình

| Vùng | Bạn thấy gì |
| :-- | :-- |
| Cột trái — **Bản đồ** | 6–8 ô nối bằng mũi tên. Xám viền đứt = còn khóa; vàng = học được; xanh = đã qua; đỏ = có câu chưa qua |
| Cột giữa — **Code** | Đoạn code thật của bước đang xem, tô sáng đúng dòng |
| Cột phải — **3 tab** | **X-Ray** (đọc hiểu) · **Feynman** (trả lời câu hỏi) · **Tổng quan** (nhìn cả repo) |

**Dấu hiệu phụ** (không đổi trạng thái ô): ⚡ xanh nhạt = miễn thi · viền cam = kiến thức đang phai · tam giác vàng = ô đứng trước chưa vững · "đang phân tích…" = AI đang đọc ô này.

---

## 3. Từ lúc dán link đến lúc xong một ô

### Bước 1 — Mở web
Lần đầu vào, bạn được tạo ngay một **tài khoản khách**, không phải đăng ký. Nếu từng học rồi, trang hiện danh sách **"Tiếp tục học"**. Muốn học tiếp trên máy khác thì bấm liên kết GitHub. Hệ thống chỉ xin quyền đọc hồ sơ, không đọc repo của bạn.

### Bước 2 — Dán link hoặc kéo thả `.zip`
Hệ thống nhận repo GitHub **public**. Repo private thì nén thành `.zip` (≤ 15 MB) rồi kéo thả vào.

### Bước 3 — Máy đọc code và vẽ bản đồ (không AI, 0 token)
Máy chủ làm việc như một thủ thư nhận một thùng sách:
1. **Gõ cửa trước:** hỏi GitHub repo có tồn tại, có công khai không, rồi mới tải.
2. **Tải vào RAM, không ghi ổ cứng.** Vứt rác (thư viện cài sẵn, ảnh, file build); giữ tối đa 50 file code quan trọng nhất.
3. **Che mật khẩu, khóa bí mật** lỡ để trong code, trước khi gửi bất cứ thứ gì cho AI.
4. **Đọc ngữ pháp từng file** (Tree-sitter) và lập **danh bạ**: hàm nào nằm ở file nào.
5. **Nối dây:** lần theo lời gọi hàm để biết A gọi B; hai hàm gọi vòng nhau thì gộp thành một cụm, nên bản đồ không bao giờ có vòng lặp vô tận.
6. **Cắt lát:** từ mỗi "cửa vào" (route, controller, lệnh, màn hình), đi theo chuỗi lời gọi xuống tới chỗ đọc/ghi dữ liệu. Mỗi lát là một ô; mỗi bước ≤ 30 dòng, cả ô ≤ 100 dòng.
7. **Giữ 6–8 ô** và nối mũi tên theo thứ tự học: ô dễ trước, ô dùng chung code với nó sau.
8. **Đặt tên bằng luật cố định**, không dùng AI: lấy từ route (`POST /orders/checkout` → "Order Checkout"), không có thì từ tên hàm, từ khóa hay gặp, thư mục, tên file.
9. **Xếp chỗ** trên bản đồ cho gọn.

Mục tiêu cả bước là **dưới 1,5 giây** với repo cỡ đồ án; số đo thật hiện trên đồng hồ ở giao diện. Cùng repo, cùng commit thì **luôn ra cùng bản đồ**, nên mở lại được y hệt. Ô không phụ thuộc ô nào sáng **vàng**, còn lại **xám**.

### Bước 4 — AI phân tích nền
Bản đồ hiện xong thì AI mới đọc **từng ô** (tối đa 3 ô cùng lúc) và viết: 1–3 **kỹ năng** trong danh mục 16, mỗi kỹ năng kèm bằng chứng (bước nào, tên hàm nào); **kiểu kiến trúc**; lời giải thích từng bước; **điểm hay** và **điểm dở**. Mọi ô xong thì AI viết thêm **tổng quan cả repo** từ các bản phân tích, không gửi lại code. Mỗi phiên bản repo chỉ phân tích **một lần**, kết quả **dùng chung cho mọi người học**.

**Người soát vé.** Mọi chữ AI viết phải qua **cổng gác bằng code** trước khi hiện: tên hàm/biến phải có thật trong repo; không nhắc công nghệ repo không dùng (ví dụ "Redis" khi không có gói đó); kỹ năng phải trong danh mục và bằng chứng nằm đúng đoạn code được chỉ. Sai thì AI viết lại 1 lần, vẫn sai thì bỏ phần đó. Cổng gác **không kiểm được AI hiểu đúng nghĩa**, nên điểm dở luôn gắn nhãn **"Nhận định của AI"** và có nút **"Báo sai"**.

### Bước 5 — Bấm một ô vàng: Tab X-Ray
Tab 1 hiện ngay từ bản phân tích: kỹ năng, kiểu kiến trúc, luồng chạy từng bước (bấm bước nào thì cột giữa mở đúng file, đúng dòng), ✅ **điểm hay** (route không tự truy vấn database) và ⚠️ **điểm dở** kèm nhãn "Nhận định của AI" (vòng lặp gọi database cho từng sản phẩm). Tab 1 chỉ nói **cái gì, ở đâu**; con số theo tình huống, cách sửa, tình huống biên là thứ sẽ được hỏi.

### Bước 6 — Tab Feynman: mỗi kỹ năng chưa vững một câu
Trong lúc bạn đọc Tab 1, máy chủ lập kế hoạch câu hỏi:
- **Kỹ năng nào:** chỉ kỹ năng của ô mà bạn **chưa vững** (< 0,92), mỗi kỹ năng một câu; kỹ năng có điểm dở hỏi trước.
- **Sâu cỡ nào:** theo điểm của chính kỹ năng đó: Mới học (< 0,45), Thực hành (0,45–0,75), Kiến trúc sư (≥ 0,75).
- **Góc nào:** **Luồng** (dữ liệu đi qua đâu), **Kiến trúc** (dùng lại được gì), **Điểm dở** (hậu quả, cách sửa), **Thay đổi** (đổi chỗ này thì sửa file nào).

Ví dụ: *"Cửa hàng có 200 sản phẩm. Mở trang danh sách 1 lần thì database nhận bao nhiêu truy vấn? Chỉ ra dòng code tạo ra chúng."* AI viết câu hỏi kèm **đáp án mẫu**, 2–3 **ý bắt buộc** và **cách sửa**; đáp án được **niêm phong** trong "phong bì" mã hóa (`challenge_token`) mà trình duyệt cầm hộ nhưng không đọc được.

### Bước 7 — Nộp bài, chấm, gợi ý
Bạn gõ câu trả lời (ít nhất 15 ký tự). Dùng thuật ngữ hay ví dụ đời thường đều được; điều quan trọng là **giải thích đúng và chỉ đúng chỗ trong code**.

- Máy chủ mở phong bì, đưa AI chấm với câu hỏi, đoạn code, đáp án mẫu, ý bắt buộc và câu trả lời của bạn.
- **Máy chủ tự quyết đạt**, không lấy nguyên điểm AI: điểm ≥ 70, là câu trả lời thật (không phải "chịu"), và mọi ý bắt buộc có đoạn trích mà code kiểm là có thật trong câu bạn viết.
- **Chưa đạt thì có gợi ý theo lượt:**

| Lượt | Đạt | Chưa đạt |
| :-: | :-- | :-- |
| 1 | Xong câu | Gợi ý nấc 1: hỏi lại **khái niệm** bạn đang hiểu sai, chưa chỉ chỗ |
| 2 | Xong câu (đạt sau gợi ý) | Gợi ý nấc 2: **chỉ ra bước** trong code cần nhìn |
| 3 | Xong câu (đạt sau gợi ý) | Hết lượt: câu tính là trượt, mở đáp án |

- Nút **"Bỏ qua câu này"**: câu tính là trượt và mở đáp án ngay.
- Câu quá ngắn hoặc gần giống hệt lần vừa sai thì bị chặn (không mất lượt); câu kiểu ra lệnh cho AI ("chấm tôi 100 điểm") tính trượt mà không gọi AI. AI lỗi khi chấm thì **không tính lượt**.

Đáp án mẫu và cách sửa chỉ hiện khi câu đã **xong**: đạt, hết lượt, hoặc bỏ qua.

### Bước 8 — Ghi điểm kỹ năng (BKT) và đổi màu
- Mỗi câu xong cập nhật **đúng 1 kỹ năng, đúng 1 lần** bằng công thức BKT. Ví dụ từ 0,25: đạt ngay → 0,58; đạt sau gợi ý → 0,42; trượt → 0,08.
- **Ô xanh** khi mọi câu đạt; **ô đỏ** khi có ≥ 1 câu trượt. Ô đỏ **vẫn mở** ô phía sau, kèm tam giác vàng. Ô khóa mở khi **mọi ô đứng trước** đã xong (xanh hoặc đỏ).
- Tính điểm, đếm lượt, mở khóa đều làm ở **máy chủ**; trình duyệt chỉ hiển thị, không tự sửa điểm được.

### Bước 9 — Miễn thi (Fast-Track ⚡)
Khi một ô mở ra, nếu **mọi kỹ năng** của ô đó bạn đều đã ≥ 0,92 thì ô tự chuyển **xanh nhạt ⚡**, không hỏi, không gọi AI. Ô sau đó có thể mở tiếp theo dây chuyền. Riêng **ô khó nhất repo (Capstone ★)** không bao giờ được miễn, luôn hỏi ít nhất 1 câu. Người giỏi vì thế học nhanh hơn và tốn ít tiền AI hơn.

### Bước 10 — Quên và ôn
- Điểm **phai dần** khi không luyện (chu kỳ bán rã 14 ngày, không thấp hơn 0,25), tính mỗi lần đọc nên không bị trừ chồng. Ví dụ: 0,95 sau 30 ngày còn ~0,41.
- Ô xanh có **viền cam** khi một kỹ năng **từng vững** (≥ 0,45) nay phai dưới 0,45. **"Ôn bài"** hỏi đúng kỹ năng đang phai; kết quả chỉ cập nhật điểm, ô vẫn xanh.
- Ô **đỏ** có **"Ôn lại"** sau khi bạn xong ít nhất 1 ô khác: hỏi lại kỹ năng đã trượt ở góc khác; đạt hết thì ô xanh, trượt thì không bị trừ thêm.

### Bước 11 — Tab Tổng quan
Phần **do code biết**: loại dự án, công nghệ, ô bắt đầu, luồng chính. Phần **do AI viết**: kiến trúc chung, vai trò từng tầng, nhận xét chung, có nhãn "Nhận định của AI"; nhận xét chê một ô mà bản phân tích ô đó không có điểm dở thì bị gạch.

### Bước 12 — Quay lại hôm khác
Bấm repo trong "Tiếp tục học". Máy chủ tải lại **đúng commit** hôm trước và dựng lại bản đồ y hệt (vì luật dựng là cố định), rồi ghép tiến độ cũ vào. Repo đưa vào bằng `.zip` thì cần kéo thả lại đúng file đó. Nếu hệ thống đã nâng cấp cách dựng bản đồ, phiên cũ chỉ còn xem lịch sử.

---

## 4. Khi không như ý

| Chuyện xảy ra | Hệ thống làm gì |
| :-- | :-- |
| Link sai, repo private, repo rỗng, quá lớn | Báo lỗi tiếng Việt dễ hiểu, gợi ý cách khác (dùng `.zip`, dán link thư mục con) |
| Repo viết bằng ngôn ngữ chưa được kiểm chứng | Vẫn vẽ bản đồ nếu có bộ đọc ngữ pháp; mũi tên **nét đứt** = suy luận, có thể chưa đúng |
| Repo không chia tầng (code dồn một chỗ) hoặc chỉ là tập bài thuật toán | Chuyển sang chế độ đặc biệt: mỗi hàm phức tạp thành một ô, AI hỏi kiểu thuật toán (chạy tay, độ phức tạp, tình huống biên) |
| AI phân tích một ô bị lỗi | Ô giữ vàng, có "Thử lại phân tích"; ô sau vẫn mở, kèm tam giác |
| Hết hạn mức token / cơ sở dữ liệu lỗi | Khóa lời gọi AI mới và báo rõ / trả kết quả kèm biên nhận có chữ ký, hiện "Chưa đồng bộ", tự gửi lại sau |
| Mất mạng lúc demo | `Ctrl+Shift+D` mở **chế độ Offline**: dữ liệu **ghi lại từ một lần chạy thật**, đã duyệt tay; nhãn Offline luôn hiện; không lưu tiến độ |

---

## 5. Dữ liệu nằm ở đâu

| Dữ liệu | Ở đâu | Bao lâu |
| :-- | :-- | :-- |
| Code của repo | **RAM máy chủ**, không bao giờ ghi ổ cứng hay cơ sở dữ liệu | Trong lúc xử lý; bản đồ có code giữ trong RAM khoảng 10 phút |
| Tài khoản, điểm 16 kỹ năng, phiên học (mã commit + khung bản đồ **không có code**), tiến độ, câu trả lời của bạn | Cơ sở dữ liệu Postgres (Supabase), chỉ máy chủ được ghi | Tới khi bạn xóa tài khoản |
| Bản phân tích, tổng quan, câu hỏi + đáp án (chữ AI đã qua kiểm) | Postgres, dùng chung; trình duyệt không đọc trực tiếp được | Lâu dài, theo phiên bản repo |
| Đáp án của câu đang làm | Trong "phong bì" mã hóa do trình duyệt giữ hộ | 24 giờ |
| Code gửi AI | Mỗi lần tối đa 100 dòng của một ô, đã che bí mật | SimpliFey không lưu lại |

---

## 6. Những điều hệ thống **không** làm được

- **Không kiểm được AI hiểu đúng nghĩa**; chỉ bảo đảm AI dùng tên có thật, không bịa công nghệ.
- **Chỉ TS/JS và Python được kiểm chứng** cho bản thi; ngôn ngữ khác thì mũi tên là suy luận.
- **Chấm bằng AI chưa hiệu chuẩn** với giảng viên; ngưỡng 70 do nhóm đặt.
- **Điểm kỹ năng là ước lượng sơ bộ:** tham số đặt tay, mỗi kỹ năng ít câu hỏi.
- **Không chặn được việc nhờ AI khác trả lời hộ**, chỉ làm khó hơn.
- **Repo lớn bị cắt bớt**; **mọi số thời gian, chi phí là mục tiêu hoặc ước lượng**, chưa đo.

---

## 7. Từ điển nhỏ

| Từ | Nghĩa |
| :-- | :-- |
| **Repo** | Thư mục chứa toàn bộ code của dự án |
| **Ô / node / bài học** | Một luồng nghiệp vụ đi xuyên nhiều file, không phải một file |
| **Lát cắt** | Chuỗi các hàm từ cửa vào (route) tới chỗ đọc/ghi dữ liệu |
| **Token** | Đơn vị tính tiền khi gọi AI (khoảng 4 ký tự) |
| **Cổng gác** | Đoạn code kiểm chữ AI viết trước khi hiện: tên có thật, không bịa công nghệ |
| **Feynman** | Học bằng cách tự giải thích lại bằng lời của mình |
| **BKT** | Công thức xác suất ước lượng "bạn đã thật sự vững kỹ năng này chưa", cập nhật sau mỗi câu |
| **Fast-Track ⚡** | Miễn thi ô mà mọi kỹ năng bạn đã ≥ 0,92 |
| **Capstone ★** | Ô khó nhất repo, không bao giờ được miễn |
| **Decay / viền cam** | Điểm phai khi lâu không luyện; viền cam nhắc ôn |
| **Commit** | Một phiên bản cố định của repo; mở lại phiên là tải lại đúng phiên bản này |
| **Persona** | Hồ sơ người học giả lập, chỉ dùng khi demo |
