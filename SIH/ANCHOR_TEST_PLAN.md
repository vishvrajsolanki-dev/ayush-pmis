# ANCHOR — TEST & VALIDATION PLAN

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

---

## 1. Test Strategy

Every FR in ANCHOR_SRS.md (FR-001…FR-024) must map to at least one test below. Full FR → test mapping: ANCHOR_TRACEABILITY.md. Categories mirror Master Part 23.

## 2. Unit Tests (UT)

| ID | Covers |
|---|---|
| UT-01 | `E(c,i)` formula correctness against mandatory-criteria inputs only |
| UT-02 | `F(c,i)` formula correctness, normalization to `[0,1]` |
| UT-03 | `Priority(c,i) = α·F + (1−α)·O` computation, default `α=0.6` |
| UT-04 | Tiebreak epsilon (`1e-9`) comparison logic |
| UT-05 | Evidence weight application (1.0× self-reported / 2.0× institution-verified) |

## 3. Contract Tests (CT)

| ID | Covers |
|---|---|
| CT-01 | `E`/`F` separation — dual-purpose-field rule never violated (a field feeding `E` never also feeds `F`) |
| CT-02 | `O`'s feature contract — only primitives (raw skill-overlap count, categorical degree/track match, raw location distance, categorical sector match); `F`'s derived score and preference rank excluded |
| CT-03 | Label generator's feature contract — allowed/forbidden inputs per ANCHOR_AI_DS_SPEC.md §4 |
| CT-04 | Schema validation on all API payloads (ANCHOR_API_SPEC.md) |

## 4. Temporal Tests (TT)

| ID | Covers |
|---|---|
| TT-01 | Cycle-aligned partitioning correctness — no split cycles, no cross-boundary events |
| TT-02 | `MIN_O_EVENTS_PER_PARTITION = 30` (≥15 positive, ≥15 negative) enforced independently per partition |
| TT-03 | VALIDATION-block sizing logic (smallest trailing block satisfying the minimum) |
| TT-04 | CALIBRATION-block sizing logic (smallest trailing block ending before VALIDATION's earliest cycle) |
| TT-05 | Infeasibility → `HEURISTIC_FALLBACK` correctness |
| TT-06 | Cycle-T isolation — TEST is always exactly cycle T, never merged with VALIDATION |

## 5. Leakage Tests (LT)

| ID | Covers |
|---|---|
| LT-01 | Cycle-T labels never influence Cycle-T scoring/activation |
| LT-02 | Label generator never consumes allocation-produced/internal state (result, proposal counts, round number, final Priority/rank, capacity remainders, override outcome) |
| LT-03 | `O` never consumes `F`'s derived score or declared preference rank |
| LT-04 | E/F separation holds under leakage audit (cross-reference CT-01) |

## 6. Allocation Tests (AT)

| ID | Covers |
|---|---|
| AT-01 | DA correctness — candidate-optimal stable matching for a given declared-preference profile |
| AT-02 | Determinism given frozen inputs — identical run produces identical output |
| AT-03 | Capacity respected exactly — never exceeded, never soft-capped |
| AT-04 | `UNMATCHED` correctness for exhausted/empty preference lists |
| AT-05 | Tiebreak determinism — same `tiebreak_key` set yields same tie resolution across runs, including recovery |

## 7. Snapshot Tests (ST)

| ID | Covers |
|---|---|
| ST-01 | Immutability — write-once enforcement on `AllocationSnapshot` |
| ST-02 | Hash stability/verification — `snapshot_hash` correctly re-derivable from `snapshot_blob` |
| ST-03 | Full reproducibility from recorded versions + `random_seed` |
| ST-04 | `subject_identity_mapping` is untouched by any operation on `AllocationSnapshot`, and vice versa |

## 8. Security Tests (SEC)

| ID | Covers |
|---|---|
| SEC-01 | RBAC per role (Master Part 3) |
| SEC-02 | Tenant isolation |
| SEC-03 | Object authorization |
| SEC-04 | Action authorization (distinct from object authorization) |
| SEC-05 | Cross-tenant rejection + audit-visibility (FR-024) |

## 9. State-Transition Tests (STT)

| ID | Covers |
|---|---|
| STT-01 | Account lifecycle — no transition outside ANCHOR_STATE_MACHINES.md §1 |
| STT-02 | Opportunity lifecycle — §2 |
| STT-03 | Application lifecycle — §3 |
| STT-04 | Allocation lifecycle — §4 (including invalidation triggers) |
| STT-05 | Recovery lifecycle — §5 (queue invariant enforced) |
| STT-06 | Verification lifecycle — §6 (including `STALE` on reactivation) |
| STT-07 | Model lifecycle — §7 |
| STT-08 | Profile visibility lifecycle — §8 |

## 10. Recovery Tests (RT)

| ID | Covers |
|---|---|
| RT-01 | Transitive-closure correctness |
| RT-02 | Batching of simultaneous dropouts into one recovery operation |
| RT-03 | ≤1 `ACTIVE` recovery-queue entry per candidate per `allocation_generation` |
| RT-04 | Retry-escalation threshold behavior |
| RT-05 | Recovery result never labeled with full-market DA stability |

## 11. End-to-End Tests (E2E)

| ID | Covers |
|---|---|
| E2E-01 | Full Part 24 demo path (see ANCHOR_DEMO_SCRIPT.md), synthetic data only, must run green before any presentation |

## 12. Demo Tests (DT)

| ID | Covers |
|---|---|
| DT-01 | Every demo screen displays priority tier, never "confidence" |
| DT-02 | `outcome_signal_source: ML | HEURISTIC_FALLBACK` visibly indicated wherever shown |
| DT-03 | Synthetic data explicitly labeled throughout |

## 13. Failure-Behavior Tests (mapped to Master Part 21)

| ID | Scenario | Expected behavior |
|---|---|---|
| FB-01 | Duplicate job execution | No-op if output artifact already exists for that key |
| FB-02 | Worker crash mid-job | No partial artifact committed; resumes/retries on next tick |
| FB-03 | Partial allocation attempt | Never persists — full `DRAFT` run or nothing |
| FB-04 | Insufficient training data | Routes to `HEURISTIC_FALLBACK`, not an error |
| FB-05 | Failed model artifact (training crash) | Retry 3x, then `HEURISTIC_FALLBACK`, logged |
| FB-06 | Concurrent recovery on same candidate | Blocked by queue invariant |

## 14. Invariant → Test Cross-Reference

| Invariant | Test(s) |
|---|---|
| No cycle splitting | TT-01 |
| TRAIN/CALIBRATION/VALIDATION disjointness | TT-01, TT-03, TT-04 |
| Cycle-T isolation | TT-06, LT-01 |
| Label-generator restrictions | LT-02, CT-03 |
| E/F separation | CT-01, LT-04 |
| O feature restrictions | CT-02, LT-03 |
| Immutable snapshots | ST-01, ST-02 |
| Deterministic replay | ST-03, AT-02 |
| Tenant isolation | SEC-02, SEC-05 |
| Override auditability | STT-04, SEC-05 |

Every requirement in ANCHOR_SRS.md maps to at least one test category above — see ANCHOR_TRACEABILITY.md for the complete per-FR mapping.
