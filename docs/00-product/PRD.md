# ANCHOR — PRODUCT REQUIREMENTS DOCUMENT

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

---

## 1. Product Overview

Anchor is a two-sided academia–industry platform. Its Main SIH flagship, the **Intelligent Allocation Engine**, is a candidate-proposing Deferred Acceptance (DA) matching system operating over structurally separated hard-eligibility (`E`), soft-fit (`F`), and opportunity-side selection (`O`) signals, governed by mandatory human review and backed by immutable, privacy-separated allocation snapshots.

Core architectural principle: **AI predicts; matching decides; constraints protect; humans govern.**

## 2. Problem Statement

Institutions and employers exchange internship/placement information through fragmented, low-fidelity channels:

- Skill evidence is unverified and unstructured — what a student claims and what an institution can vouch for are conflated, and neither connects to what a role actually requires.
- Matching today is either manual (slow, unscalable, opaque) or naively automated (a single ranked list with no mechanism-level stability or fairness-of-process guarantee).
- Nothing closes the loop — outcomes generate no structured signal feeding back into future matching.

Anchor does not claim to solve employer decision-making itself; any opportunity-side signal is explicitly a synthetic, prototype-scoped construct.

## 3. Goals (Phase 1 / Main SIH Round)

- G1 — A working, explainable, mechanism-grounded allocation engine over synthetic data.
- G2 — Structural separation of eligibility, fit, and a learned opportunity-side signal.
- G3 — A temporally honest evaluation protocol for the learned signal, with deterministic fallback.
- G4 — Full human governance and auditability over the allocation lifecycle.
- G5 — A privacy architecture separating identity from computational state by construction.

## 4. Non-Goals (Phase 1)

- No real applicant or company data.
- No deployment-validity claim for the opportunity-side signal.
- No unseen-opportunity / unseen-company generalization evaluation.
- No `O_shortlist` / `O_interview` implementation — `O_offer` only.
- No claim that recovery or overridden results carry DA's full stability guarantee.

## 5. Users / Personas & Role Responsibilities

| Role | Purpose | Approval gate | Key restriction |
|---|---|---|---|
| Student | Build profile/evidence, submit ranked preferences | Self-service | Cannot see other students' evidence beyond granted visibility; cannot edit `E`/`F`/`O`/priority |
| Institution | Represent an academic org; verify evidence | `PENDING → Admin approval → ACTIVATED` | Cannot verify students outside itself; no allocation override |
| Faculty *(Institution sub-role)* | Day-to-day evidence verification | Institution must be `ACTIVATED` | No account-activation rights |
| Placement Cell *(Institution sub-role)* | Institutional oversight of outcomes | Institution must be `ACTIVATED` | Cannot override allocations |
| Company | Post opportunities, view shared evidence | `PENDING → Admin approval → ACTIVATED` | Cannot see non-shared student evidence; no allocation override |
| Recruiter *(Company sub-role)* | Manage specific opportunities | Company must be `ACTIVATED` | Same as Company |
| Mentor *(Configurable, minimal default)* | Advise assigned candidates | Explicit assignment | No allocation visibility beyond assigned candidates |
| Administrator / Ministry | Platform governance | Single pre-seeded bootstrap | N/A — full cross-tenant access, fully audited |

All roles operate under the cross-cutting `AuthN → RBAC → object/tenant-authorization → action-authorization → audit` contract (see 03-engineering-specs/SECURITY_PRIVACY.md) — the table above describes intent; the middleware enforces it.

## 6. Product Principles

- AI predicts; matching decides; constraints protect; humans govern — no stage silently substitutes for another.
- Hard eligibility, soft fit, and a learned opportunity-side signal are three distinct kinds of judgment, never blurred into one number.
- Every claim about the learned signal is honestly scoped: synthetic validity is demonstrated; deployment validity is not assessed.
- Nothing about the AI layer overrides a mandatory (hard-eligibility) requirement.
- Every proposed allocation passes through human review before publication and can be overridden with a stored, accountable reason.

## 7. College vs. Main SIH Scope — `RETIRED — OUT OF ACTIVE SCOPE`

**Status note (added at scope transition, see DECISIONS.md D-012):** The College Round track described below was never executed (no ROADMAP, DECISIONS, or Phase-1/2/3 record references it) and is retired from active scope. It is preserved here as historical context only. **Main SIH Round is now the sole primary project direction; this document's Main-Round content is unchanged.**

| | College Round *(historical, retired)* | Main SIH Round *(active — primary)* |
|---|---|---|
| Mechanism | Simple, standalone one-sided ranking | Two-sided candidate-proposing DA |
| Opportunity-side learned signal | None | `O_offer` |
| Governance machinery | None | Full human-review/override/audit lifecycle |
| Relationship | Not a subset of the Main Round | Not an extension of the College Round |

Neither round implicitly contains the other's mechanisms; this document specifies the Main SIH Round only. The College Round row above is retained as historical scope-notation, not as a parallel active deliverable.

## 8. End-to-End Workflow

```
registration/onboarding
 → profile/evidence creation (cap 5 evidence items/skill claim)
 → verification (Institution Faculty)
 → opportunity creation (Company Recruiter)
 → eligibility computation E(c,i)
 → fit computation F(c,i)
 → preference submission (declared, never system-modified)
 → opportunity-side scoring O(c,i) (frozen model or HEURISTIC_FALLBACK)
 → allocation preparation (Priority(c,i); freeze-at-run-start engages)
 → DA execution (candidate-proposing)
 → human review (DRAFT→PROPOSED→UNDER_REVIEW)
 → publication (APPROVED→PUBLISHED or OVERRIDDEN→VALIDATED→PUBLISHED)
 → acceptance/rejection
 → dropout/recovery (transitive-closure rerun)
 → outcome generation (OFFER_EXTENDED, full eligible-pair universe)
 → analytics (peer-institution aggregates, min sample 10)
 → ecosystem feedback (Cycle T outcomes eligible for TRAIN/CALIBRATION from Cycle T+1)
```

## 9. Functional Requirements

See 01-requirements/SRS.md for the full FR-001…FR-024 catalogue (canonical source: Master Part 5) and 01-requirements/TRACEABILITY.md for FR → data/API/test mapping. Product-level summary:

- **PRD-FR-1** (FR-001, FR-002): Eligibility and fit are computed from structurally disjoint fields — no field feeds both.
- **PRD-FR-2** (FR-010, FR-011): Priority is a transparent, versioned blend of fit and opportunity signal, frozen at run start.
- **PRD-FR-3** (FR-012): Preferences are candidate-declared only; the system never edits them; unmatched is a legitimate outcome.
- **PRD-FR-4** (FR-013, FR-016): Every override and every pre-publication invalidation is explicit, reasoned, and auditable.
- **PRD-FR-5** (FR-017, FR-018, FR-019): Trust is admin-gated; verification integrity degrades safely on edit; visibility defaults to private.
- **PRD-FR-6** (FR-023): Model output is never shown to users as "confidence" — only as a coarse, labeled priority tier.

## 10. Non-Functional Requirements

- **Explainability** — every allocation is traceable to eligibility, fit, and signal inputs a human can inspect (Part 6, Part 24).
- **Determinism** — identical frozen inputs reproduce identical Priority and allocation outcomes (Part 6.4, Part 12).
- **Auditability** — every state-changing action is logged with actor, action, object, tenant, timestamp (Part 22).
- **Honesty of claims** — no UI or pitch wording implies confidence, real-employer prediction, fairness-guaranteeing tie-breaks, or full DA stability for recovery/overrides (Part 25).
- **Availability of allocation** — a failed or unavailable ML signal never blocks a run; it triggers `HEURISTIC_FALLBACK` (Part 7).

## 11. Trust & Governance Requirements

- Institution and Company accounts activate only via `PENDING → Admin approval → ACTIVATED` — no self-service path to a trusted role.
- `verification_tier` is precisely scoped ("verified by institution account") and never implies a stronger guarantee.
- Editing verified evidence reverts it to `SELF_REPORTED` until re-verified.
- Reactivated institutions' prior verifications remain `STALE` until explicit re-review.
- Every allocation proposal passes through `UNDER_REVIEW` before it can publish; overrides are distinct, linked, reasoned records that never inherit DA's stability label.

## 12. Privacy Requirements

- Profile visibility defaults to `PRIVATE` for real users; `DISCOVERABLE`-by-default applies only to the seeded demo dataset.
- `APPLICATION_SHARED` visibility is scoped to one `application_id`; `CONTACT_SHARED` is a later-stage (Phase 2) milestone.
- Direct identity is excluded from `AllocationSnapshot`; re-identification requires the separate, higher-restricted `subject_identity_mapping` table.
- Deletion/pseudonymization acts only on `subject_identity_mapping` — snapshot immutability and reproducibility are never broken by a privacy request.

## 13. Success Criteria (Phase 1)

- End-to-end demo (Part 24 sequence) runs green on synthetic data with no external dependency.
- Every FR in the SRS maps to at least one passing test category.
- Activation-gate logic never activates an ML `O` signal without clearing all five gate conditions on VALIDATION.
- No non-claim in Part 25 is contradicted anywhere in UI copy, demo script, or pitch material.
- Full traceability chain (Master decision → requirement → data → API/job → test → demo evidence) has no orphaned entries.

## 14. Phase 1 / Phase 2 Boundaries

**Phase 1 (this document's scope):** synthetic data only; `O_offer` only; no unseen-opportunity/company evaluation; `PRIVATE`/`DISCOVERABLE`/`APPLICATION_SHARED` visibility only, with `DISCOVERABLE` demo-only.

**Phase 2 (explicitly deferred — must not silently enter Phase-1 scope):** `O_shortlist`/`O_interview`; unseen-opportunity/unseen-company evaluation; `CONTACT_SHARED`; real-world data and any resulting deployment-validity assessment; full unseen-student evaluation protocol; additional admin-provisioning mechanism; numeric recovery retry-count escalation threshold.
