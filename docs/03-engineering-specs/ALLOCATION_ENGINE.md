# ANCHOR — ALLOCATION ENGINE TECHNICAL SPECIFICATION

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

## 1. Eligible-Pair Construction

Only pairs with `E(c,i)=1` enter the matching graph. `E` is computed from mandatory criteria only (degree/track, availability, mandatory certification, quota-category). The full eligible-pair universe for Cycle T is constructed before any downstream scoring.

## 2. Eligibility, Fit, Opportunity Signal

- **`E(c,i) ∈ {0,1}`** — exclusive binary gate (§6.1). Never feeds `F`. Dual-purpose-field rule: a real-world attribute with both a hard and soft sense is represented as two separate fields, never one serving both.
- **`F(c,i) ∈ [0,1]`** — computed only for `E=1` pairs; post-eligibility graded factors (skill/semantic overlap weighted by evidence — self-reported 1.0×, institution-verified 2.0× — location/sector compatibility). Never a function of `E`'s pass/fail outcome beyond gating whether `F` is computed at all.
- **`O(c,i) ∈ [0,1]`** — frozen model score or `HEURISTIC_FALLBACK`, per the activation gate (03-engineering-specs/AI_DS_SPEC.md). `O_offer` (`OFFER_EXTENDED`) is the sole Phase-1 target.

## 3. Priority

```
Priority(c,i) = α · F(c,i) + (1−α) · O(c,i)
default α = 0.6
```

Recorded per allocation run as part of that run's policy version (`policy_alpha`, a snapshot field — never hardcoded invisibly). Deterministic: given the same frozen inputs, recomputation always yields the same result. `outcome_signal_source: ML | HEURISTIC_FALLBACK` logged per run.

## 4. Candidate Preference Handling

Candidate-declared, ranked, never system-modified. Empty/incomplete lists are valid input and may legitimately terminate in `UNMATCHED`. The system never inserts, reorders, or auto-completes a preference list.

## 5. Candidate-Proposing Deferred Acceptance

- Candidates propose in preference order to opportunities.
- Opportunity capacities are respected exactly — opportunities accept up to capacity, ranked by `Priority`, rejecting lower-priority proposals as higher-priority ones arrive.
- Tie resolution via `tiebreak_key` when priorities are equal within epsilon `1e-9`.
- Termination: standard DA termination — no candidate has an unrejected proposal pending, and no opportunity has an open, unfilled proposal to consider.
- `UNMATCHED` is a valid terminal state for candidates with exhausted or empty preference lists.

**Stability claim:** candidate-proposing DA yields the candidate-optimal stable matching among all stable matchings for the exact declared-preference profile, under the configured `Priority` relation and capacity model — a standard result, not a novel claim. **Does not automatically extend to recovery runs or overridden results.**

**Mechanism / priority model / system objective — kept separate:**
1. DA's stability guarantee is a mechanism property.
2. How `Priority(c,i)` is computed is a policy choice, not a stability requirement.
3. Anchor's system objective is "reasonable, explainable, non-manipulable allocation" — not "maximize total utility."
None of the three is ever conflated with another.

## 6. Opportunity Capacities

Respected exactly at every step of proposal acceptance/rejection — never soft-capped or exceeded, and never adjusted mid-run (frozen at run start, §7).

## 7. Deterministic Ties

`tiebreak_key`: persistent, generated once per candidate at registration from a seeded RNG, reused across every run including recovery. Not a protected attribute; never learned from candidate characteristics. Opportunity-side ties handled symmetrically. Epsilon `1e-9` is a prototype engineering tolerance chosen for this application — not IEEE machine epsilon, not claimed as such. **Explicit statement (must propagate to all documentation): tie-breaking is not a fairness mechanism** — it resolves ties, it does not correct for or claim to address distributional fairness.

## 8. Run Freezing (Freeze-at-Run-Start)

Once a run enters execution, `E`, `F`, `O`, `Priority(c,i)`, opportunity capacities, preference lists, tiebreak values, and model/configuration version references are immutable for that run's duration. Any change requires a new run — never an in-place mutation of an executing run. Distinct from, and in addition to, the pre-publication snapshot-invalidation rule (§9 below) — this invariant covers the execution window itself.

## 9. Snapshots

`AllocationSnapshot` (immutable): `candidate_subject_token`, opportunity_state, preferences, eligibility_results, capacities, scores, `model_hash`, version fields (`algorithm_version`, `calibration_version`, `dataset_version`, `generator_version`), actual tiebreak values used, `policy_alpha`, `random_seed`. Both `snapshot_blob` and `snapshot_hash` required. Once written, never modified. `subject_identity_mapping` is a separate, mutable table (see 03-engineering-specs/SECURITY_PRIVACY.md).

## 10. Publication

Governed by the human-governance state machine (02-architecture/STATE_MACHINES.md): `DRAFT → PROPOSED → UNDER_REVIEW → APPROVED → PUBLISHED`, or `→ OVERRIDDEN → VALIDATED → PUBLISHED`.

## 11. Overrides

An overridden assignment is human-modified: the original proposed assignment, the override decision, its reason, the acting admin, and the validation result are stored as distinct, linked records. An override **never inherits the DA stability label.**

## 12. Invalidation

A `PROPOSED` run goes stale/`INVALIDATED` if any enumerated trigger occurs before publication: algorithm/config change (`policy_alpha`, model/calibration version, tiebreak epsilon, capacity-computation formula), opportunity lifecycle event (withdrawal/closure, capacity change, eligibility-requirement change, material detail edit), evidence change (add/edit/remove, verification status change, degree/track correction), or user/account-state change (preference-list edit, application withdrawal, account deactivation/reactivation). `INVALIDATED` runs require a new run — never in-place repair.

## 13. Recovery

- **Trigger:** dropout or vacancy of a published allocation.
- **Affected set:** transitive closure — vacated opportunity → competing candidates → their current allocations → alternatives → repeat until the set stops growing.
- **Batching:** simultaneous dropouts batch into a single recovery operation.
- **Queue invariant:** at most one `ACTIVE` recovery-queue entry per candidate per `allocation_generation`.
- **Lineage:** recovery runs carry `allocation_generation` and `parent_run_id`; prior runs marked `SUPERSEDED` where applicable.
- **Retries:** `retry_count`, escalating to a full admin-triggered market rerun past a defined threshold *(numeric value not specified in the Master — Configurable, deferred)*.
- **Stability scope:** explicitly a **locally stable recovery heuristic — never a full-market stability guarantee.** Must not be described otherwise in any downstream document.

---

## 14. Pseudocode

### 14.1 Eligibility
```
function compute_eligibility(candidate, opportunity):
    for each mandatory_criterion in opportunity.requirements.mandatory:
        if not candidate.satisfies(mandatory_criterion):
            return E = 0
    return E = 1
```

### 14.2 Fit
```
function compute_fit(candidate, opportunity):
    require E(candidate, opportunity) == 1
    skill_score = weighted_skill_overlap(candidate.evidence, opportunity.requirements)
        # evidence weight: 1.0x self-reported, 2.0x institution-verified
    location_score = location_compatibility(candidate, opportunity)
    sector_score = sector_compatibility(candidate, opportunity)
    return F = combine(skill_score, location_score, sector_score)  # in [0,1]
```

### 14.3 O Scoring
```
function score_opportunity_signal(candidate, opportunity, frozen_model_or_fallback):
    features = extract_primitives(candidate, opportunity)  # raw skill-overlap count,
                                                             # categorical degree/track match,
                                                             # raw location distance,
                                                             # categorical sector match
    assert preference_rank not in features
    assert fit_score not in features
    if frozen_model_or_fallback.source == ML:
        return O = frozen_model_or_fallback.model.predict(features)
    else:
        return O = heuristic_fallback(features)
```

### 14.4 Priority
```
function compute_priority(F_score, O_score, alpha=0.6):
    return alpha * F_score + (1 - alpha) * O_score
```

### 14.5 Deferred Acceptance
```
function run_da(candidates, opportunities, priority_matrix, capacities, preferences, tiebreak_keys):
    freeze(priority_matrix, capacities, preferences, tiebreak_keys)  # freeze-at-run-start
    tentative_holds = {}
    unproposed_lists = {c: preferences[c].copy() for c in candidates}
    while exists candidate c with unrejected pending proposal or unproposed list nonempty:
        c = next candidate with opportunities remaining in unproposed_lists[c]
        i = pop_next(unproposed_lists[c])
        propose(c -> i)
        held = tentative_holds.get(i, [])
        held.append(c)
        if len(held) > capacities[i]:
            held = rank_by_priority_with_tiebreak(held, priority_matrix, tiebreak_keys, epsilon=1e-9)
            rejected = held[capacities[i]:]
            held = held[:capacities[i]]
            for r in rejected:
                reject(r, i)
        tentative_holds[i] = held
    return finalize_matches(tentative_holds)  # UNMATCHED valid for exhausted/empty lists
```

### 14.6 Tiebreaking
```
function rank_by_priority_with_tiebreak(candidates, priority_matrix, tiebreak_keys, epsilon):
    return sort(candidates, key = lambda c: (
        -priority_matrix[c],           # higher priority first
        tiebreak_keys[c]                # deterministic seeded tiebreak, applied only within epsilon-equal priorities
    ), epsilon_tolerance=epsilon)
```

### 14.7 Snapshot Creation
```
function create_snapshot(run):
    blob = serialize(run.opportunity_state, run.preferences, run.eligibility_results,
                      run.capacities, run.scores, run.model_hash, run.versions,
                      run.tiebreak_values, run.policy_alpha, run.random_seed,
                      run.candidate_subject_tokens)
    hash = compute_hash(blob)
    write_immutable(snapshot_blob=blob, snapshot_hash=hash)  # both required, never rewritten
```

### 14.8 Invalidation
```
function check_invalidation(run):
    if run.status != PROPOSED:
        return
    if any(trigger in ENUMERATED_TRIGGERS for trigger in events_since(run.created_at)):
        run.status = INVALIDATED
        # requires a brand-new run; no in-place repair
```

### 14.9 Recovery
```
function recover(dropout_or_vacancy_event, allocation_generation):
    affected = compute_transitive_closure(dropout_or_vacancy_event)
    if active_recovery_exists(affected.candidates, allocation_generation):
        raise QueueInvariantViolation  # at most one ACTIVE entry per candidate per generation
    enqueue_recovery(affected, allocation_generation, parent_run_id=current_run.id)
    result = run_da(affected.candidates, affected.opportunities,
                     frozen_priority_matrix, frozen_capacities,
                     frozen_preferences, frozen_tiebreak_keys)
    mark_superseded(current_run) if applicable
    label(result, stability="locally_stable_heuristic")  # never "full-market-stable"
    return result
```

---

## 15. Explicit Separations (must never be conflated in code, docs, or UI)

- DA stability ≠ Priority policy choice ≠ system objective (§5).
- Recovery stability = locally stable heuristic ≠ full-market DA stability.
- Overrides never inherit the DA stability label.
- Deterministic tie-breaking ≠ a fairness mechanism.
