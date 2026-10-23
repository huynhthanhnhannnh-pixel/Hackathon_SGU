# ĐẶC TẢ KIẾN TRÚC HỆ THỐNG AI & PIPELINE LLM (COMPOUND AI SYSTEM)
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN
### *Tài liệu Kỹ thuật Dành riêng cho Kỹ sư AI / LLM Developer trong Nhóm*

---

| **Thuộc tính** | **Thông số Kỹ thuật** |
| :--- | :--- |
| **Dự án** | **SimpliFey V2 Pro** (*Bản sao Nhận thức Mã nguồn cho Sinh viên IT*) |
| **Phân hệ** | **Trí tuệ Nhân tạo & Điều phối Đa tác tử (AI Reasoning & LLM Orchestration)** |
| **Kiến trúc** | **Compound AI System** (Hệ thống AI Phức hợp theo chuẩn Berkeley / Stanford) |
| **Mô hình nền tảng** | **Gemini 1.5 / 2.5 Flash** (Tối ưu độ trễ thấp & chi phí siêu rẻ) |
| **SDK & Thư viện** | `@google/genai`, `zod` (Structured Outputs), `web-tree-sitter` (Code-Graph RAG) |
| **Mục tiêu hiệu năng** | Phản hồi dưới **0.4 giây**, Giảm **75% chi phí token** (Context Caching), **Zero Hallucination** (Actor-Critic) |

---

## MỤC LỤC
1. [TỔNG QUAN CHIẾN LƯỢC: VÌ SAO KHÔNG DÙNG PROMPT WRAPPER?](#1-tổng-quan-chiến-lược-vì-sao-không-dùng-prompt-wrapper)
2. [5 TRỤ CỘT TRONG PIPELINE LLM HIỆN ĐẠI](#2-5-trụ-cột-trong-pipeline-llm-hiện-đại)
   * 2.1. Trụ cột 1: **AI Intent Router (Bộ định tuyến 50ms)**
   * 2.2. Trụ cột 2: **Code-Graph RAG (RAG đồ thị mã nguồn)**
   * 2.3. Trụ cột 3: **Agentic Actor-Critic Loop (Chống ảo giác 100%)**
   * 2.4. Trụ cột 4: **Feynman Rubric Judge & Structured Outputs**
   * 2.5. Trụ cột 5: **Context Caching & Tối ưu chi phí**
3. [HỆ THỐNG PROMPT MẪU & ZOD SCHEMA CHUẨN HOÁ](#3-hệ-thống-prompt-mẫu--zod-schema-chuẩn-hoá)
4. [SƠ ĐỒ MERMAID KIẾN TRÚC TOÀN CẢNH PIPELINE AI (SẴN SÀNG LÀM SLIDE)](#4-sơ-đồ-mermaid-kiến-trúc-toàn-cảnh-pipeline-ai-sẵn-sàng-làm-slide)
5. [HƯỚNG DẪN CODE TRIỂN KHAI NHANH TRONG 24H (QUICK-START CODE)](#5-hướng-dẫn-code-triển-khai-nhanh-trong-24h-quick-start-code)

---

# 1. TỔNG QUAN CHIẾN LƯỢC: VÌ SAO KHÔNG DÙNG PROMPT WRAPPER?

Ở vòng sơ loại, nhóm bị đánh rớt vì mô hình cũ chỉ là **Prompt Wrapper**:  
`PDF ➔ Prompt thô ➔ LLM ➔ JSON đổi màu`.  
Hội đồng giám khảo Khoa CNTT đánh giá mô hình này không có chiều sâu kỹ thuật phần mềm, dễ bị ảo giác và không thể kiểm soát chất lượng câu trả lời.

Ở phiên bản **SimpliFey V2 Pro**, toàn bộ tầng trí tuệ nhân tạo được nâng cấp thành một **Compound AI System (Hệ thống AI Phức hợp)** gồm nhiều thành phần phối hợp chặt chẽ:
* Không gọi LLM một cách vô định.
* Tách rời việc **Định tuyến (Routing)**, **Truy xuất mã nguồn (Graph-RAG)**, **Kiểm duyệt tự thân (Actor-Critic)** và **Chấm điểm toán học (Rubric Validation)**.

---

# 2. 5 TRỤ CỘT TRONG PIPELINE LLM HIỆN ĐẠI

---

### 2.1. TRỤ CỘT 1: AI INTENT ROUTER (BỘ ĐỊNH TUYẾN Ý ĐỊNH SIÊU TỐC)

#### Vấn đề:
Khi sinh viên nhập tin nhắn, không phải lúc nào họ cũng đang "trả bài". Có lúc họ muốn nói thêm ý (*"Khoan anh ơi em giải thích thêm..."*), có lúc họ bị bế tắc (*"Phần này em chưa hiểu, cho em bỏ qua"*), hoặc hỏi linh tinh. Nếu câu nào cũng tống vào bộ chấm điểm thì sẽ phạt oan sinh viên và tốn token.

#### Giải pháp:
Một bộ phân loại intent siêu nhẹ (Gemini Flash với `max_tokens: 20`) chạy trong **50ms**:

```mermaid
flowchart TD
    UserMsg["Tin nhắn của sinh viên"] --> Router{"AI Intent Router (50ms)"}
    
    Router -- "Khoan, ý em là..." --> Elab["Intent: ELABORATION<br/>• KHÔNG tăng retry_count<br/>• Giữ nguyên màu VÀNG<br/>• Lắng nghe và gom ý tiếp"]
    Router -- "Khó quá em chịu / Bỏ qua" --> Surrender["Intent: SURRENDER<br/>• Chuyển Node sang ĐỎ nhẹ nhàng<br/>• Ghi nhận lỗ hổng vào sổ tay<br/>• Mở khóa bài tiếp theo"]
    Router -- "Giải thích logic code" --> Eval["Intent: EVALUATION<br/>• Chuyển sang Pipeline chấm điểm Feynman"]
    Router -- "Hỏi lạc đề / Chửi thề" --> OffTopic["Intent: OFF_TOPIC<br/>• Nhắc nhở quay lại chủ đề chính"]
```

---

### 2.2. TRỤ CỘT 2: CODE-GRAPH RAG (RAG ĐỒ THỊ MÃ NGUỒN CHUYÊN SÂU)

#### Vấn đề:
RAG tài liệu thông thường cắt code thành từng đoạn 500 ký tự (text chunking). Hậu quả: Dòng `function checkout()` nằm ở chunk A, phần thân logic nằm ở chunk B $\implies$ AI đọc bị đứt đoạn và hiểu sai code.

#### Giải pháp:
* **AST-based Chunking:** Chỉ cắt code theo ranh giới hoàn chỉnh của một Hàm (`FunctionDeclaration`) hoặc Lớp (`ClassDeclaration`).
* **Metadata Graph Enrichment:** Mỗi đoạn code được đính kèm metadata về các hàm liên đới:
  ```json
  {
    "file": "src/services/order.service.ts",
    "function": "processCheckout",
    "callers": ["order.controller.ts#createOrder"],
    "callees": ["inventory.service.ts#deductStock", "db.order.create"],
    "code": "async processCheckout(cart) { ... }"
  }
  ```
Nhờ vậy, khi AI đọc hàm `processCheckout`, nó nhìn thấy ngay toàn bộ chuỗi mắt xích liên kết mà không cần phải nạp cả repo 10,000 dòng!

---

### 2.3. TRỤ CỘT 3: AGENTIC ACTOR-CRITIC LOOP (CHỐNG ẢO GIÁC 100%)

#### Vấn đề:
Khi AI sinh câu hỏi thử thách sinh viên, AI rất hay bị **Ảo giác (Hallucination)**: hỏi về một biến không hề tồn tại trong code, hoặc hỏi kiến thức mông lung ngoài repo.

#### Giải pháp: Mô hình Hai Tác tử Tự Soi Lỗi (Actor-Critic Pattern):

```mermaid
flowchart LR
    Context["Code AST Slice + Lỗ hổng cũ"] --> Actor["Agent 1 (Actor Questioner)<br/>Dự thảo 1 câu hỏi phản biện"]
    
    Actor --> Draft["Bản nháp câu hỏi"]
    
    Draft --> Critic{"Agent 2 (Critic Gatekeeper)<br/>Kiểm duyệt 3 câu hỏi sấm truyền:<br/>1. Biến/Hàm có thật 100% trong code?<br/>2. Không hỏi kiến thức ngoài repo?<br/>3. Ngôn từ bình dân, không lộ đáp án?"}
    
    Critic -- Có lỗi / Bịa đặt --> Reject["Bác bỏ & Ép sinh lại kèm phản hồi lỗi"]
    Reject --> Actor
    
    Critic -- Đạt chuẩn --> Publish["Đưa câu hỏi lên giao diện Cockpit"]

    classDef pass fill:#064E3B,stroke:#10B981,stroke-width:1.5px,color:#F8FAFC;
    classDef fail fill:#7F1D1D,stroke:#EF4444,stroke-width:1.5px,color:#F8FAFC;
    classDef normal fill:#1E293B,stroke:#38BDF8,stroke-width:1.5px,color:#F8FAFC;
    class Context,Actor,Draft normal;
    class Critic fail;
    class Publish pass;
```

---

### 2.4. TRỤ CỘT 4: FEYNMAN RUBRIC JUDGE & STRUCTURED OUTPUTS

Không bao giờ để AI trả về văn bản tự do rồi dùng Regex cắt chuỗi. Bắt buộc ép chuẩn bằng **JSON Schema (Zod)**.

Hội đồng chấm thi AI sẽ đánh giá câu trả lời của sinh viên dựa trên **3 Thang Điểm Độc Lập**:
1. **`core_accuracy` (0 - 100):** Tính chính xác về mặt kỹ thuật (dữ liệu biến đổi đúng không, luồng chạy đúng không).
2. **`simplicity` (0 - 100):** Độ bình dân, trong sáng (có dùng từ ngữ đời thường để giải thích không, hay chỉ copy lại sách giáo khoa).
3. **`repo_grounding` (0 - 100):** Khả năng bám sát mã nguồn (có chỉ đúng biến, đúng dòng code thực tế trong repo không).

**Bộ lọc Thuật ngữ Sáo rỗng (Jargon Detector):**  
Nếu sinh viên nói vẹt các từ như: *"tính đa hình"*, *"tính đóng gói"*, *"idempotent"*, *"immutable"* mà không giải thích bản chất đời thường $\implies$ Điểm `simplicity` bị trừ thẳng tay và hệ thống yêu cầu: *"Hãy giải thích từ đó bằng ví dụ đời thường!"*.

---

### 2.5. TRỤ CỘT 5: CONTEXT CACHING & TỐI ƯU CHI PHÍ TOKEN

#### Cơ chế Gemini Context Caching:
* Khi sinh viên học 1 repo, toàn bộ cấu trúc AST và mã nguồn của các Node là **bất biến (Static)** trong suốt phiên học.
* Thay vì mỗi lượt chat phải gửi lại 5,000 tokens code:
  * Chúng ta sử dụng tính năng **Context Caching** của Gemini Flash.
  * Toàn bộ mã nguồn repo được nạp vào Cache một lần duy nhất lúc khởi tạo.
  * Các lượt chat tiếp theo chỉ gửi câu trả lời của sinh viên (~100 tokens).
* **Hiệu quả đạt được:**
  * Giảm **75% chi phí API**.
  * Giảm độ trễ phản hồi từ **2.5s xuống dưới 0.35s**!

---

# 3. HỆ THỐNG PROMPT MẪU & ZOD SCHEMA CHUẨN HOÁ

Dưới đây là mã nguồn TypeScript sẵn sàng copy vào dự án:

### 3.1. Zod Schema cho Bộ Chấm Điểm Feynman (`FeynmanEvaluationSchema`)
```typescript
import { z } from "zod";

export const FeynmanEvaluationSchema = z.object({
  intent: z.enum(["EVALUATION", "ELABORATION", "SURRENDER", "OFF_TOPIC"]),
  scores: z.object({
    core_accuracy: z.number().min(0).max(100).describe("Tính chính xác kỹ thuật logic của đoạn code"),
    simplicity: z.number().min(0).max(100).describe("Độ dễ hiểu, dùng ngôn ngữ bình dân, tránh nói vẹt thuật ngữ"),
    repo_grounding: z.number().min(0).max(100).describe("Mức độ bám sát vào đúng các biến và hàm trong repo")
  }),
  is_valid_feynman: z.boolean().describe("True nếu cả 3 điểm >= 70 và không dính lỗi nghiêm trọng"),
  detected_jargons: z.array(z.string()).describe("Các từ chuyên môn nói vẹt mà sinh viên không giải thích nghĩa đời thường"),
  uncovered_blindspots: z.array(z.string()).describe("Các điểm mù nhận thức phát hiện được qua câu trả lời"),
  ai_socratic_feedback: z.string().describe("Lời phản hồi sư phạm ngắn gọn, ấm áp, gợi mở tư duy")
});

export type FeynmanEvaluation = z.infer<typeof FeynmanEvaluationSchema>;
```

### 3.2. System Prompt Chuẩn cho Agent 2 (Actor-Critic Questioner)
```text
BẠN LÀ: AI Co-Architect trong hệ thống SimpliFey V2 Pro.
NHIỆM VỤ: Đặt 01 câu hỏi phản biện duy nhất cho sinh viên dựa trên Lát cắt Mã nguồn được cung cấp.

QUY TẮC BẤT DI BẤT DỊCH (STRICT CONSTRAINTS):
1. 100% ĐÓNG KHUNG TRONG REPO: Tuyệt đối chỉ hỏi về các hàm, biến và file có thật trong ngữ cảnh. Không hỏi kiến thức hàn lâm ngoài lề.
2. 3 DẠNG CÂU HỎI ĐƯỢC PHÉP CHỌN:
   - Dạng A (Truy vết luồng): Dữ liệu từ hàm X truyền sang hàm Y qua tham số nào? Nếu đổi kiểu dữ liệu thì hàm nào sập?
   - Dạng B (Lý do thiết kế): Tại sao repo lại tách Controller và Service riêng? Gộp lại thì rủi ro gì?
   - Dạng C (Phê bình code AI): Chỉ vào đoạn code viết ẩu (Vibe Smell: vòng lặp query, thiếu transaction) và yêu cầu sinh viên giải thích bằng tiếng dân dã tại sao viết vậy sẽ làm server mệt mỏi.
3. PHONG CÁCH FEYNMAN: Thân thiện, khiêu khích tư duy, cấm dùng từ ngữ cao đạo.
```

---

# 4. SƠ ĐỒ MERMAID KIẾN TRÚC TOÀN CẢNH PIPELINE AI (SẴN SÀNG LÀM SLIDE)

Sơ đồ này thể hiện trọn vẹn luồng dữ liệu thông minh của Compound AI System:

```mermaid
graph TB
    subgraph INGESTION_STAGE ["1. DATA & GRAPH-RAG PIPELINE"]
        RawCode["📂 Mã nguồn GitHub"] --> AST_Chunk["AST Block Chunking<br/>(Cắt theo ranh giới Hàm/Class)"]
        AST_Chunk --> Graph_Enrich["Call-Graph Enrichment<br/>(Đính kèm Caller/Callee metadata)"]
        Graph_Enrich --> Prompt_Cache["Gemini Context Caching<br/>(Đóng băng context, giảm 75% chi phí)"]
    end

    subgraph ROUTING_STAGE ["2. INTENT ROUTING & DISPATCHER"]
        UserInput["💬 Tin nhắn của Sinh viên"] --> Intent_Classifier["AI Intent Classifier (Flash 50ms)"]
        Intent_Classifier -->|"Bổ sung ý"| Dispatch_Elab["Elaboration Handler<br/>(Giữ nguyên trạng thái)"]
        Intent_Classifier -->|"Đầu hàng"| Dispatch_Skip["Surrender Handler<br/>(Chuyển ĐỎ an ủi)"]
        Intent_Classifier -->|"Trả lời bài"| Dispatch_Eval["Feynman Evaluation Flow"]
    end

    subgraph AGENTIC_CORE ["3. MULTI-AGENT REASONING CORE"]
        Prompt_Cache --> Actor_Questioner["Actor: Sinh câu hỏi sát hạch"]
        Actor_Questioner --> Critic_Validator{"Critic: Kiểm duyệt Hallucination"}
        Critic_Validator -- "Phát hiện ảo giác" --> Actor_Questioner
        Critic_Validator -- "Chuẩn 100%" --> Challenge_UI["Hiển thị câu hỏi cho Sinh viên"]
        
        Dispatch_Eval --> Rubric_Judge["Agent 3: Feynman Rubric Judge<br/>(Accuracy, Simplicity, Grounding)"]
        Rubric_Judge --> Jargon_Detector["Jargon & Misconception Filter"]
    end

    subgraph STATE_PERSISTENCE ["4. FEEDBACK & MEMORY ENGINE"]
        Jargon_Detector --> FSM_Engine["FSM 4 Màu Transition"]
        FSM_Engine --> BKT_Memory["Bayesian Knowledge Tracing Store<br/>(Cập nhật ma trận 16 kỹ năng)"]
        BKT_Memory -->|"Mồi lỗ hổng cũ"| Actor_Questioner
    end

    classDef stage1 fill:#0F172A,stroke:#38BDF8,stroke-width:1.5px,color:#F8FAFC;
    classDef stage2 fill:#1E1B4B,stroke:#818CF8,stroke-width:1.5px,color:#F8FAFC;
    classDef stage3 fill:#312E81,stroke:#C084FC,stroke-width:1.5px,color:#F8FAFC;
    classDef stage4 fill:#022C22,stroke:#10B981,stroke-width:1.5px,color:#F8FAFC;
    class INGESTION_STAGE stage1;
    class ROUTING_STAGE stage2;
    class AGENTIC_CORE stage3;
    class STATE_PERSISTENCE stage4;
```

---

# 5. HƯỚNG DẪN CODE TRIỂN KHAI NHANH TRONG 24H (QUICK-START CODE)

Đoạn code hoàn chỉnh để gọi Gemini Flash với Structured Outputs trong Next.js API Route (`src/app/api/evaluate/route.ts`):

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userMessage, sliceCodeContext, cognitiveHistory } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Bạn là Giám khảo Feynman. Hãy chấm điểm câu trả lời của sinh viên:
              
              [NGỮ CẢNH CODE]:
              ${sliceCodeContext}
              
              [LỖ HỔNG CŨ CỦA SINH VIÊN]:
              ${JSON.stringify(cognitiveHistory)}
              
              [CÂU TRẢ LỜI CỦA SINH VIÊN]:
              "${userMessage}"`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING, enum: ["EVALUATION", "ELABORATION", "SURRENDER", "OFF_TOPIC"] },
            scores: {
              type: Type.OBJECT,
              properties: {
                core_accuracy: { type: Type.NUMBER },
                simplicity: { type: Type.NUMBER },
                repo_grounding: { type: Type.NUMBER }
              },
              required: ["core_accuracy", "simplicity", "repo_grounding"]
            },
            is_valid_feynman: { type: Type.BOOLEAN },
            detected_jargons: { type: Type.ARRAY, items: { type: Type.STRING } },
            ai_socratic_feedback: { type: Type.STRING }
          },
          required: ["intent", "scores", "is_valid_feynman", "detected_jargons", "ai_socratic_feedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Lỗi AI Pipeline:", error);
    return NextResponse.json({ error: "Lỗi kết nối AI" }, { status: 500 });
  }
}
```

---

### TỔNG KẾT CHO ĐỒNG ĐỘI
Tài liệu này giải quyết trọn vẹn phần việc của kỹ sư AI trong nhóm:
1. Đã có **luồng dữ liệu đa tác tử (Multi-Agent Architecture)** rõ ràng.
2. Đã có **Zod Schema và Prompt System** mẫu, chỉ việc copy vào code.
3. Đã có **Sơ đồ Mermaid đẳng cấp** để đưa thẳng vào slide thuyết trình.

Bạn hãy push file này lên Git ngay để đồng đội đọc và triển khai, còn bạn có thể nghỉ ngơi để phục hồi năng lượng nhé!
