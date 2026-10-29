# Báo cáo TASK_05B — áp dụng CHỐT CUỐI vào 20, 21, 22, 30

Nhánh: `docs/cau-truc-spec`. Đã có `DONE_05A`, đã đọc `TASK_05A.report.md`. Chỉ áp dụng dòng ✅ của `.ai/CHOT_CUOI.md` (D-13, D-27, D-34 … D-40, D-42). **Không áp dụng** D-43, D-44, D-46 (⏳) ⇒ không thêm ô đồng ý nghiên cứu, giữ nút liên kết GitHub, không tải trước node.

Byte đo bằng `tr -d '\r' < spec/<file>.md | wc -c` (trước: `git show HEAD:spec/<file>.md | tr -d '\r' | wc -c`). mmcheck: `node .ai/tools/mmcheck/check.mjs`. Token mất: `node .ai/tools/preserve.mjs`.

## 1. `spec/22_BKT_VA_KE_HOACH_CAU_HOI.md`

- Byte: **39 996 → 32 723**. mmcheck: **2/2 OK**.
- Đã làm:
  - D-34: bỏ Fast-Track (Đọc nhanh, sơ đồ, Mục 1, 1.1, 3.2, Mục 5 viết lại thành "Kế hoạch không rỗng (D-34) & Capstone"). Luật mới BKT-31: mọi kỹ năng ≥ `CONFIG.FAST_TRACK_MIN` ⇒ 1 câu cho kỹ năng điểm đã decay thấp nhất, tier `ARCHITECT`, áp cho mọi node (không phụ thuộc `is_capstone`). BKT-32: `analysis.skills` khác rỗng ⇒ n ≥ 1. Bất biến 6.5 (g) đổi theo.
  - D-35: bỏ `REMEDIATION`, `DECAY_REVIEW` (sơ đồ Mục 6, BKT-41, BKT-46, BKT-47, mục `remediationTargetsOf` cũ 6.5, mã giả, Mục 7 + bảng theo mode, Mục 8). **Giữ** `getDecayedMastery`. BKT-24 viết lại: `isDecaying(state, now)` = có state ∧ điểm đã decay < `p_mastery` ⇒ nhãn "đang mài mòn", thanh nhạt dần — chỉ hiển thị.
  - Chữ ký khớp `03` (05A, Mục 5 mục 9): `planNodeQuestions(analysis, skills, now, stepCount)`, `outcomeOf(isPassed, attemptsUsed)`, `computeSkillChange(skill, state, outcome, now)` (không còn `null`), `applyBkt(tx, userId, skill, outcome, now)`; bỏ `isFastTrack`, `hasDecayWarning`, `decayingSkills`, `remediationTargetsOf`; `nodeStatusFromRuns` chỉ xét run `LEARN` (BKT-70..72).
  - D-40: bỏ dòng `sync/replay`. D-34: bỏ `SENIOR_ACTIVE` (Mục 9, T-PER); demo viền cam ⇒ demo mài mòn bằng `SENIOR_RUSTY`.
  - D-36: 6.3 bỏ câu "`code_context` của token". D-37: GAP_TARGETING bỏ "khóa cache thêm `target_tags`". `previous_questions` (D-35) bỏ.
  - Test: xóa T-FT, T-WARN, T-UPD #6–#7 (REMEDIATION), P-E1, P-E2 (REMEDIATION), P-F1, P-F2 (DECAY_REVIEW), T-OUT 2 dòng REMEDIATION, T-RUN 3 dòng REMEDIATION/DECAY_REVIEW, cột "Mục tiêu ôn", T-PER dòng `SENIOR_ACTIVE` + cột `isFastTrack`. Bỏ tham số `mode` khỏi các test còn lại; đánh số lại T-UPD (5, 6) và T-RUN (1–4).
  - **Thêm test D-34:** P-D2 = N3 (node thường), DB 0.96, LAYERED 0.93 ⇒ `(1, LAYERED_SEPARATION, ARCHITECT, CHANGE, [1,2,3])` (trước là `[]`). P-D (Capstone mọi kỹ năng 0.95) giữ kỳ vọng, đổi mô tả từ `SENIOR_ACTIVE` sang số.
- Số đã tính lại bằng `node -e` (cài BKT, decay và `planNodeQuestions` theo mã giả mới; kiểm chứng bằng P-A cho đúng kỳ vọng cũ):
  - Lệnh: `node -e '<cài dec/upd/plan như Mục 3, 4, 6.6>; console.log(dec(0.9532,30), upd(dec(0.9532,30),"X"), dec(.95,30), …, plan(N3,{},3), plan(N5,all95,3), plan(N3,{DB:.96,LAYERED:.93},3))'`
  - Kết quả: T-UPD #6 `p_before 0.4092`, `p_after 0.1268` ✓; T-PER `SENIOR_RUSTY` 0.4085 · 0.7319 / 0.5847 / 0.1265 ✓; `MID_LEVEL` 0.8779 / 0.7845 / 0.2522 ✓; P-A ✓; P-D `(1, TRANSACTION_INTEGRITY, ARCHITECT, WEAKNESS, [3])` ✓; P-D2 `(1, LAYERED_SEPARATION, ARCHITECT, CHANGE, [1,2,3])`; mài mòn 0.5767@0 false, @10 true (0.4491), 0.0791@30 false.
- Token mất (70) — tất cả thuộc thứ đã bỏ:
  - D-34 (Fast-Track / `SENIOR_ACTIVE`): `isFastTrack`, `isFastTrack(nodeSkills, skills, now, isCapstone)`, `isFastTrack(…) = true`, `applyFastTrackCascade`, `is_auto_mastered`, `!isCapstone`, `nodeSkills.length > 0`, `getDecayedMastery(k, now) ≥ CONFIG.FAST_TRACK_MIN`, `AVAILABLE`, `planNodeQuestions(…, "LEARN", false, …)`, `node.is_capstone`, `SENIOR_ACTIVE`, `POST /api/ingest { session_id }`, `NOVICE → PRACTITIONER → ARCHITECT → Fast-Track`, `[HTTP_ROUTING, DTO_VALIDATION]`, `isCapstone = true`, `isCapstone = false`, `[HTTP_ROUTING, STATE_MANAGEMENT]`, `nodeSkills = []`, `BKT-30`.
  - D-35 (ôn tập / viền cam / mode): `p_mastery ≥ CONFIG.DECAY_WARNING_BELOW`, `p_mastery(k) ≥ CONFIG.DECAY_WARNING_BELOW`, `getDecayedMastery(k, now) < CONFIG.DECAY_WARNING_BELOW`, `CONFIG.DECAY_WARNING_BELOW`, `0.45` ("cam `0.45`"), `hasDecayWarning`, `decayingSkills`, `decayingSkills(nodeSkills, skills, now)`, `decayingSkills(…)`, `decayingSkills = [LAYERED_SEPARATION]`, `[DB_OPTIMIZATION, LAYERED_SEPARATION]`, `[DB_OPTIMIZATION]`, `{0.1268, now}`, `{0.7324, now}`, `last_run`, `mode = "DECAY_REVIEW"`, `ERR_MODE_NOT_ALLOWED`, `mode`, `failedSkills`, `failedSkills = [{AUTH_SECURITY, used_focuses: [WEAKNESS]}]`, `[WEAKNESS nếu weak(k)] + [FLOW, ARCHITECTURE, CHANGE]`, `used_focuses`, `used_focuses: [WEAKNESS, FLOW]`, `previous_questions`, `remediationTargetsOf`, `remediationTargetsOf(runs)`, `started_at`, `RemediationTarget`, `ended_by ≠ "DROPPED"`, `outcomeOf(isPassed, attemptsUsed, mode)`, `mode = "REMEDIATION"`, `computeSkillChange(skill, state, outcome, mode, now)`, `applyBkt(tx, userId, skill, outcome, mode, now)`, `p_before = null`, `CONFIG.REMEDIATION_MAX_ATTEMPTS`, `computeSkillChange("AUTH_SECURITY", undefined, "FAILED", "LEARN", T0)` (đổi thành bản không `mode`), `computeSkillChange(…, "FAILED", "REMEDIATION", …)`, `p_before 0.0791`, `p_after 0.2008`, `next = { 0.2008, T0+1d, 2, 1 }`, `(1, AUTH_SECURITY, NOVICE, FLOW, [1,2,3])`, `(1, AUTH_SECURITY, NOVICE, ARCHITECTURE, [1,2])`, `(1, LAYERED_SEPARATION, NOVICE, FLOW, [1,2,3])`, `[{AUTH_SECURITY, [WEAKNESS]}]`, `[{AUTH_SECURITY, [WEAKNESS, FLOW]}]`, `BKT-47`, `BKT-51`.
  - D-36: `code_context`. D-40: `sync/replay`, `issued_at`.
- Khối code đổi: 2 (mã giả `planNodeQuestions`, chữ ký TypeScript) — đúng chủ đích.

## 2. `spec/20_AI_GOI_VA_PROMPT.md`

- Byte: **47 115 → 44 088** (≤ 47 433). mmcheck: **3/3 OK**.
- Đã làm:
  - D-37: `enrich-node` không cache (Đọc nhanh, sơ đồ bỏ cạnh `EN <--> C`, AI-08, sơ đồ AI-12); AI-22 `getOrGenerateQuestions` ⇒ `generateQuestions(session, graph, node, analysis, plan)` (khớp `03` 6.1), bỏ khóa `questionKey`, biến thể `|v{n}` (D-25 hủy), "ghi cache câu đạt".
  - D-35: bỏ mục `previous_questions` (AI-24), tag `"previous_questions"` trong `DATA_TAGS`, luật 8 của `QUESTIONS_SYSTEM` và dòng `[<previous_questions>…]` trong tin nhắn người dùng; AI-31 bỏ nhánh `REMEDIATION` (sơ đồ + `expectedFollowUpType` bỏ tham số `mode`).
  - D-36: bỏ toàn bộ Mục 8 `challenge_token` (AI-35), `src/server/token.ts`, `CHALLENGE_TOKEN_KEY` ở bảng lỗi; Mục 9 "Xử lý lỗi" đánh số lại thành **Mục 8** (không file nào khác trỏ số mục của `20`). Prompt chấm: bỏ đúng dòng `<code_data>{t.code_context}</code_data>` và cụm "`<code_data>`, " trong câu cuối `GRADE_SYSTEM` (vì thẻ không còn). Đầu vào chấm: thay `ChallengeTokenPayload` bằng kiểu nội bộ `GradeContext = RunQuestion & { steps: RunStepRef[]; forbidden_external_keywords: string[] }` dựng từ dòng `node_runs` (giữ tên biến `t` để không phải sửa placeholder `{t.…}` trong khối prompt); `injectionGrading(t: Pick<RunQuestion, "must_have_points">)` (khớp `03` gọi `injectionGrading(q)`). AI-10 bỏ `code_context`; AI-23 bỏ câu về token.
  - D-13: AI-30 câu 1 viết lại thành so khớp lỏng (đoạn con sau chuẩn hóa, không xét thứ tự); **không đổi code** `coveredFlags` (vốn đã là `includes` từng đoạn).
  - Test: AI-31 bỏ phần `DECAY_REVIEW` / `REMEDIATION`; AI-22 bỏ "câu 1 cache" và ca `…|v2`, thêm "không ghi `ai_cache`"; AI-23 thay "token Q1 có `code_context`" bằng "prompt chấm không có `<code_data>`"; xóa AI-35; bỏ `REMEDIATION_MAX_ATTEMPTS = 2` khỏi giả định.
- Không sửa nội dung prompt / schema nào khác (`ANALYZE_*`, `OVERVIEW_*`, `FOCUS_GUIDE_*`, `HINT_RULE`, các schema giữ nguyên).
- Token mất (45) — tất cả thuộc thứ đã bỏ:
  - D-36: `challenge_token`, `src/server/token.ts`, `token.ts`, `code_context`, `code_context = renderSteps(node, rq.step_indices)`, `forbidden_external_keywords = forbiddenKeywords(…)`, `exp = issued_at + CONFIG.CHALLENGE_TOKEN_TTL_MS`, `CONFIG.CHALLENGE_TOKEN_TTL_MS`, `base64decode(CHALLENGE_TOKEN_KEY)`, `CHALLENGE_TOKEN_KEY`, `"simplifey.ct.v1"`, `"v1." + b64url(iv) + "." + b64url(ciphertext ‖ tag16)`, `"v1"`, `step_indices ⊆ steps[].step_index`, `INVALID`, `now > exp`, `EXPIRED`, `run.node_id = node_id`, `now = exp + 1`, `AI-35`; và các tên trường chỉ nằm trong backtick ở mục token: `question_index`, `tier`, `focus`, `step_indices`, `RunQuestion`, `run_id`, `node_id`, `finished`, `""`, `session_id` (các tên này vẫn có trong khối code / file khác).
  - D-37 / D-25 hủy: `base = questionKey(session, node, item, mode)`, `base`, `v === 1`, `base + "|v" + v`, `…|v2`, `RunQuestion.cache_key`, `run_questions`.
  - D-35: `normText(feynman_question) ∉ normText(previous)`, `[]` (`LEARN ⇒ []` của AI-24), `previous`, `previous_questions`, `mode`, `HINT_RULE[expectedFollowUpType(attempt, maxAttempts, t.mode) ?? "NONE"]` (đổi thành bản không `t.mode`), `REMEDIATION_MAX_ATTEMPTS = 2`, `AI-24`.
- Khối code đổi: 10 — `DATA_TAGS`, `generateQuestions`, `[QUESTIONS_SYSTEM]` (bỏ luật 8), tin nhắn đặt câu hỏi (bỏ dòng `previous_questions`), `gradeWithAI`, `[GRADE_SYSTEM]` (bỏ "`<code_data>`, "), tin nhắn chấm (bỏ dòng `code_data`), `expectedFollowUpType`/`decideFollowUp`, `injectionGrading`, khối token (xóa). Đúng chủ đích.

## 3. `spec/21_AI_KIEM_VA_DUYET.md`

- Byte: **38 972 → 39 382**. mmcheck: **1/1 OK**.
- Đã làm:
  - D-36: `tokenScope(t: ChallengeTokenPayload, …)` ⇒ `gradeScope(t: GradeContext, …)` (bỏ `code_context` khỏi phạm vi tên); `verifyFollowUp`, `leaksNumbers` nhận `GradeContext` (`20` AI-27); GUARD-06: bỏ "token" khỏi phạm vi `codeText`, `ChallengeTokenPayload.forbidden_external_keywords` ⇒ `node_runs.forbidden_external_keywords`.
  - D-13: thêm mục ngắn "Trích dẫn ý bắt buộc (D-13)" ở Mục 6 — so khớp lỏng, trỏ `20` AI-30 (không thêm mã GUARD mới).
- Token mất (5) — D-36: `tokenScope`, `code_context`, `ChallengeTokenPayload.forbidden_external_keywords`, `checkNames([q], tokenScope(t, answer))`, `checkNames([f], tokenScope)`.
- Khối code đổi: 2 (`NameScope`/chữ ký phạm vi, `verifyFollowUp`) — đúng chủ đích.

## 4. `spec/30_UI.md`

- Byte: **39 988 → 38 127**. mmcheck: **1/1 OK**.
- Đã làm:
  - D-34: bỏ Fast-Track (Đọc nhanh, Mục 1, màu ⚡ `--mint` "Miễn thi", nút UI-47, UI-58, 7.4, 7.5, Offline `isFastTrack`, T3). Persona online (Mục 9) theo `03` 5.4: không gọi lại `ingest`, trạng thái node không đổi.
  - D-35: bỏ viền cam (bản đồ, chú giải, `GraphNodeCard.decay`, `--orange`, aria "đang phai"), nút "Ôn bài" / "Ôn lại", `can_remediate`, nhãn "Ôn lại / Ôn bài", lượt `REMEDIATION`, băng UI-57 `REMEDIATION`/`DECAY_REVIEW`, 7.4 bước 3. **Thêm** mài mòn kiểu Duolingo ở bảng kỹ năng Tab X-Ray (6.1): thanh theo điểm đã decay, đậm theo tỉ lệ `điểm đã decay / p_mastery`, nhãn "đang mài mòn" khi `isDecaying` (`22` BKT-24); T4, T5 viết lại theo mài mòn.
  - D-36: bỏ mọi `challenge_token` (Mục 1, 7.5, UI-77, `ERR_CHALLENGE_TOKEN_*` ở Mục 10, T15).
  - D-40: bỏ `sf.receipts.*`, header "Đồng bộ", `pending_receipts`, 7.2 bước `sync/replay`, Mục 7.6, `SyncReplayResponse.profile`, `sync` trong Offline, `ERR_RECEIPT_INVALID`; UI-77 thêm `ERR_PERSISTENCE_UNAVAILABLE` ⇒ "Thử lại"; T17 viết lại.
  - D-42: nút "Học lại từ đầu" ở "Tiếp tục học" ⇒ `POST /api/ingest { session_id, restart: true }` + hộp xác nhận; thêm T30.
  - D-38: ghi chú dưới ô link "Chỉ hỗ trợ nhánh mặc định"; link `/tree/…`, `/blob/…` vẫn quét (`GithubRepoInfo.path_trimmed`), ghi chú tô `--amber`; link sai dạng ⇒ `ERR_INVALID_GITHUB_URL`. T26 thêm ca `/tree/main/src`.
  - D-27: vùng thả kiểm `CONFIG.MAX_UPLOAD_BYTES` ở client; thêm thông điệp "Upload" cho `ERR_STREAM_QUOTA_EXCEEDED` (giữ nguyên thông điệp cũ từng chữ, thêm biến thể như dòng `ERR_AI_UNAVAILABLE`); T26 đổi `MAX_STREAM_BYTES` ⇒ `MAX_UPLOAD_BYTES`.
  - D-39 (ngoài danh sách việc của task nhưng ✅ và `30` nằm trong file bị ảnh hưởng): xóa dòng `ERR_SESSION_SOURCE_EXPIRED` ở Mục 10 — nếu giữ, `ERROR_MESSAGES: Record<ErrorCode, …>` thừa khóa (T27 hỏng) vì `02` đã bỏ mã này.
  - Chuỗi hiển thị còn giữ (nút, thông điệp lỗi) không đổi chữ nào.
- Token mất (43) — tất cả thuộc thứ đã bỏ:
  - D-34: `is_auto_mastered`, `!is_auto_mastered`, `--mint`, `--mint #6EE7B7`, `questions = []`, `isFastTrack`, `SENIOR_ACTIVE`.
  - D-35: `node: HybridArchitecturalNode; state?: …; decay: boolean; …` (prop `GraphNodeCard`), `status = COMPLETED`, `hasDecayWarning(…)`, `--orange`, `--orange #FB923C`, `can_remediate`, `remediation_runs < CONFIG.REMEDIATION_MAX_RUNS_PER_NODE`, `CONFIG.REMEDIATION_MAX_RUNS_PER_NODE`, `CONFIG.REMEDIATION_MAX_ATTEMPTS`, `mode`, `last_run.mode`, `MODE`, `ERR_MODE_NOT_ALLOWED`, `enrich-node DECAY_REVIEW`.
  - D-36: `challenge_token`, `challenge_token = ""`, `ERR_CHALLENGE_TOKEN_EXPIRED`, `ERR_CHALLENGE_TOKEN_INVALID`, `_INVALID`.
  - D-40: `sf.receipts.{user_id}`, `sf.receipts.*`, `pending_receipts`, `POST /api/sync/replay`, `sync/replay`, `SyncReplayResponse.profile`, `sync_receipt ≠ null`, `sync_receipt`, `user_id`, `issued_at`, `online`, `visibilitychange`, `STALE`, `INVALID`, `progress ≠ null`, `ERR_RECEIPT_INVALID`.
  - D-39: `ERR_SESSION_SOURCE_EXPIRED`.
- Khối code đổi: 0.

## 5. Chỗ chưa làm / không chắc (cần planner xem)

1. **`gradeWithAI` lệch chữ ký với `03` 6.2:** `03` gọi `gradeWithAI(q, run.steps, answer, attempt, max, session)`, nhưng chấm còn cần `forbidden_external_keywords` (gác gợi ý, `21` GUARD-13) mà `03` không truyền. `20` dùng `gradeWithAI(t: GradeContext, answer, attempt, maxAttempts, session)` với `GradeContext` dựng từ dòng `node_runs`. Cần sửa 1 dòng ở `03` 6.2 cho khớp (ngoài phạm vi).
2. **`GradeContext` là kiểu nội bộ khai ở `20`** (như `LlmRequest`, `NameScope`), không đưa vào `02`. Nếu planner muốn "mọi kiểu ở `02`" chặt thì chuyển sang `02` Mục 5.4.
3. **`21` GUARD-12 Q9 + tham số `previous` của `checkQuestions`** vẫn còn (CHOT ghi D-35 không ảnh hưởng `21`). Từ nay `previous` luôn rỗng ⇒ Q9 vô nghĩa; test "Câu trùng `previous` ⇒ hỏng" cũng vậy. Nên bỏ ở task sau.
4. **Nhãn "đang mài mòn" bật gần như ngay sau khi luyện** (luật đúng chữ CHOT: điểm đã decay < điểm gốc; với Δt > 0 và điểm > sàn thì luôn đúng). Có thể cần ngưỡng (vd so sau làm tròn 4 chữ số, hoặc chênh tối thiểu) — chưa thêm vì sẽ là số mới ngoài `CONFIG`.
5. **"Bảng kỹ năng" của D-35** được đặt ở phần Kỹ năng của Tab X-Ray (chỉ kỹ năng của node đang mở). `30` chưa có bảng 16 kỹ năng toàn hồ sơ; nếu nhóm muốn bảng riêng (vd trong menu tài khoản) cần thêm component.
6. **T-MM (4 dòng) ở `22`** là test thêm ngoài yêu cầu ("thêm 1 test cho D-34") cho hàm `isDecaying` mới; số lấy lại từ T-DEC, đã kiểm bằng `node -e`. Có thể bỏ nếu planner muốn giữ đúng phạm vi.
7. **T-UPD #6 và T-OUT dòng `true, 3`** trước là ca `DECAY_REVIEW`; giữ lại sau khi bỏ `mode` vì vẫn đúng với `LEARN` (tiên nghiệm đã decay; lượt 3 đạt).
8. **`ERR_BRANCH_NOT_FOUND`** vẫn ở `02` và Mục 10 của `30` với thông điệp "Hãy nhập đúng tên nhánh (VD: release/1.0)" — mâu thuẫn D-38 (không còn nhập nhánh). Giữ nguyên từng chữ theo luật task; cần quyết bỏ mã hoặc đổi thông điệp.
9. **`RunMode = "LEARN"` + trường `mode`** còn ở `QuestionCard`, `EnrichNodeRequest`, khóa bundle Offline `${node_id}:${mode}:${persona}` — giữ theo `02` (05A Mục 5 mục 3).
10. **D-38 ở client:** `IngestResponse` không trả `path_trimmed`; `30` cho client tự nhận biết `/tree/…`, `/blob/…` trong ô link để tô ghi chú. Nếu muốn server báo thì thêm trường ở `02`.

## 6. Chỗ cần sửa ở file ngoài phạm vi

- `spec/00` dòng **D-25** (đã hủy) còn trỏ `20` AI-24 (đã xóa) ⇒ `refcheck --diff` báo 1 tham chiếu hỏng mới: `spec/00_QUYET_DINH.md | mã không còn trong spec/20_AI_GOI_VA_PROMPT.md | AI-24`. Các dòng khác `refcheck` báo đều có trong baseline.
- `spec/03` 6.2: chữ ký `gradeWithAI` (Mục 5 mục 1 ở trên).
- `spec/04` dòng "Storage & Sync" còn `challenge_token`, `ChallengeTokenPayload`, `SyncReceipt` (TASK_05C).
- `spec/01` INV-05, INV-07, INV-11 (đã nêu ở 05A) còn Fast-Track / viền cam / `challenge_token`.
- `spec/50` fixture / kịch bản dùng `SENIOR_ACTIVE`, Fast-Track, viền cam, `sync/replay`, `REMEDIATION` (nếu có) cần theo `22` và `30` mới.
- `spec/21` Mục 10 nhắc khóa bundle "mỗi persona × mode" — vẫn đúng hình thức (`mode` chỉ còn `LEARN`), không sửa.
