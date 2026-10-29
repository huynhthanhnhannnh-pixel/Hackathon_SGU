# 03 — API, LƯU TRỮ & GIAO DỊCH

> Kiểu dữ liệu: `02_CONTRACTS.md` (Mục 6–9). Hằng số: `CONFIG.*`. Luồng nghiệp vụ tổng thể: `01_KIEN_TRUC_VA_LUONG.md`.
> **Trong repo thi:** route handler ở `src/app/api/**/route.ts` (mỏng: xác thực → gọi service → map lỗi); nghiệp vụ ở `src/server/*.ts`; SQL ở `supabase/migrations/0001_init.sql`.

---

## 1. Nguyên tắc (mã luật API-xx)

- **API-01 Không lưu mã nguồn.** Postgres không chứa file code, `snippet`, `trace_steps`, `StaticEngineResult`, `code_context`. Được lưu: tài khoản, điểm kỹ năng, phiên học (commit SHA + khung đồ thị không có code), tiến độ, câu trả lời của người học, văn bản AI **đã qua kiểm** trong `ai_cache` (có thể chứa tên hàm/biến).
- **API-02 Server là nơi ghi duy nhất.** Client không có quyền `insert/update/delete` trên bảng nào; mọi lệnh ghi đi qua route handler bằng service-role key.
- **API-03 Trả về theo danh sách trường cho phép.** Mỗi response dựng bằng một hàm map tường minh (`toClientResult`, `toAnalysisView`, `toEvaluateResponse`…). Cấm spread object thô của AI hay của DB vào response (chống lộ `misconception`, đáp án, `suspicious_instruction_files`).
- **API-04 Mọi request cần phiên Supabase.** Header `Authorization: Bearer <access_token>`; server xác thực bằng `supabase.auth.getUser(token)`. Thiếu / sai ⇒ `ERR_UNAUTHENTICATED`.
- **API-05 Kiểm quyền sở hữu.** `session_id` phải thuộc `user_id` hiện tại, nếu không ⇒ `ERR_SESSION_NOT_FOUND` (không tiết lộ là phiên của người khác).
- **API-06 Đếm token ở server.** Sau mỗi lời gọi AI thật (không tính trúng cache), cộng `usage_metadata` vào `learning_sessions.tokens_used`. Trước mỗi lời gọi AI: `tokens_used ≥ CONFIG.SESSION_TOKEN_QUOTA` ⇒ `ERR_TOKEN_QUOTA_EXCEEDED`.
- **API-07 Gọi AI ngoài transaction.** Không giữ khóa DB trong lúc chờ AI (D-18).
- **API-08 Triển khai một tiến trình Node.js sống lâu** (`next start` trên Railway / Render / Fly.io, vùng Singapore cùng vùng Supabase), không dùng serverless — để cache RAM `StaticEngineResult`, semaphore ingest và bộ chống gọi trùng (in-flight map) có tác dụng.

---

## 2. Bảng endpoint

| # | Endpoint | Request → Response (`02` Mục 8) | Ghi Postgres | AI | Lỗi riêng |
| :-: | :-- | :-- | :-- | :-: | :-- |
| 1 | `GET /api/me` | — → `MeResponse` | Tạo `profiles` nếu chưa có; đồng bộ `is_guest` theo identity GitHub | — | — |
| 2 | `DELETE /api/me` | — → 204 | Xóa `auth.users` ⇒ cascade mọi bảng | — | — |
| 3 | `GET /api/sessions` | — → `SessionsResponse` | — | — | — |
| 4 | `GET /api/sessions/{id}/history` | — → `HistoryResponse` | — | — | `ERR_SESSION_NOT_FOUND` |
| 5 | `POST /api/ingest` | `IngestRequest` → `IngestResponse` | Upsert `learning_sessions`; Fast-Track (Mục 5.4) | — | Mọi `IngestionErrorCode`, `ERR_SESSION_SOURCE_EXPIRED`, `ERR_SESSION_ENGINE_OUTDATED` |
| 6 | `POST /api/analyze-node` | `AnalyzeNodeRequest` → `AnalyzeNodeResponse` | `ai_cache`, `node_progress.analysis_failed`, Fast-Track, `tokens_used` | ✅ | `ERR_TOKEN_QUOTA_EXCEEDED` |
| 7 | `POST /api/analyze-overview` | `AnalyzeOverviewRequest` → `AnalyzeOverviewResponse` | `ai_cache`, `tokens_used` | ✅ | `ERR_OVERVIEW_NOT_READY`, `ERR_TOKEN_QUOTA_EXCEEDED` |
| 8 | `POST /api/enrich-node` | `EnrichNodeRequest` → `EnrichNodeResponse` | `node_runs` (tạo run), `ai_cache`, `tokens_used`, `last_active_at` | ✅ | `ERR_NODE_NOT_AVAILABLE`, `ERR_MODE_NOT_ALLOWED`, `ERR_ANALYSIS_NOT_READY`, `ERR_AI_REJECTED`, `ERR_AI_UNAVAILABLE` |
| 9 | `POST /api/evaluate-feynman` | `EvaluateFeynmanRequest` → `EvaluateFeynmanResponse` | Transaction Mục 6.2 | ✅ | `ERR_CHALLENGE_TOKEN_*`, `ERR_ANSWER_*`, `ERR_QUESTION_FINISHED`, `ERR_ATTEMPT_OUT_OF_SYNC`, `ERR_AI_UNAVAILABLE`, `ERR_TOKEN_QUOTA_EXCEEDED`, `ERR_PERSISTENCE_UNAVAILABLE` |
| 10 | `POST /api/reveal` | `RevealRequest` → `RevealResponse` | Transaction Mục 6.3 | — | `ERR_CHALLENGE_TOKEN_*`, `ERR_QUESTION_FINISHED` |
| 11 | `POST /api/report-wrong` | `ReportWrongRequest` → `ReportWrongResponse` | Mục 6.4 | — | `ERR_REPORT_NOT_ALLOWED` |
| 12 | `POST /api/sync/replay` | `SyncReplayRequest` → `SyncReplayResponse` | Mục 6.5 | — | `ERR_RECEIPT_INVALID` |
| 13 | `POST /api/demo/persona` | `PersonaRequest` → `PersonaResponse` | Ghi đè 16 dòng `skill_states` của **tài khoản hiện tại** | — | `ERR_DEMO_MODE_DISABLED` |
| 14 | `GET /api/sessions/{id}/progress` | — → `ProgressResponse` | — (chỉ đọc DB, không engine, không AI) | — | `ERR_SESSION_NOT_FOUND` |

Liên kết GitHub không phải endpoint của mình: client gọi `supabase.auth.linkIdentity({ provider: "github" })` (scope mặc định `read:user`, không xin quyền repo private), sau đó gọi lại `GET /api/me` để server cập nhật `is_guest = false`.

---

## 3. Lược đồ Postgres (`supabase/migrations/0001_init.sql`)

```sql
create type swe_skill as enum (
  'HTTP_ROUTING','DTO_VALIDATION','AUTH_SECURITY','DEPENDENCY_INJECTION',
  'LAYERED_SEPARATION','DB_OPTIMIZATION','ASYNC_CONCURRENCY','TRANSACTION_INTEGRITY',
  'ERROR_HANDLING','STATE_MANAGEMENT','ALGORITHMIC_COMPLEXITY','MEMORY_MANAGEMENT',
  'API_CONTRACT_DESIGN','CACHING_STRATEGY','RATE_LIMIT_RESILIENCE','DATA_SERIALIZATION'
);                                                     -- cùng thứ tự SWE_SKILLS
create type run_mode as enum ('LEARN','REMEDIATION','DECAY_REVIEW');

create table profiles (
  user_id      uuid primary key references auth.users on delete cascade,
  display_name text,
  is_guest     boolean not null default true,
  created_at   timestamptz not null default now()
);

create table skill_states (                            -- = CognitiveSkillState; thiếu dòng ⇒ P = BKT_P_L0
  user_id           uuid not null references profiles on delete cascade,
  skill             swe_skill not null,
  p_mastery         double precision not null check (p_mastery between 0.01 and 0.99),
  last_practiced_at timestamptz not null,
  practice_count    int not null default 0,
  correct_count     int not null default 0,
  primary key (user_id, skill)
);

create table learning_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles on delete cascade,
  source           text not null check (source in ('GITHUB','ZIP')),
  repo_key         text not null,
  snapshot_id      text not null,
  snapshot_id_kind text not null check (snapshot_id_kind in ('COMMIT_SHA','ARCHIVE_HASH')),
  subdir           text not null default '',
  ref_label        text,
  repo_name        text not null,
  engine_version   text not null,
  graph_skeleton   jsonb not null,                     -- GraphSkeletonNode[] — KHÔNG có code
  tokens_used      int not null default 0,
  created_at       timestamptz not null default now(),
  last_active_at   timestamptz not null default now(),
  unique (user_id, source, snapshot_id, subdir, engine_version)
);

create table node_progress (                           -- Chỉ node đã có sự kiện; thiếu dòng ⇒ suy ra (Mục 5.1)
  session_id       uuid not null references learning_sessions on delete cascade,
  node_id          text not null,
  status           text check (status in ('AVAILABLE','COMPLETED','FAILED')),  -- null ⇒ suy ra
  is_auto_mastered boolean not null default false,
  analysis_failed  boolean not null default false,
  remediation_runs smallint not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (session_id, node_id)
);

create table node_runs (                               -- 1 lần học / ôn 1 node (D-16)
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references learning_sessions on delete cascade,
  node_id     text not null,
  mode        run_mode not null,
  questions   jsonb not null,                          -- RunQuestion[] (Mục 3.1)
  started_at  timestamptz not null default now(),
  finished_at timestamptz
);
create unique index node_runs_one_open on node_runs (session_id, node_id, mode) where finished_at is null;

create table question_attempts (                       -- Chỉ thêm, không sửa
  id             bigint generated always as identity primary key,
  run_id         uuid not null references node_runs on delete cascade,
  question_index smallint not null,
  attempt_number smallint not null check (attempt_number between 1 and 3),
  skill          swe_skill not null,
  core_accuracy  smallint not null,
  simplicity     smallint not null,
  intent         text not null check (intent in ('ANSWER','GIVE_UP','OFF_TOPIC')),
  is_passed      boolean not null,
  points_covered boolean[] not null,
  student_answer text not null check (char_length(student_answer) <= 2000),
  receipt_id     uuid unique,                          -- Có giá trị khi ghi qua /api/sync/replay
  created_at     timestamptz not null default now()
);
create index on question_attempts (run_id);

create table ai_cache (                                -- D-15: văn bản AI đã qua kiểm, dùng chung mọi người học
  cache_key     text primary key,
  kind          text not null check (kind in ('NODE_ANALYSIS','REPO_OVERVIEW','QUESTION')),
  payload       jsonb not null,                        -- NodeAnalysis | RepoOverviewRaw | GeneratedQuestionRaw
  model         text not null,
  prompt_version text not null,
  tokens_in     int not null,
  tokens_out    int not null,
  created_at    timestamptz not null default now()
);

create table dispute_reports (                         -- Nút "Báo sai" (D-22) — để nhóm đọc lại
  id             bigint generated always as identity primary key,
  user_id        uuid not null references profiles on delete cascade,
  run_id         uuid not null references node_runs on delete cascade,
  question_index smallint not null,
  note           text not null check (char_length(note) <= 500),
  created_at     timestamptz not null default now()
);
```

### 3.1. `node_runs.questions` (jsonb) — kiểu `RunQuestion`

```typescript
interface RunQuestion extends QuestionPlanItem {   // QuestionPlanItem: 02 Mục 5.3
  cache_key: string;                 // Khóa ai_cache của câu hỏi
  attempts_used: number;
  finished: boolean;
  outcome: NodeOutcome | null;
  ended_by: "ANSWER" | "SKIP" | "DROPPED" | null;
  disputed: boolean;
  p_before: number | null;           // Điểm kỹ năng trước / sau lần cập nhật BKT của câu này (cho D-22)
  p_after: number | null;
  last_answer: string | null;        // Kiểm trùng ở server
}
```

### 3.2. Bảo mật hàng (RLS)

- Bật RLS trên **mọi** bảng.
- `select` cho client: `profiles`, `skill_states`, `learning_sessions`, `dispute_reports` khi `auth.uid() = user_id`; `node_progress`, `node_runs` khi `session_id` thuộc phiên của `auth.uid()`; `question_attempts` khi `run_id` thuộc run của phiên đó.
- `ai_cache`: **không có chính sách nào** cho client (chứa đáp án tham chiếu).
- Không có chính sách `insert/update/delete` cho client ở bất kỳ bảng nào (API-02).

### 3.3. Khóa cache AI

| Loại | `cache_key` |
| :-- | :-- |
| `NODE_ANALYSIS` | `na|{source}|{snapshot_id}|{subdir}|{engine_version}|{node_id}|{PROMPT_VERSION}|{LLM_MODEL}` |
| `REPO_OVERVIEW` | `ov|{source}|{snapshot_id}|{subdir}|{engine_version}|{PROMPT_VERSION}|{LLM_MODEL}` |
| `QUESTION` | `q|{source}|{snapshot_id}|{subdir}|{engine_version}|{node_id}|{skill}|{tier}|{focus}|{mode}|{PROMPT_VERSION}|{LLM_MODEL}` |

`mode` nằm trong khóa câu hỏi để run ôn tập không lấy lại câu đã lộ đáp án. Với `REMEDIATION` / `DECAY_REVIEW`, lần ôn thứ n ≥ 2 của cùng (node, kỹ năng, tier, góc) thêm hậu tố `|v{n}` vào khóa (`20` AI-22) để không trúng lại câu cũ. Hai yêu cầu trùng khóa cùng lúc dùng chung một promise trong RAM (in-flight map), chỉ gọi AI 1 lần.

---

## 4. Định danh phiên & cache RAM

- **Khóa phiên:** `(user_id, source, snapshot_id, subdir, engine_version)`.
  - GitHub: `snapshot_id` = commit SHA 40 hex đọc từ comment EOCD của zip codeload (`10` Mục snapshot). Comment không khớp `/^[0-9a-f]{40}$/` ⇒ `ARCHIVE_HASH` = SHA-256 của **toàn bộ** buffer zip.
  - Upload `.zip`: `ARCHIVE_HASH` = SHA-256 của buffer.
- **Cache RAM `StaticEngineResult`:** LRU `CONFIG.INGESTION_CACHE_MAX_ENTRIES`, TTL `CONFIG.INGESTION_CACHE_TTL_MS`, hai tầng: alias `owner/repo@ref/subdir ⇒ snapshot_id` và kết quả `snapshot_id|subdir|engine_version ⇒ StaticEngineResult`.
- **`getOrRebuildStaticResult(session)`:** trúng cache ⇒ dùng; trượt và `COMMIT_SHA` ⇒ tải `codeload.github.com/{owner}/{repo}/zip/{sha}` rồi chạy lại Tầng 0–2; trượt, `ARCHIVE_HASH` và nguồn `GITHUB` ⇒ tải lại zip theo `ref_label`, so SHA-256 toàn bộ buffer với `snapshot_id`: khớp ⇒ dùng, lệch ⇒ `ERR_SESSION_SOURCE_EXPIRED` "repo đã thay đổi" (D-26); trượt và nguồn `ZIP` ⇒ `ERR_SESSION_SOURCE_EXPIRED` (UI mời kéo thả lại file zip; server so SHA-256 khớp `snapshot_id` rồi mới gắn vào phiên cũ); codeload 404 (commit bị force-push xóa) ⇒ `ERR_SESSION_SOURCE_EXPIRED`.
- **Kiểm tất định khi dựng lại:** khung đồ thị dựng lại phải trùng `graph_skeleton` đã lưu (so `node_id` + `prerequisites`). Lệch ⇒ ghi log lỗi và trả `ERR_SESSION_ENGINE_OUTDATED`.

---

## 5. Suy ra trạng thái & Fast-Track (hàm thuần, dùng chung client và server)

### 5.1. `deriveNodeStates(skeleton, progressRows): Record<node_id, NodeStateView-lite>`

Node `is_group_root` (D-24) không có trong `graph_skeleton` và không bao giờ là node cha. Duyệt các node còn lại theo thứ tự tô-pô (hòa ⇒ `node_id` tăng dần):
1. Dòng `node_progress` có `status` ≠ null ⇒ dùng `status` đó.
2. Ngược lại ⇒ `AVAILABLE` nếu mọi node cha **đã thông**, nếu không ⇒ `LOCKED`. Node gốc luôn thỏa.
   - Node cha **đã thông** khi trạng thái của nó ∈ {`COMPLETED`, `FAILED`} **hoặc** (nó `AVAILABLE` **và** `analysis_failed = true`) — D-03 #20.
3. `has_warning = true` khi node không `LOCKED` và có ≥ 1 node cha `FAILED` hoặc được thông nhờ `analysis_failed`.
4. `can_remediate` (chỉ để hiển thị nút; server kiểm lại ở enrich): `status = FAILED` ∧ `remediation_runs < REMEDIATION_MAX_RUNS_PER_NODE` ∧ số node khác có trạng thái ∈ {`COMPLETED`, `FAILED`} ≥ `REMEDIATION_MIN_OTHER_FINISHED`.

Không còn chuyển trạng thái `FAILED → AVAILABLE` (D-16): ôn node đỏ là một run `REMEDIATION`, node vẫn `FAILED` cho tới khi ôn đạt, nên node con không bao giờ bị khóa ngược.

### 5.2. Viền cam (chỉ hiển thị, tính khi đọc)

Node `COMPLETED` có viền cam khi tồn tại kỹ năng `k` trong `analysis.skills` của node với `p_mastery(k) ≥ DECAY_WARNING_BELOW` **và** `getDecayedMastery(k, now) < DECAY_WARNING_BELOW` (D-03 #19). Client tính bằng `bkt-engine` với `now = Date.now() + server_clock_offset_ms`.

### 5.3. Fast-Track — `applyFastTrackCascade(tx, session, profile, now): string[]`

Lặp tới khi không còn thay đổi; mỗi vòng xét node theo thứ tự tô-pô:
1. Node đang `AVAILABLE` theo 5.1, **chưa có run nào**, không phải Capstone, đã có `NODE_ANALYSIS` trong `ai_cache`.
2. Mọi kỹ năng trong `analysis.skills` có `getDecayedMastery ≥ FAST_TRACK_MIN` ⇒ upsert `node_progress(status = 'COMPLETED', is_auto_mastered = true)`. Không cập nhật BKT (không có bằng chứng mới).
3. Trả về danh sách node vừa đổi (gộp vào `unlocked_node_ids`).

### 5.4. Khi nào chạy Fast-Track

Sau `ingest` (mở mới hoặc mở lại), sau `analyze-node` thành công, sau khi một run kết thúc (Mục 6.2 bước 4.6), sau `sync/replay`. Đổi persona không tự chạy: UI gọi lại `POST /api/ingest { session_id }` (trúng cache, 0 token) để làm mới.

---

## 6. Luồng ghi

### 6.1. `enrich-node` — tạo run và cấp câu hỏi

```typescript
// src/server/enrich.ts
async function enrichNode(req: EnrichNodeRequest, userId: string): Promise<EnrichNodeResponse> {
  const session = await getOwnedSession(req.session_id, userId);
  const graph = await getOrRebuildStaticResult(session);
  const node = mustFindNode(graph, req.node_id);
  const state = await loadNodeState(session, node.id);                  // deriveNodeStates + node_progress
  assertModeAllowed(req.mode, state, profile, now);                      // Bảng dưới

  const open = await db.findOpenRun(session.id, node.id, req.mode);
  if (open) return buildEnrichResponse(open, issueTokensForUnfinished(open)); // Idempotent: cấp token mới

  const analysis = await aiCache.get(analysisKey(session, node.id));
  if (!analysis) throw ERR_ANALYSIS_NOT_READY;
  const targets = req.mode === "REMEDIATION" ? remediationTargetsOf(await db.finishedRuns(session.id, node.id)) : []; // 22
  const plan = planNodeQuestions(analysis, profile.skills, now, req.mode, node.is_capstone, targets, node.trace_steps.length); // 22
  if (plan.length === 0) {
    if (req.mode !== "LEARN") throw ERR_MODE_NOT_ALLOWED;                // Không còn kỹ năng để ôn
    await db.tx(tx => applyFastTrackCascade(tx, session, profile, now)); // LEARN: kỹ năng vừa vượt FAST_TRACK_MIN
    return buildEnrichResponse(null, []);
  }
  const questions: RunQuestion[] = await getOrGenerateQuestions(session, graph, node, analysis, plan, req.mode); // 20: ai_cache hoặc 1 lời gọi AI cho các câu thiếu; câu hỏng ⇒ gọi lại riêng 1 lần ⇒ vẫn hỏng ⇒ DROPPED
  if (questions.every(q => q.ended_by === "DROPPED")) throw ERR_AI_REJECTED;          // Không tạo run; UI hiện "Thử lại"
  const run = await db.createRun(session.id, node.id, req.mode, questions);           // REMEDIATION ⇒ remediation_runs++ trong cùng transaction
  await db.touchSession(session.id);
  return buildEnrichResponse(run, issueTokensForUnfinished(run));
}
```

| `mode` | Điều kiện (sai ⇒ lỗi) |
| :-- | :-- |
| `LEARN` | Node `AVAILABLE`, `is_auto_mastered = false` — ngược lại `ERR_NODE_NOT_AVAILABLE` |
| `REMEDIATION` | Node `FAILED` và `can_remediate` (Mục 5.1 bước 4) — ngược lại `ERR_MODE_NOT_ALLOWED` |
| `DECAY_REVIEW` | Node `COMPLETED` và đang có viền cam (Mục 5.2) — ngược lại `ERR_MODE_NOT_ALLOWED` |

`issueToken` đóng `ChallengeTokenPayload` (`02` Mục 5.5) với `code_context` = snippet các bước trong `step_indices`, `exp = now + CHALLENGE_TOKEN_TTL_MS`.

### 6.2. `evaluate-feynman` — kiểm ⇒ chấm ⇒ khóa ⇒ ghi (D-18)

```typescript
// src/server/evaluate.ts
async function evaluateFeynman(req: EvaluateFeynmanRequest, userId: string): Promise<EvaluateFeynmanResponse> {
  // 1. Token & đầu vào (0 token, 0 DB)
  const t = openChallengeToken(req.challenge_token);                     // Sai ⇒ ERR_CHALLENGE_TOKEN_INVALID; quá exp ⇒ _EXPIRED
  if (t.user_id !== userId || t.session_id !== req.session_id) throw ERR_CHALLENGE_TOKEN_INVALID;
  validateAnswerLength(req.student_answer);                              // src/lib/similarity.ts, dùng chung với client: số ký tự không phải khoảng trắng < ANSWER_MIN_CHARS ⇒ _TOO_SHORT; độ dài thô > ANSWER_MAX_CHARS ⇒ _TOO_LONG

  // 2. Đọc trạng thái KHÔNG khóa — DB lỗi ở đây ⇒ ERR_PERSISTENCE_UNAVAILABLE, không gọi AI (D-17)
  const { run, skill, session } = await readForGrading(t);              // run + skill_states(t.skill) + learning_sessions
  const q = run.questions[t.question_index - 1];
  if (run.finished_at || q.finished) throw ERR_QUESTION_FINISHED;
  if (req.attempt_number !== q.attempts_used + 1) throw ERR_ATTEMPT_OUT_OF_SYNC;
  if (q.last_answer && similarity(req.student_answer, q.last_answer) >= CONFIG.ANSWER_DUPLICATE_SIMILARITY) throw ERR_ANSWER_DUPLICATE;

  // 3. Chấm (ngoài transaction)
  const maxAttempts = t.mode === "REMEDIATION" ? CONFIG.REMEDIATION_MAX_ATTEMPTS : CONFIG.MAX_ATTEMPTS_PER_QUESTION;
  const grading = isInjection(req.student_answer)                       // 21: chuẩn hóa NFC rồi chỉ bắt mẫu câu lệnh
    ? injectionGrading(t)                                               // 0 điểm, OFF_TOPIC, không gợi ý, 0 token — VẪN tính 1 lượt
    : await gradeWithAI(t, req.student_answer, req.attempt_number, maxAttempts, session); // Quota ⇒ ERR_TOKEN_QUOTA_EXCEEDED; hỏng ⇒ ERR_AI_UNAVAILABLE (không tính lượt)
  const isPassed = decidePass(grading, t.must_have_points, req.student_answer);        // D-13
  const followUp = decideFollowUp(grading, req.attempt_number, maxAttempts, isPassed, t, req.student_answer); // 20, 21: verifyFollowUp, mẫu tĩnh

  // 4. Transaction ngắn
  try {
    return await withDbRetry(() => db.tx(async (tx) => {
      const run2 = await tx.lockRun(t.run_id);                           // SELECT … FOR UPDATE — run luôn tồn tại (tạo ở enrich)
      const q2 = run2.questions[t.question_index - 1];
      if (q2.finished || q2.attempts_used !== req.attempt_number - 1) throw ERR_ATTEMPT_OUT_OF_SYNC; // Bỏ kết quả chấm
      await tx.insertAttempt(run2.id, t, req, grading, isPassed);        // 4.1
      q2.attempts_used += 1; q2.last_answer = req.student_answer;        // 4.2
      let skillChange: SkillChange | null = null;
      if (isPassed || q2.attempts_used === maxAttempts) {                // 4.3 Câu xong
        q2.finished = true; q2.ended_by = "ANSWER";
        q2.outcome = outcomeOf(isPassed, q2.attempts_used, t.mode);      // 22: lượt 1 & không REMEDIATION ⇒ PASS_FIRST
        skillChange = await applyBkt(tx, t.user_id, t.skill, q2.outcome, t.mode, now); // 22: REMEDIATION trượt ⇒ null
        q2.p_before = skillChange?.p_before ?? null; q2.p_after = skillChange?.p_after ?? null;
      }
      await tx.saveRunQuestions(run2);                                   // 4.4
      const unlocked = await finalizeRunIfDone(tx, run2, now);           // 4.5–4.6: Mục 6.6 + applyFastTrackCascade
      return toEvaluateResponse(t, req, grading, isPassed, followUp, q2, skillChange, unlocked, await tx.loadNodeState(run2));
    }));
  } catch (e) {
    if (!isDbError(e)) throw e;
    // 5. Ghi thất bại sau CONFIG.DB_RETRY_DELAYS_MS — đã đọc được trạng thái ở bước 2 ⇒ phát biên nhận (D-17)
    return toEvaluateResponseUnsynced(t, req, grading, isPassed, followUp, q, skill,
      signReceipt({ kind: "EVALUATE", run_id: t.run_id, question_index: t.question_index,
                    expected_attempts_used: q.attempts_used, observation: canonicalObservation(req, grading, isPassed) }));
  }
}
```

Quy tắc mở đáp án: `question.reveal` chỉ có khi câu `finished` (đạt, hết lượt, hoặc bỏ qua). Response không bao giờ có `misconception`, `reference_answer` của câu chưa xong, hay `quote` của AI.

### 6.3. `reveal` — "Bỏ qua câu này"

Mở token như 6.2 bước 1 ⇒ khóa run ⇒ câu chưa xong (ngược lại `ERR_QUESTION_FINISHED`) ⇒ `finished = true`, `outcome = FAILED`, `ended_by = SKIP` ⇒ `applyBkt(FAILED)` với `LEARN` và `DECAY_REVIEW`, **không** cập nhật với `REMEDIATION` ⇒ `finalizeRunIfDone` ⇒ trả `RevealResponse` kèm `reveal`. 0 token. DB lỗi ở bước ghi ⇒ biên nhận `kind: "REVEAL"` như 6.2 bước 5.

### 6.4. `report-wrong` — "Báo sai" (D-22)

Khóa run ⇒ câu phải `outcome = FAILED`, `ended_by = ANSWER`, `disputed = false` (ngược lại `ERR_REPORT_NOT_ALLOWED`) ⇒ `disputed = true` ⇒ nếu `skill_states.p_mastery` của kỹ năng đúng bằng `p_after` (sai số 1e-9) thì đặt lại `p_mastery = p_before` (`p_before` là điểm **đã decay** dùng làm tiên nghiệm lúc cập nhật), `practice_count -= 1`, giữ nguyên `last_practiced_at` và `correct_count` (`revertSkillChange`, `22`) ⇒ insert `dispute_reports` ⇒ tính lại màu node (Mục 6.6, câu `disputed` bị bỏ qua) ⇒ `ReportWrongResponse`.

### 6.5. `sync/replay`

Với từng biên nhận theo `issued_at` tăng dần: kiểm chữ ký HMAC và `user_id` (sai ⇒ `INVALID`) ⇒ `receipt_id` đã có trong `question_attempts` ⇒ `DUPLICATE` ⇒ khóa run; `attempts_used ≠ expected_attempts_used` hoặc câu đã xong ⇒ `STALE` ⇒ ngược lại chạy lại bước 4 của 6.2 (hoặc 6.3) bằng `observation`, BKT **tính lại** trên điểm hiện tại ⇒ `APPLIED`. Cuối cùng chạy `applyFastTrackCascade` và trả `progress` + `profile` mới.

### 6.6. `finalizeRunIfDone(tx, run, now)`

Run xong khi mọi câu `finished`. Câu `DROPPED` và câu `disputed` không tính khi xét màu.

| `mode` | Kết quả khi run xong |
| :-- | :-- |
| `LEARN` | Có câu `FAILED` ⇒ node `FAILED`; ngược lại `COMPLETED` |
| `REMEDIATION` | Mọi kỹ năng từng `FAILED` (không `disputed`) ở run `LEARN` của node đã `PASS_*` trong một run `REMEDIATION` ⇒ node `COMPLETED`; ngược lại giữ `FAILED`, BKT không trừ thêm |
| `DECAY_REVIEW` | Không đổi màu node; chỉ BKT thay đổi |

Sau khi đổi trạng thái: đặt `finished_at`, upsert `node_progress`, chạy `applyFastTrackCascade`, trả về danh sách node vừa từ `LOCKED` sang `AVAILABLE` hoặc vừa Fast-Track.

### 6.7. `analyze-node` / `analyze-overview` / `ingest`

- **`analyze-node`:** phiên hợp lệ ⇒ dựng khung ⇒ trúng `ai_cache` ⇒ trả ngay. Trượt ⇒ kiểm quota ⇒ gọi AI qua in-flight map ⇒ kiểm theo `21`.
  - Kỹ năng còn lại sau kiểm = 0 sau thử lại ⇒ `analysis_failed = true`, không cache.
  - Phần chữ trượt gác 2 lần ⇒ `skeleton_only = true`, vẫn cache.
  - Thành công ⇒ xóa `analysis_failed`.
  - Cuối cùng chạy `applyFastTrackCascade`. Client gọi tối đa `CONFIG.ANALYZE_CONCURRENCY` node cùng lúc, ưu tiên node đang mở.
- **`analyze-overview`:** mọi node không `analysis_failed` phải có bản phân tích, nếu không ⇒ `ERR_OVERVIEW_NOT_READY`. Server tự gom dữ liệu từ `ai_cache` + khung (không nhận dữ liệu từ client, không gửi code cho AI). AI hỏng sau thử lại ⇒ `ai: null`, vẫn trả `facts`.
- **`ingest`:**
  - Semaphore `MAX_CONCURRENT_INGESTIONS`; chờ quá `INGEST_QUEUE_TIMEOUT_MS` ⇒ `ERR_SERVER_BUSY`.
  - Chạy Tầng 0–2 (`10`, `11`) ⇒ upsert `learning_sessions` theo khóa phiên (`resumed = true` nếu đã có).
  - Upsert chạy **sau** khi có kết quả, không tính vào mục tiêu cold-start.
  - Với `{ session_id }`: `engine_version` khác `CONFIG.ENGINE_VERSION` ⇒ `ERR_SESSION_ENGINE_OUTDATED`.
  - Cuối cùng chạy Fast-Track, trả `analyses` có sẵn trong cache.

### 6.8. `demo/persona`

`process.env.DEMO_MODE !== "true"` ⇒ `ERR_DEMO_MODE_DISABLED`. Ngược lại upsert đủ 16 dòng `skill_states`: `p_mastery = PERSONAS[mode].initial_p_mastery`, `last_practiced_at = now − days_idle · CONFIG.MS_PER_DAY`, `practice_count = 1`, `correct_count = 1`. Chỉ tài khoản đang đăng nhập; nhóm dùng tài khoản demo riêng, không dùng tài khoản thật của thành viên.

---

## 7. Sự cố & tình huống biên

| Tình huống | Xử lý |
| :-- | :-- |
| Hai tab nộp cùng một câu | Bước 2 hoặc bước khóa của 6.2 ⇒ tab chậm nhận `ERR_ATTEMPT_OUT_OF_SYNC`; UI tải lại run và báo "Câu này vừa được nộp ở tab khác" |
| Postgres lỗi ở bước đọc | `ERR_PERSISTENCE_UNAVAILABLE`, không gọi AI, không tốn lượt |
| Postgres lỗi ở bước ghi | Biên nhận ký HMAC (D-17); UI hiện chấm vàng "Chưa đồng bộ", tự gửi `sync/replay` khi `GET /api/me` thành công trở lại |
| AI lỗi khi chấm | `ERR_AI_UNAVAILABLE`, không tính lượt, UI hiện "Thử lại" (D-03 #9) |
| Hết quota phiên | `ERR_TOKEN_QUOTA_EXCEEDED` cho mọi lời gọi AI mới; câu đang làm không nộp được; chế độ Offline chỉ dành cho repo demo |
| Token câu hỏi hết hạn | `ERR_CHALLENGE_TOKEN_EXPIRED` ⇒ UI gọi lại `enrich-node` cùng `mode` (trả lại đúng run, token mới) |
| Commit bị force-push xóa | `ERR_SESSION_SOURCE_EXPIRED`; phiên chỉ còn xem lịch sử; điểm kỹ năng không ảnh hưởng |
| Chế độ Offline (`Ctrl+Shift+D`) | Không gọi API học; không ghi Postgres; nhãn "Chế độ Offline — dữ liệu ghi lại, không lưu tiến độ" |
| Câu trả lời chứa thông tin cá nhân | Lưu ≤ `ANSWER_MAX_CHARS`, chỉ chủ tài khoản đọc (RLS), xóa theo tài khoản |

---

## 8. Biến môi trường (server)

| Biến | Dùng cho | Ghi chú |
| :-- | :-- | :-- |
| `GEMINI_API_KEY` | 4 lời gọi AI | Không bao giờ gửi xuống client |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client đăng nhập khách / GitHub | Công khai được |
| `SUPABASE_SERVICE_ROLE_KEY` | Mọi lệnh ghi ở server | Chỉ server |
| `CHALLENGE_TOKEN_KEY` | AES-256-GCM `challenge_token` | 32 byte, base64; đổi khóa ⇒ mọi token cũ thành `INVALID` |
| `RECEIPT_HMAC_KEY` | Ký `SyncReceipt` | 32 byte, base64 |
| `DEMO_MODE` | Bật `/api/demo/persona` | `"true"` chỉ ở máy demo |
| `NEXT_PUBLIC_DEMO_MODE` | Client chỉ dùng để hiện menu Persona | Đặt cùng giá trị với `DEMO_MODE`; server vẫn kiểm `DEMO_MODE` |
