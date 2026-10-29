# Báo cáo TASK_05A — áp dụng CHỐT CUỐI vào 00, 01, 02, 03

Nhánh: `docs/cau-truc-spec` ✅. Chỉ áp dụng dòng ✅ của `.ai/CHOT_CUOI.md`: D-27 … D-31, D-33 … D-42, D-13 (sửa), V-4. **Không áp dụng** D-43, D-44, D-45, D-46 (⏳) ⇒ không thêm `LlmCallLog` / bảng `llm_calls`, giữ liên kết GitHub.

Byte đo bằng `tr -d '\r' < spec/<file>.md | wc -c`. mmcheck: `node .ai/tools/mmcheck/check.mjs`. Token mất: `node .ai/tools/preserve.mjs` (đã trừ token chuyển sang archive).

## 1. `spec/00_QUYET_DINH.md`

- Byte: **20 794 → 25 323**. mmcheck: 0/0 sơ đồ (file không có sơ đồ).
- Đã làm:
  - Mục 1: thêm D-33 … D-42 (đúng mã `CHOT_CUOI.md`, không có con số; D-41 trỏ `CONFIG.MAX_CLEAN_FILES`).
  - D-27 … D-31 viết lại tại chỗ ở Mục 2 (Vercel `sin1`, Pino ra stdout, Observability Vercel + Supabase, Vercel auto-deploy + GitHub Actions, không queue ngoài), cột "Xác nhận" = "Chốt 29/10"; bỏ số (`= 4`, `tracesSampleRate ≤ 0.1`, vùng Railway).
  - Hủy (giữ dòng, thêm `**Hủy bởi D-xx.**`): D-11 (D-38), D-14 (D-36), D-17 (D-40), D-21 (D-34), D-25 (D-35), D-26 (D-39).
  - Sửa: D-13 (`**Sửa (chốt 29/10):**` so khớp lỏng — không có D mới nên không ghi "bởi D-xx"), D-15 (D-37), D-23 (D-36).
  - Thêm ngoài danh sách task (để không mâu thuẫn): "Sửa bởi" ở D-01 (D-34, D-36), D-02 (D-34), D-03 (D-35, D-37), D-04 (D-35, D-40); bỏ số trong D-03 #19, D-11 (Lý do), D-20 (Lý do), D-21, D-25; Q-08 đánh dấu đã đóng bằng D-35; Q-10 bỏ `= 4`.
  - **Thêm Q-12** (xem Mục 5 báo cáo, mục 2).
- Token mất (4): `next start`, `asia-southeast1-eqsg3a` — D-27 (bỏ Railway); `CONFIG.MAX_CONCURRENT_INGESTIONS = 4`, `MAX_CONCURRENT_INGESTIONS = 4` — D-31 + luật "số chỉ ở CONFIG" (tên hằng vẫn còn).

## 2. `spec/01_KIEN_TRUC_VA_LUONG.md`

- Byte: **17 351 → 16 548**. mmcheck: **4/4 OK** (sửa 1 lỗi: dấu `;` trong thông điệp sequence diagram ⇒ đổi thành `·`).
- Đã làm (Mục 5–8): bỏ Fast-Track ở 5.1, 5.2 (thay nhánh "kế hoạch rỗng" bằng luật D-34: n ≥ 1 câu), bỏ `challenge_token` (evaluate gửi `{ run_id, question_index }`, đọc câu hỏi + đáp án từ DB — D-36), câu hỏi không cache (D-37); 5.3 "Ôn tập" ⇒ "Không ôn tập — hiển thị mài mòn (D-35)"; 5.4 thêm D-39 (tải lại theo SHA) và D-42 ("Học lại từ đầu"); Mục 6 bỏ chuyển Fast-Track, bỏ `FAILED → COMPLETED` do `REMEDIATION`, bỏ "hoặc đã ôn đạt"; Mục 7 bỏ mọi nhánh `REMEDIATION`; Mục 8 bỏ dòng `challenge_token`, `SyncReceipt`, thêm dòng "câu hỏi + đáp án ở `node_runs`", cache RAM "không được dựa vào (D-27)". Giữ luồng nhiều câu / run, `DROPPED`, Bỏ qua, Báo sai.
- Token mất (8): `can_remediate`, `REMEDIATION_MAX_ATTEMPTS`, `CONFIG.REMEDIATION_MAX_ATTEMPTS` — D-35; `AVAILABLE → COMPLETED` (dòng Fast-Track; dòng `AVAILABLE → COMPLETED / FAILED` vẫn còn), `ingest` (cùng dòng), `node_progress(status, is_auto_mastered)` — D-34; `sync/replay` — D-40; `CHALLENGE_TOKEN_TTL_MS` — D-36.
- **Chưa làm (ngoài phạm vi Mục 5–8 của task):** Mục 1–4 vẫn còn chữ cũ — Mục 1 "Fast-Track (miễn thi…) và cảnh báo khi trí nhớ phai"; **INV-05** nhắc Fast-Track + `SyncReceipt` trong `localStorage`; **INV-07** nói đáp án nằm trong `challenge_token`; **INV-11** nhắc Fast-Track ⚡ và viền cam; Mục 3 sơ đồ "Tiến trình Node.js sống lâu", "(RAM, 10 phút)" (con số ngoài CONFIG); Mục 4 tầng 5 "Fast-Track". Sửa INV cần planner quyết.

## 3. `spec/02_CONTRACTS.md`

- Byte: **43 397 → 39 915** (≤ 40 000). mmcheck: 0/0 sơ đồ.
- Đã làm:
  - `CONFIG`: `MAX_CLEAN_FILES` = 100 (D-41); thêm `MAX_UPLOAD_BYTES: 4.5 * 1024 * 1024` (chú thích "giới hạn body của Vercel Functions, D-27"); `MAX_STREAM_BYTES` chú thích lại "Byte nén tải từ GitHub"; bỏ `MAX_REF_CANDIDATES`, `CHALLENGE_TOKEN_TTL_MS`, `REMEDIATION_MAX_ATTEMPTS`, `REMEDIATION_MAX_RUNS_PER_NODE`, `REMEDIATION_MIN_OTHER_FINISHED`, `DECAY_WARNING_BELOW` (chỉ dùng cho viền cam — D-35). Không có hằng `DECAY_REVIEW_*` hay hằng receipt trong CONFIG.
  - **Giữ `FAST_TRACK_MIN`**: vẫn là ngưỡng "đã thạo" khi lập kế hoạch câu hỏi (`22` BKT-41, BKT-31) và trong `tierOf` / D-20. Chú thích lại: "Ngưỡng 'đã thạo' khi lập kế hoạch câu hỏi (22, D-34)". Có thể đổi tên sau (vd `MASTERED_MIN`) — chưa đổi.
  - Mục 1.1: dòng "Người học sau cùng repo" tính lại vì câu hỏi không còn cache (D-37): ~29 lời gọi · ~38 000 token · ~$0.03 — **ước tính, chưa đo** (cùng cách tính như dòng người học đầu tiên).
  - Kiểu: bỏ `ChallengeTokenPayload` (5.5), `RemediationTarget`, `SyncReceipt`, `SyncReplayRequest/Response`; thêm `RunStepRef` (Mục 7); xem danh sách đầy đủ ở Mục 6 báo cáo.
- Token mất (9): `ChallengeTokenPayload`, `ERR_CHALLENGE_TOKEN_INVALID`, `ERR_CHALLENGE_TOKEN_EXPIRED`, `CONFIG.CHALLENGE_TOKEN_TTL_MS` — D-36; `SyncReceipt`, `ERR_RECEIPT_INVALID` — D-40; `ERR_MODE_NOT_ALLOWED` — D-35 (chỉ dùng cho REMEDIATION / DECAY_REVIEW); `ERR_SESSION_SOURCE_EXPIRED` — D-39; `D-11` — D-38 (nằm trong chú thích của `MAX_REF_CANDIDATES`).
- Khối code đổi: 9 (do sửa CONFIG / kiểu — đúng chủ đích).

## 4. `spec/03_API_VA_LUU_TRU.md`

- Byte: **36 531 → 32 104** (V-4 mục tiêu ≤ 32 000: **chưa đạt, thiếu 104 byte**; không cắt thêm để khỏi bỏ quy định). mmcheck: **3/3 OK**.
- Đã làm:
  - API-08 + Mục 1: Vercel `sin1`; cache RAM / semaphore / in-flight map chỉ trong 1 instance, không được dựa vào; upload ≤ `CONFIG.MAX_UPLOAD_BYTES` (D-27).
  - Bỏ endpoint `sync/replay` (13 endpoint, đánh số lại bảng; **giữ số mục 6.6–6.8**, mục 6.5 bỏ trống để không vỡ tham chiếu từ file khác), bỏ biên nhận, cột `receipt_id`, luồng challenge token, biến môi trường `CHALLENGE_TOKEN_KEY`, `RECEIPT_HMAC_KEY`.
  - D-36: `RunQuestion` (3.1) mang câu hỏi + `reference_answer` + `must_have_points` + `fix`; `node_runs` thêm cột `steps` (`RunStepRef[]`, chỉ tên) và `forbidden_external_keywords`; `evaluate-feynman` / `reveal` đọc theo `(run_id, question_index)`; AI chấm không nhận `code_context`. DB lỗi khi ghi ⇒ `ERR_PERSISTENCE_UNAVAILABLE` + "Thử lại" (D-40).
  - Mục 5: bỏ Fast-Track (5.3, 5.4 cũ), bỏ `can_remediate`; 5.2 viền cam ⇒ mài mòn chỉ hiển thị (D-35); 5.3 = luật kế hoạch không rỗng (D-34); 5.4 = đổi persona chỉ ghi `skill_states`.
  - D-37: bỏ khóa cache `QUESTION`, `ai_cache.kind` chỉ còn `NODE_ANALYSIS`, `REPO_OVERVIEW`.
  - D-39 thay D-26 ở Mục 4: phiên gắn SHA, dựng lại theo SHA; `ARCHIVE_HASH` không dựng lại được ⇒ Q-12.
  - D-42: `IngestRequest { session_id, restart: true }` tạo phiên mới cùng snapshot; bỏ `unique` của khóa phiên (đổi thành index), trùng khóa ⇒ mở phiên `last_active_at` mới nhất.
  - `node_runs`: bỏ `mode` khỏi `node_runs_one_open`; `run_mode` chỉ còn `'LEARN'`; `node_progress` bỏ `is_auto_mastered`, `remediation_runs`.
  - RLS: `node_runs`, `question_attempts` **không còn chính sách select cho client** (vì `node_runs` chứa đáp án — INV-07; `question_attempts` có policy phụ thuộc `node_runs`). Lịch sử vẫn đọc qua `GET /api/sessions/{id}/history`.
  - `enrich-node`: kiểm run đang mở **trước** khi dựng engine (trả lại run không cần cache RAM).
- Token mất (57) — tất cả thuộc thứ đã bỏ:
  - D-40 (biên nhận / sync): `sync/replay`, `src/server/sync.ts`, `POST /api/sync/replay`, `SyncReplayRequest`, `SyncReplayResponse`, `ERR_RECEIPT_INVALID`, `SyncReceipt`, `RECEIPT_HMAC_KEY`, `receipt_id`, `kind: "REVEAL"`, `issued_at`, `INVALID`, `EVALUATE`, `DUPLICATE`, `REVEAL`, `attempts_used ≠ expected_attempts_used`, `STALE`, `observation`, `APPLIED`, `progress` (response của sync).
  - D-36 (challenge token): `challenge_token`, `ChallengeTokenPayload`, `issueToken`, `exp = now + CHALLENGE_TOKEN_TTL_MS`, `ERR_CHALLENGE_TOKEN_*`, `ERR_CHALLENGE_TOKEN_`, `ERR_CHALLENGE_TOKEN_INVALID`, `ERR_CHALLENGE_TOKEN_EXPIRED`, `CHALLENGE_TOKEN_KEY`, `code_context`, `step_indices` (nằm trong câu về `code_context` của token).
  - D-34 (Fast-Track): `applyFastTrackCascade`, `applyFastTrackCascade(tx, session, profile, now): string[]`, `getDecayedMastery ≥ FAST_TRACK_MIN`, `node_progress(status = 'COMPLETED', is_auto_mastered = true)`, `is_auto_mastered = false`, `analysis.skills` (điều kiện Fast-Track / viền cam), `POST /api/ingest { session_id }` (làm mới Fast-Track sau đổi persona), `UI-58` (trả `run_id = null`).
  - D-35 (ôn tập / viền cam): `ERR_MODE_NOT_ALLOWED`, `can_remediate`, `status = FAILED`, `remediation_runs < REMEDIATION_MAX_RUNS_PER_NODE`, `REMEDIATION_MIN_OTHER_FINISHED`, `CONFIG.REMEDIATION_MAX_ATTEMPTS`, `p_mastery(k) ≥ DECAY_WARNING_BELOW`, `getDecayedMastery(k, now) < DECAY_WARNING_BELOW`, `PASS_*` (bảng kết quả REMEDIATION), `D-25`.
  - D-37: `q|{source}|…|{mode}|…` (khóa cache câu hỏi), `mode` (quy tắc "mode nằm trong khóa câu hỏi").
  - D-39: `ERR_SESSION_SOURCE_EXPIRED`, `D-26`, `ref_label` (tải lại theo `ref_label`; cột `ref_label` vẫn còn trong SQL), `GITHUB` (câu "mọi phiên `GITHUB`, kể cả `ARCHIVE_HASH`").
  - D-38: `owner/repo@{ref_path}/{subdir_override}` (alias cache có `ref_path`).
  - D-27: `next start` (Railway / Render / Fly.io).
- Khối code đổi: 4 (SQL, `RunQuestion`, `enrichNode`, `evaluateFeynman`) — đúng chủ đích.

## 5. Chỗ chưa làm / không chắc (cần planner xem)

1. **`spec/01` Mục 1–4** còn Fast-Track, `SyncReceipt`, `challenge_token`, viền cam, "Node.js sống lâu", "10 phút" (chi tiết ở Mục 2 báo cáo). INV-05, INV-07, INV-11 cần viết lại câu chữ (ý bất biến không đổi: đáp án chỉ ở server, server ghi duy nhất).
2. **Q-12 (mới, ở `spec/00`)** — phiên `ARCHIVE_HASH` (upload zip, hoặc GitHub không có SHA) trượt cache RAM / commit bị force-push xóa: đã bỏ `ERR_SESSION_SOURCE_EXPIRED` theo D-39 nên tạm trả `ERR_SESSION_NOT_FOUND` (mặc định ghi ở Q-12). **Rủi ro lớn:** trên Vercel, upload zip gần như chắc chắn trượt cache khi request sau rơi vào instance khác ⇒ luồng học từ file zip có thể không chạy được. `resume_blocker = "ZIP_SOURCE"` cũng đang dùng cho GitHub `ARCHIVE_HASH` (tên không khớp).
3. **`RunMode` giữ lại = `"LEARN"`** và các trường `mode` (request, `node_runs.mode`, history) giữ để ít vỡ file khác. Có thể bỏ hẳn sau.
4. **RLS**: bỏ quyền select của client trên `node_runs`, `question_attempts` (hệ quả của D-36 + INV-07). Nếu `30` có đọc trực tiếp 2 bảng này qua Supabase client thì phải đổi sang API.
5. **D-42** cần thêm trường `restart?: boolean` vào `IngestRequest` (`02`) và bỏ `unique` khóa phiên ở `learning_sessions` — CHOT không ghi `02` cho D-42 nhưng không có cách khác để client yêu cầu phiên mới.
6. **D-38** đổi `GithubRepoInfo` (`ref_path`, `is_blob_link` ⇒ `path_trimmed`) — `10` ING-31, ING-32 phải sửa theo.
7. **`node_runs.steps` + `forbidden_external_keywords`** (mới): để chấm / gác gợi ý mà không cần `StaticEngineResult` (thay phần tương ứng trong token cũ). Chỉ chứa tên bước / tên hàm / tên gói, không có code (như `ai_cache`) — nên được người phụ trách INV-04 xác nhận.
8. `evaluate-feynman` ghi DB hỏng sau khi đã gọi AI ⇒ mất token của lần chấm đó, không tính lượt (hệ quả của D-40).
9. Chữ ký hàm trong `03` đã đổi theo D-34/D-35 và cần `22`/`20` khớp: `planNodeQuestions(analysis, skills, now, stepCount)` (bỏ `mode`, `isCapstone`, `targets`), `applyBkt(tx, userId, skill, outcome, now)` và `outcomeOf(isPassed, attempts)` (bỏ `mode`), `gradeWithAI(q, steps, answer, attempt, max, session)`, `injectionGrading(q)`, `getOrGenerateQuestions` ⇒ `generateQuestions`.
10. Q-07 (luật Capstone khi mọi kỹ năng đã thạo) nay là luật chung D-34 cho mọi node — để nguyên Q-07, chưa đóng.
11. V-4: `spec/03` = 32 104 byte (> 32 000).

## 6. Tên đã bỏ / đổi khỏi `spec/02` (để TASK_05B, 05C gỡ ở file khác)

**CONFIG bỏ:** `MAX_REF_CANDIDATES`, `CHALLENGE_TOKEN_TTL_MS`, `REMEDIATION_MAX_ATTEMPTS`, `REMEDIATION_MAX_RUNS_PER_NODE`, `REMEDIATION_MIN_OTHER_FINISHED`, `DECAY_WARNING_BELOW`.
**CONFIG thêm / đổi:** `MAX_UPLOAD_BYTES` (mới); `MAX_CLEAN_FILES` 50 → 100; `FAST_TRACK_MIN` giữ, nghĩa = ngưỡng "đã thạo".

**Kiểu bỏ:** `ChallengeTokenPayload`, `RemediationTarget`, `SyncReceipt`, `SyncReplayRequest`, `SyncReplayResponse`.
**Kiểu thêm:** `RunStepRef`.
**Giá trị union bỏ:** `RunMode` `"REMEDIATION"`, `"DECAY_REVIEW"` (còn `"LEARN"`); `PersonaMode` / `PERSONAS` `SENIOR_ACTIVE`.

**Trường bỏ / đổi:**
- `QuestionView.challenge_token` (bỏ).
- `EvaluateFeynmanRequest.challenge_token` ⇒ `run_id` + `question_index`.
- `RevealRequest.challenge_token` ⇒ `run_id` + `question_index`.
- `EvaluateFeynmanResponse.sync_receipt`, `RevealResponse.sync_receipt` (bỏ).
- `RevealResponse.skill_change`: `SkillChange | null` ⇒ `SkillChange`.
- `EnrichNodeResponse.run_id`: `string | null` ⇒ `string` (kế hoạch luôn ≥ 1 câu).
- `NodeStateView.is_auto_mastered`, `.remediation_runs`, `.can_remediate` (bỏ).
- `QuestionPromptPayload.invariants.previous_questions` (bỏ).
- `ClientWorkbenchState.pending_receipts` (bỏ).
- `GithubRepoInfo.ref_path`, `.is_blob_link` ⇒ `path_trimmed`.
- `IngestRequest` nhánh `{ session_id }` thêm `restart?: boolean` (D-42).
- `QuestionState.feynman_question` đọc từ `node_runs.questions` (không còn `RunQuestion.cache_key`).
- Chú thích `AnalyzeNodeResponse.unlocked_node_ids` = node con mở nhờ `analysis_failed` (không còn Fast-Track).

**Mã lỗi bỏ:** `ERR_CHALLENGE_TOKEN_INVALID`, `ERR_CHALLENGE_TOKEN_EXPIRED`, `ERR_SESSION_SOURCE_EXPIRED`, `ERR_RECEIPT_INVALID`, `ERR_MODE_NOT_ALLOWED` (bảng HTTP: dòng 410 chỉ còn `ERR_SESSION_ENGINE_OUTDATED`; danh sách `retryable` bỏ `ERR_CHALLENGE_TOKEN_EXPIRED`).

**Tên ở `03` bỏ (file khác đang nhắc):** endpoint `POST /api/sync/replay`; `applyFastTrackCascade`, `isFastTrack` (dùng ở `22`), `issueToken`, `openChallengeToken`, `signReceipt`, `remediationTargetsOf`, `assertModeAllowed`, `getOrGenerateQuestions`; cột `node_progress.is_auto_mastered`, `node_progress.remediation_runs`, `question_attempts.receipt_id`; `ai_cache.kind = 'QUESTION'` và khóa cache `q|…`, biến thể `|v{n}` (`20` AI-08, AI-22, AI-24); biến môi trường `CHALLENGE_TOKEN_KEY`, `RECEIPT_HMAC_KEY`; mục `03` 5.3/5.4 cũ (Fast-Track) và 6.5 (sync).
