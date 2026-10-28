# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This is a **documentation-only repository** (Vietnamese) for the SimpliFey V2 Pro hackathon project (SGU 2026–2027, "Codebase Cognitive Twin"). There is no source code, build system, linter, or test suite — no commands to run. The only runnable artifact is `index.html`, a static landing/demo page (Tailwind + Lucide via CDN, inline script) you open directly in a browser.

The specs say "Documentation Phase — never generate code" (`00_CORE_SPEC/01_TONG_QUAN_KIEN_TRUC.md`). Treat the Markdown as the product: edit specs, keep them consistent, don't scaffold an implementation unless asked.

## Project in one paragraph

A pipeline that turns a public GitHub repo (or an uploaded `.zip`) into an interactive DAG of cross-file "architectural slices" and then quizzes the student Feynman-style. Principle: **pure code first (0 tokens, < 1.5s), AI second (JIT Gemini 2.5 Flash, enrich 1.2–1.8s with ≤ 2,000 input / ≤ 900 output tokens, ≈ $0.03/session estimated)**. Planned stack: Next.js 15, ReactFlow, Monaco, Tree-sitter WASM, Zustand, Supabase (Postgres + Auth) for learner progress.

## Directory map (folder ⇔ architecture tier ⇔ owner)

`README.md` is the master map. Folders are numbered by tier ownership:

- `00_CORE_SPEC/` — Person 1 (Lead). Architecture overview (`01_TONG_QUAN_KIEN_TRUC.md` §5 is the **single canonical numbers table**), `02_DATA_CONTRACTS.md` (TypeScript interfaces that bind all tiers — the source of truth for types; other files reference types, never copy them), `03_SYSTEM_EDGE_CASES_AUDIT.md`, `04_LUU_TRU_VA_DONG_BO.md` (Supabase Postgres + Auth persistence layer: tables, RLS, server-side BKT transaction, resume-by-commit-SHA), `00_AUDIT_VA_PHAN_VIEC_3_NGUOI.md` (per-file audit + task checklists), and `Kich_Ban_UseCase.md` — a **derived summary**: never use it as a source; when it disagrees with another spec, update it from that spec.
- `01_ENGINE_THUAT_TOAN/` — Person 2. Tiers 0–2: stream unzip into RAM + TreePruner → Tree-sitter symbol tables + Tarjan SCC (forces a DAG) → PageRank with utility-sink filter, Cognitive Complexity "VIP" nodes, scoped slicing, Uncle Bob metrics, deterministic node naming (Algorithm 8: route → entry symbol → TF-IDF domain terms → directory → file name; never AI), Dagre layout.
- `02_AI_VA_BAYES/` — Person 3. Tiers 3–5: context-sandwich packing → single-pass contrastive CoT Gemini call + two-gate binary guardrail (symbol whitelist ∩ AST, regex blacklist) → BKT with 16-skill q-Matrix and half-life decay.
- `03_UI_VA_KICH_BAN/` — Person 1. Tri-pane cockpit FSM (ReactFlow 4-colour nodes / Monaco / X-Ray + Feynman tabs) and the 5-minute pitch/demo script.
- `04_ROADMAP_KY_THUAT/` — post-hackathon 4-phase roadmap.
- `references/` — algorithm textbook with hand-traced examples and competition rules (`thele.md`).
- `archive/` — superseded drafts and old specs; **not authoritative**. Don't cite or "fix" these to match current specs.
- `BAO_CAO_LUONG_HE_THONG.md` — end-to-end walkthrough of the system (plain-language + technical per step); a **derived summary** like `Kich_Ban_UseCase.md`: update it from the specs, never the reverse. Its Part 7 lists what the specs still leave undefined.
- `KyVong45.md` — competitive-positioning / defense cheat sheet for the judges. `BAO_CAO_THAM_DINH_GIAM_KHAO.md` — mock judge review with a status table of which findings are fixed.

## Invariants to preserve when editing specs

- 1 Node = 1 cross-file architectural slice (Controller → Middleware → Service → Repository), never a single file.
- 2-phase loop: Phase 1 X-Ray walkthrough (flow + design strengths only — never show the smell/bug), Phase 2 Feynman assessment. The answer (`smell_reveal_after_attempt`) stays server-side inside `challenge_token` until pass, 3rd failed attempt, or skip.
- Zero-Trust / Zero-Disk: no `git clone`, no executing user code; static analysis only; stream from `codeload.github.com` with a pre-flight HEAD probe. Zero-Disk covers the user's **source code**: code, snippets and the full `StaticEngineResult` never reach disk or the database.
- Persistence: Postgres (Supabase) stores learner data only — `skill_states`, `learning_sessions` (commit SHA + code-free graph skeleton), `node_progress`, `feynman_attempts`. The server is the only writer: BKT updates, retry counting, unlocks/Fast-Track and the reveal decision all run server-side in one transaction; the client holds a read-only copy. Sessions resume by re-ingesting the stored commit SHA (engine is deterministic). `localStorage` holds only signed `SyncReceipt`s and UI prefs, never the learner profile.
- One LLM call per node (not Actor-Critic multi-turn), and AI only at 2 JIT points (`enrich-node`, `evaluate-feynman`) — no Intent Router; AI output must pass the two-gate guardrail before display, with an AST-syntax fallback question on rejection. Don't claim the gate kills 100% of hallucinations: it blocks invented symbols and out-of-repo tech, not wrong semantics.
- Language support is tiered via a Language Registry, not a hard-coded list: `RESOLVED` (has its own `ImportResolver`: TS/JS, Python, Java, Go, Dart → accurate edges) vs `STRUCTURAL` (any language with a Tree-sitter grammar → Universal Resolver, edges `confidence: INFERRED`, not guaranteed 100%). Only languages with no grammar are `UNSUPPORTED` (`ERR_UNSUPPORTED_LANGUAGE`). Never claim "100+ languages verified" — only TS/JS and Python are verified for the hackathon MVP. No regex fallback, no LLM-based graph extraction.
- Node states/colours: `#F59E0B` available, `#10B981` completed, `#EF4444` failed (3rd wrong attempt or skip; still unlocks children via soft-bypass), plus locked; background `#0F172A`. Fast-Track (≥ 0.92), warning triangle and decay (orange border, `max(0.25, P·2^(-Δt/14)) < 0.45`, computed on read) are display layers, not FSM states.
- Latency/cost numbers (cold-start DAG < 1.5s target, JIT enrich 1.2–1.8s / evaluate 0.8–1.2s, ≈ $0.03/session estimated, ≤ 100 lines / ≤ 1,500 tokens of code per node) live in `01_TONG_QUAN_KIEN_TRUC.md` §5 — change that table first, then every file that cites it.
- Positioning: never claim to have invented Compound AI, BKT, PageRank, or Tree-sitter repo-maps (Aider prior art); frame as novel *combination/application* (see `KyVong45.md`).
- Type names (`HybridArchitecturalNode`, `ContextSandwichPayload`, `EnrichedSliceResponse`, `StaticEngineResult`, `LearnerCognitiveProfile`, …) must match `02_DATA_CONTRACTS.md` wherever they are referenced.

## Known doc debt (from the audit file)

The 2026-10-28 sync removed `isomorphic-git`, "0.4s / Actor-Critic", the Intent Router, "~400 tokens" / "< $0.002" cost claims and absolute `file:///` links. Still open: `index.html` / `cockpit_demo.html` mock data predates the sync (`index.html` shows the N+1 smell up front); per-team pitch duration is not in `thele.md`; no measured latency/token numbers yet. Prefer relative links in new edits.

## Working conventions

- Docs are written in Vietnamese with Mermaid diagrams and LaTeX math; keep that language and style.
- Edit in the main working directory; do not create git worktrees (stray copies exist under `.claude/worktrees/`, ignore them).
