# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This is a **documentation repository** (Vietnamese) for the SimpliFey V2 Pro hackathon project (SGU 2026–2027, "Codebase Cognitive Twin"). There is no source code, build system or test suite here. The product is coded during the 21-hour challenge round (12:00 31/10 → 09:00 01/11/2026) in a **separate, initially empty** competition repo, by following `spec/`. Competition rules (`references/thele.md`): only commits made during the round count, no bulk commit of pre-written code, every member must commit. So: do not scaffold the implementation in this repo, and do not paste large code blocks from `spec/` into the competition repo in one commit.

Spec freeze: 30/10/2026. After that, spec changes go through `spec/00_QUYET_DINH.md`.

## Project in one paragraph

Turns a public GitHub repo (or uploaded `.zip`) into a deterministic map of 6–8 cross-file architectural slices (pure code, 0 tokens, target < 1.5 s), then uses Gemini at **4 calls** — `analyze-node` (skills + strengths + weak points, shared cache), `analyze-overview`, `enrich-node` (questions per weak skill), `evaluate-feynman` (grading + 3-level hints) — and a server-side BKT learner model over 16 skills stored in Supabase Postgres. Stack: Next.js 15, ReactFlow, Monaco, Tree-sitter WASM, Zustand, Supabase.

## Directory map

- `spec/` — **the only normative source.** Read `README.md` for the per-role reading order.
  - `00_QUYET_DINH.md` — decisions (D-xx), defaults awaiting confirmation, open questions (Q-xx). The only place that may say "proposed / pending".
  - `01_KIEN_TRUC_VA_LUONG.md` — invariants INV-01..13, components, flows, node & question lifecycles, where data lives.
  - `02_CONTRACTS.md` — **all** TypeScript types, every API request/response, all error codes, and the single `CONFIG` constants table.
  - `03_API_VA_LUU_TRU.md` — endpoints, Postgres schema, RLS, transactions, state derivation, Fast-Track.
  - `10_ENGINE_INGEST.md`, `11_ENGINE_DO_THI.md` — Tiers 0–2 (Person 2).
  - `20_AI_GOI_VA_PROMPT.md`, `21_AI_KIEM_VA_DUYET.md`, `22_BKT_VA_KE_HOACH_CAU_HOI.md` — AI calls, guardrails, BKT & question planning (Person 3).
  - `30_UI.md` — UI (Person 1). `40_KE_HOACH_21H.md` — 21-hour build plan. `50_TEST_VA_FIXTURE.md` — fixtures and end-to-end scenarios.
- `pitch/` — demo script, judge Q&A, plain-language walkthrough, roadmap. **Not used for coding**; when it disagrees with `spec/`, `spec/` wins.
- `references/` — competition rules (`thele.md`) and an algorithm textbook (illustrative only).
- `prototype/cockpit_demo.html` — stale visual prototype; design reference only, its data and logic are outdated.
- `archive/` — superseded documents (including everything before the 2026-10-28 consolidation in `archive/2026-10-28_truoc-hop-nhat/`). **Not authoritative**; don't cite or "fix" them.

## Rules when editing specs

- One fact, one place: types live only in `spec/02_CONTRACTS.md`; numbers only in its `CONFIG` table (and in "Test bắt buộc" sections / `50`). Other files refer by name (`CONFIG.FAST_TRACK_MIN`, `HybridArchitecturalNode`, rule IDs like `ENG-12`).
- To change a decision: edit the D-xx row in `spec/00_QUYET_DINH.md` first, then the files it points to.
- Preserve the invariants in `spec/01_KIEN_TRUC_VA_LUONG.md` §2 (INV-01..13). Key ones: 1 node = 1 cross-file slice; Zero-Trust / Zero-Disk for source code; server is the only writer of learning progress; Tab 1 shows strengths and AI-labelled weak points, answers revealed only when a question finishes; every AI text passes the guardrail (it blocks invented names / out-of-repo tech, not wrong meaning — never claim 100%); no AST fallback question; only TS/JS and Python are verified languages; deterministic engine; never claim to have invented BKT / PageRank / Compound AI / Tree-sitter repo-maps.
- Spec files are normative: no rationale essays, metaphors, pitch text or history inside `spec/` (those go to `pitch/` or `archive/`). Keep each spec file ≤ ~40 KB.
- All latency / token / cost numbers are targets or estimates until measured (`spec/02_CONTRACTS.md` §1.1).

## Working conventions

- Docs are written in Vietnamese with Mermaid diagrams and occasional LaTeX; keep that language and style. Prefer relative links.
- Edit in the main working directory; do not create git worktrees (stray copies exist under `.claude/worktrees/`, ignore them).
