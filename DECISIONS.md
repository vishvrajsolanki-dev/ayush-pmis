# Project Decisions Log

All architectural and structural decisions are recorded here. Format: one decision per section, numbered sequentially.

---

## D-001 — Stray PNG File Disposition
**Task**: TASK-001  
**Question**: What to do with `ChatGPT Image Sep 3, 2026, 07_51_39 PM.png` found at repo root (890KB, not referenced in any docs)?  
**Doc citation**: NOT SPECIFIED — resolved independently  
**Decision**: Moved to `_unsorted/` folder for human review — not referenced by any documentation, appears accidental  
**Alternative(s) considered**: Delete immediately (too destructive without confirmation), move to `docs/assets/` (no document references it)  
**Reversible**: Yes — file preserved, can be moved/deleted after human review

---

## D-002 — Monorepo vs Polyrepo
**Task**: TASK-001  
**Question**: Should frontend live in this repo as `frontend/`, or in a separate repository?  
**Doc citation**: NOT SPECIFIED — resolved independently per TASK-001 instructions  
**Decision**: **Monorepo** — `frontend/` folder lives in this repo (empty for now, README placeholder only until Stitch conversion task starts)  
**Alternative(s) considered**: Polyrepo (separate frontend repo) — adds coordination overhead, requires cross-repo references in docs  
**Reversible**: Yes — can extract to separate repo later if team coordination requires it

---

## D-003 — Repository Visibility
**Task**: TASK-001  
**Question**: Should the GitHub repo be public or private?  
**Doc citation**: docs/06-testing/TEST_PLAN.md (checking for submission requirements)  
**Decision**: **Private** by default — SIH submission requirements not yet verified; can make public later if required  
**Alternative(s) considered**: Public immediately (premature without confirming submission rules)  
**Reversible**: Yes — GitHub repo visibility can be changed at any time

---

## D-004 — Branch Protection
**Task**: TASK-001  
**Question**: Require PR review before merging to main, or allow direct pushes?  
**Doc citation**: NOT SPECIFIED — engineering best practice vs hackathon speed trade-off  
**Decision**: **Skip branch protection for now** — under SIH time pressure, team speed matters more than PR review friction; log this decision and revisit if quality issues emerge  
**Alternative(s) considered**: Require PR + 1 approval (best practice, but adds latency under tight deadlines)  
**Reversible**: Yes — can enable branch protection rules at any time via GitHub settings
