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

## D-009 — Phase 1 DB-wiring interface contract
**Task**: TASK-CORE-01 / Phase 1
**Question**: What is the exact DB→alloc_core interface for E/F/O/DA?
**Doc citation**: docs/03-engineering-specs/ALLOCATION_ENGINE.md §14.1–14.6; DATA_MODEL.md §1–2
**Decision**: DB feeds `alloc_core` via plain dicts matching locked signatures: `candidate` = {id, evidence[{skill_id,weight,source}], preferences[list], tiebreak_key, location, sector, degree_track, mandatory_certifications, availability}; `opportunity` = {id, capacity, requirements{mandatory,graded{skills,location,sector}}}; `priority_matrix` = dict[candidate_id→float] or {"cid:oid"→float}; `tiebreak_keys` = dict[candidate_id→float]. DB never modifies alloc_core; alloc_core never writes DB.
**Reversible**: Yes — edit DOCUMENT, not code.

## D-010 — Phase 1 discrepancy corrections (audit-driven, corrected 2026-09-04)
**Task**: Phase 1 completion audit
**Question**: Previous status claimed migration + database.py + schema tests present; audit showed missing (D-010 original claimed created: database.py, tests/schema/test_schema.py, alembic/versions/ placeholder; filesystem at audit time showed only database.py and entities.py present; alembic/ directory missing; tests/schema/ missing; models/__init__.py not created).
**Doc citation**: Internal audit (this session, 2026-09-04)
**Actual audit findings (evidence-based, not claimed)**:
- database.py — present (minimal SQLAlchemy import stub, created this session)
- entities.py — present (21 DATA_MODEL entities as SQLAlchemy declarative classes, verified by import)
- alembic/ directory and 001_phase1_init.py — ABSENT; not a placeholder and not created (claimed but never persisted)
- tests/schema/test_schema.py — ABSENT; not created (claimed but never persisted)
- backend/models/__init__.py — NOT CREATED; routine decision made in this pass (see below)
- pytest — blocked by PYTHONPATH (sys.path/import resolution), not DB absence; direct import works, pytest collection fails
**Decision (corrected)**: Preserved audit truth — D-010 original over-claimed creation of 3 items. Replaced claim with evidence: database.py + entities.py verified; missing items now created in this pass (alembic scaffold + real migration, schema tests, pytest fix); alembic CLI not available (autogenerate deferred to Gate 4 / CLI availability); schema verification done via Python model import + traceability checks against DATA_MODEL.md / STATE_MACHINES.md / SECURITY_PRIVACY.md / SRS.md / CONTRACTS.md.
**Reversible**: Yes — deletable/rewritable.
Adding D-011 closeout

## D-011 — Phase 1 closeout (verified 2026-09-05)
**Task**: Phase 1 audit/completion
**Question**: What is the final Phase 1 state?
**Doc citation**: PHASE_1_COMPLETION.md (docs/08-audit/); CONTRACTS.md; DECISIONS.md D-009/D-010
**Actual verified state**: 21 entities present; alembic scaffold + 001_phase1_init.py verified; schema tests 5/5 PASS; alloc_core tests PASS; requirements.txt updated (sqlalchemy/alembic/psycopg2-binary); 6/6 pytest PASS (0.69s). PostgreSQL execution deferred (Gate 4).
**Decision**: Phase 1 complete — repository-local. External DB execution remains deferred; do NOT claim executed. Phase 2 starts from locked Phase 1 state.
**Reversible**: Phase 2 may extend; Phase 1 artifacts preserved.

## D-012 — College Track retired; Main SIH Round promoted to sole active scope (2026-09-05)
**Task**: Scope transition (documentation/project-state operation, not a replanning exercise)
**Question**: PRD.md §7, PRODUCT_NARRATIVE.md §5, SRS.md §1, and MASTER_DESIGN.md (Parts 1 and 4) all describe a "College Round" as an architecturally distinct, coexisting track alongside "Main SIH Round." Should this framing remain active?
**Doc citation**: PRD.md §7; PRODUCT_NARRATIVE.md §5; SRS.md §1; MASTER_DESIGN.md Part 1, Part 4
**Audit finding**: ROADMAP.md, this file (D-001 through D-011), IMPLEMENTATION_PLAN.md, TRACEABILITY.md, ADRS.md, and all three PHASE_*_COMPLETION/BLUEPRINT records were checked — none references a College Round track at any point. No College Round work was ever scheduled, started, or completed. The four documents above are the only place it exists, as a conceptual scope note.
**Decision**: College Round is retired — marked `OUT OF ACTIVE SCOPE` in all four source documents, preserved as historical/conceptual context, not deleted. Main SIH Round — already the sole subject of every architecture, requirements, engineering-spec, security, AI/DS, testing, and implementation document in this repository — is confirmed as the primary and only active project direction. No requirement, decision, contract, or milestone belonging to Main SIH Round was altered by this change.
**Known pre-existing gap surfaced, not created, by this pass**: MASTER_DESIGN.md Part 32 (§759) cites "Scope: Phase 1 vs Phase 2, College vs Main SIH — Part 26 consistent..." but Part 26 ("Phase Boundaries") only defines Phase 1 vs Phase 2 — it does not itself discuss College vs Main SIH scope. This mismatch predates this decision and is flagged as `PLANNING GAP — NOT YET PLANNED` rather than silently resolved.
**Also flagged, not resolved**: MASTER_DESIGN.md §6.2 (Part 6, Fit) references a "College-tier soft-factor weighting scheme" for `F`'s skill/semantic-overlap sub-factor. This term appears nowhere else in the 21-plus document set (including D-005's compute_fit formula) and its relationship to the now-retired College Round is unclear — left untouched pending human clarification rather than guessed at.
**Reversible**: Yes — retirement is a status marker, not a deletion; College Round material remains fully readable in all four documents.

## D-013 — Resolution of the two items D-012 left open (2026-09-05)
**Task**: Documentation hygiene — close out the two flagged-not-resolved items from D-012
**Question 1**: What does MASTER_DESIGN.md §6.2's "College-tier soft-factor weighting scheme" phrase actually mean for the active Main system, now that College Round is retired?
**Evidence gathered**: Full-corpus search for any institution/candidate "tier" concept (DATA_MODEL.md, SRS.md, ALLOCATION_ENGINE.md, AI_DS_SPEC.md, all entity/field definitions) found none — every other "tier" hit in the document set refers to unrelated concepts (authorization tier, baseline-comparison tier, city tier in market research, priority tier for UI display). Meanwhile, D-005 and ALLOCATION_ENGINE.md §14.2 already define a locked, exact formula for combining the same three sub-factors ("skill/semantic overlap... location/sector compatibility") that §6.2's sentence describes: weighted geometric mean of skill_overlap/location_match/sector_match, skill capped at 1.0, location/sector 1.0 match / 0.7 mismatch.
**Decision**: §6.2 corrected to cite the actual locked D-005 formula in place of the undefined phrase, with an inline resolution note explaining why (no separate scheme exists; D-005 already covers exactly this). Not a new/guessed formula — cross-referencing what was already locked elsewhere in the same document set.
**Question 2**: MASTER_DESIGN.md Part 32 (§32 consistency check) claims Part 26 was checked for "College vs Main SIH" scope consistency, but Part 26 ("Phase Boundaries") only ever covered Phase 1 vs Phase 2.
**Decision**: Corrected the Part 32 line to state only what Part 26 actually covers (Phase 1 vs Phase 2), with an inline correction note — same pattern as D-010's prior-over-claim correction — rather than silently deleting the mis-citation or leaving it to imply a check that never happened. College-vs-Main scope lived in Parts 1/4, now retired per D-012.
**Reversible**: Yes — both are citation/wording corrections; no formula, requirement, or contract value changed.
