# ANCHOR — IMPLEMENTATION PLAN

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

*[Derived dependency-aware sequence, converting the Master's implementation order (Part 31) into workstreams with deliverables, acceptance criteria, and testing gates.]*

---

## Milestone Sequence & Dependencies

| # | Milestone | Depends on | Deliverable | Acceptance criteria | Testing gate |
|---|---|---|---|---|---|
| 1 | Repository/project foundation | — | Repo scaffold, CI, locked stack (Next.js/Vercel, FastAPI/Render, PostgreSQL+pgvector, APScheduler) | Stack matches 02-architecture/ARCHITECTURE.md §1 exactly; no unlocked infra introduced | N/A |
| 2 | Database/schema | 1 | All entities in 02-architecture/DATA_MODEL.md created | Schema matches entity catalogue field-for-field; `allocation_snapshots` write-once enforced at DB level | ST-01 |
| 3 | Authentication & authorization | 2 | `AuthN → RBAC → object/tenant-authz → action-authz → audit` middleware | Applied uniformly to every endpoint stub; no ownership-only list-query shortcut | SEC-01…SEC-05 |
| 4 | Synthetic data generator | 3 | Cycle-driven generator, ≥3 latent regimes + noise term, versioned (`generator_version`, `dataset_version`) | Generates full eligible-pair universe per cycle; label-generator feature contract enforced | LT-02, CT-03 |
| 5 | Candidate/opportunity/application flows | 4 | Registration, profile/evidence, verification, opportunity posting, preferences | Cap-5 evidence enforced; preferences never system-modified | UT-05, AT-04 |
| 6 | `E` and `F` computation | 5 | Eligibility and fit services | Dual-purpose-field rule holds; `F` only computed for `E=1` pairs | CT-01, UT-01, UT-02 |
| 7 | `O` training/evaluation pipeline | 4, 6 (feature-reuse boundary clarity only — `O` does not consume `F` directly) | TRAIN/CALIBRATE/VALIDATE/ACTIVATE pipeline, `HEURISTIC_FALLBACK` | Activation gate (5 conditions) correctly decided on VALIDATION only; TEST never activates | TT-01…TT-06, LT-01, LT-03 |
| 8 | DA engine | 6, 7 | Candidate-proposing DA, freeze-at-run-start, tiebreaking | Capacity respected exactly; determinism given frozen inputs | AT-01…AT-05 |
| 9 | Snapshots | 8 | `AllocationSnapshot` + `subject_identity_mapping` | Immutability + hash reproducibility verified | ST-01…ST-04 |
| 10 | Governance | 9 | Allocation state machine, override flow | Every override produces distinct linked records; never inherits DA stability label | STT-04 |
| 11 | Recovery | 10 (published allocations must exist to recover from) | Recovery engine, queue invariant | Transitive closure correctness; ≤1 active/candidate/generation | RT-01…RT-05 |
| 12 | Analytics | outcomes accumulating over cycles | Peer-institution aggregates | Sample-size ≥10 gate enforced before display | — |
| 13 | UI integration | all backend milestones | Role-scoped screens per 04-ux/UX_SPEC.md | Non-claims wording rules (Part 25) honored on every screen | DT-01…DT-03 |
| 14 | End-to-end demo | 13 | Full 12-step demo path (07-demo/DEMO_SCRIPT.md) | Runs green on synthetic data, no external dependency | E2E-01 |
| 15 | Verification and polish | 14 | Full test suite green | Every FR (01-requirements/SRS.md) maps to a passing test | Full 06-testing/TEST_PLAN.md suite |

## Sequencing Rationale (preserved from the Master)

This ordering follows the dependency chain above. If implementation reveals a better sequence given real dependency discovery, **the rationale — not the exact numbered order — is what must be preserved.** Notably:

- Auth (3) must precede any tenant-scoped data, since nothing else is meaningfully testable without tenant isolation in place.
- The synthetic generator (4) must exist before `E`/`F` can be tested against realistic inputs, and before `O` has any training data at all.
- `E`/`F` (6) are foundational and have no dependency on `O` — they can and should be built and tested independently.
- `O`'s pipeline (7) depends on synthetic cycles existing (4) and, for feature-reuse boundary clarity only, on `F` (6) — even though `O` never directly consumes `F`'s output.
- DA (8) requires all three of `E`/`F`/`O` to be available — it is the first point they combine.
- Snapshots (9) require a working allocation run to snapshot; governance (10) requires snapshots and runs to review; recovery (11) requires published allocations to recover from.

## Integration Points

- Milestone 6 → 7: feature-reuse boundary (documented, not a data dependency) between `F` and `O`.
- Milestone 7 → 8: frozen `O` config must exist (ML or `HEURISTIC_FALLBACK`) before Priority/DA can run for a cycle.
- Milestone 8 → 9: every allocation run must produce exactly one immutable snapshot.
- Milestone 9 → 10: governance actions (approve/override) operate against a snapshotted run.
- Milestone 10 → 11: recovery only triggers against published, then vacated/dropped allocations.

## Testing Gates

No milestone is considered complete until its corresponding test IDs (06-testing/TEST_PLAN.md) pass. Milestone 15 requires the full suite green, with FR → test traceability closed (01-requirements/TRACEABILITY.md).

## Explicit Non-Scope for This Plan

No speculative timelines or calendar dates are introduced — the Master specifies dependency order, not duration, and none is invented here.
