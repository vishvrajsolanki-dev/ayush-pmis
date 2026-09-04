# ANCHOR — AI / DATA SCIENCE SPECIFICATION

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

## 1. Canonical Signals

| Signal | Range | Definition |
|---|---|---|
| `E(c,i)` | `{0,1}` | Hard eligibility — exclusive binary gate; only `E=1` pairs enter matching. Mandatory criteria only (degree/track, availability, mandatory certification, quota-category). |
| `F(c,i)` | `[0,1]` | Soft fit — computed only where `E=1`; post-eligibility graded factors (skill/semantic overlap, location/sector compatibility). |
| `O(c,i)` | `[0,1]` | Opportunity-side selection signal — a family (`O_shortlist`, `O_interview`, `O_offer`); Phase 1 implements `O_offer` only. |
| `O_offer` | `{0,1}` (as label) / `[0,1]` (as score) | Phase-1 `O` instantiation, operationalized as the synthetic observed event `OFFER_EXTENDED`. |

**Dual-purpose field rule:** where a real-world attribute has both a hard and soft sense, it is represented as two explicitly separate fields — one feeding `E`, one feeding `F` — never one field serving both (§6.1). This is a P0 leakage-prevention rule.

## 2. Feature Contracts

### `O` feature contract (locked)
- **Allowed:** primitives only — raw skill-overlap count, categorical degree/track match, raw location distance, categorical sector match.
- **Forbidden:** `F`'s derived score; declared preference rank; any allocation-produced or allocation-internal state.

### Label-generator feature contract (locked, for `OFFER_EXTENDED`)
- **Allowed:** pre-allocation candidate attributes (skills, degree/track, location, availability, declared preference rank), pre-allocation opportunity attributes (role requirements, capacity, sector, location), pre-allocation market/regime state.
- **Forbidden:** allocation result, assigned/rejected candidate status, proposal count or round number inside DA, final `Priority`/rank, post-allocation capacity remainders, human override outcome.

The **preference-rank asymmetry** is by design: the synthetic generator sees a candidate's declared preference rank (for market-behavior realism); `O` itself never does (§6.3, §9).

## 3. Synthetic Generator

- `CYCLE` advances on the generator's own internal clock, not wall-clock time.
- Candidates/opportunities are synthetic, versioned (`generator_version`, `dataset_version`).
- At least 3 latent regimes plus a noise/label-corruption term, so the model cannot trivially re-derive the generator's own formula from a single fixed relationship. This is **not a guarantee** the model can never learn the underlying relationship — the generator and `O` deliberately share several primitive inputs; the multi-regime design reduces trivial-recovery risk and provides a more demanding synthetic-validity test.
- `random_seed` recorded per snapshot; deterministic replay from a given seed + version set.

## 4. Label-Generation Contract

`OFFER_EXTENDED` is generated per the Cycle-T pipeline (§8), for the full eligible-pair universe, independently of allocation. **Forbidden inputs to the label generator:** the allocation result, proposal counts/round numbers inside DA, final `Priority(c,i)` values or ranks, post-allocation capacity remainders, or any human override outcome — enforced by the label-generator feature contract and checked by the leakage-check activation-gate condition.

## 5. Temporal Partitioning (Locked)

```
Given: current cycle T, all complete prior cycles 1..T−1

TEST        = cycle T                                        (always exactly this cycle)
VALIDATION  = smallest trailing block of complete cycles
              ending immediately at T−1
              that independently satisfies MIN_O_EVENTS_PER_PARTITION
CALIBRATION = smallest trailing block of complete cycles
              ending immediately before VALIDATION's earliest cycle
              that independently satisfies MIN_O_EVENTS_PER_PARTITION
TRAIN       = all remaining complete cycles strictly before
              CALIBRATION's earliest cycle
```

Every cycle belongs to exactly one partition. No cycle is split. No event crosses a partition boundary. **Cycle-T rule:** Cycle T's own `OFFER_EXTENDED` labels are never used to score or activate for Cycle T — reserved exclusively for future-cycle training.

## 6. Canonical Constants (must match exactly across every document)

```
α (Priority weight, default)          = 0.6
MIN_O_EVENTS_PER_PARTITION            = 30    (= 15 positive + 15 negative)
MIN_O_MODEL_SELECTION_EVENTS          = 90    (= 3 × MIN_O_EVENTS_PER_PARTITION; derived reporting figure, NOT a separate gate)
MIN_PRACTICAL_IMPROVEMENT             = 0.01
Sensitivity-sweep values (total / per partition) = 90/30, 135/45, 180/60
```

`MIN_O_MODEL_SELECTION_EVENTS` is a derived selection-history reporting figure — the real per-partition bar is `MIN_O_EVENTS_PER_PARTITION`, applied independently to each of TRAIN, CALIBRATION, VALIDATION.

## 7. Activation Gate (`MODEL_ACTIVATION`) — all five required, decided on VALIDATION only

1. **Event-count gate** — each of TRAIN/CALIBRATION/VALIDATION independently ≥ `MIN_O_EVENTS_PER_PARTITION`.
2. **Label-balance-aware gate** — ≥15 positive and ≥15 negative *per partition*, not a total-count check.
3. **Practical-significance gate** — Brier-score improvement over the heuristic baseline, evaluated on VALIDATION, must exceed `MIN_PRACTICAL_IMPROVEMENT = 0.01`.
4. **Leakage check** — features audited against both feature contracts (§2).
5. **Multi-seed instability reporting** — results reported across multiple random seeds.

**VALIDATION is the activation gate. TEST (Cycle T) never activates the model** — Cycle T uses the already-frozen configuration purely to score and allocate.

## 8. Fallback

Any failed gate condition, or an unavailable/invalid model → `HEURISTIC_FALLBACK` for that run. Fallback never blocks or invalidates a run. Every run logs `outcome_signal_source: ML | HEURISTIC_FALLBACK`. If no feasible disjoint partitioning exists (including TRAIN falling below its own minimum), `HEURISTIC_FALLBACK` applies for that cycle.

## 9. Calibration Metrics

Brier score, log loss, calibration curve — computed for **every** model version (not only activated ones), retained as part of the frozen `validation_evidence` record.

## 10. Evaluation Hierarchy

- **Primary (gating):** VALIDATION-partition evaluation — the sole gate for `MODEL_ACTIVATION`.
- **Secondary — diagnostic/future, non-gating:** unseen-student generalization. Phase-1 sketch: hold out a subset of candidates whose historical interaction data is excluded entirely from TRAIN/CALIBRATION/VALIDATION (not merely their Cycle-T pairs), score with the frozen model, report separately. Does not gate activation; full protocol not yet defined.
- **Diagnostic experiments (neither gates activation):**
  - *Synthetic Recovery* — train/test within known regimes; confirms the model can learn the designed relationship at all.
  - *Synthetic Regime Generalization* — train across a subset of regimes, hold out one entirely; informs cross-regime robustness confidence.

**Explicitly not evaluated in Phase 1 (named Phase 2):** unseen-opportunity, unseen-company — dataset scale cannot credibly support company-level holdout evaluation at prototype scale.

## 11. Mandatory Ablation

`F only → F + heuristic O → F + ML O`, reusing the existing 4-tier baseline-comparison infrastructure. Purpose: measure `O`'s actual incremental contribution over `F` alone — without this, "the ML model" risks being a redundant re-encoding of the existing fit score.

## 12. Leakage Prevention (summary — see ANCHOR_TEST_PLAN.md for test-level detail)

- Cycle-T labels never influence Cycle-T scoring/activation.
- Label generator never consumes allocation-produced/internal state.
- `O` never consumes `F`'s derived score or preference rank.
- Dual-purpose-field rule (§1) never violated between `E` and `F`.

## 13. Unseen-Student Diagnostic (Phase-1 Sketch, Non-Gating)

See §10 — diagnostic only, not part of the activation gate, full protocol pending definition. Do not present this as a completed evaluation.

## 14. Phase-2 Evaluation Boundaries

`O_shortlist`/`O_interview` as additional targets (each requiring its own target definition — no assumed transfer from `O_offer`); unseen-opportunity/unseen-company generalization at larger dataset scale; full unseen-student evaluation protocol beyond the diagnostic sketch above.

## 15. Public/Demo Terminology

Displayed as **"Opportunity-side selection signal."** "Offer likelihood" is internal/technical naming only — never framed as predicting real employer decisions, per the non-claims in ANCHOR_STATE_MACHINES.md / Master Part 25.

## 16. Synthetic Validity vs. Deployment Validity (kept permanently separate)

- **Synthetic Validity Test:** does the model recover the designed synthetic relationship? This is what is measured and demonstrated.
- **Deployment-Validity Claim:** does this predict real-world employer behavior? **Explicitly NOT ASSESSED** — no real data exists to assess it; no such claim is made anywhere in documentation, demo, or pitch material.
