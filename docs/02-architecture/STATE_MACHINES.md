# ANCHOR — STATE MACHINES & WORKFLOW SPECIFICATION

```text
Source of Truth:
00-product/MASTER_DESIGN.md

Product Narrative:
00-product/PRODUCT_NARRATIVE.md

Status:
Derived downstream specification

Historical review documents:
Reference only — not authoritative
```

No transition outside the graphs below is reachable in any workflow. Every transition's audit event, where applicable, is drawn from 03-engineering-specs/API_SPEC.md.

---

## 1. Account Lifecycle

```
Student:               (self-service) → ACTIVE
Institution/Company:   PENDING → ACTIVATED
                        ACTIVATED → (deactivated) → (reactivated, verifications STALE until re-review)
```

| Source | Event | Authorization | Validation | Destination | Side effects | Audit event |
|---|---|---|---|---|---|---|
| — | Student registers | Public, rate-limited | Email uniqueness | `ACTIVE` | Account created | `account_created` |
| — | Institution/Company registers | Public, rate-limited | Email uniqueness | `PENDING` | Account created | `account_created` |
| `PENDING` | Admin approves | Admin-only | — | `ACTIVATED` | — | `institution_activated` / `company_activated` |
| `ACTIVATED` | Admin/org deactivates | Admin-only *(mechanism not further specified)* | — | deactivated | Existing verifications retained but not usable until reactivation review | *(not enumerated in Master)* |
| deactivated | Admin reactivates | Admin-only | — | `ACTIVATED` (verifications `STALE`) | Prior verifications require explicit re-review | *(not enumerated in Master)* |

## 2. Opportunity Lifecycle

```
DRAFT → POSTED → (eligibility/fit computed each cycle) → CLOSED/WITHDRAWN
```

| Source | Event | Authorization | Destination | Side effects | Audit event |
|---|---|---|---|---|---|
| — | Recruiter creates | Company `ACTIVATED`, object-owner | `DRAFT` | Opportunity created | `opportunity_created` |
| `DRAFT` | Recruiter posts | Object-owner | `POSTED` | Enters eligibility/fit computation each cycle | *(not separately enumerated — covered by opportunity_created/edited)* |
| `POSTED` | Recruiter closes/withdraws | Object-owner | `CLOSED/WITHDRAWN` | Triggers invalidation of any pre-publication run referencing it; may trigger recovery if published allocations existed | — |

## 3. Application Lifecycle

```
SUBMITTED → (feeds preference list) → ALLOCATED / UNMATCHED → ACCEPTED / REJECTED-VACATED
```

| Source | Event | Destination | Side effects |
|---|---|---|---|
| — | Student expresses interest | `SUBMITTED` | Feeds candidate's preference list |
| `SUBMITTED` | Allocation run executes | `ALLOCATED` or `UNMATCHED` | `UNMATCHED` is a legitimate terminal state for exhausted/empty preference lists |
| `ALLOCATED` | Publication | `ACCEPTED` or `REJECTED/VACATED` | `REJECTED/VACATED` → recovery run triggered |

## 4. Allocation Lifecycle (Canonical — Human Governance)

```
DRAFT → PROPOSED → UNDER_REVIEW → APPROVED → PUBLISHED
                                 → OVERRIDDEN → VALIDATED → PUBLISHED
                                 → INVALIDATED → (new run)
PUBLISHED → ACCEPTED
          → REJECTED/VACATED → RECOVERY RUN
```

| Source | Event | Authorization | Validation | Destination | Side effects | Audit event |
|---|---|---|---|---|---|---|
| — | Allocation run triggered | Admin or system job | Prerequisite: `E`/`F`/`O` all available for the cycle | `DRAFT` | Executes E→F→O→DA; freeze-at-run-start engages | `allocation_run_executed` |
| `DRAFT` | DA completes | System | — | `PROPOSED` | Snapshot written | — |
| `PROPOSED` | Enters review | System/Admin | — | `UNDER_REVIEW` | — | — |
| `UNDER_REVIEW` | Admin approves | Admin-only | — | `APPROVED → PUBLISHED` | — | `allocation_approved` |
| `UNDER_REVIEW` | Admin overrides | Admin-only | Mandatory reason | `OVERRIDDEN → VALIDATED → PUBLISHED` | Original assignment, decision, reason, admin, validation result stored as distinct linked records; never inherits DA stability label | `allocation_overridden` |
| `PROPOSED` (pre-publication) | Any enumerated invalidation trigger fires | System | Trigger match (see 03-engineering-specs/SECURITY_PRIVACY.md §11) | `INVALIDATED` | Requires a brand-new run — never in-place repair | — |
| `PUBLISHED` | Candidate accepts | Student (self) | — | `ACCEPTED` | — | — |
| `PUBLISHED` | Candidate/opportunity drops out | — | — | `REJECTED/VACATED` | Triggers recovery run | — |

## 5. Recovery Lifecycle

```
TRIGGERED → QUEUED (ACTIVE, ≤1 per candidate per generation) → RUNNING → RESOLVED / ESCALATED (past retry_count threshold)
```

| Source | Event | Authorization | Validation | Destination | Side effects | Audit event |
|---|---|---|---|---|---|---|
| — | Dropout/vacancy event | System | — | `TRIGGERED` | Transitive closure computed | `recovery_triggered` |
| `TRIGGERED` | Enqueued | System | ≤1 `ACTIVE` per candidate per `allocation_generation` | `QUEUED (ACTIVE)` | — | — |
| `QUEUED` | Processing begins | System | Published allocation exists | `RUNNING` | Locally-stable-heuristic rerun over affected set | — |
| `RUNNING` | Completes | System | — | `RESOLVED` | Prior run marked `SUPERSEDED` where applicable | — |
| `RUNNING` | Fails past `retry_count` threshold | System → Admin | Threshold exceeded *(numeric value unspecified — Configurable)* | `ESCALATED` | Full admin-triggered market rerun | `recovery_escalated` |

## 6. Verification Lifecycle

```
SELF_REPORTED → (Faculty verifies) → INSTITUTION_VERIFIED
INSTITUTION_VERIFIED → (edited) → SELF_REPORTED (must re-verify)
INSTITUTION_VERIFIED → (institution deactivated → reactivated) → STALE → (re-review) → INSTITUTION_VERIFIED
```

| Source | Event | Authorization | Validation | Destination | Side effects | Audit event |
|---|---|---|---|---|---|---|
| — | Student adds evidence | Object-owner | Cap 5/skill claim | `SELF_REPORTED` | — | `evidence_created` |
| `SELF_REPORTED` | Faculty verifies | Institution `ACTIVATED`, object belongs to own student | — | `INSTITUTION_VERIFIED` | `verification_tier` set | `evidence_verified` |
| `INSTITUTION_VERIFIED` | Student edits | Object-owner | — | `SELF_REPORTED` | Must re-verify | `evidence_edited` |
| `INSTITUTION_VERIFIED` | Institution deactivated → reactivated | Admin | — | `STALE` | Not auto-restored | — |
| `STALE` | Explicit re-review | Faculty | Institution must be `ACTIVATED` | `INSTITUTION_VERIFIED` | — | `evidence_verified` |

## 7. Model Lifecycle

```
TRAIN → CALIBRATE → VALIDATE/ACTIVATION-DECISION → FROZEN → (scores TEST cycle) → SUPERSEDED (next cycle's model)
                                                 → (gate fails) → HEURISTIC_FALLBACK
```

| Source | Event | Authorization | Validation | Destination | Side effects | Audit event |
|---|---|---|---|---|---|---|
| — | `model_train` job runs | System | Feasible cycle-aligned partitioning | `TRAIN` complete | Model artifact + `model_version` | `model_trained` |
| `TRAIN` | `model_calibrate` job runs | System | `model_train` succeeded | `CALIBRATE` complete | Calibration artifact | — |
| `CALIBRATE` | `model_validate_activate` job runs | System | Both above succeeded | `VALIDATE/ACTIVATION-DECISION` | Five-gate check on VALIDATION only; `validation_evidence` frozen regardless of outcome | `model_activation_decided` |
| activation passes | — | System | All 5 gate conditions met | `FROZEN` | Scores Cycle T (TEST) | — |
| activation fails | — | System | Any gate condition fails | `HEURISTIC_FALLBACK` | Never blocks allocation | — |
| `FROZEN` | Next cycle's model activates | System | — | `SUPERSEDED` | — | — |

## 8. Profile Visibility Lifecycle

```
PRIVATE → (opt-in) → DISCOVERABLE
PRIVATE / DISCOVERABLE → (application submitted) → APPLICATION_SHARED (scoped to application_id)
APPLICATION_SHARED → (later milestone grant, Phase 2) → CONTACT_SHARED
```

| Source | Event | Authorization | Destination | Side effects |
|---|---|---|---|---|
| — | Real-user default | System | `PRIVATE` | — |
| `PRIVATE` | Student opts in | Object-owner | `DISCOVERABLE` | (Demo-seed dataset defaults to `DISCOVERABLE` directly — never for real onboarding) |
| `PRIVATE`/`DISCOVERABLE` | Application submitted | System | `APPLICATION_SHARED` (scoped to that `application_id` only) | Withdrawing a different application does not affect this grant |
| `APPLICATION_SHARED` | Later-stage milestone grant (Phase 2) | *(mechanism not specified — deferred)* | `CONTACT_SHARED` | Full contact details shared |
