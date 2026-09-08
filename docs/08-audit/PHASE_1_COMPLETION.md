# Phase 1 — DB Schema Foundation Completion (2026-09-05)

## Objective
Establish repository-local DB schema, SQLAlchemy declarative models, Alembic migration infrastructure, alloc_core contract compatibility, schema verification tests, and dependency reproducibility. External DB execution deferred.

## Final Verified State
- Repo root: C:/Users/vishv/OneDrive/Desktop/AYUSH
- Backend CWD: /AYUSH/backend
- 6/6 pytest items PASS: 5 schema (test_schema.py) + 1 alloc_core (test_alloc_core.py)
- Command: `cd backend && pytest -v` → 6 passed, 0 failed, 0.69s
- SQLAlchemy 2.0.36 installed; alembic 1.13.3 installed; dependencies declared in backend/requirements.txt

## Implemented Components (verified by ls + import)
- backend/models/entities.py — 21 SQLAlchemy entities; declarative_base()
- backend/models/__init__.py — package init
- backend/alembic.ini + env.py + versions/001_phase1_init.py — real migration (all 21 tables + indexes)
- backend/database.py — SQLAlchemy stub
- backend/tests/schema/test_schema.py — 5 assertions (import, weights contract, tiebreak_key, snapshot fields, audit structure)
- backend/tests/test_alloc/test_alloc_core.py — alloc_core integration (renamed from test_alloc_core/ to avoid package shadow)
- backend/alloc_core/ — 6 exported interface functions + locked constants preserved
- backend/conftest.py + pytest.ini — architectural import mechanism
- backend/requirements.txt — sqlalchemy, alembic, psycopg2-binary declared and installed

## Migration Status
- Migration source exists (001_phase1_init.py, 768 bytes, all 21 tables + FK ordering + indexes)
- Alembic config verified (env.py imports models.entities.Base, targets metadata)
- Actual PostgreSQL execution: NOT EXECUTED (external prerequisite deferred — Gate 4 not requested)
- Alembic CLI autogenerate: deferred to Gate 4 / CLI availability (not claimed)

## Contracts
- CONTRACTS.md — DB→alloc_core interface locked (candidate/opportunity dicts); evidence weights (SELF_REPORTED=1.0, INSTITUTION_VERIFIED=2.0); schema contract (21 tables)
- D-009 (DB→alloc_core contract), D-005 through D-008 (alloc_core formulas) preserved
- D-010 corrected (audit trail preserved: original over-claim documented, evidence-based correction)

## Decisions (D-005 → D-010 verified in DECISIONS.md)
- D-005: compute_fit geometric mean
- D-006: heuristic_fallback mean of normalized coverage
- D-007: freeze-at-run-start (deepcopy)
- D-008: epsilon-tolerant tiebreak grouping
- D-009: DB→alloc_core dict contract (locked)
- D-010: Phase 1 discrepancy correction (verified against filesystem)

## Verification (exact results)
- `python -c "from alloc_core.engine import *; print(ALPHA)"` → 0.6 PASS
- `python -c "import sqlalchemy; print(sqlalchemy.__version__)"` → 2.0.36 PASS
- `cd backend && pytest -v` → 6 passed in 0.69s PASS
- Direct import of all 21 entities → PASS

## Security/Privacy Foundation (Phase 1 implemented)
- Student.tiebreak_key (FR-020)
- AllocationSnapshot.snapshot_blob / snapshot_hash / candidate_subject_token (FR-015 immutability)
- Audit (append-only, actor/action/object_ref/tenant/timestamp)
- SubjectIdentityMapping (separation from snapshot)
- Institution/Company status PENDING default; Opportunity status DRAFT default; Evidence status SELF_REPORTED default
- Full auth/RBAC/tenant enforcement belongs to Phase 2 — NOT claimed here

## Deferred / Not Yet Done (correctly external/Phase-bound, not hidden)
- PostgreSQL server + pgvector execution (Gate 4)
- Render/cloud provisioning (Gate 4)
- Auth / RBAC / tenant enforcement (Phase 2)
- API layer (Phase 4)
- Synthetic data (Phase 3)
- ML pipeline (Phase 5)
- Governance/scheduler (Phase 6/7)
- Analytics (Phase 8)
- Integration/E2E (Phase 9)
- Final deployment readiness (Phase 10)

## Phase 2 Starting Point
Phase 2 begins from this verified repository state. Consume (do not rebuild):
- database/model foundation (backend/models/ + database.py)
- alloc_core contract + locked constants (backend/alloc_core/)
- contracts + decisions (CONTRACTS.md + DECISIONS.md D-009/D-010)
- migrations (backend/alembic/ + 001_phase1_init.py)
- package structure (pythonpath=. + conftest + no sys.path hacks)
- test infrastructure (pytest.ini + 6 verified tests)

Locked for Phase 2 (do not modify without gated decision):
- alloc_core 6 public signatures; ALPHA=0.6; EPSILON=1e-9; EVIDENCE_WEIGHTS
- 21 DATA_MODEL entities and their FK relationships
- DB→alloc_core dict contract (D-009)
- Migration 001_phase1_init.py (first revision — downgrade deferred)

## New Session Startup
1. Read this file.
2. Read CONTRACTS.md and DECISIONS.md (verify D-005→D-010).
3. Verify git status / repo root / backend/ CWD.
4. Verify `cd backend && pytest -v` produces 6 passed (not 0/6, not fabricated).
5. Confirm external DB execution deferred (Gate 4 not requested).
6. Begin Phase 2 from locked Phase 1 state above.
