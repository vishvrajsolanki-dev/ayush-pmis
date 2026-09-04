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

## D-005 — compute_fit combine() formula
**Task**: TASK-CORE-01
**Question**: ALLOCATION_ENGINE.md §14.2 names combine(skill,location,sector) → [0,1] but defines no formula.
**Doc citation**: docs/03-engineering-specs/ALLOCATION_ENGINE.md §14.2
**Decision**: Weighted geometric mean of three equal-weight sub-scores (skill_overlap / location_match / sector_match). Skill capped at 1.0; location/sector use 1.0 (match) / 0.7 (mismatch) to allow partial-credit fits.
**Reasoning**: Geometric mean penalizes zero-in-any-dimension (correct incentive), 0.7 partial allows realistic remote/cross-sector fits.
**Alternative(s)**: Arithmetic mean rejected (compensates zero skills); min() rejected (too harsh on location mismatch).
**Reversible**: Yes — isolated to compute_fit().

## D-006 — heuristic_fallback() formula for O
**Task**: TASK-CORE-01
**Question**: ADR-05 requires deterministic heuristic fallback; AI_DS_SPEC.md §6 sets O∈[0,1]; no formula given.
**Doc citation**: docs/02-architecture/ADRS.md (ADR-05); docs/03-engineering-specs/AI_DS_SPEC.md §6
**Decision**: Mean of normalized coverage scores (skills matched/required, location 1/0, sector 1/0).
**Reasoning**: Deterministic, bounded [0,1], mirrors F dimensions, simple arithmetic = auditable proxy for missing ML.
**Alternative(s)**: Weighted sum with magic coefficients rejected (no ML basis); constant 0.5 rejected (wastes signal).
**Reversible**: Yes — isolated to score_opportunity_signal(); ML path replaces later.

## D-007 — freeze-at-run-start enforcement + data structure
**Task**: TASK-CORE-01
**Question**: §8 requires inputs immutable during run; what structure + enforcement mechanism?
**Doc citation**: docs/03-engineering-specs/ALLOCATION_ENGINE.md §8
**Decision**: Plain dicts for Candidate/Opportunity (DB-layer contract); enforcement = copy.deepcopy() at top of run_da() only.
**Reasoning**: Dicts preserve serializability for DB-wiring; deep-copy is explicit/auditable; pure E/F/O don't mutate inputs so no copy needed there.
**Alternative(s)**: @dataclass(frozen=True) rejected (breaks dict contract); caller-discipline rejected (§8 demands freeze, not assumption).
**Reversible**: Yes — internal to run_da().

## D-008 — epsilon-tolerant tiebreak grouping
**Task**: TASK-CORE-01
**Question**: §14.6 needs priorities within 1e-9 treated as tied, broken by tiebreak_key.
**Doc citation**: docs/03-engineering-specs/ALLOCATION_ENGINE.md §46, §14.6; tests/UT-04, AT-05
**Decision**: Group-by-epsilon then sort: first group candidates within epsilon of same priority, sort groups descending by priority, within group sort ascending by tiebreak_key.
**Reasoning**: Explicit epsilon grouping avoids float-ordering bugs (1e-10 diff ≤ epsilon → tied; 1e-8 > epsilon → separate). Stable sort within group gives determinism.
**Alternative(s)**: Tuple sort key (-priority, tiebreak) rejected — float comparison brittle at 1e-9 scale.
**Reversible**: Yes — isolated to rank_by_priority_with_tiebreak().
