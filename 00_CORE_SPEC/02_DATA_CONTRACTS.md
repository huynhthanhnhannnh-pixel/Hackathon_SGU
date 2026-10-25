# CHUẨN HÓA HỢP ĐỒNG DỮ LIỆU TYPESCRIPT (DATA CONTRACTS)
## DỰ ÁN: SIMPLIFEY V2 PRO — CODEBASE COGNITIVE TWIN
### *Bộ Hợp đồng Dữ liệu Bất biến Kết nối Toàn bộ 6 Tầng Xử lý (Phụ trách: NGƯỜI 1 - LEAD)*

---

| **Thuộc tính** | **Thông số kỹ thuật** |
| :--- | :--- |
| **Phân hệ** | `00_CORE_SPEC/02_DATA_CONTRACTS.md` |
| **Người phụ trách** | **NGƯỜI 1 (LEAD ARCHITECT)** |
| **Mục đích** | Đảm bảo tính nhất quán dữ liệu giữa Code Thuần (Tầng 0-2), AI Gemini (Tầng 4) và Client Store (Tầng 3, 5) |
| **Nguyên tắc** | Strict Typing 100%, không dùng `any`, có đầy đủ guard-types và định nghĩa trường |

---

# 1. HỢP ĐỒNG DỮ LIỆU ĐỒ THỊ & LÁT CẮT (TẦNG 0, 1, 2)

```typescript
// ==========================================
// 1. Máy Trạng Thái Hữu Hạn 4 Màu (FSM Status)
// ==========================================
export type NodeStatus = 
  | "LOCKED"      // Màu XÁM: Chưa hoàn thành các node tiền đề (Prerequisites)
  | "AVAILABLE"   // Màu VÀNG: Đã mở khóa, sẵn sàng cho sinh viên click vào học
  | "COMPLETED"   // Màu XANH: Đã vượt qua sát hạch Feynman (Mastery đạt chuẩn)
  | "FAILED";     // Màu ĐỎ: Trả lời sai quá 3 lần, ghi nhận điểm mù nhận thức

// ==========================================
// 2. Từng bước thực thi vi mô trong Lát cắt
// ==========================================
export type ArchitecturalLayer = 
  | "CONTROLLER" 
  | "MIDDLEWARE" 
  | "SERVICE" 
  | "REPOSITORY" 
  | "DATABASE";

export interface ExecutionTraceStep {
  step_number: number;
  layer: ArchitecturalLayer;
  file_path: string;           // VD: "src/services/order.service.ts"
  function_name: string;       // VD: "checkout"
  line_start: number;          // Tọa độ dòng bắt đầu (1-indexed)
  line_end: number;            // Tọa độ dòng kết thúc
  snippet: string;             // Code hạt nhân 15-30 dòng
  data_in?: string;            // Kiểu dữ liệu nhận vào (VD: "CreateOrderDTO")
  data_out?: string;           // Kiểu dữ liệu trả ra (VD: "OrderEntity")
}

// ==========================================
// 3. Bộ chỉ số Kiến trúc Uncle Bob theo Slice Scope
// ==========================================
export interface UncleBobMetrics {
  instability: number;         // I = Ce / (Ca + Ce), trong đoạn [0, 1]
  abstractness: number;        // A = Na / (Na + Nc), trong đoạn [0, 1]
  distance: number;            // D = |A + I - 1|, trong đoạn [0, 1]
  diagnosis: "BALANCED" | "ZONE_OF_PAIN" | "ZONE_OF_USELESSNESS";
}

// ==========================================
// 4. Cấu trúc 1 Node Lai Kiến Trúc trên ReactFlow
// ==========================================
export interface HybridArchitecturalNode {
  id: string;                    // VD: "slice-order-checkout"
  title: string;                 // VD: "Order Checkout Flow"
  status: NodeStatus;
  prerequisites: string[];       // Danh sách ID các node cha (để Dagre phân nhánh)
  position: { x: number; y: number }; // Tọa độ (x, y) do Dagre tính toán
  files: string[];               // Các file trong lát cắt (VD: ["order.controller.ts", "order.service.ts"])
  cognitive_complexity: number;  // Điểm xoắn não SonarQube của lát cắt
  uncle_bob: UncleBobMetrics;
  is_vip_algorithm: boolean;     // true nếu được cấp vé VIP do thuật toán phức tạp
  retry_count: number;           // Số lần trả lời sai ở Pha 2 (Max = 3)
  trace_steps: ExecutionTraceStep[];
}

// ==========================================
// 5. Toàn bộ đồ thị trả về từ Static Engine
// ==========================================
export interface StaticEngineResult {
  repo_name: string;
  total_files: number;
  nodes: HybridArchitecturalNode[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
  symbol_whitelist: string[];    // Sổ hộ khẩu Symbol dùng cho Cổng Gác Nhị Phân
}
```

---

# 2. HỢP ĐỒNG DỮ LIỆU NGỮ CẢNH & AI COPILOT (TẦNG 3, 4)

```typescript
// ==========================================
// 1. Đóng gói Context Sandwich gửi cho Gemini
// ==========================================
export interface ContextSandwichPayload {
  macro_context: {
    repo_name: string;
    tech_stack: string[];        // Trích xuất từ package.json
    node_id: string;
    node_title: string;
    dag_predecessors: string[];  // Node đứng trước
    dag_successors: string[];    // Node đứng sau
  };
  micro_trace: {
    scoped_code_snippet: string; // 60-100 dòng code thật bóc tách từ 3 hàm
    dto_interfaces: string;      // Định nghĩa kiểu dữ liệu DTO liên quan
  };
  invariants: {
    learner_persona_tier: "NOVICE" | "PRACTITIONER" | "ARCHITECT";
    forbidden_external_keywords: string[]; // Blacklist công nghệ không có trong repo
  };
}

// ==========================================
// 2. Dữ liệu mổ xẻ & Thử thách Feynman do AI trả về
// ==========================================
export type QuestionType = 
  | "DATA_FLOW_BREAK"     // Tier 1: Truy vết dữ liệu gãy vỡ
  | "DESIGN_TRADE_OFF"    // Tier 2: Tình huống giả định Điểm Hay
  | "FEYNMAN_ANALOGY";    // Tier 3: Ẩn dụ bình dân giải thích Điểm Dở

export interface CandidateProbe {
  angle: string;
  probe: string;
  verdict: "SELECTED" | "REJECT";
}

export interface EnrichedSliceResponse {
  _internal_reasoning?: {
    candidate_probes: CandidateProbe[];
  };
  internal_design_xray: {
    identified_pattern: string;  // VD: "Layered Architecture + Dependency Injection"
    why_it_works: string;        // Điểm hay kiến trúc (Hiển thị ở Pha 1)
    ai_vibe_smell: {
      severity: "CRITICAL" | "WARNING" | "INFO";
      location: string;          // VD: "order.service.ts: dòng 45"
      smell_description: string; // VD: "Vòng lặp N+1 Query trong forEach"
      consequence_plain_text: string; // Hậu quả sập DB khi có 100 người mua đồng thời
    };
  };
  referenced_symbols: string[];  // Danh sách các biến/hàm mà AI nhắc tới trong câu hỏi
  feynman_challenge: {
    question_type: QuestionType;
    question: string;            // Nội dung câu hỏi Socratic (Pha 2)
    target_skills: string[];     // Ánh xạ vào vector q-Matrix 16 kỹ năng SWE
  };
}

// ==========================================
// 3. Kết quả Chấm điểm Phản biện Feynman
// ==========================================
export interface FeynmanEvaluationResult {
  core_accuracy: number;         // Độ chính xác bản chất kỹ thuật (0 - 100)
  simplicity: number;            // Độ bình dân, không nói vẹt thuật ngữ (0 - 100)
  is_passed: boolean;            // true nếu core_accuracy >= 70 && simplicity >= 70
  feedback: string;              // Nhận xét phản hồi 2 câu từ AI Co-Architect
  detected_jargons: string[];    // Các thuật ngữ bị dùng vẹt nếu có
}
```

---

# 3. HỢP ĐỒNG DỮ LIỆU ĐỘNG CƠ NHẬN THỨC BAYES (TẦNG 5)

```typescript
// ==========================================
// 1. Không gian 16 Kỹ năng SWE Chuẩn (q-Matrix)
// ==========================================
export const SWE_SKILLS = [
  "HTTP_ROUTING",
  "DTO_VALIDATION",
  "DEPENDENCY_INJECTION",
  "LAYERED_ARCHITECTURE",
  "DB_OPTIMIZATION",          // N+1 Query, Indexing
  "TRANSACTION_MANAGEMENT",   // Rollback, ACID
  "ASYNC_CONCURRENCY",        // Race condition, Promise.all
  "ERROR_HANDLING",
  "SECURITY_AUTH",
  "INTERFACE_SEGREGATION",
  "SINGLE_RESPONSIBILITY",
  "DATA_INTEGRITY",
  "CACHING_STRATEGY",
  "EVENT_DRIVEN",
  "DEFENSIVE_PROGRAMMING",
  "PERFORMANCE_BOTTLENECK"
] as const;

export type SWESkill = typeof SWE_SKILLS[number];

// ==========================================
// 2. Trạng thái Bộ nhớ Nhận thức BKT trên Client Store
// ==========================================
export interface CognitiveSkillState {
  skill: SWESkill;
  p_mastery: number;           // Xác suất làm chủ P(L_t) trong đoạn [0, 1]
  last_practiced_at: number;   // Timestamp (mili-giây) lần ôn tập cuối
  decayed_p_mastery: number;   // P(L_t) sau khi tính hàm Half-Life Decay
}

export interface LearnerCognitiveProfile {
  user_id: string;
  overall_tier: "NOVICE" | "PRACTITIONER" | "ARCHITECT";
  skills: Record<SWESkill, CognitiveSkillState>;
  completed_nodes: string[];
  failed_nodes: string[];
}

// ==========================================
// 3. Cấu hình Giả lập Persona Demo (Pitching Tool)
// ==========================================
export type PersonaMode = "NEWBIE" | "MID_LEVEL" | "SENIOR_RUSTY";

export interface PersonaConfig {
  mode: PersonaMode;
  name: string;
  description: string;
  initial_p_mastery: number;
  simulated_days_idle: number; // Số ngày nghỉ để demo công thức Half-Life Decay
}
```
