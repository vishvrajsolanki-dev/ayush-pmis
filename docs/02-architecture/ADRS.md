# ANCHOR — ARCHITECTURAL DECISION RECORDS

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

*[Converted from Master Part 28's ADR table into formal ADR entries. All decisions below are Locked — do not reopen without revisiting the Master.]*

---

## ADR-01 — Use Candidate-Proposing Deferred Acceptance

- **Status:** Locked
- **Context:** Anchor needs a matching mechanism with real, well-understood guarantees rather than an ad hoc ranked list.
- **Decision:** Use candidate-proposing Deferred Acceptance (DA) as the core allocation mechanism.
- **Alternatives considered:** Company-proposing DA (favors opportunities); pure ranked-list/greedy matching (no stability guarantee).
- **Consequences:** Predictable, explainable mechanism-level behavior; unmatched states are legitimate, not failures. Textbook stability guarantee (candidate-optimal among stable matchings), JoSAA-class precedent at scale.

## ADR-02 — Separate E/F/O Structurally

- **Status:** Locked
- **Context:** A single blended score risks conflating hard requirements, graded fit, and a learned/uncertain signal into one opaque number.
- **Decision:** Structurally separate hard eligibility (`E`), soft fit (`F`), and the opportunity-side selection signal (`O`).
- **Alternatives considered:** Single blended score with implicit weighting.
- **Consequences:** More explainable, easier to audit and test each stage independently.

## ADR-03 — O_offer Is the Only Phase-1 O Family Member

- **Status:** Locked
- **Context:** Shortlisting/interview/offer are genuinely different targets; building all three without validating one first risks diluted effort and unjustified transfer assumptions.
- **Decision:** Implement `O_offer` only in Phase 1.
- **Alternatives considered:** Build all three targets in parallel.
- **Consequences:** Narrower but more defensible Phase-1 scope; `O_shortlist`/`O_interview` explicitly Phase 2.

## ADR-04 — Cycle-Aligned, Chronologically Disjoint TRAIN/CALIBRATION/VALIDATION/TEST

- **Status:** Locked
- **Context:** Row-level or ambiguous cycle-block splitting risks non-independent partitions and biased calibration/activation metrics.
- **Decision:** Partition by whole, chronologically ordered cycles — no cycle split across a boundary.
- **Alternatives considered:** Fixed-size rolling windows; row-level random splits.
- **Consequences:** More implementation complexity in partition-boundary logic, but a materially more trustworthy activation gate.

## ADR-05 — Deterministic Heuristic Fallback Whenever the Activation Gate Isn't Cleared

- **Status:** Locked
- **Context:** A cold-start or data-poor cycle should never force an under-supported ML decision.
- **Decision:** Fall back to a deterministic heuristic proxy for `O` on any gate failure.
- **Alternatives considered:** Always use ML regardless of data sufficiency; block allocation entirely if ML unavailable.
- **Consequences:** Allocation always proceeds; `outcome_signal_source` transparently logged.

## ADR-06 — PostgreSQL + pgvector, Relational Adjacency Tables for Skill Graph

- **Status:** Locked
- **Context:** Phase-1 dataset scale does not need a dedicated graph or vector database.
- **Decision:** Use PostgreSQL with pgvector; represent the Skill Graph as relational adjacency tables.
- **Alternatives considered:** Dedicated graph DB (Neo4j-class); dedicated vector DB.
- **Consequences:** Simpler ops surface, one database to reason about.

## ADR-07 — APScheduler Over a Distributed Task Queue

- **Status:** Locked
- **Context:** Phase-1 job volume and single-backend deployment (Render) don't justify distributed-queue complexity.
- **Decision:** Use APScheduler for all background jobs.
- **Alternatives considered:** Celery/RQ with a separate broker.
- **Consequences:** Simpler deployment; revisit if job volume or scale-out needs grow.

## ADR-08 — Immutable AllocationSnapshot + Separate Mutable subject_identity_mapping

- **Status:** Locked
- **Context:** Privacy deletion requests must never break reproducibility of past decisions.
- **Decision:** Store allocation snapshots immutably; store the identity mapping in a separate, mutable table.
- **Alternatives considered:** Single table with identity inline, soft-deleted on request.
- **Consequences:** Slightly more schema complexity; a real, defensible privacy/reproducibility separation.

## ADR-09 — Human Governance State Machine With Mandatory Review Before Publication

- **Status:** Locked
- **Context:** AI-proposed allocations should never auto-publish without an accountable human step.
- **Decision:** Require `UNDER_REVIEW` before any allocation can reach `PUBLISHED`.
- **Alternatives considered:** Auto-publish with post-hoc override only.
- **Consequences:** Slower publication path; materially stronger accountability story.

## ADR-10 — Synthetic-Only Data, No Company/Opportunity Holdout Evaluation in Phase 1

- **Status:** Locked
- **Context:** No real applicant/company data exists; dataset scale can't credibly support company-level holdout.
- **Decision:** Use synthetic data exclusively in Phase 1; defer company/opportunity holdout evaluation.
- **Alternatives considered:** Attempt limited real-data pilot; skip holdout evaluation entirely.
- **Consequences:** Deployment-validity claims explicitly deferred to Phase 2; synthetic validity is the only claim made.

---

No new ADRs are introduced here for ordinary implementation details that don't materially affect architecture — per the generation instructions, this collection preserves exactly the ten locked decisions from the Master.
