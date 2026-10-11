# ĐẶC TẢ KỸ THUẬT CÁC ĐỘNG CƠ CỐT LÕI (TECHNICAL ENGINES SPECIFICATION)
## DỰ ÁN: SGU-FEYNMAN

Tài liệu chi tiết hóa 2 trục chuyên môn trong hệ thống:
- **Trục 1:** Thuật toán Đồ thị & Quản trị Trạng thái Backend (Graph & State Engine).
- **Trục 2:** Kỹ thuật AI & Dẫn dắt Hội thoại (AI & Dialogue Flow).

---

# PHẦN 1: TRỤC THUẬT TOÁN ĐỒ THỊ & TRẠNG THÁI (TRỤC SỐ 1 - BACKEND)

*(Ghi chú: Các câu hỏi dưới đây đang trong quá trình Người thứ nhất hoàn thiện, giữ nguyên cấu trúc để cập nhật khi có kết quả chính thức)*

### Câu 1: Cold Start & Lựa chọn Node xuất phát

#### 1. Tiêu chuẩn Chọn Node Gốc & Quy tắc Phá vỡ Thế cân bằng (Tie-breaking Rule)
Khi người dùng bấm "Bắt đầu học", hệ thống phải xác định chính xác một node duy nhất để kích hoạt làm điểm xuất phát:
- **Tiêu chí cốt lõi:** Lọc tất cả các node không có điều kiện tiên quyết (`in-degree == 0` hay `prerequisites.length == 0`).
- **Quy tắc giải quyết khi có $\ge 2$ node gốc (Tie-breaking):**
  - **Ưu tiên 1 (Out-degree Heuristic):** Chọn node có số bậc ra (`out-degree`) lớn nhất — tức node làm nền tảng tri thức cho nhiều node con phụ thuộc phía sau nhất (node "trụ cột").
  - **Ưu tiên 2 (Document Order):** Nếu `out-degree` bằng nhau, chọn node xuất hiện trước theo thứ tự gốc trong tài liệu/slide ban đầu.

#### 2. Thuật toán & Mã giả (Pseudo-code)
```typescript
function findColdStartNode(nodes: ConceptNode[], edges: Edge[]): ConceptNode {
  // Bước 1: Lọc các node không có điều kiện tiên quyết (bậc vào in-degree == 0)
  const rootCandidates = nodes.filter(node => node.prerequisites.length === 0);

  if (rootCandidates.length === 0) {
    throw new Error("Lỗi đồ thị: Tồn tại chu trình, không tìm thấy node gốc!");
  }

  // Trường hợp 1: Duy nhất 1 node gốc -> Kích hoạt ngay
  if (rootCandidates.length === 1) {
    return rootCandidates[0];
  }

  // Trường hợp 2: Có >= 2 node gốc -> Sắp xếp theo out-degree giảm dần
  rootCandidates.sort((a, b) => {
    const outDegreeA = edges.filter(edge => edge.source === a.id).length;
    const outDegreeB = edges.filter(edge => edge.source === b.id).length;
    return outDegreeB - outDegreeA;
  });

  return rootCandidates[0];
}
```

#### 3. Mẫu Câu Mở Lời Của Đứa Trẻ (Tối ưu 0đ Token - Zero Latency)
Để tối ưu chi phí và phản hồi tức thì (<10ms), câu chào đầu tiên không gọi qua LLM mà được tạo bằng chuỗi mẫu tĩnh phía Backend/Frontend:
```typescript
function generateColdStartGreeting(activeNode: ConceptNode): string {
  const greetings = [
    `Chào anh! Hôm nay mình học về '${activeNode.title}' hả anh? Khái niệm này nghe lạ quá, nó là cái gì vậy anh?`,
    `Em sẵn sàng rồi nè! Anh giải thích giúp em '${activeNode.title}' nghĩa là gì được không?`,
    `Ủa anh ơi, '${activeNode.title}' có khó hiểu lắm không anh? Anh giảng cho em dễ hiểu với!`
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
```

### Câu 2: Thuật toán Duyệt Node & Điều kiện Tiên quyết (Dynamic Graph Traversal)

#### 1. Quy mô Phiên học & Khống chế Đồ thị (Golden Rule: $7 \pm 2$ Concepts)
- **Định vị Micro-session:** Một phiên học chỉ giới hạn từ **5 đến 7 khái niệm cốt lõi** trên một chuyên đề hẹp (10-15 phút tập trung). Không nạp cả cuốn giáo trình vào 1 phiên để tránh quá tải nhận thức và tránh làm vỡ giao diện trực quan của ReactFlow.
- **Cơ chế tích lũy nhiều câu chat (Multi-turn Check):** Người dùng có thể giải thích trong 2–3 tin nhắn ngắn. Nhờ Rolling Window ($N=2$), AI đối chiếu tích lũy: khi nào chạm đủ các ý trong `core_facts` và vượt qua thử thách thì Backend mới chốt đổi màu XANH.

#### 2. Thuật toán Duyệt Node Kế tiếp (Kiểm tra Toàn bộ Node Cha đã XANH)
Khi một node đổi sang XANH, Backend phải tìm node tiếp theo để kích hoạt thỏa mãn 2 điều kiện:
1. Là node con liền kề hoặc node tiếp theo trên cây DAG.
2. **Bắt buộc toàn bộ node cha (prerequisites) của node đó đều đã mang màu XANH.**

```typescript
function findNextNodeToActivate(
  completedNodeId: string, 
  nodes: ConceptNode[], 
  edges: Edge[]
): ConceptNode | null {
  // Bước 1: Tìm danh sách các node con trực tiếp của node vừa hoàn thành
  const childEdges = edges.filter(e => e.source === completedNodeId);
  const candidateChildNodes = childEdges.map(e => nodes.find(n => n.id === e.target)!);

  // Bước 2: Lọc các node con đã thỏa mãn TOÀN BỘ điều kiện tiên quyết (tất cả cha đều XANH)
  const readyNodes = candidateChildNodes.filter(childNode => {
    const parentEdges = edges.filter(e => e.target === childNode.id);
    const parentNodeIds = parentEdges.map(e => e.source);

    // Kiểm tra tất cả node cha đã đạt status == "GREEN" chưa
    const allParentsGreen = parentNodeIds.every(parentId => {
      const parent = nodes.find(n => n.id === parentId);
      return parent && parent.status === "GREEN";
    });

    return allParentsGreen && childNode.status === "GRAY";
  });

  // Bước 3: Nếu có node con sẵn sàng -> Kích hoạt ngay node đầu tiên
  if (readyNodes.length > 0) {
    return readyNodes[0];
  }

  // Bước 4: Fallback - Nếu nhánh con chưa đủ điều kiện (còn nhánh cha song song khác),
  // quét toàn bộ đồ thị tìm bất kỳ node GRAY nào đã thỏa mãn 100% điều kiện tiên quyết
  const anyReadyNode = nodes.find(node => {
    if (node.status !== "GRAY") return false;
    const parentEdges = edges.filter(e => e.target === node.id);
    return parentEdges.every(e => {
      const parent = nodes.find(n => n.id === e.source);
      return parent && parent.status === "GREEN";
    });
  });

  return anyReadyNode || null; // null nghĩa là toàn bộ đồ thị đã XANH -> Hoàn thành phiên!
}
```

### Câu 3: Tiêu chí Đánh giá Mức độ Hiểu & Cơ chế Chuyển màu Node (Evaluation & Deterministic Scoring)

#### 1. Thời điểm sinh Dữ liệu Node & Cấu trúc Dữ liệu Chuẩn
Dữ liệu của các Node được sinh ra tại **Màn 1 (Khởi tạo bài học)** theo 2 nguồn:
- **Nguồn 1 - Nạp Slide/Tài liệu (File Ingestion):** Người dùng upload PDF/Slide $\to$ AI trích xuất khái niệm, quan hệ cha-con (`prerequisites`) và các tiêu chí sư phạm trong 1 lần duy nhất $\to$ Thuật toán Kahn chạy kiểm tra chu trình và khóa thành đồ thị DAG.
- **Nguồn 2 - Bài mẫu dựng sẵn (Preset Templates):** Các bài học kinh điển (Con trỏ trong C++, Cung - Cầu, Định luật Newton...) được lưu sẵn dưới dạng JSON tĩnh để sẵn sàng dùng ngay, đảm bảo demo 100% không phụ thuộc mạng.

**Cấu trúc một Node trong Đồ thị Tri thức:**
```typescript
interface ConceptNode {
  // A. Định danh & Cấu trúc đồ thị (Backend & Frontend)
  id: string;                         // Mã định danh duy nhất (vd: "node_pointer")
  title: string;                      // Tên khái niệm (vd: "Con trỏ")
  prerequisites: string[];            // Danh sách node cha bắt buộc phải XANH trước đó
  status: "GRAY" | "YELLOW" | "RED" | "GREEN"; // Trạng thái màu hiện tại (Mặc định: GRAY)
  retry_count: number;                // Số lần giải thích chưa đạt tại node này (0 -> 3)

  // B. Thước đo Sư phạm (Nạp vào Prompt để AI thẩm định)
  pedagogical_spec: {
    core_facts: string[];             // Các ý cốt lõi bắt buộc phải chạm tới (Semantic Anchors)
    forbidden_jargons: string[];      // Danh sách từ khóa hàn lâm mồi (Baseline Jargons)
    common_misconceptions: string[];  // Các lỗi hiểu sai kinh điển cần bắt bẫy
    real_world_anchor: string;        // Mồi tình huống đời thường (Dành cho Giàn giáo Bậc 1)
  };
}
```

#### 2. Cơ chế AI Nhận diện Mức độ Hiểu (Semantic Evaluation vs. String Matching)
- **Tuyệt đối KHÔNG so khớp chuỗi (Exact String Matching):** Hệ thống không dùng regex hay tìm kiếm từ khóa cứng nhắc. `core_facts` đóng vai trò là **"Điểm neo Ngữ nghĩa" (Semantic Anchors)**. Dù người dùng dùng các hình ảnh ẩn dụ khác nhau (*"tờ giấy ghi địa chỉ"*, *"cái hộp ghi số nhà"*, *"mũi tên chỉ nơi cất tiền"*), AI sử dụng năng lực hiểu ngôn ngữ để suy luận: *Ý tứ của người dùng có tương đương về mặt bản chất với `core_facts` hay không*.
- **Cách bắt từ khó (Jargon) nằm ngoài danh sách có sẵn:** Mảng `forbidden_jargons` chỉ là bộ từ khóa mẫu (Few-shot Baseline). Persona AI được cấu hình với vai diễn người bạn học tò mò / đứa trẻ chưa biết gì: *Ngoài các từ trong danh sách, bất kỳ thuật ngữ chuyên ngành, từ viết tắt kỹ thuật hoặc từ ngữ hàn lâm nào mà một người bình thường không hiểu, AI đều tự động nhận diện và trích xuất là từ khó (`detected_jargons`)*.

#### 3. Hệ thống Điểm số Sư phạm (Rubric Scoring) & Xử lý Bẫy "Học vẹt Sách giáo khoa"
Để giải quyết triệt để nguy cơ người dùng copy nguyên văn sách giáo khoa mà không thực sự hiểu, và tránh việc AI phán đoán cảm tính, AI đóng vai trò là **Bộ cảm biến ngữ nghĩa** lượng hóa câu trả lời thành 3 chỉ số điểm cụ thể (thang điểm 0 - 100):
1. **`core_accuracy` (0 - 100):** Mức độ chính xác về mặt bản chất khoa học (đối chiếu với `core_facts`).
2. **`simplicity` (0 - 100):** Mức độ bình dân, mộc mạc (càng ít từ hàn lâm thì điểm càng cao).
3. **`analogy_grounding` (0 - 100):** Mức độ liên hệ thực tế / ví von cụ thể (có ví dụ riêng hoặc giải quyết được tình huống ngoại suy thì điểm cao; chỉ chép lý thuyết suông thì điểm thấp).

**Cấu trúc dữ liệu thẩm định JSON từ AI:**
```json
{
  "scores": {
    "core_accuracy": 90,
    "simplicity": 85,
    "analogy_grounding": 30
  },
  "misconception_flag": false,
  "detected_jargons": [],
  "extracted_metaphor": "",
  "ai_chat_response": "Anh nói nghe giống trong sách nè! Nhưng mà em chưa tưởng tượng được, anh cho em ví dụ cụ thể đi?"
}
```

#### 4. Bảng Luật Backend Gán Màu (Deterministic Rule Engine)
Backend (Người số 1) áp dụng bộ luật logic tường minh để quyết định chuyển màu Node:

```text
NẾU misconception_flag == true HOẶC core_accuracy < 50:
    --> Gán màu ĐỎ (Sai bản chất nghiêm trọng / Ngụy biện)
    --> Tăng retry_count += 1
    --> Kích hoạt Mật lệnh phản biện logic sai

NGƯỢC LẠI NẾU detected_jargons.length > 0 HOẶC simplicity < 60:
    --> Gán màu VÀNG (Lạm dụng từ chuyên môn)
    --> Tăng retry_count += 1
    --> Kích hoạt Mật lệnh đòi ví dụ bình dân

NGƯỢC LẠI NẾU core_accuracy >= 70 VÀ analogy_grounding < 60:
    --> Gán màu VÀNG (Bẫy Học vẹt Sách giáo khoa: Đúng lý thuyết nhưng chưa liên hệ thực tế)
    --> Giữ nguyên trạng thái để Đứa trẻ đặt câu hỏi ngoại suy tình huống cụ thể (Application Probe)

NGƯỢC LẠI NẾU core_accuracy >= 75 VÀ simplicity >= 70 VÀ analogy_grounding >= 70:
    --> Chuyển màu XANH (Thấu suốt thực sự: Đúng bản chất + Dễ hiểu + Có liên hệ)
    --> Reset retry_count = 0
    --> Kích hoạt Duyệt Topo để mở khóa Node kế tiếp
```

#### 5. Cơ chế Kháng sai & Bảo vệ Trải nghiệm (Fault Tolerance)
Để đối phó với tình huống "Lỡ AI đánh giá sai lệch", hệ thống thiết lập 3 chốt chặn:
1. **Bản chất vai diễn (Persona Framing):** AI không phải giám khảo phán xét "đậu/rớt". AI là người bạn học tò mò; phản ứng "chưa hiểu" chỉ kích hoạt người học tìm thêm một góc nhìn diễn giải khác, hoàn toàn đúng với tinh thần rèn luyện tư duy Feynman.
2. **Khóa chống bế tắc (Retry Cap = 3):** Nếu sau 3 lần giải thích mà Node chưa Xanh (do người học bí hoặc AI lệch pha), hệ thống tự động cho qua để tiếp tục lộ trình, lưu Node vào danh sách "Lỗ hổng cần phục thù" ở Màn 3.
3. **Minh bạch hóa lý do (Explainability):** Mọi quyết định đổi màu Vàng/Đỏ đều lưu kèm lý do (`detected_jargons`, điểm số thấp ở mục nào) để hiển thị tooltip trên đồ thị và giải trình trong báo cáo cuối phiên.

### Câu 4: Hợp đồng Dữ liệu Kết thúc Phiên (Diagnostic Output Contract)

Khi người dùng hoàn thành 100% đồ thị hoặc chủ động bấm nút "Dừng sớm bài học", Backend tổng hợp toàn bộ trạng thái phiên học thành một đối tượng JSON duy nhất để Frontend (Màn 3) render trực tiếp từ In-Memory Store / LocalStorage mà không cần gọi API tính toán lại:

```typescript
interface DiagnosticReport {
  sessionId: string;
  topicTitle: string;
  durationSeconds: number;
  totalInteractions: number;          // Tổng số câu chat đã trao đổi
  overallMasteryPercent: number;      // % Điểm thấu suốt tổng thể (Số Node Xanh / Tổng Node)

  // Danh sách phân loại Node phục vụ vẽ Mindmap kết quả
  nodesSummary: {
    masteredNodes: string[];          // Danh sách ID các node màu XANH (Nắm vững bản chất)
    weakNodes: string[];              // Danh sách ID các node màu VÀNG (Hiểu nông / Còn dùng từ khó)
    misconceptionNodes: string[];     // Danh sách ID các node màu ĐỎ (Lỗ hổng kiến thức nghiêm trọng)
  };

  // Chi tiết các lỗi để người học ôn tập lại (Targeted Review)
  pedagogicalInsights: {
    nodeId: string;
    nodeTitle: string;
    status: "YELLOW" | "RED";
    reason: string;                   // Vd: "Dùng từ chuyên môn 'dereference' mà chưa diễn giải"
    recommendedReview: string;        // Gợi ý xem lại slide/trang sách liên quan
  }[];

  // Danh sách từ chuyên môn bị bắt lỗi trong toàn bộ phiên học
  flaggedJargonsHistory: string[];
}
```

- **Ưu điểm kiến trúc:**
  - Màn 3 vẽ biểu đồ Radar năng lực, hiển thị danh sách lỗ hổng và nút bấm *"Phục thù lỗ hổng (Retry Red Nodes)"* ngay tức thì (0ms latency).
  - Người dùng có thể bấm nút "Lưu báo cáo" để xuất file JSON / PDF cục bộ mà không cần phụ thuộc máy chủ.

---

# PHẦN 2: TRỤC KỸ THUẬT AI & DẪN DẮT HỘI THOẠI (TRỤC SỐ 2 - AI ENGINE)

### Câu 5: Kiến trúc Tối ưu hóa Hội thoại - $O(1)$ Token Economics

#### 1. Cấu trúc Payload gửi lên Gemini Flash
Payload được chia thành 3 khối phân tách nhiệm vụ rõ ràng:
- **Khối 1: Persona & Cột mốc (Pinned Core - Cố định suốt 1 Node):** Gửi qua `system_instruction`. Định hình vai diễn người bạn học / đứa trẻ tò mò và mục tiêu khái niệm cần nắm.
- **Khối 2: Mật Lệnh Đạo Diễn (Dynamic Directives):** Đặt đầu mảng `contents`, bọc trong thẻ XML `<DEVELOPER_DIRECTIVE>` để phân tách ranh giới với lời của người dùng và chống rò rỉ prompt.
- **Khối 3: Cửa sổ Cuốn chiếu (Rolling Window):** Kích thước cố định $N = 2$ lượt hội thoại gần nhất (tối đa 4 messages: 2 của User, 2 của AI). Tin nhắn cũ hơn sẽ bị pop ra khỏi hàng đợi.

#### 2. Hợp đồng Đầu ra JSON (Single-Pass Output)
```json
{
  "is_valid": true,
  "extracted_jargon_or_error": "",
  "extracted_metaphor": "Hộp nhựa",
  "ai_chat_response": "Anh ơi vậy cái hộp nhựa đó chứa được cái gì ạ?"
}
```

#### 3. Tại sao kiến trúc này đạt tối ưu tuyệt đối $O(1)$?
- **Khống chế kích thước ngữ cảnh:** Không dồn tích lịch sử chat tuyến tính $O(N)$. Dù chat 5 câu hay 50 câu, payload luôn giữ ở mức hằng số xấp xỉ ~150 tokens.
- **Tối ưu chi phí và độ trễ:** Chi phí chỉ ~0.0001 USD/lượt, thời gian phản hồi cực nhanh (<800ms) tạo cảm giác hội thoại thời gian thực.
- **Chống trôi ngữ cảnh (Context Drift):** Chủ động cắt tỉa tin nhắn cũ giúp AI luôn bám chặt vào mục tiêu sư phạm của node đang học.

---

### Câu 6: Xử lý Vòng lặp Bắt bẻ khi Vàng/Đỏ (Targeted Re-prompting)

Backend tiêm mật lệnh ẩn bọc trong thẻ XML `<DEVELOPER_DIRECTIVE>` vào trước câu trả lời của người dùng:

1. **Kịch bản Node VÀNG (Lạm dụng từ chuyên môn / Jargon):**
   ```text
   <DEVELOPER_DIRECTIVE>
   LỆNH: Người dùng vừa dùng từ khóa khó hiểu: '{từ_khó}'. Bạn đóng vai người bạn học tò mò, hãy tỏ ra bối rối với từ này. Yêu cầu họ giải thích lại từ '{từ_khó}' bằng cách ví von với [đồ vật / thức ăn / trò chơi quen thuộc]. KHÔNG lặp lại câu hỏi trước đó. Dưới 30 từ.
   </DEVELOPER_DIRECTIVE>
   ```

2. **Kịch bản Node ĐỎ (Sai bản chất / Lỗi logic):**
   ```text
   <DEVELOPER_DIRECTIVE>
   LỆNH: Người dùng vừa giải thích sai logic ở điểm: '{lỗi_logic}'. Nhiệm vụ: Tin hoàn toàn vào logic sai đó và đặt một câu hỏi ngoại lệ cực kỳ vô lý để người dùng tự giật mình nhận ra cái sai của họ. Dưới 30 từ.
   </DEVELOPER_DIRECTIVE>
   ```

3. **Cơ chế Chống lặp câu hỏi (Anti-Loop) qua biến `retry_count` (Tối đa 3 lần):**
   - **Lần 1:** Đòi ví dụ thực tế / bẫy logic vô lý.
   - **Lần 2:** Gợi ý ngớ ngẩn (Mớm ví dụ cố tình sai để ép người học sửa lưng AI).
   - **Lần 3:** Chốt Đỏ & Xin chuyển bài ("Phần này rắc rối quá em chả hiểu gì hết, mình học sang phần khác đi anh!").

4. **Luồng Sư phạm cho Node bị Đỏ (Targeted Retry):**
   - Feynman là công cụ chẩn đoán, không phải máy mớm đáp án. Cho qua ở lần 3 để giữ nhịp độ chẩn đoán toàn bài. Sau khi hoàn thành, người học xem bản đồ điểm mù và dùng tính năng *"Phục thù lỗ hổng"* để giải thích lại các node Đỏ.

---

### Câu 7: Kỹ thuật Bắc cầu Chuyển Node (Context Bridging - Metaphor Retention)

Khi chuyển từ Node A sang Node B, Backend tái sử dụng hình ảnh ẩn dụ người dùng đã dùng thành công ở Node A để mớm vào câu hỏi đầu tiên của Node B:

1. **Cấu trúc Mật Lệnh Chuyển Tiếp (Khi Node A XANH):**
   ```text
   <DEVELOPER_DIRECTIVE>
   LỆNH CHUYỂN NODE:
   Khái niệm vừa học xong: '{node_A}'.
   Hình ảnh ví von người dùng vừa dùng: '{user_metaphor}'.
   Khái niệm tiếp theo cần học: '{node_B}'.
   Nhiệm vụ: Đóng vai người bạn học tò mò. Tỏ ra thích thú vì đã hiểu '{node_A}' qua hình ảnh '{user_metaphor}'. Sau đó, dùng CHÍNH HÌNH ẢNH ĐÓ để đặt một câu hỏi ngây ngô dọn đường cho khái niệm '{node_B}'. Tuyệt đối không tự giải thích '{node_B}'. Dưới 30 từ.
   </DEVELOPER_DIRECTIVE>
   ```

2. **Cơ chế Dự phòng (Fallback Prompt) khi Node A bị ĐỎ:**
   ```text
   <DEVELOPER_DIRECTIVE>
   LỆNH CHUYỂN NODE (DỰ PHÒNG): Người dùng không thể giải thích khái niệm trước. Đóng vai người bạn học, tỏ ra chán nản với khái niệm cũ và tò mò hỏi sang khái niệm mới: '{node_B}'. Dưới 30 từ.
   </DEVELOPER_DIRECTIVE>
   ```

---

# PHẦN 3: GIẢI PHÁP SƯ PHẠM MỞ RỘNG: GIÀN GIÁO NHẬN THỨC (COGNITIVE SCAFFOLDING)

Để hỗ trợ người mới học không bị bế tắc, hệ thống áp dụng cơ chế Giàn giáo 3 bậc thang trên cùng Đồ thị Tri thức:

```text
[Bậc 1: Kích hoạt liên tưởng] ──► [Bậc 2: Khớp nối logic] ──► [Bậc 3: Tự chủ giảng giải]
    (Priming / Anchoring)            (Bridging / Gap Fill)              (Full Feynman)
```

1. **Bậc 1 - Kích hoạt liên tưởng (Node Xám):** AI chủ động ném ra tình huống đời thường quen thuộc liên quan đến khái niệm để người học phản xạ bằng trực giác thực tế.
2. **Bậc 2 - Khớp nối logic (Node Vàng):** AI đặt câu hỏi định hướng để người học liên kết phản xạ trực giác với nguyên lý bản chất.
3. **Bậc 3 - Feynman toàn phần (Node Xanh):** AI yêu cầu người học tự tóm tắt đúc kết cốt lõi vấn đề bằng một câu ngắn gọn để chứng minh đã làm chủ tri thức hoàn toàn.
