# PMIS Adaptive Allocation Engine — V4 FINAL Master Blueprint
## Conflict-Free, Cross-Verified, Fact-Checked

*Consolidates: V3 (original blueprint) → two independently-produced V4 repairs → cross-verification against each other and against live government-reporting sources → this document. No open conflicts remain. This is the authoritative baseline for Phase 1 implementation.*

---

## 1. Executive Summary

The PMIS Adaptive Allocation Engine is a government decision-support prototype for market-wide internship allocation. It targets the allocation *mechanism* itself — not another candidate-facing recommendation list.

The Phase 1 mechanism is **candidate-proposing Deferred Acceptance (DA)**, the same mechanism class as India's JoSAA engineering-admissions system, with:

- a fully specified two-sided ranking (candidate side = declared preference, unaltered; opportunity side = fit + predicted acceptance likelihood);
- hard eligibility filtering before any candidate enters the matching graph;
- a persistent, deterministic tie-break;
- a bounded, honestly-scoped quota model;
- transitive-closure dropout recovery;
- a full human-governance state machine, with overrides stored separately from algorithmic results;
- dual-layer explainability (machine trace + human-facing rendering).

Guiding principle: **AI predicts; matching decides; constraints protect; humans govern; events trigger adaptation.** AI never allocates directly — it supplies one signal used in opportunity-side priority ordering.

All Phase 1 experiments use synthetic data, explicitly not real PMIS applicant records. No claim is made that the ML component is deployment-ready or that allocation causally produces completion or employment outcomes.

---

## 2. Canonical PMIS Facts & Terminology (fact-checked)

| Term | Meaning |
|---|---|
| Scheme target | 1 crore internships over 5 years (policy aim, not a measured count) |
| Candidate | A person participating in the scheme |
| Application | A candidate's submission against opportunities — not interchangeable with unique candidate count |
| Opportunity | An internship position posted by a company |
| Offer | An internship offer made to a candidate |
| Acceptance | Candidate's response accepting an offer |
| Joining | Candidate actually begins the internship |
| Completion | Candidate finishes the full internship term |

**Verified figures (Round 1, pilot phase):**

| Metric | Value | Source status |
|---|---|---|
| Opportunities | 1.27 lakh | Confirmed, Corporate Affairs Ministry / Rajya Sabha reply |
| Applications | 6.21 lakh | Confirmed |
| Applicant candidates | 1.81 lakh | Confirmed |
| Offers made | 82,000+ | Confirmed |
| Offers accepted | 28,000 (≈34%) | Confirmed, Dec 15 2025 written reply to Parliament |
| Joined | 8,700+ | Confirmed — directly downstream of the 28,000 acceptances (same funnel, not a separate cohort) |
| Completed | 2,066 (≈24% of joiners) | Confirmed, as of Nov 30, 2025 written reply to Parliament |

**Verified figures (Round 2):**

| Metric | Value |
|---|---|
| Opportunities | ~1.18 lakh |
| Offers made | ~83,000 |
| Offers accepted | <24,600 (<30%) |

The acceptance rate did not merely stay flat — it **worsened**, from ≈34% (Round 1) to below 30% (Round 2), despite Round 3's preference-based-browsing UX redesign.

**Budget:** ₹2,000 crore allocated FY 2024-25; ₹29.29 crore utilised (~1.5%).

**Scheme purpose caveat:** government reporting explicitly frames PMIS as a skilling/employability initiative, not an employment-placement scheme. Any statistic about post-completion job offers is illustrative context, not evidence of the scheme failing its own stated goal.

**Rule:** every future reference to these figures carries its round and reporting-date scope. Never substitute one term for another (e.g., "applications" ≠ "candidates"; "scheme target" ≠ "measured applications").

---

## 3. Problem Definition

PMIS operates a large, constrained internship market. Public reporting shows: 5x oversubscription in Round 1 (6.21 lakh applications against 1.27 lakh opportunities); an acceptance rate that stayed weak and then *worsened* across rounds (34% → <30%) despite the candidate-facing portal being redesigned between Round 2 and Round 3; and steep joining-to-completion attrition (8,700 joined, 2,066 completed).

**Correct framing:**

> There is an opportunity to redesign the allocation mechanism itself around preference-aware stable matching, an allocation-time acceptance-likelihood signal, hard-constraint enforcement, explainability, human governance, and adaptive recovery from market changes.

**Explicitly not the framing:** "PMIS needs AI because it currently has none," or "our model solves PMIS's completion/employment problem." The project improves allocation *quality*; it does not claim causal control over post-allocation outcomes.

---

## 4. Solution Definition

**Phase 1 (hackathon):**
1. Hard eligibility filtering
2. Explicit candidate preference lists (declared, never altered)
3. Opportunity-side priority = fit + calibrated acceptance-likelihood signal
4. Capacity + one bounded quota dimension (only if the demo requires it)
5. Synthetic-market simulation
6. Match and no-match explanations (machine trace + human-facing rendering)
7. Proposed-run human review, with explicit override recording
8. Transitive-closure dropout recovery
9. 4-tier baseline comparison, reproducible experiments

**Phase 2 (advanced prototype, research):** NLP/embedding-based compatibility scoring; a second, separate acceptance-model refinement; richer quota/distributional mechanisms; uncertainty-aware ranking; formal stability analysis under learned priorities; sensitivity/robustness studies.

**Phase 3 (SIH final / long-term research):** multi-stage outcome chain (accept × join × complete × convert) with uncertainty quantification; disruption-aware recovery objectives ("stability budget"); richer distributional constraints; formal 7-baseline benchmark; publication; patent evaluation only after a prior-art search.

No Phase 2/3 claim is presented as a Phase 1 capability, anywhere.

---

## 5. Core Architecture

```text
PMIS-style market snapshot
        |
        v
Hard eligibility filter
        |
        v
Feasible candidate x internship graph
        |
        +-------------------------------+
        |                               |
        v                               v
Candidate preference list         Fit + acceptance-likelihood signal
(declared, unaltered)             F(c,i), O(c,i)
        |                               |
        |                               v
        |                       Opportunity-side priority
        |                       Priority(c,i) = α·F + (1-α)·O
        |                               |
        +---------------+---------------+
                        |
                        v
              Candidate-proposing DA
                        |
              capacity / bounded quota
                        |
                        v
                 Proposed match run
                        |
                        v
                  Human review
                   /         \
              approve       override
                 |              |
                 |        validate + audit
                 |              |
                 +-------+------+
                         |
                         v
                     Publish
                         |
                accept / reject / dropout
                         |
                         v
       Transitive-closure recovery run (batched)
```

Semantic/feature construction → prediction → priority → matching → governance → adaptation are kept strictly separate. The ML component supplies a priority *input*; it never replaces the matching mechanism.

---

## 6. Matching Mechanism — Locked

**Candidate-proposing Deferred Acceptance is the sole Phase 1 mechanism.** CP-SAT / global-utility-maximization (an early exploratory alternative) is permanently retired — it optimizes total utility rather than guaranteeing stability, which would contradict this project's core differentiation claim. It must not reappear in any diagram, endpoint description, or demo narration.

**Candidate side:** each candidate submits a ranked list of acceptable internships (`A > B > C`). The system never inserts, reorders, or auto-completes this list. An empty or incomplete list is a valid input state (→ `UNMATCHED`, reason `NO_SUBMITTED_FEASIBLE_PREFERENCE`).

**Opportunity side:** for each feasible pair `(c, i)`:

```text
E(c,i) ∈ {0,1}   — hard eligibility indicator
F(c,i) ∈ [0,1]   — soft fit score
O(c,i) ∈ [0,1]   — calibrated P(accept offer | allocation-time information)
```

Only `E=1` pairs enter ranking. Priority:

```text
Priority(c,i) = α·F(c,i) + (1-α)·O(c,i),  0 ≤ α ≤ 1
```

The exact `α` used in any run is recorded as part of the run's policy version — never hardcoded invisibly. Default `α = 0.6`.

**Stability, precisely:** the core matching run is stable with respect to (a) each candidate's own unaltered declared preferences, (b) the configured `Priority(c,i)` relation, (c) the supported capacity/quota model, (d) the candidate-proposing DA procedure itself. Candidate-proposing DA yields the candidate-optimal stable matching among all stable matchings for that exact profile (standard result, not a novel claim). This label does not extend automatically to recovery runs (§13) or overridden results (§14) — see those sections for their own, weaker, precisely-stated properties.

---

## 7. Tie-Breaking

Persistent, deterministic, per-candidate: each candidate is assigned exactly one `tiebreak_key` (drawn from a seeded RNG) **once**, at first registration — not regenerated per run. The same key is used consistently across every run that candidate participates in, including recovery runs. This is Single Tie-Breaking (STB), matching standard deferred-acceptance deployment practice. The key is not a protected attribute and is never learned from candidate characteristics. Multiple Tie-Breaking (per-slot lotteries) is a named Phase 2 fairness research question, not built.

The audit record for every ranking stores the priority score, the tiebreak key used, and the resulting rank.

---

## 8. Hard Constraints, Soft Fit, Preference, and Policy

| Category | Definition | Affects allocation? |
|---|---|---|
| Hard eligibility (E) | Mandatory official/technical condition (degree/branch, availability window, quota-category tag) | Yes — pair removed from the graph if failed |
| Soft compatibility/fit (F) | Degree of suitability among already-eligible pairs (skill overlap, location, sector alignment) | Yes — opportunity-side priority input |
| Candidate preference (P) | Candidate's own declared ranking | Yes — candidate side of DA only, never elsewhere |
| Outcome signal (O) | Allocation-time predicted acceptance likelihood | Yes — opportunity-side priority input only |
| Policy constraint | Quota bucket capacity ceilings | Yes, where configured |
| Audit-only attribute | Candidate ID, timestamp, application channel | No — logged, never used in ranking/eligibility |
| Forbidden allocation feature | Any post-allocation signal (actual acceptance, joining, completion, employer feedback) | No — must never enter E, F, or O |

No variable may ambiguously act as both a hard rule and a soft score. Location may be used as a compatibility signal but must never become an unexplained proxy for candidate worth.

**Quota scope, Phase 1 (bounded, honestly scoped):** simple capacity constraints, plus — only if the demo requires it — **one** explicitly defined, mutually-exclusive reservation/category dimension per slot. No overflow between categories, no minimum-fill floors, no multi-category eligibility, no nested/overlapping quotas. Richer distributional constraints (which can alter the stability properties of ordinary DA) are explicitly Phase 2 research, not claimed as Phase 1 capability.

---

## 9. AI / ML Layer

**Target:**

```text
O(c,i) = P(accept offer | candidate c, internship i, allocation-time features)
```

Chosen because the 34%→<30% acceptance-rate collapse (§2/§3) is the single most-repeated, most central piece of documented evidence in the whole problem statement — more central than completion or joining. "Success" is never used as an undefined umbrella label. Phase 1 makes no claim about predicting employment, completion, or any other post-allocation outcome.

**Prediction time:** at allocation time, before the candidate has responded to any offer. **Horizon:** the offer-response window only (not the internship term).

**Allocation-time feature contract:** every feature must be knowable before the allocation decision. Allowed: structured skills, education/branch, prior-experience fields represented as allocation-time information, location/distance compatibility, internship sector/role, stipend/duration (where set before allocation), and — only when explicitly tested against a preference-only baseline (§14) to rule out simple restatement — the candidate's submitted preference rank. Forbidden: actual post-offer acceptance, joining status, completion status, employer feedback, or any other post-allocation event.

**Synthetic-data discipline:** the label-generating process is hidden from the model and includes at least one latent/noise component not exposed as a feature, so the model cannot trivially re-derive its own label-generation formula. Evaluation uses held-out generation seeds/scenarios distinct from training seeds, to test generalization under distributional shift rather than only a random row split.

**Fallback:** if the model is unavailable, incompatible, or produces invalid output, the outcome engine automatically falls back to the deterministic heuristic proxy for that run. Fallback never changes the matching mechanism and never blocks or invalidates a run. Every run logs `outcome_signal_source: ML | HEURISTIC_FALLBACK` with a reason code if fallback occurred.

**Calibration:** because `O` is used numerically inside `Priority(c,i)`, it must be calibrated — Brier score, log loss, and a calibration curve are computed for every model version, with discrimination metrics as secondary. This calibration requirement exists regardless of what the UI shows.

**UI display:** the model output is never labeled "confidence" in any user-facing surface — that word implies statistical certainty the system doesn't calibrate for end-user display. The UI shows a coarse, explicitly-labeled **priority tier** (e.g., "higher/typical/lower predicted priority") — a display convenience, not a stated probability.

**Causal caveat:** predicted acceptance likelihood is a correlational proxy learned from synthetic labels — never presented as "this allocation causes acceptance," only as "more likely, per the model, to result in an accepted offer, under the synthetic assumptions."

---

## 10. Baseline Comparison Hierarchy

To isolate the incremental value of each architectural layer (and specifically to rule out a tautological result, since acceptance likelihood correlates with declared preference by construction):

```text
FCFS
  → Preference-only DA (candidate side = declared order; opportunity side = eligibility only, no F or O)
  → DA + heuristic outcome priority (opportunity side = α·F + (1-α)·O_heuristic)
  → DA + ML outcome priority (opportunity side = α·F + (1-α)·O_ml)
```

This is deliberately stronger than a single FCFS-vs-full-model comparison: it shows what DA alone contributes, what fit-based priority adds on top, and what the learned acceptance signal adds beyond that — each isolated.

Fairness-monitoring metrics (category-level match-rate disparity) are reported at every tier. A *comparative* claim ("fairer than FCFS") is only stated if the dashboard's own numbers show it, always qualified "in this simulation."

---

## 11. Dropout / Recovery Mechanism

**Event:** an allocated candidate drops out, or a vacancy otherwise opens.

**Snapshot discipline:** recovery runs operate on an explicit new market snapshot; a previously proposed run is never mutated in place.

**Affected market (transitive closure):**

```text
vacated opportunity
 → candidates who can feasibly compete for it
 → their currently-allocated opportunities (now also potentially contested)
 → relevant alternative opportunities for those candidates
 → repeat until the affected set stops growing
```

DA is rerun over exactly this closed set, using frozen slot rankings and each candidate's unaltered declared preferences.

**Claim boundary:** the documentation may state "the engine performs affected-market recovery rather than recomputing the entire market." It may **not** claim a formal global-stability guarantee for the local rerun — that would require a full fresh run over the whole market, a deliberate Phase 1 speed/demo tradeoff. The result is labeled a **locally stable recovery heuristic**.

**Simultaneous events:** multiple dropouts occurring between runs are batched into a single recovery operation, avoiding inconsistent sequential intermediate states.

---

## 12. Human Governance & Override

The engine proposes; a human administrator publishes. The admin is not expected to inspect every individual assignment — the workflow surfaces aggregate metrics and flagged exceptions, with the option to approve in bulk or override specific assignments.

**Override rule:** a manual override is never silently represented as the original DA output. The system preserves, as distinct, linked records: the original proposed assignment, the override decision, its reason, the acting admin, validation result, and publication status. An overridden assignment is marked a **human-modified outcome** — it does not inherit the §6 stability label.

**Allocation state machine:**

```text
DRAFT
  → PROPOSED
  → UNDER_REVIEW
      → APPROVED → PUBLISHED
      → OVERRIDDEN → VALIDATED → PUBLISHED
      → INVALIDATED → (new run)

PUBLISHED
  → ACCEPTED
  → REJECTED / VACATED → RECOVERY RUN
```

A `PROPOSED` run becomes stale/`INVALIDATED` if the underlying market snapshot changes materially before publication (e.g., new candidates or slots register mid-review) — it does not silently carry forward against changed data; a fresh run is required.

---

## 13. Explainability

Two distinct layers, both traceable to the same underlying `allocation_events` rows, but not the same artifact:

- **Machine audit trace:** the raw DA proposal/rejection log — complete, technical, generated at zero extra computation cost as the algorithm runs.
- **Human-facing explanation:** a deterministic template rendered *from* that trace (e.g., "You were not matched to Slot Y because N other candidates had a higher priority score for this slot's available seats"). Cheap and deterministic, but a distinct rendering step — not an automatic byproduct of the trace alone.

---

## 14. Database Design

**`candidates`, `companies`, `internship_slots`** — as in V3, unchanged.

**`candidate_preferences`** — authoritative, read-only declaration of candidate order. Duplicate candidate–internship pairs rejected at validation. Empty/incomplete lists are valid.

**`tiebreak_keys`** — one row per candidate, created once at registration, persisted permanently, reused across every run (§7).

**`matching_runs`**
```text
run_id, snapshot_id, algorithm_version, model_version, calibration_version,
policy_version (includes α), dataset_version, generator_version, random_seed,
outcome_signal_source (ML | HEURISTIC_FALLBACK), status, created_at,
reviewed_at, approved_at, approved_by
```

**`allocations`**
```text
allocation_id, run_id, candidate_id, internship_id,
fit_score, outcome_score, priority_score, tiebreak_key_ref, status
```

**`allocation_events`**
```text
event_id, run_id, candidate_id, internship_id, event_type
  (PROPOSED | REJECTED | ASSIGNED | OVERRIDDEN | APPROVED | PUBLISHED |
   DROPPED_OUT | REMATCHED | INVALIDATED),
event_reason, actor, timestamp, metadata
```

**`quotas`** — fixed, non-overlapping category buckets per slot (§8 scope).

**`scenario_runs`** — research/what-if runs only, ephemeral, never reach `PUBLISHED`. Kept structurally separate from `matching_runs` (live allocation rounds) since the two have different lifecycles and different consumers (researcher vs. auditor).

---

## 15. API Design

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/candidates` | POST | Register a candidate (also generates their permanent `tiebreak_key`) |
| `/api/companies/{id}/slots` | POST | Post an internship slot |
| `/api/preferences` | POST | Submit ranked preference list (immutable input) |
| `/api/allocations/run` | POST | Freeze a snapshot, run DA at the requested tier (§10) → `PROPOSED` |
| `/api/allocations/{id}/review` | POST | Admin-only: transition `UNDER_REVIEW` → `APPROVED`/`OVERRIDDEN` → `PUBLISHED` |
| `/api/allocations/{candidate_id}` | GET | Get match result |
| `/api/allocations/{candidate_id}/why` | GET | Human-facing match explanation |
| `/api/allocations/{candidate_id}/why-not` | GET | Human-facing no-match explanation |
| `/api/scenarios` | POST | Run a what-if scenario (writes to `scenario_runs` only) |
| `/api/metrics/comparison` | GET | 4-tier baseline comparison dashboard data |
| `/api/allocations/dropout` | POST | Trigger transitive-closure recovery (batches simultaneous events) |

---

## 16. Security, Reliability, and Edge Cases

Synthetic data only; no real PII. API-boundary validation, role enforcement (`candidate` / `company` / `admin`), run/snapshot-state verification before publication.

| Edge case | Handling |
|---|---|
| Empty preference list | `UNMATCHED`, reason `NO_SUBMITTED_FEASIBLE_PREFERENCE` |
| Incomplete preference list | Used exactly as submitted — never auto-completed |
| Duplicate preferences | Rejected at validation |
| Multiple seats, one internship | Modeled as one opportunity with capacity `N`, not one entity per seat |
| Equal priority | Persistent deterministic tiebreak (§7) |
| ML unavailable/invalid | Heuristic fallback, logged (§9) |
| Simultaneous dropouts | Batched into one recovery run (§11) |
| New opportunity mid-review | Prior proposal goes stale/`INVALIDATED` if the snapshot no longer matches (§12) |
| Admin override | Both original proposal and final human action stored (§12) |

**Failure modes:** solver failure → return last good run; DB loss → cached read-only dashboard; network outage → tested offline fallback with seeded deterministic dataset (non-negotiable before demo day).

---

## 17. Non-Negotiable Invariants — Verified

| # | Invariant | Status |
|---|---|---|
| I1 | No ineligible pair enters the matching graph | ✅ §6/§8 |
| I2 | Candidate receives at most one internship per run | ✅ Standard DA property |
| I3 | Internship never exceeds capacity | ✅ §8 quota ceilings |
| I4 | Candidate-declared preference never silently altered | ✅ §6 |
| I5 | ML never overrides hard constraints | ✅ O only feeds soft priority, never eligibility |
| I6 | ML failure cannot create an invalid allocation | ✅ §9 fallback |
| I7 | Every run reconstructible from snapshot, versions, seed | ✅ §14 `matching_runs` |
| I8 | Every human override distinguishable from the algorithmic proposal | ✅ §12 |
| I9 | Every recovery run has an explicit market state/scope | ✅ §11 |
| I10 | No guarantee claimed beyond the implemented mechanism | ✅ §6/§11/§12 stability qualifications |
| I11 | Every ML feature available at allocation time | ✅ §9 feature contract |
| I12 | Synthetic performance never presented as real-world validation | ✅ §1/§9 |

---

## 18. Demo Strategy

1. Canonical figures (§2, verified) frame the gap, including the Round 1→2 *worsening* acceptance rate. 2. FCFS baseline. 3. Preference-only DA — explain two-sided ranking and the precise stability claim. 4. DA+heuristic. 5. DA+ML — same candidate preferences held constant across all four tiers. 6. Judge triggers a dropout. 7. Transitive-closure recovery, correctly labeled "locally stable heuristic." 8. Click a match → human-facing explanation. 9. Click a non-match → human-facing explanation. 10. Quota scenario (bounded scope) + policy slider (α only). 11. Admin reviews: approve or override, state machine visible. 12. Close on Phase 2/3 roadmap.

---

## 19. Risks / Standing Caveats

**Not built in Phase 1:** NLP resume parsing, multi-target outcome chain, quota overflow/overlap/min-fill, full-market stability re-guarantee after recovery, calibrated-probability UI display, patent/novelty claims, CP-SAT/global-optimization framing.

**Every presentation states:**
- All data is synthetic, calibrated to verified published parameters, not real applicant records.
- The ML model is trained/evaluated on self-generated synthetic labels with a hidden noise term — architecture demonstration, not real-world validation.
- Predicted acceptance likelihood is correlational, never causal.
- "Stable" always means the §6 precise definition; recovery is "locally stable heuristic" only; overrides are explicitly not stable.
- The scheme's own stated purpose is skilling/employability, not direct job placement — post-completion job-offer figures are context, not a failure metric against the scheme's own goals.

---

## 20. Change Provenance

This document is the fully-merged result of: V3 (original blueprint) → V4-mine and V4-independent (two separately produced repairs of V3) → cross-verification of the two V4s against each other and against live government-reporting sources → resolution of six identified conflicts (ML target, tiebreak-key lifetime, "confidence" terminology, recovery-scope definition, baseline hierarchy, and the canonical facts table, including one factual correction: completions are 2,066, not the previously-stated 3,417). No unresolved conflicts remain between the two source repairs. This document supersedes both.
