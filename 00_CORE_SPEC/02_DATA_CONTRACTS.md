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
// 2. Nhận diện Hình thái Dự án (Project Archetype)
// ==========================================
export type ProjectArchetype = 
  | "WEB_BACKEND"       // Express, NestJS, FastAPI, Spring Boot
  | "WEB_FRONTEND"      // React, Vue, Next.js (Client SPA/SSR)
  | "MOBILE_APP"        // React Native, Flutter, Expo
  | "DESKTOP_APP"       // Electron, Tauri
  | "CLI_TOOL"          // Commander, Typer, Argparse
  | "ALGORITHM_CORE";   // Package giải thuật thuần

export interface ProjectFingerprint {
  archetype: ProjectArchetype;
  primary_language: "TYPESCRIPT" | "JAVASCRIPT" | "PYTHON" | "DART" | "JAVA" | "OTHER";
  detected_framework: string; // VD: "NestJS", "React Native", "Flutter", "FastAPI"
  is_monorepo: boolean;
  root_dir_offset: string;    // "" nếu single repo, "server/" hoặc "backend/" nếu monorepo
}

// ==========================================
// 3. Tầng kiến trúc linh hoạt theo Archetype (Canonical 3-Tier)
// ==========================================
export type ArchitecturalLayer = 
  // Dùng chung cho Luồng Nghiệp vụ (Web, Mobile, Desktop, CLI)
  | "ENTRY_POINT"       // Cửa vào: Controller (Web), Screen/Widget (Mobile), Command (CLI)
  | "BUSINESS_LOGIC"    // Xử lý: Service (Web), ViewModel/Bloc (Mobile), Handler (CLI)
  | "DATA_ACCESS"       // Dữ liệu: Repository/SQL (Web), LocalStore/APIClient (Mobile)
  // Dùng riêng cho Thuật toán VIP
  | "ALGO_SETUP"        // Khởi tạo Heap / Mảng / State
  | "ALGO_EXECUTION"    // Vòng lặp thư giãn cạnh / biến đổi trạng thái
  | "ALGO_TERMINATION"  // Điều kiện dừng & Trả kết quả
  // Tương thích ngược (Legacy Aliases)
  | "CONTROLLER" | "MIDDLEWARE" | "SERVICE" | "REPOSITORY" | "DATABASE";

export interface LayerDisplayMeta {
  layer: ArchitecturalLayer;
  display_name: string; // VD: Web hiện "Controller", Mobile hiện "Màn hình (Screen)"
  color_badge: string;
}

export interface ExecutionTraceStep {
  step_number: number;
  layer: ArchitecturalLayer;
  display_meta?: LayerDisplayMeta; // Nhãn hiển thị thân thiện trên UI Cột 3
  file_path: string;           // VD: "src/services/order.service.ts"
  function_name: string;       // VD: "checkout"
  line_start: number;          // Tọa độ dòng bắt đầu (1-indexed)
  line_end: number;            // Tọa độ dòng kết thúc
  snippet: string;             // Code hạt nhân 15-30 dòng
  data_in?: string;            // Kiểu dữ liệu nhận vào (VD: "CreateOrderDTO")
  data_out?: string;           // Kiểu dữ liệu trả ra (VD: "OrderEntity")
}

// ==========================================
// 4. Bộ chỉ số Kiến trúc Uncle Bob theo Slice Scope
// ==========================================
export interface UncleBobMetrics {
  instability: number;         // I = Ce / (Ca + Ce), trong đoạn [0, 1]
  abstractness: number;        // A = Na / (Na + Nc), trong đoạn [0, 1]
  distance: number;            // D = |A + I - 1|, trong đoạn [0, 1]
  diagnosis: "BALANCED" | "ZONE_OF_PAIN" | "ZONE_OF_USELESSNESS";
  is_exempt?: boolean;         // true nếu miễn tính cho tầng UI_VIEW / ENTRY_POINT để tránh báo lỗi giả
}

// ==========================================
// 5. Cấu trúc 1 Node Lai Kiến Trúc trên ReactFlow
// ==========================================
export interface HybridArchitecturalNode {
  id: string;                    // VD: "slice-order-checkout"
  title: string;                 // VD: "Order Checkout Flow"
  node_type: "ARCHITECTURAL_DATA_FLOW" | "ALGORITHMIC_CORE"; // Phân loại luồng dữ liệu vs thuật toán
  status: NodeStatus;
  is_auto_mastered?: boolean;    // true nếu được miễn thi do kỹ năng BKT >= 0.92 (Fast-Track)
  preliminary_skills: SWESkill[]; // 1-3 kỹ năng gán tĩnh từ Tầng 2 để xét Auto-Pass trước khi gọi AI
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
// 6. Toàn bộ đồ thị trả về từ Static Engine
// ==========================================
export interface StaticEngineResult {
  repo_name: string;
  fingerprint: ProjectFingerprint; // Định danh hình thái dự án bóc tách từ Tầng 0
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
    archetype: ProjectArchetype;
    primary_language: string;
    is_monorepo: boolean;
    tech_stack: string[];        // Trích xuất từ package.json / pubspec.yaml
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
    forbidden_external_keywords: string[]; // Dynamic Blacklist đã lọc trừ tech_stack thật
  };
}

// ==========================================
// 2. Dữ liệu mổ xẻ & Thử thách Feynman do AI trả về (Anti-Spoiler)
// ==========================================
export interface CandidateProbe {
  angle: string;
  probe: string;
  verdict: "SELECTED" | "REJECT" | string;
}

export interface ExecutionStepDisplay {
  step_index: number;
  label: string;
  file_path: string;
  highlight_lines: number[];     // Tọa độ mảng dòng code để highlight trên Editor
}

export interface SocraticChallenge {
  feynman_question: string;
  smell_reveal_after_attempt: string; // Giải thích chi tiết lỗi và giải pháp, ẩn đi cho tới khi đạt hoặc hết 3 lần thử
}

export interface EnrichedSliceResponse {
  _internal_reasoning?: {
    candidate_probes: CandidateProbe[];
  };
  internal_design_xray: {
    identified_pattern: string;  // VD: "Layered Architecture + Dependency Injection"
    why_it_works: string;        // Lý do thiết kế
    execution_steps: ExecutionStepDisplay[]; // Không chứa đáp án lỗi để tránh lộ đề
  };
  referenced_symbols: string[];  // Danh sách các biến/hàm đối chiếu Symbol_Table
  target_skills: SWESkill[];     // Ánh xạ vào vector q-Matrix 16 kỹ năng SWE
  socratic_challenge: SocraticChallenge; // Thử thách sư phạm Feynman
}

// ==========================================
// 3. Kết quả Chấm điểm Phản biện Feynman
// ==========================================
export interface FeynmanEvaluationResult {
  core_accuracy: number;         // Hiểu đúng vì sao code viết như vậy + bám đúng code thật (0 - 100). Tiêu chí duy nhất quyết định Đạt
  simplicity: number;            // Điểm cộng: diễn đạt dễ hiểu / có ẩn dụ đời thường (0 - 100). Không ảnh hưởng Đạt/Trượt
  is_passed: boolean;            // true nếu core_accuracy >= 70 (backend tự tính lại, không tin giá trị model trả về)
  feedback: string;              // Nhận xét phản hồi 2 câu từ AI Co-Architect
  detected_jargons: string[];    // Thuật ngữ chuyên ngành xuất hiện trong câu trả lời, chỉ để gợi ý giải nghĩa, không trừ điểm
}
```

---

# 3. HỢP ĐỒNG DỮ LIỆU ĐỘNG CƠ NHẬN THỨC BAYES (TẦNG 5)

```typescript
// ==========================================
// 1. Không gian 16 Kỹ năng SWE Chuẩn Cố định (q-Matrix)
// ==========================================
export const SWE_SKILLS = [
  "HTTP_ROUTING",
  "DTO_VALIDATION",
  "AUTH_SECURITY",
  "DEPENDENCY_INJECTION",
  "LAYERED_SEPARATION",
  "DB_OPTIMIZATION",
  "ASYNC_CONCURRENCY",
  "TRANSACTION_INTEGRITY",
  "ERROR_HANDLING",
  "STATE_MANAGEMENT",
  "ALGORITHMIC_COMPLEXITY",
  "MEMORY_MANAGEMENT",
  "API_CONTRACT_DESIGN",
  "CACHING_STRATEGY",
  "RATE_LIMIT_RESILIENCE",
  "DATA_SERIALIZATION"
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
// 3. Cấu hình Giả lập Persona Demo
// ==========================================
export type PersonaMode = "NEWBIE" | "MID_LEVEL" | "SENIOR_RUSTY";

export interface PersonaConfig {
  mode: PersonaMode;
  name: string;
  description: string;
  initial_p_mastery: number;
  simulated_days_idle: number; // Số ngày nghỉ để demo công thức Half-Life Decay
}

// ==========================================
// 4. Trạng thái Bộ nhớ Đệm Nạp Ngầm (Pre-fetch Cache Store)
// ==========================================
export interface ClientWorkbenchState {
  active_node_id: string | null;
  active_tab: "XRAY_WALKTHROUGH" | "FEYNMAN_CHALLENGE";
  node_cache: Record<string, EnrichedSliceResponse>; // Cache nạp ngầm pre-fetch phản hồi tức thì 0ms
  is_prefetching: boolean;
  user_profile: LearnerCognitiveProfile;
}
```
