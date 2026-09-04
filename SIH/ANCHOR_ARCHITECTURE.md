# ANCHOR — SOFTWARE ARCHITECTURE DOCUMENT

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

## 1. Architecture Overview

**Locked stack** (Master Part 27 — do not change without revisiting the Master): Next.js/Vercel (frontend); FastAPI/Render (backend); PostgreSQL + pgvector (database); relational adjacency tables for the Skill Graph (no separate graph database); APScheduler (scheduling). No microservice explosion, no standalone ML microservice, no distributed task queue.

```
Next.js/Vercel (frontend)
        │  HTTPS/JSON
        ▼
FastAPI/Render (backend)
   ├── AuthN → RBAC → object/tenant-authz → action-authz → audit  (cross-cutting)
   ├── Eligibility (E) + Fit (F) services
   ├── Opportunity-signal (O) training/calibration/validation/activation pipeline
   ├── Deferred Acceptance allocation engine
   ├── Recovery engine
   ├── Snapshot + identity-mapping services
   └── APScheduler-driven background jobs (cycle progression, model lifecycle, allocation runs)
        │
        ▼
PostgreSQL + pgvector (relational store; Skill Graph as relational adjacency tables)
```

All items below not explicitly locked in the Master are marked **[Derived]** — reasonable structure inferred to satisfy the design, not an independently reviewed decision.

## 2. Component Architecture **[Derived]**

A single FastAPI service hosts: the cross-cutting authorization middleware, E/F/O computation, the DA engine, the recovery engine, snapshot/identity services, and the full API surface. APScheduler jobs run in-process or as a scheduled worker against the same database — no separate service boundary for Phase 1.

## 3. Module Boundaries **[Derived]**

`auth` · `eligibility_fit` · `opportunity_signal` (training/calibration/validation/activation) · `allocation` (DA + recovery) · `snapshots` · `governance` (state machine + override) · `evidence_verification` · `analytics`.

## 4. Frontend Architecture **[Derived]**

Next.js on Vercel. Role-based views per Part 3's role table (Student / Institution / Faculty / Placement Cell / Company / Recruiter / Mentor / Admin). Screen-level behavior specified in ANCHOR_UX_SPEC.md. The frontend never computes `E`/`F`/`O`/`Priority` client-side — all scoring is server-authoritative.

## 5. FastAPI Backend Architecture **[Derived]**

- **Cross-cutting middleware:** `AuthN → RBAC → object/tenant-authorization → action-authorization → audit`, applied uniformly to every endpoint (Master §13) — never an ad hoc ownership filter on list queries only.
- **Domain modules** as listed in §3, each exposing the endpoints inventoried in ANCHOR_API_SPEC.md.
- **Background jobs** (APScheduler) inventoried in ANCHOR_IMPLEMENTATION_PLAN.md / Master Part 19, invoking the same domain-module logic used by request-driven endpoints — no duplicated business logic between request and job paths.

## 6. PostgreSQL Architecture

Single managed PostgreSQL instance (Render) with the pgvector extension. All entities in ANCHOR_DATA_MODEL.md live in this one relational store — no polyglot persistence. `allocation_snapshots` and `subject_identity_mapping` are physically separate tables to preserve the privacy/reproducibility separation (ADR-08).

## 7. pgvector Usage

Used for semantic skill-matching within the Fit (`F`) computation's skill/semantic-overlap sub-factor (§6.2). Not used as a general-purpose vector database beyond this scope — no additional vector-store infrastructure is introduced.

## 8. Relational Skill Graph

The Skill Graph (`skills`, adjacency edges) is represented as relational adjacency tables inside PostgreSQL — explicitly not a dedicated graph database (ADR-06). Chosen because Phase-1 dataset scale does not justify a separate graph engine.

## 9. APScheduler

Chosen over a distributed task queue (ADR-07): Phase-1 job volume and single-backend deployment don't justify broker-based distributed-queue complexity.

### 9.1 Background Job Inventory (source: Master Part 19)

Every job's transaction boundary is scoped to its single output artifact (§21) — no job partially writes an allocation, model version, or snapshot.

| Job | Trigger | Prerequisites | Input | Output | Retry policy | Idempotency | Failure behavior |
|---|---|---|---|---|---|---|---|
| `cycle_progression` | Scheduler tick, cycle boundary reached | Prior cycle fully closed | Current `CYCLE` state | Advanced `CYCLE` | Retry on transient failure; does not advance on partial failure | Yes — no-op if cycle already advanced | Blocks dependent jobs until it succeeds; never partially advances |
| `model_train` | Cycle boundary, after `cycle_progression` | Feasible cycle-aligned TRAIN partition exists | TRAIN-partition data | New `model_versions` row | Retry 3× on crash, then `HEURISTIC_FALLBACK` for the cycle (logged) | Yes — per cycle | On persistent failure, routes to `HEURISTIC_FALLBACK`, never blocks allocation |
| `model_calibrate` | `model_train` success | `model_train` succeeded for this cycle | New model artifact | `calibration_artifacts` row (Brier, log loss, calibration curve) | Retry on transient failure | Yes — per `model_version` | Failure prevents activation decision; falls through to `HEURISTIC_FALLBACK` |
| `model_validate_activate` | `model_calibrate` success | Both prior jobs succeeded | Calibration artifact, VALIDATION-partition data | `validation_evidence` row (frozen regardless of outcome) | Retry on transient failure | Yes — per cycle | Any of the 5 gate conditions failing → `HEURISTIC_FALLBACK`, evidence still recorded |
| `allocation_run` | Admin/system trigger for a cycle | `E`/`F`/`O` (or fallback) available for the cycle | Eligible-pair universe, preferences, capacities | `allocation_runs`, `allocations`, `allocation_snapshots` rows | No automatic retry — a failed run does not partially persist; re-trigger creates a new run | No — each trigger creates a new run (by design, FR-011 freeze invariant) | Never partially writes an allocation, model version, or snapshot (§21) |
| `outcome_generation` | Post-allocation, per cycle | `allocation_run` completed for the cycle | Full eligible-pair universe, cycle state | `outcomes` rows (`OFFER_EXTENDED`, full eligible-pair universe) | Retry on transient failure | Yes — per cycle | Never consumes allocation-produced/internal state (label-generator feature contract, §4/§12 of ANCHOR_AI_DS_SPEC.md) |
| `recovery_processing` | Dropout/vacancy event | Published allocation exists | Transitive-closure-affected candidates/opportunities | `recovery_queue` entries, new (recovery) `allocation_runs`/`allocations` | `retry_count` tracked per queue entry; escalates to admin-triggered full rerun past threshold (numeric value unspecified in Master — Configurable) | Enforced — ≤1 `ACTIVE` entry per candidate per `allocation_generation` | Labeled a locally stable heuristic, never full-market-stable (§6.7 of Master; ANCHOR_ALLOCATION_ENGINE.md §13) |
| `analytics_update` | Scheduled, post-cycle-close | Sufficient outcomes accumulated | `outcomes`, `allocations` history | `institutional_analytics` rows | Retry on transient failure | Yes — recomputation is idempotent per institution/cycle | Never displays a partial/individual-level fallback below the sample-size-10 gate (FR-022) |
| `snapshot_integrity_check` | Scheduled, periodic | `allocation_snapshots` rows exist | Stored `snapshot_blob`/`snapshot_hash` pairs | Integrity-check log entry | Retry on transient failure | Yes — read-only verification | Detected mismatch is logged/alerted; never rewrites `snapshot_blob` or `snapshot_hash` |

Milestone-level sequencing for these jobs: see ANCHOR_IMPLEMENTATION_PLAN.md.

## 10. Authentication/Authorization Layers

`AuthN` (JWT/OAuth2) → `RBAC` (Part 3 role table) → object/tenant-authorization → action-authorization → audit. Full detail: ANCHOR_SECURITY_PRIVACY.md.

## 11. Allocation Engine

The `allocation` module implements candidate-proposing Deferred Acceptance over frozen `E`/`F`/`O`/`Priority` inputs. Full specification: ANCHOR_ALLOCATION_ENGINE.md.

## 12. Model Pipeline

The `opportunity_signal` module implements TRAIN → CALIBRATE → VALIDATE/ACTIVATE for the `O_offer` target, with deterministic `HEURISTIC_FALLBACK` on any gate failure. Full specification: ANCHOR_AI_DS_SPEC.md.

## 13. Recovery Engine

Reruns DA over the transitive closure of dropout/vacancy-affected candidates and opportunities within an `allocation_generation`, honoring the ≤1-active-per-candidate queue invariant. Never claims full-market DA stability (§6.7).

## 14. Snapshot Service

Writes immutable `AllocationSnapshot` records (`snapshot_blob` + `snapshot_hash`, both required) and separately maintains the mutable `subject_identity_mapping` table. Full specification: Master Part 12, summarized in ANCHOR_DATA_MODEL.md and ANCHOR_SECURITY_PRIVACY.md.

## 15. Analytics

Computes institutional peer-comparison aggregates (`institutional_analytics`), gated at minimum sample size 10, visible only to Institution/Admin roles (§17).

## 16. Audit System

Append-only `audits` table; every authorization-relevant, state-changing event logged with actor, action, object, tenant, timestamp (§13, §22).

## 17. Deployment Topology

Vercel-hosted Next.js frontend; Render-hosted FastAPI backend + APScheduler; managed PostgreSQL with pgvector extension. No additional infrastructure components.

## 18. Data Flow **[Derived]**

```
frontend → FastAPI API layer → authz middleware → domain module → PostgreSQL
background jobs → read/write PostgreSQL directly → trigger domain-module logic on schedule
```

## 19. Request Flow **[Derived]**

Client request → JWT validation (AuthN) → role check (RBAC) → object/tenant ownership check → action-specific authorization check → domain-module execution → audit-event write → response. Any rejection at any stage short-circuits to a logged, audited failure — cross-tenant attempts specifically are always logged and UI-visible (§13).

## 20. Background-Job Flow **[Derived]**

Scheduler tick → prerequisite check (e.g., prior job success, cycle state) → domain-module execution within a single-output transaction boundary → artifact write or defined fallback (e.g., `HEURISTIC_FALLBACK`) → retry/escalation per Master Part 19/21.

## 21. Failure Boundaries

Every job's transaction boundary is scoped to its single output artifact — no job partially writes an allocation, model version, or snapshot (Part 19, 21). Failure modes (worker crash, insufficient data, failed model activation, recovery retry escalation) are enumerated defined states in ANCHOR_TEST_PLAN.md and Master Part 21 — never silent errors.

## 22. Locked Architecture vs. Derived Implementation Structure

| Locked (Master-decided — do not change without revisiting the Master) | Derived (reasonable structure inferred, may evolve) |
|---|---|
| Next.js/Vercel, FastAPI/Render, PostgreSQL+pgvector, APScheduler stack | Exact module boundaries and their internal decomposition |
| No graph DB, no vector DB beyond pgvector, no distributed queue, no microservice explosion | Precise API path naming, job naming, table-layout details |
| E/F/O structural separation; snapshot/identity-mapping separation | Service-boundary description (single FastAPI service) |
| Cross-cutting `AuthN→RBAC→...→audit` contract | Exact middleware implementation order in code |

No microservices, graph databases, vector databases, or message queues are introduced anywhere in this architecture beyond what is explicitly locked above.
