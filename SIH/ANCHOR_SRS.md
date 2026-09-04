# ANCHOR — SYSTEM REQUIREMENTS SPECIFICATION

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

## 1. System Scope

This SRS covers the Main SIH Round's Intelligent Allocation Engine only: eligibility/fit/opportunity-signal computation, candidate-proposing Deferred Acceptance, recovery, human governance, snapshotting, trust/verification, and the cross-cutting authorization/audit layer. The College Round's one-sided ranking system is out of scope (Master Part 1, Part 26).

## 2. Functional Requirements

*[Derived — IDs and phrasing are implementation-level structure; every requirement traces to a Master-locked rule. Canonical source: Master Part 5.]*

| ID | Requirement | Actor | Priority | Master Ref |
|---|---|---|---|---|
| FR-001 | Compute `E(c,i) ∈ {0,1}` from mandatory criteria only (degree/track, availability, mandatory certification, quota-category); a field feeding `E` never also feeds `F`. | System | P0 | §3, §6.1 |
| FR-002 | Compute `F(c,i) ∈ [0,1]` only where `E(c,i)=1`, from post-eligibility graded factors only. | System | P0 | §6.2 |
| FR-003 | Exclude declared preference rank from `O`'s feature set entirely. | System | P0 | §6.3 |
| FR-004 | Label generator for `OFFER_EXTENDED` consumes only pre-allocation-time state — never allocation-produced/internal state. | System | P0 | §8, §9 |
| FR-005 | For Cycle T, `O`'s activation status/config is decided on VALIDATION only and frozen, evidence included, before Cycle T scoring begins. | System | P0 | §7 |
| FR-006 | TRAIN/CALIBRATION/VALIDATION are cycle-aligned, chronologically disjoint; no cycle split; each independently satisfies `MIN_O_EVENTS_PER_PARTITION = 30` (≥15 positive, ≥15 negative). | System | P0 | §7 |
| FR-007 | If no feasible disjoint partitioning exists, use `HEURISTIC_FALLBACK` for that cycle. | System | P0 | §7 |
| FR-008 | `MODEL_ACTIVATION` requires event-count gate, per-partition class-balance gate, Brier improvement > `MIN_PRACTICAL_IMPROVEMENT = 0.01` on VALIDATION, leakage check, multi-seed reporting — all required. | System | P0 | §7 |
| FR-009 | Cycle T's `OFFER_EXTENDED` labels are generated for the full eligible-pair universe, independent of allocation, reserved exclusively for future-cycle training. | System | P0 | §8 |
| FR-010 | `Priority(c,i) = α·F(c,i) + (1−α)·O(c,i)`, default `α=0.6`, recorded per run as part of policy version. | System | P0 | §6.4 |
| FR-011 | Once a run enters execution, `E`, `F`, `O`, `Priority`, capacities, preferences, tiebreak values, version references are immutable for that run's duration. | System | P0 | §6.6 |
| FR-012 | DA runs candidate-proposing; system never inserts/reorders/auto-completes a declared preference list; empty/incomplete lists valid, may yield `UNMATCHED`. | System | P0 | §6.5 |
| FR-013 | An override stores the original proposed assignment, decision, reason, acting admin, and validation result as distinct linked records; never inherits the DA stability label. | Admin | P0 | §15 |
| FR-014 | Recovery reruns DA only over the transitive closure of affected candidates/opportunities, using frozen rankings and unaltered preferences; ≤1 `ACTIVE` recovery-queue entry per candidate per `allocation_generation`. | System | P0 | §6.7 |
| FR-015 | `AllocationSnapshot` immutable once written (`snapshot_blob` + `snapshot_hash` both required); `subject_identity_mapping` is a separate mutable table; deletion acts only on the mapping table. | System | P0 | §12 |
| FR-016 | A `PROPOSED` run goes stale/`INVALIDATED` if any enumerated trigger occurs before publication. | System | P1 | §12 |
| FR-017 | Institution/Company accounts activate only via `PENDING → Admin approval → ACTIVATED`. | Admin | P0 | §13 |
| FR-018 | Editing verified evidence reverts it to `SELF_REPORTED` until re-verified; reactivated institutions' prior verifications stay `STALE` until explicit re-review. | System | P0 | §13 |
| FR-019 | Real-user profile visibility defaults to `PRIVATE`; `DISCOVERABLE`-by-default applies only to the seeded demo dataset. | System | P0 | §14 |
| FR-020 | `tiebreak_key` generated once per candidate at registration from seeded RNG, reused across every run including recovery; never learned from candidate characteristics; never a fairness mechanism. | System | P0 | §16 |
| FR-021 | Evidence capped at N=5 items/skill claim; weights 1.0× self-reported / 2.0× institution-verified, labeled an unvalidated policy parameter. | System | P1 | §17 |
| FR-022 | Peer-institution comparison requires minimum sample size 10 before any aggregate is shown; aggregated-only, institution/admin roles only. | System | P1 | §17 |
| FR-023 | UI never labels model output "confidence"; displays a coarse, explicitly-labeled priority tier instead. | System | P1 | §6, §25 |
| FR-024 | Cross-tenant access attempts are logged and UI-visible in the audit trail. | System | P0 | §13 |

## 3. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Reliability | No job partially writes an allocation, model version, or snapshot; every job commits within a transaction boundary scoped to its single output artifact (Part 19, 21). |
| Determinism | Given the same frozen inputs, `Priority` and DA outcomes are deterministically reproducible (§6.4, §12). |
| Security | Every endpoint enforces `AuthN → RBAC → object/tenant-authorization → action-authorization → audit` uniformly (§13). |
| Privacy | Direct identity excluded from allocation snapshots; identity mapping access-controlled at a higher tier than general snapshot access (§12). |
| Performance | Not independently specified in the Master; no numeric SLA is asserted here — do not invent one. |
| State behavior | Every transition confined to the state machines in ANCHOR_STATE_MACHINES.md (Part 20) — no undocumented transition. |
| Model behavior | VALIDATION is the sole activation gate; TEST (Cycle T) never activates a model — it only scores under an already-frozen configuration (§7). |
| Allocation behavior | Capacity respected exactly; unmatched is a legitimate terminal state; stability claim scoped to the exact declared-preference profile under the DA mechanism (§6.5). |
| Failure behavior | See ANCHOR_TEST_PLAN.md / Master Part 21 — insufficient data, failed activation, and worker crashes are all defined states, not undefined errors. |
| Observability | Structured logs per job/request; correlation IDs (`allocation_generation`, `run_id`, `model_version`, `snapshot_hash`) propagated through logs (§22). |
| Auditability | Every authorization-relevant, state-changing event logged with actor, action, object, tenant, timestamp (§13, §22). |

## 4. Cross-References

- Allocation-mechanism detail: ANCHOR_ALLOCATION_ENGINE.md
- Data contracts per FR: ANCHOR_DATA_MODEL.md
- Endpoint-level authorization: ANCHOR_API_SPEC.md, ANCHOR_SECURITY_PRIVACY.md
- Full FR → test mapping: ANCHOR_TRACEABILITY.md, ANCHOR_TEST_PLAN.md
