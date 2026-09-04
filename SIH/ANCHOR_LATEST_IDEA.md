# ANCHOR — LATEST IDEA
### SIH26044 — Final Reviewed Product Concept

---

## 1. One-Line Definition

Anchor is a two-sided academia–industry platform that turns verified student skill evidence and company opportunity requirements into an explainable, human-governed allocation — using a candidate-proposing Deferred Acceptance mechanism whose priority ordering blends a transparent fit score with a synthetic, honestly-scoped opportunity-side selection signal.

---

## 2. Problem

Academic institutions and employers currently exchange internship/placement information through fragmented, low-fidelity channels: resumes and forms that don't capture verified skill evidence, ranked lists that don't reflect real institutional or student preference structure, and outcomes that generate no usable feedback for either side. Three specific gaps drive this:

- **Skill evidence is unverified and unstructured.** What a student claims to know and what an institution can actually vouch for are conflated, and neither is connected to what a role genuinely requires.
- **Matching is currently either purely manual (slow, unscalable, opaque) or naively automated (a single ranked list with no real mechanism-level guarantees about stability or fairness of process).**
- **Nothing closes the loop.** Once an internship or placement happens, there's no structured signal feeding back into how future matching should behave — institutions, students, and companies all repeat the same discovery process from scratch every cycle.

Anchor does not claim to solve employer decision-making itself — it is explicit that any signal about opportunity-side selection is a synthetic, prototype-scoped construct, not a claim about real-world employer behavior.

---

## 3. Anchor's Core Insight

Anchor's central architectural principle:

> **AI predicts; matching decides; constraints protect; humans govern.**

Concretely:

- **AI predicts** — a fit score and an opportunity-side selection signal are computed per candidate–opportunity pair. Neither is the final decision; both are inputs to a priority ordering.
- **Matching decides** — a well-understood, textbook-grade mechanism (candidate-proposing Deferred Acceptance) turns those priorities and declared student preferences into a concrete allocation, with a precise, limited stability guarantee attached to it.
- **Constraints protect** — hard eligibility gates ineligible pairs out before any scoring happens; capacity limits are respected exactly; nothing about the AI layer can override a mandatory requirement.
- **Humans govern** — every proposed allocation passes through a review state before publication, can be overridden by an accountable human decision with a stored reason, and every allocation, override, and access event is auditable.

This means Anchor is never "the algorithm decided" — it is a specific, inspectable pipeline where each stage has a distinct, separately-justified role, and none of them silently substitutes for another.

---

## 4. Product Vision

Anchor is a closed-loop academia–industry ecosystem, not a one-shot recommender. The loop:

**evidence → skills → matching → application → allocation → outcome → feedback → improved ecosystem intelligence.**

Each cycle of this loop produces structured data — which skills mattered, which opportunities were genuinely competitive, which outcomes occurred — that can improve future cycles' scoring, without ever silently blurring "what we observed in synthetic data" with "what we know about real employer behavior."

---

## 5. Two-Stage Strategy

Anchor is built and evaluated in two distinct stages, which are not the same system at different scales — they are architecturally different.

### College Round
A simpler, one-sided ranking system: a standalone, explainable matching approach scoped appropriately for a college-level competition round. It does not include the Main Round's two-sided mechanism, opportunity-side learned signal, or governance machinery.

### Main SIH Round
The full ecosystem-scale system: the Intelligent Allocation Engine (below), an Industry ↔ Academia feedback loop, and the deeper allocation, learning, and institutional-governance layers described in this document. The College Round's mechanisms are not assumed to already exist inside the Main Round's scope, and vice versa — the Main Round is a distinct, larger system built for this flagship.

---

## 6. Main SIH Flagship: The Intelligent Allocation Engine

At its core, Anchor's Main Round flagship is a **candidate-proposing Deferred Acceptance system** — the same class of mechanism used in large-scale seat-allocation systems like JoSAA.

- **Declared student preferences** drive the process — the system never inserts, reorders, or auto-completes a student's ranked list. An incomplete or empty list is valid input and can result in a legitimate unmatched outcome.
- **Hard eligibility** is a strict binary gate — only eligible candidate–opportunity pairs are ever scored or considered.
- **Soft fit** is a graded, explainable score covering skill overlap, location/sector compatibility, and other post-eligibility factors — never a pass/fail condition.
- **Opportunity-side selection signal** contributes a second, separately-computed input to priority, alongside fit.
- **Priority**, a transparent blend of fit and the selection signal, orders how the matching mechanism resolves competition for a given opportunity.
- **Deterministic tie-breaking** resolves exact ties reproducibly, without ever functioning as — or being described as — a fairness mechanism.
- **Human governance** sits between a proposed allocation and its publication, with full override and audit capability.
- **Recovery** handles dropouts and vacancies by re-running the mechanism over only the affected part of the market — a locally-stable heuristic, explicitly not a full-market stability guarantee.

---

## 7. The AI Layer

Anchor's AI layer does two specific, bounded things:

1. **Fit scoring** — skill/semantic overlap and other graded compatibility factors between a candidate and an opportunity.
2. **Opportunity-side selection signal** — a learned (or, when insufficient data exists, heuristic) estimate of how likely an opportunity-side outcome is for a given pair, calibrated and validated against a temporally honest evaluation protocol before it is ever allowed to influence a live allocation.

What the AI layer explicitly **does not** do: it does not determine the final allocation. The allocation is a mechanism-level outcome of Deferred Acceptance operating on eligibility, priority, and declared preferences — AI contributes one of the inputs to priority, never the decision itself. Model output is never presented to users as "confidence" — only as a coarse, clearly-labeled priority tier.

---

## 8. Trust & Governance

- **Verification** distinguishes self-reported evidence from institution-verified evidence, with a precise label ("verified by institution account") that never implies a stronger guarantee than what was actually attested. Editing verified evidence reverts it to self-reported status until re-verified.
- **Institution and company accounts** activate only through an admin-approval gate — there is no self-service path to a trusted role for either.
- **Privacy** is handled with a specific, honestly-scoped claim: direct identity is excluded from computational allocation records, but the combination of attributes inside one can still act as a quasi-identifier — Anchor does not overclaim anonymity it can't guarantee.
- **Profile visibility** defaults to private for real users, with explicit opt-in required for any broader visibility; a more open default is used only in the seeded demo dataset, never for real onboarding.
- **Human override** of a proposed allocation is always a distinct, accountable, auditable action — never a silent edit.
- **Audit trail** covers allocation, override, verification, and cross-tenant access events.
- **Immutable snapshots** record exactly what a given allocation run saw and decided, separately from the mutable record linking a pseudonymous token back to a real identity — so a privacy deletion request never breaks the reproducibility of a past decision.

---

## 9. What Makes Anchor Distinctive

- A genuinely two-sided, mechanism-grounded matching engine (candidate-proposing DA with a real, precisely-scoped stability guarantee) rather than a single ranked-list recommender.
- A strict, structural separation between hard eligibility, soft fit, and a learned opportunity-side signal — three different kinds of judgment that are never allowed to blur into one number.
- An unusually disciplined temporal evaluation protocol for the learned signal: chronologically disjoint train/calibration/validation/test partitions, an explicit activation gate, and a deterministic heuristic fallback whenever the data doesn't yet support the model.
- Human governance and full auditability built into the allocation lifecycle from the start, not bolted on afterward.
- A privacy architecture that separates identity from computational state by construction, so anonymization requests never compromise reproducibility.

These are architectural strengths, not novelty claims about being first to use any individual technique — Deferred Acceptance, calibrated ML signals, and audit-logged governance all exist elsewhere; the combination and the discipline around honest claims is what Anchor is offering here.

---

## 10. Prototype Boundaries

Stated plainly, because they matter as much as the capabilities do:

- All data is synthetic. No real applicant or company data exists or will exist before submission.
- No claim is made that the opportunity-side signal predicts real-world employer behavior — that question is explicitly out of scope for this prototype.
- No claim of statistical independence between fit and the opportunity-side signal — only computational non-dependency (one doesn't consume the other's output) is claimed.
- No claim that Deferred Acceptance's stability guarantee extends to recovery runs or human-overridden results — both carry their own, weaker, separately-stated properties.
- No claim that deterministic tie-breaking is a fairness mechanism.
- No causal claim for the opportunity-side signal — it is described as correlational only, under stated synthetic assumptions.
- Unseen-opportunity and unseen-company generalization are explicitly Phase 2 — dataset scale in Phase 1 cannot credibly support company-level holdout evaluation.

---

## 11. Final Scope

What is actually being built for the Main SIH Round: a candidate-proposing Deferred Acceptance allocation engine over a synthetic academia–industry dataset, with structurally separated hard-eligibility and soft-fit scoring, a single-target (`O_offer`) opportunity-side selection signal trained and gated under a cycle-aligned temporal evaluation protocol with deterministic heuristic fallback, human-governed review/override/publication of allocation results, immutable reproducible allocation snapshots with privacy-separated identity mapping, and role-gated trust/verification for institution and company accounts. Everything outside that boundary — real data, additional `O` family members, unseen-company evaluation, and later-stage sharing states — is explicitly deferred.

---

## 12. Current Status

This is the final reviewed design baseline for the Main SIH Intelligent Allocation Engine, having passed multiple adversarial design-review rounds, a self-verification pass, and two independent cold cross-checks. It is **moving into implementation** — the specification has been reviewed for internal consistency, but that is not the same as implementation-level validation, which is the next stage of work.
