# CONTRACTS.md — Interface Contracts (Anchor / ayush-pmis)

## DB → alloc_core interface (locked, Phase 1)
- Candidate dict to compute_eligibility, compute_fit, score_opportunity_signal: {id, evidence:[{skill_id,weight,source}], preferences:[opportunity_id], tiebreak_key:float, location, sector, degree_track, mandatory_certifications:[str], availability}
- Opportunity dict: {id, capacity:int, requirements:{mandatory:[str], graded:{skills:[str], location, sector}}}
- priority_matrix: dict[candidate_id→float] OR {"cid:oid"→float}; tiebreak_keys: dict[candidate_id→float]
- run_da(candidates, opportunities, priority_matrix, capacities, preferences, tiebreak_keys) → dict[candidate_id → opportunity_id | "UNMATCHED"]

## alloc_core locked constants (must not change without breaking-change flag)
- ALPHA = 0.6; EPSILON = 1e-9; Evidence weights SELF_REPORTED=1.0, INSTITUTION_VERIFIED=2.0; cap evidence≤5/claim (FR-021)

## DB schema contract (Phase 1)
- Tables from DATA_MODEL §1: users, students, institutions, companies, opportunities, applications, skills, skill_claims, evidence, verification, preferences, allocation_runs, allocation_generations, allocations, recovery_queue, model_versions, calibration_artifacts, validation_evidence, allocation_snapshots, subject_identity_mapping, audits, outcomes, institutional_analytics
- Enforcement: SQL enum status fields; check constraints; pgvector (evidence.embedding 4096-dim, opportunities.embedding); indexes; audit append-only (no UPDATE/DELETE); snapshot immutability; identity mapping separation; tenant-scoped access

## Phase 1 Boundary (verified 2026-09-05)
- DB→alloc_core interface: locked (D-009); pure dict contract; DB never writes alloc_core; alloc_core never writes DB.
- Schema contract 21 tables verified (DATA_MODEL §1); migration 001_phase1_init.py present; execution deferred to Gate 4.
- Phase 1 repository-local complete; PostgreSQL execution not executed.
- Phase 2 must consume Phase 1 components (models, alloc_core, contracts, migration, tests) without rebuild.
- Locked constants and interfaces unchanged by Phase 1 closeout.
