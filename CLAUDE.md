# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This is a **documentation-only repository** (Vietnamese) for the SimpliFey V2 Pro hackathon project (SGU 2026–2027, "Codebase Cognitive Twin"). There is no source code, build system, linter, or test suite — no commands to run. The only runnable artifact is `index.html`, a static landing/demo page (Tailwind + Lucide via CDN, inline script) you open directly in a browser.

The specs say "Documentation Phase — never generate code" (`00_CORE_SPEC/01_TONG_QUAN_KIEN_TRUC.md`). Treat the Markdown as the product: edit specs, keep them consistent, don't scaffold an implementation unless asked.

## Project in one paragraph

A pipeline that turns a public GitHub repo into an interactive DAG of cross-file "architectural slices" and then quizzes the student Feynman-style. Principle: **pure code first (0 tokens, < 1.5s), AI second (JIT Gemini 2.5 Flash, ~400 tokens, 1.2–1.8s)**. Planned stack: Next.js 15, ReactFlow, Monaco, Tree-sitter WASM, Zustand.

## Directory map (folder ⇔ architecture tier ⇔ owner)

`README.md` is the master map. Folders are numbered by tier ownership:

- `00_CORE_SPEC/` — Person 1 (Lead). Architecture overview, `02_DATA_CONTRACTS.md` (TypeScript interfaces that bind all tiers — the source of truth for types), `Kich_Ban_UseCase.md`, and `00_AUDIT_VA_PHAN_VIEC_3_NGUOI.md` (per-file audit + task checklists).
- `01_ENGINE_THUAT_TOAN/` — Person 2. Tiers 0–2: stream unzip into RAM + TreePruner → Tree-sitter symbol tables + Tarjan SCC (forces a DAG) → PageRank with utility-sink filter, Cognitive Complexity "VIP" nodes, scoped slicing, Uncle Bob metrics, Dagre layout.
- `02_AI_VA_BAYES/` — Person 3. Tiers 3–5: context-sandwich packing → single-pass contrastive CoT Gemini call + two-gate binary guardrail (symbol whitelist ∩ AST, regex blacklist) → BKT with 16-skill q-Matrix and half-life decay.
- `03_UI_VA_KICH_BAN/` — Person 1. Tri-pane cockpit FSM (ReactFlow 4-colour nodes / Monaco / X-Ray + Feynman tabs) and the 5-minute pitch/demo script.
- `04_ROADMAP_KY_THUAT/` — post-hackathon 4-phase roadmap.
- `references/` — algorithm textbook with hand-traced examples, competition rules (`thele.md`), enterprise architecture notes.
- `archive/` — superseded drafts and old specs; **not authoritative**. Don't cite or "fix" these to match current specs.
- `KyVong45.md` — competitive-positioning / defense cheat sheet for the judges.

## Invariants to preserve when editing specs

- 1 Node = 1 cross-file architectural slice (Controller → Middleware → Service → Repository), never a single file.
- 2-phase loop: Phase 1 X-Ray walkthrough, Phase 2 Feynman assessment.
- Zero-Trust / Zero-Disk: no `git clone`, no executing user code; static analysis only; stream from `codeload.github.com` with a pre-flight HEAD probe.
- One LLM call per node (not Actor-Critic multi-turn); AI output must pass the two-gate guardrail before display, with an AST-syntax fallback question on rejection.
- Node states/colours: `#F59E0B` available, `#10B981` completed, `#EF4444` failed, plus locked; background `#0F172A`.
- Latency/cost numbers (cold-start DAG < 1.5s, JIT 1.2–1.8s, < $0.002/session) are repeated across files — change them everywhere or nowhere.
- Positioning: never claim to have invented Compound AI, BKT, PageRank, or Tree-sitter repo-maps (Aider prior art); frame as novel *combination/application* (see `KyVong45.md`).
- Type names (`HybridArchitecturalNode`, `ContextSandwichPayload`, `EnrichedSliceResponse`, `StaticEngineResult`, `LearnerCognitiveProfile`, …) must match `02_DATA_CONTRACTS.md` wherever they are referenced.

## Known doc debt (from the audit file)

`01_INGESTION_STREAM.md` may still mention `isomorphic-git` (should be stream-unzip via `unzipper`); older LLM docs may cite "0.4s / Actor-Critic" (superseded by single-pass 1.2–1.8s). `README.md` links use absolute paths from another machine (`c:/Users/Admin/...`); prefer relative links in new edits.

## Working conventions

- Docs are written in Vietnamese with Mermaid diagrams and LaTeX math; keep that language and style.
- Edit in the main working directory; do not create git worktrees (stray copies exist under `.claude/worktrees/`, ignore them).
