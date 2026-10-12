# KIẾN TRÚC HỆ THỐNG & ĐẶC TẢ VẬN HÀNH DỮ LIỆU
## DỰ ÁN: SGU-FEYNMAN (HỆ THỐNG LUYỆN TƯ DUY & CHẨN ĐOÁN LỖ HỔNG TRI THỨC)

Tài liệu kỹ thuật chuẩn hóa toàn bộ kiến trúc, cấu trúc dữ liệu và quy trình vận hành hệ thống SGU-Feynman. Văn bản này đóng vai trò là bản thiết kế hệ thống chính thức (System Spec), chuyển hóa các câu hỏi - đáp kỹ thuật thành một đặc tả kiến trúc mạch lạc, chuẩn xác, không dùng thuật ngữ đao to búa lớn.

---

## 1. MÔ HÌNH PHÂN CHIA TRÁCH NHIỆM TRONG HỆ THỐNG

Hệ thống phân định rõ ràng vai trò giữa **Bộ điều phối Backend** và **Trí tuệ Nhân tạo (Gemini AI)** qua 2 giai đoạn:

### Giai đoạn 1: Khởi tạo bài học (Ingestion & Graph Generation)
1. **Người dùng tải file tài liệu (PDF/slide bài giảng) lên:**
2. **AI phân tích nội dung:** Đọc hiểu tài liệu, bóc tách các khái niệm trọng tâm cùng mối quan hệ trước - sau để **tự động sinh ra cây sơ đồ bài học ban đầu (Curriculum Graph)**.
3. **Người dùng kiểm tra & Tinh chỉnh:** Người dùng có toàn quyền xem trước, chỉnh sửa tên node, thêm/bớt hoặc sắp xếp lại các node theo ý mình trước khi khóa sơ đồ bắt đầu học.

### Giai đoạn 2: Phiên học tương tác (Interactive Feynman Session)
Trong suốt quá trình học, hai thành phần phối hợp nhịp nhàng:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               PHÂN ĐỊNH TRÁCH NHIỆM KỸ THUẬT (SYSTEM ROLES)            │
├──────────────────────────────────┬─────────────────────────────────────┤
│      BACKEND ENGINE (ĐIỀU PHỐI)  │       MÔ HÌNH AI (GEMINI FLASH)     │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Lưu trữ & quản lý cây Đồ thị   │ • Phân tích file tải lên sinh node  │
│ • Kiểm tra điều kiện tiên quyết  │ • Đọc hiểu câu giải thích của User  │
│ • Quản lý số lần giải thích      │ • Đánh giá mức độ hiểu (Rubric)     │
│ • Điều phối giàn giáo nhận thức  │ • Nhận diện từ khó & lỗi sai logic  │
│ • Cập nhật màu Node (Xám/Vàng...)│ • Trích xuất hình ảnh ẩn dụ đời thực│
│ • Gửi context gọn theo từng node │ • Trả về JSON kèm câu hỏi tiếp theo │
└──────────────────────────────────┴─────────────────────────────────────┘
```

> **Nguyên tắc vận hành:**  
> AI đóng vai trò phân tích nội dung (sinh sơ đồ từ file và thẩm định mức độ hiểu của từng câu nói). Toàn bộ việc lưu trữ tiến độ, kiểm tra điều kiện tiên quyết và cập nhật trạng thái màu của Node do **Backend quản lý trực tiếp trên cây sơ đồ**. Nhờ vậy, mỗi lượt chat chỉ cần gửi tin nhắn gần nhất kèm tiêu chuẩn của node hiện tại, giúp dữ liệu luôn tinh gọn và hệ thống hoạt động ổn định.

---

## 2. SƠ ĐỒ PHÂN TẦNG HỆ THỐNG (SYSTEM ARCHITECTURE)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. TẦNG GIAO DIỆN (Client Frontend - React / ReactFlow)                 │
│  - Cột Trái: Cây đồ thị bài học (ReactFlow), đổi màu Node (Xám/Vàng/Đỏ) │
│  - Cột Phải: Khung chat văn bản, Avatar đổi biểu cảm SVG theo cảm xúc   │
│  - Báo cáo: Màn hình Mindmap chẩn đoán lỗ hổng khi kết thúc phiên       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP Request { user_message, active_node_id }
┌────────────────────────────────────▼────────────────────────────────────┐
│ 2. TẦNG ĐIỀU PHỐI (Backend Controller & State Machine)                  │
│  - Quản lý trạng thái Node: status, retry_count, scaffold_level         │
│  - Quản lý hàng đợi Rolling Window: Giữ đúng 2 lượt chat gần nhất       │
│  - Bộ tiêm lệnh ẩn: Bọc mật lệnh điều hướng trong thẻ XML chống rò rỉ   │
│  - Thuật toán duyệt Đồ thị: Kiểm tra 100% node cha Xanh trước khi mở    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Single-Pass Prompting (Input ~150 tokens)
┌────────────────────────────────────▼────────────────────────────────────┐
│ 3. TẦNG XỬ LÝ NGÔN NGỮ (AI Engine - Gemini Flash)                       │
│  - System Instruction ghim chặt vai diễn và mục tiêu bài học            │
│  - Nhận diện câu nói người dùng, phân tích độ hiểu                      │
│  - BẮT BUỘC trả về đúng 1 gói tin JSON có cấu trúc (Structured Output) │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CẤU TRÚC DỮ LIỆU CỐT LÕI (DATA SCHEMAS)

Hệ thống vận hành xoay quanh 2 hợp đồng dữ liệu chính thức:

### 3.1. Cấu trúc Đồ thị & Node Bài học (`ConceptNode`)
Sinh ra một lần duy nhất tại Màn 1 (lúc nạp slide hoặc chọn bài mẫu). Được lưu trữ trên bộ nhớ Backend:

```typescript
interface ConceptNode {
  // A. Định danh & Cấu trúc liên kết
  id: string;                         // Mã định danh duy nhất (vd: "node_pointer")
  title: string;                      // Tên bài học hiển thị (vd: "Con trỏ")
  prerequisites: string[];            // Danh sách ID các node cha bắt buộc phải XANH trước đó
  
  // B. Trạng thái động (Backend cập nhật sau mỗi lượt chat)
  status: "GRAY" | "YELLOW" | "RED" | "GREEN"; // Trạng thái màu (Mặc định: GRAY)
  retry_count: number;                // Số lần giải thích chưa đạt tại node này (0 -> 3)
  scaffold_level: 1 | 2 | 3;          // Bậc thang giàn giáo nhận thức (Mặc định: 1)

  // C. Tiêu chuẩn Sư phạm (Nạp vào prompt để AI soi chiếu)
  pedagogical_spec: {
    core_facts: string[];             // Ý bản chất cốt lõi bắt buộc phải chạm tới
    forbidden_jargons: string[];      // Danh sách từ chuyên môn cấm dùng mồi
    common_misconceptions: string[];  // Bẫy ngộ nhận / lỗi sai bản chất kinh điển
    real_world_anchor?: string;       // Tình huống đời thường gợi ý mồi (Tùy chọn)
  };
}

interface Edge {
  id: string;                         // Vd: "edge_var_to_ptr"
  source: string;                     // ID Node cha (học trước)
  target: string;                     // ID Node con (học sau)
}
```

### 3.2. Gói tin JSON AI Trả Về Backend (`AIEvaluationResponse`)
Sau mỗi câu người dùng gửi đi, AI bắt buộc phản hồi về gói tin JSON chuẩn sau:

```json
{
  // 1. BỘ BA ĐIỂM SỐ RUBRIC (Lượng hóa mức độ hiểu để Backend tính toán)
  "scores": {
    "core_accuracy": 85,          // (0-100) Mức độ chính xác so với core_facts của bài
    "simplicity": 90,             // (0-100) Mức độ bình dân, mộc mạc (càng ít từ khó điểm càng cao)
    "analogy_grounding": 75       // (0-100) Mức độ liên hệ thực tế / vượt qua câu hỏi bẫy
  },

  // 2. KẾT LUẬN LƯỢT CHAT & PHÂN LOẠI Ý ĐỊNH
  "intent": "EVALUATION",          // "EVALUATION" (Người học trả lời thử thách) | "ELABORATION" (Người học nói thêm ý, bổ sung -> Backend KHÔNG tăng retry_count)
  "is_valid": true,                // true: đạt chuẩn lượt này / false: chưa đạt
  "user_surrendered": false,       // true: người dùng bảo "Không biết", "Chịu rồi", hoặc bấm nút "Tạm bỏ qua / Skip"

  // 3. BẮT LỖI SƯ PHẠM RẠCH RÒI
  "is_node_misconception": false,  // true: Hiểu sai bản chất Node chính -> Backend gán màu ĐỎ
  "detected_jargons": [],          // Danh sách từ chuyên môn phát hiện -> Backend gán màu VÀNG
  "peripheral_misconception": {    // Lỗi kiến thức phụ ngoài lề (Vd: RAM) -> Lưu báo cáo, KHÔNG phạt Đỏ Node chính
    "has_error": false,
    "topic": "",
    "description": ""
  },
  "is_off_topic": false,           // true: người dùng nói chuyện phiếm ngoài lề

  // 4. CHẤT LIỆU BẮC CẦU & LỜI THOẠI UI
  "extracted_metaphor": "Hộp nhựa dán tên", // Trích xuất ẩn dụ thành công để nối bài sau
  "ai_chat_response": "Anh ơi vậy cái hộp nhựa đó chứa được cái gì vậy anh?" // Câu nói hiển thị lên UI
}
```

---

## 4. LUỒNG DỮ LIỆU TOÀN TRÌNH (STEP-BY-STEP DATA FLOW)

Mỗi khi người dùng gõ 1 câu giải thích, luồng dữ liệu chạy qua 4 bước khép kín:

```text
[BƯỚC 1: FRONTEND GỬI TIN NHẮN]
User nhập: "Biến là cái hộp dán nhãn để cất đồ trong RAM."
Frontend gửi: { user_message, active_node_id: "node_variable" }
       │
       ▼
[BƯỚC 2: BACKEND ĐÓNG GÓI PAYLOAD O(1)]
1. Lấy thông số của "node_variable" (core_facts, jargons, scaffold_level).
2. Chọn Mật lệnh ẩn bọc trong thẻ XML <DEVELOPER_DIRECTIVE> theo trạng thái hiện tại.
3. Ghép Payload chuẩn gồm 3 khối:
   - Khối 1: System Instruction (Ghim vai đứa trẻ 10 tuổi + Mục tiêu bài học).
   - Khối 2: Mật lệnh XML Directive (Lệnh điều hướng ngầm).
   - Khối 3: Rolling Window (Chỉ lấy đúng 2 lượt chat gần nhất).
4. Gọi API Gemini Flash (Input cố định ~150 tokens).
       │
       ▼
[BƯỚC 3: AI CHẤM ĐIỂM & TRẢ VỀ JSON]
Gemini Flash phân tích câu nói và trả về JSON AIEvaluationResponse:
{
  "scores": { "core_accuracy": 85, "simplicity": 60, "analogy_grounding": 80 },
  "is_valid": false,
  "detected_jargons": ["RAM"],
  "is_node_misconception": false,
  "extracted_metaphor": "Cái hộp dán nhãn",
  "ai_chat_response": "Ủa anh ơi, 'RAM' là cái gì vậy anh?"
}
       │
       ▼
[BƯỚC 4: BACKEND CHẠY BỘ LUẬT IF/ELSE & CẬP NHẬT TRẠNG THÁI]
Backend đọc JSON và chạy bộ luật gán màu toán học:
- NẾU intent == "ELABORATION" (người dùng nói thêm ý, bổ sung): Giữ nguyên status = "YELLOW", KHÔNG tăng retry_count, AI tiếp tục lắng nghe.
- NẾU intent == "EVALUATION" và thấy detected_jargons có từ "RAM": Giữ status = "YELLOW", tăng retry_count += 1, nâng scaffold_level.
- NẾU user_surrendered == true hoặc retry_count >= 3: Đổi status = "RED", chuyển bài tiếp theo (hoặc dừng sớm nếu là Node gốc).
- Lưu "Cái hộp dán nhãn" vào bộ nhớ bắc cầu.
- Cắt bỏ thẻ XML directive trước khi lưu câu chat vào lịch sử cuốn chiếu (chống ô nhiễm).
- Trả kết quả về Frontend:
  + ReactFlow đổi viền Node tương ứng.
  + Khung chat in câu thoại của đứa trẻ.
```

---

## 5. BỘ THUẬT TOÁN ĐIỀU PHỐI ĐỒ THỊ BACKEND (GRAPH ALGORITHMS)

Toàn bộ logic chuyển bài đều do 2 hàm giải thuật sau kiểm soát:

### 5.1. Thuật toán Khởi động phiên học (Cold Start)
```typescript
function findColdStartNode(nodes: ConceptNode[], edges: Edge[]): ConceptNode {
  // Lọc các node không có node cha (in-degree == 0)
  const rootCandidates = nodes.filter(node => node.prerequisites.length === 0);

  if (rootCandidates.length === 1) return rootCandidates[0];

  // Nếu có >= 2 node gốc: Chọn node làm nền tảng cho nhiều node con nhất (out-degree cao nhất)
  rootCandidates.sort((a, b) => {
    const outDegreeA = edges.filter(e => e.source === a.id).length;
    const outDegreeB = edges.filter(e => e.source === b.id).length;
    return outDegreeB - outDegreeA;
  });

  return rootCandidates[0];
}
```

### 5.2. Thuật toán Mở khóa Node tiếp theo (Kiểm tra 100% cha XANH)
```typescript
function findNextNodeToActivate(
  completedNodeId: string, 
  nodes: ConceptNode[], 
  edges: Edge[]
): ConceptNode | null {
  // 1. Tìm các node con trực tiếp của node vừa xong
  const childEdges = edges.filter(e => e.source === completedNodeId);
  const candidateChildNodes = childEdges.map(e => nodes.find(n => n.id === e.target)!);

  // 2. Chỉ chọn node con nào mà TẤT CẢ các node cha của nó đều đã mang màu XANH (GREEN)
  const readyNodes = candidateChildNodes.filter(childNode => {
    const parentEdges = edges.filter(e => e.target === childNode.id);
    const allParentsGreen = parentEdges.every(e => {
      const parent = nodes.find(n => n.id === e.source);
      return parent && parent.status === "GREEN";
    });
    return allParentsGreen && childNode.status === "GRAY";
  });

  if (readyNodes.length > 0) return readyNodes[0];

  // 3. Quét toàn đồ thị tìm bất kỳ node GRAY nào khác đã đủ điều kiện cha Xanh
  const anyReadyNode = nodes.find(node => {
    if (node.status !== "GRAY") return false;
    const parentEdges = edges.filter(e => e.target === node.id);
    return parentEdges.every(e => {
      const parent = nodes.find(n => n.id === e.source);
      return parent && parent.status === "GREEN";
    });
  });

  return anyReadyNode || null; // null nghĩa là toàn bộ đồ thị đã XANH -> Hoàn thành bài học!
}
```

---

## 6. BẢO VỆ DỮ LIỆU KHI HOÀN THÀNH PHIÊN (BÁO CÁO MÀN 3)

Khi phiên học kết thúc hoặc người dùng bấm dừng sớm, Backend gom dữ liệu thành đối tượng `DiagnosticReport` để Frontend vẽ biểu đồ radar và danh sách lỗ hổng mà không cần tính toán lại:

```typescript
interface DiagnosticReport {
  sessionId: string;
  topicTitle: string;
  totalInteractions: number;
  overallMasteryPercent: number;      // % Điểm thấu suốt (Số Node Xanh / Tổng Node)
  
  nodesSummary: {
    masteredNodes: string[];          // Node XANH (Nắm vững)
    weakNodes: string[];              // Node VÀNG (Hiểu nông / Còn dùng từ khó)
    misconceptionNodes: string[];     // Node ĐỎ (Hiểu sai bản chất)
  };

  // Chi tiết lỗ hổng kiến thức chính
  pedagogicalInsights: {
    nodeId: string;
    nodeTitle: string;
    status: "YELLOW" | "RED";
    reason: string;
  }[];

  // Điểm mù kiến thức phụ ngoài lề (Vd: RAM)
  peripheralInsights: {
    triggerNode: string;
    topic: string;
    description: string;
  }[];
}
```
