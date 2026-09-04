# ANCHOR — TRACEABILITY MATRIX

```text
Source of Truth:
ANCHOR_MASTER_DESIGN.md

Product Narrative:
ANCHOR_LATEST_IDEA.md

Status:
Derived downstream specification

Historical review documents:
Reference only — not authoritative
```

Chain: **Master Decision → Requirement → Data → API/Job → Test → Demo Evidence**

---

| Design Decision | FR (ANCHOR_SRS.md) | Data (ANCHOR_DATA_MODEL.md) | API/Job (ANCHOR_API_SPEC.md / ANCHOR_IMPLEMENTATION_PLAN.md) | Test Category (ANCHOR_TEST_PLAN.md) | Demo Evidence (ANCHOR_DEMO_SCRIPT.md) |
|---|---|---|---|---|---|
| E/F separation | FR-001, FR-002 | `opportunities` (requirements), `students`/`skill_claims` | Eligibility/fit computation (in `allocation_run` job) | CT-01, UT-01, UT-02 | Step 3–4 |
| O feature contract | FR-003 | `model_versions` | `model_train` job | CT-02, LT-03 | Step 5 |
| Label-generator feature contract | FR-004 | `outcomes` | `outcome_generation` job | CT-03, LT-02 | Step 11 |
| Temporal partitions (cycle-aligned, disjoint) | FR-005, FR-006, FR-007 | — | `model_train`/`model_calibrate`/`model_validate_activate` jobs | TT-01…TT-06 | Step 5 (fallback indicator) |
| Activation gate | FR-008 | `validation_evidence` | `model_validate_activate` job | TT-01, LT-01 | Step 5 |
| Fallback | FR-007, FR-008 | `allocation_runs.outcome_signal_source` | `model_train`/`model_validate_activate` jobs | TT-05, FB-04, FB-05 | Step 5 |
| DA mechanism | FR-012 | `allocation_runs`, `allocations` | `POST /admin/cycles/{cycle}/allocation-runs`, `allocation_run` job | AT-01…AT-05 | Step 8 |
| Snapshot | FR-015 | `allocation_snapshots`, `subject_identity_mapping` | `allocation_run` job | ST-01…ST-04 | Step 10 |
| Privacy (identity separation) | FR-015 | `subject_identity_mapping` | *(deletion endpoint — not yet enumerated, Deferred detail)* | ST-04, SEC | Step 10 |
| Authorization (AuthN→RBAC→...→audit) | FR-024 | `audits` | All endpoints (ANCHOR_API_SPEC.md), cross-cutting middleware | SEC-01…SEC-05 | Step 9 |
| Verification | FR-018 | `evidence`, `verification` | `POST /institutions/{id}/verify-evidence/{evidence_id}` | STT-06 | Step 1 |
| Recovery | FR-014 | `recovery_queue`, `allocation_generations` | `recovery_processing` job | RT-01…RT-05 | *(not in core demo path; available on request)* |
| Deterministic tiebreaking | FR-020 | `students.tiebreak_key` | `allocation_run` job | AT-05, UT-04 | Step 6 |
| Cycle-T label reservation | FR-009 | `outcomes` (`eligible_for_training_as_of`) | `outcome_generation` job | LT-01, TT-06 | Step 11 |

## Additional Coverage (Master-locked items not carrying a distinct FR ID)

| Design Decision | Requirement basis | Data | API/Job | Test Category | Demo Evidence |
|---|---|---|---|---|---|
| Priority formula (`α=0.6`) | FR-010 | `allocation_runs` (`policy_alpha`) | `allocation_run` job | UT-03 | Step 6 |
| Freeze-at-run-start invariant | FR-011 | `allocation_runs` (freeze-scoped fields) | `allocation_run` job | AT-02 | Step 8 |
| Override accountability | FR-013 | `allocations` (override-linked records) | `POST /admin/allocation-runs/{id}/override` | STT-04 | Step 9 |
| Invalidation triggers | FR-016 | `allocation_runs.status` | *(triggered internally on referenced-entity change)* | STT-04 | — |
| Trust-role activation gate | FR-017 | `institutions`, `companies` (status) | `POST /admin/institutions/{id}/activate`, `POST /admin/companies/{id}/activate` | STT-01 | — |
| Profile visibility defaults | FR-019 | `students` (visibility state), `applications` | *(visibility toggle, not separately enumerated)* | STT-08 | — |
| Evidence cap/weighting | FR-021 | `evidence` (cap 5), skill-overlap weighting in `F` | `POST /students/{id}/evidence` | UT-05 | Step 1 |
| Peer-institution privacy | FR-022 | `institutional_analytics` (sample_size ≥10) | `GET /institutions/{id}/analytics` | — | Step 12 |
| No-"confidence" UI rule | FR-023 | — (UI-layer rule) | — | DT-01 | Steps 5, 6 |

## Traceability Completeness Check

Every major design rule identified in the Master's Final QA checklist (Part 32) is represented above:

- E/F/O structural separation — ✓ (rows 1, and Additional Coverage)
- Label-generator contract — ✓
- Temporal partitioning — ✓
- Activation gate & fallback — ✓
- DA mechanism & tiebreaking — ✓
- Snapshots & privacy separation — ✓
- Authorization — ✓
- Verification — ✓
- Recovery — ✓

No orphaned Master decision was identified during this pass. Any future addition to the Master must add a corresponding row here before it is considered fully specified downstream.
