# ANCHOR — MASTER DESIGN DOCUMENT
### SIH26044 — Canonical Product, System, Data, AI & Engineering Specification

This document is the single source of truth for Anchor's Main SIH flagship, the Intelligent Allocation Engine. It is derived entirely from the V13 reviewed baseline. Historical review rounds, superseded wording, and closed findings are not reproduced here — where V13 contains historical explanation, this document states only the final decision. Where V13 explicitly marks something as future work, diagnostic, non-gating, operational configuration, needing sign-off, or out of scope, that status is preserved exactly, not silently upgraded.

Items in this document that are *derived engineering structure* rather than explicit V13 decisions (API paths, job names, table layouts, role sub-decomposition, ADR alternatives) are marked **[Derived]** the first time they appear in each Part, so implementers can tell "locked by design review" apart from "reasonable structure inferred to satisfy the design's requirements."

---

# PART 1 — EXECUTIVE SYSTEM DEFINITION

**Anchor** is a two-sided academia–industry platform. Its Main SIH flagship is the **Intelligent Allocation Engine**: a candidate-proposing Deferred Acceptance (DA) matching system over structurally separated hard-eligibility, soft-fit, and opportunity-side selection signals, governed by human review and backed by immutable, privacy-separated allocation snapshots.

**Problem:** fragmented, low-fidelity academia–industry signals; unverified/unstructured skill evidence; matching that is either unscalably manual or naively automated with no real mechanism guarantees; no structured feedback loop from outcomes back into future matching.

**Goals (Phase 1 / Main SIH Round):**
- A working, explainable, mechanism-grounded allocation engine over synthetic data.
- Structural separation of eligibility, fit, and a learned opportunity-side signal.
- A temporally honest evaluation protocol for the learned signal, with deterministic fallback.
- Full human governance and auditability over the allocation lifecycle.
- A privacy architecture that separates identity from computational state by construction.

**Non-goals (Phase 1):**
- No real applicant or company data.
- No deployment-validity claim for the opportunity-side signal.
- No unseen-opportunity / unseen-company generalization evaluation.
- No `O_shortlist` / `O_interview` implementation — `O_offer` only.
- No claim that recovery or overridden results carry DA's full stability guarantee.

**College vs Main SIH architecture — `RETIRED — OUT OF ACTIVE SCOPE` (see DECISIONS.md D-012):** College Round was a simpler, standalone one-sided ranking system; it was never executed and is retired from active scope. Main SIH Round is the full two-sided DA system described here, and is now the sole active project direction. Neither implicitly contains the other's mechanisms.

**Core principles:** AI predicts; matching decides; constraints protect; humans govern. Hard/soft/learned scoring are three distinct kinds of judgment, never blurred into one number. Every claim about the learned signal is scoped honestly — synthetic validity is demonstrated; deployment validity is not assessed.

**Product loop:** evidence → skills → matching → application → allocation → outcome → feedback → improved ecosystem intelligence.

**Flagship capabilities:** E/F/O structural separation; candidate-proposing DA with a precise stability claim; cycle-aligned temporal ML evaluation with an explicit activation gate and heuristic fallback; human-governed allocation state machine with override and audit; immutable, privacy-separated allocation snapshots; recovery over transitive-closure-affected candidates only.

**Prototype boundary:** synthetic data only; `O_offer` is the sole Phase-1 opportunity-side target; recovery and overrides are explicitly weaker than full DA stability; tie-breaking is explicitly not a fairness mechanism.

**Deployment vision (Phase 2, deferred):** `O_shortlist`/`O_interview` as additional targets; unseen-opportunity/unseen-company evaluation at larger scale; `CONTACT_SHARED` as a later-stage visibility milestone; real-world data once available, with the deployment-validity question then, and only then, in scope.

**Architecture-at-a-glance [Derived]:**

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
PostgreSQL + pgvector (relational store; Skill Graph as relational adjacency tables — no separate graph DB)
```

---

# PART 2 — CANONICAL TERMINOLOGY & DEFINITIONS

| Term | Definition |
|---|---|
| **Anchor** | The overall academia–industry platform; this document covers only its Main SIH flagship. |
| **Student** | An individual whose profile, evidence, and preferences drive candidacy in the allocation engine. |
| **Institution** | An academic organization account; activates via `PENDING → Admin approval → ACTIVATED`; can verify student evidence. |
| **Faculty** *[Derived sub-role]* | An individual acting under an activated Institution account with evidence-verification and profile-oversight permissions for that institution's students. |
| **Placement Cell** *[Derived sub-role]* | An individual acting under an activated Institution account with opportunity-visibility and allocation-oversight permissions at the institutional level. |
| **Company** | An employer organization account; activates via `PENDING → Admin approval → ACTIVATED`; posts opportunities. |
| **Recruiter** *[Derived sub-role]* | An individual acting under an activated Company account, creating/managing opportunities and viewing shared candidate evidence. |
| **Mentor** *[Derived, not specified in V13 — minimal-scope default, Configurable]* | An optional, lightly-scoped role with read access to assigned candidates' evidence and progress; no allocation write access. |
| **Administrator / Ministry** | The single pre-seeded Admin role (env-config seeded, hashed, idempotent); approves Institution/Company activation; can trigger admin-level recovery escalation. |
| **Candidate** | A Student in the context of one specific eligible-pair evaluation, `(c, i)`. |
| **Opportunity** | An internship/placement role posted by a Company, `i`. |
| **Application** | A Candidate's expressed interest in / eligibility for a specific Opportunity, underlying `APPLICATION_SHARED` visibility scope. |
| **CYCLE** | One complete application → allocation → offer/outcome-generation period, advanced by the synthetic generator's own internal clock — not wall-clock time. |
| **E(c,i)** | Hard eligibility, `∈ {0,1}` — exclusive binary gate; only `E=1` pairs enter matching. |
| **F(c,i)** | Soft fit, `∈ [0,1]` — post-eligibility graded compatibility score. |
| **O(c,i)** | Opportunity-side selection signal, `∈ [0,1]` — a family (`O_shortlist`, `O_interview`, `O_offer`); Phase 1 implements `O_offer` only. |
| **O_offer** | Phase-1 `O` instantiation, operationalized as the synthetic observed event `OFFER_EXTENDED ∈ {0,1}`. |
| **O_shortlist / O_interview** | Future `O` family members, not implemented in Phase 1 — no assumption that findings transfer from `O_offer`. |
| **Priority(c,i)** | `α·F(c,i) + (1−α)·O(c,i)`, default `α = 0.6`, recorded per run as part of that run's policy version. |
| **Allocation run** | One execution of the DA mechanism for a given cycle, from frozen scoring through to a proposed allocation. |
| **Allocation generation** | An identifier grouping an allocation run together with any recovery runs that follow from it. |
| **Allocation snapshot** | The immutable record (`AllocationSnapshot`) of everything a given allocation run saw and decided. |
| **Recovery run** | A re-execution of DA over the transitive closure of candidates/opportunities affected by a dropout/vacancy, within an allocation generation. |
| **verification_tier** | The evidence-trust label (not "verified_flag"); precisely scoped to "verified by institution account," never implying a stronger guarantee. |
| **Profile visibility states** | `PRIVATE` (real-user default), `DISCOVERABLE` (demo-seed default only), `APPLICATION_SHARED` (scoped to one `application_id`), `CONTACT_SHARED` (later-stage milestone, narrower than `APPLICATION_SHARED`). |
| **Model version** | Identifier for a trained `O` model artifact. |
| **Calibration version** | Identifier for the calibration artifact paired with a model version. |
| **Dataset version** | Identifier for the synthetic dataset generation run. |
| **Generator version** | Identifier for the synthetic data generator's own version. |
| **Heuristic fallback** | The deterministic heuristic proxy used for `O` whenever the ML activation gate isn't cleared; logged as `outcome_signal_source: HEURISTIC_FALLBACK`. |
| **Validation evidence** | The frozen record of what justified an activation decision: VALIDATION-partition event counts, Brier-score improvement, threshold value in force, leakage-check result, multi-seed results. |
| **Tiebreak key** | `tiebreak_key` — persistent, deterministic, seeded-RNG-generated once per candidate at registration, reused across every run including recovery; not a fairness mechanism. |

No term above has a competing definition elsewhere in this document.

---

# PART 3 — USER ROLES & RESPONSIBILITIES

| Role | Purpose | Reads | Writes | Approval needed | Verification capability | Restricted from | Audit |
|---|---|---|---|---|---|---|---|
| **Student** | Build profile/evidence, submit preferences | Own profile, eligible opportunities, own allocation status | Own profile, evidence, preference list | Account creation is self-service (no trusted-role gate) | None | Cannot see other students' evidence beyond granted visibility; cannot edit `E`/`F`/`O`/priority | Own profile edits, application submissions |
| **Institution** | Represent an academic org; verify evidence | Own students' profiles/evidence, own opportunities-of-interest views | Verification status on own students' evidence | `PENDING → Admin approval → ACTIVATED` | Can set `verification_tier` on own students' evidence | Cannot verify students outside itself; no allocation override | Verification actions, activation status |
| **Faculty** *(Institution sub-role)* | Day-to-day evidence verification | Assigned students' evidence | Verification actions | Institution must be `ACTIVATED` | Evidence verification | No account-activation rights | Verification actions |
| **Placement Cell** *(Institution sub-role)* | Institutional oversight of allocation outcomes | Own institution's allocation outcomes (aggregated, per §Part 17 peer-institution privacy rules) | None on allocation itself | Institution must be `ACTIVATED` | None | Cannot override allocations | View events |
| **Company** | Post opportunities, view shared candidate evidence | Own opportunities, evidence shared via `APPLICATION_SHARED`/`CONTACT_SHARED` | Own opportunity postings | `PENDING → Admin approval → ACTIVATED` | None | Cannot see non-shared student evidence; no allocation override | Opportunity edits, evidence views |
| **Recruiter** *(Company sub-role)* | Manage specific opportunities | Own company's opportunities and shared evidence | Opportunity details | Company must be `ACTIVATED` | None | Same as Company | Opportunity edits |
| **Mentor** *(Configurable, minimal default)* | Advise assigned candidates | Assigned candidates' evidence/progress | None | Explicit assignment by a Student or Institution | None | No allocation visibility beyond assigned candidates | Evidence views |
| **Administrator / Ministry** | Platform governance | Everything, cross-tenant | Institution/Company activation decisions, allocation overrides, recovery escalation | Self (single pre-seeded bootstrap account) | Full | N/A | All actions, especially cross-tenant access |

All roles operate under the cross-cutting `AuthN → RBAC → object/tenant-authorization → action-authorization → audit` contract (Part 13) — none of the above table is a substitute for that enforcement layer; it describes intent, the middleware enforces it.

---

# PART 4 — END-TO-END PRODUCT FLOW

**Main SIH Round:**

```
registration/onboarding (Student self-service; Institution/Company via PENDING→Admin approval→ACTIVATED)
   → profile/evidence creation (Student; capped at 5 evidence items per skill claim)
   → verification (Institution Faculty; SELF_REPORTED → verification_tier; reverts on post-verification edit)
   → opportunity creation (Company Recruiter)
   → eligibility computation, E(c,i) (system, per cycle)
   → fit computation, F(c,i) (system, post-eligibility only)
   → preference submission (Student; declared list, never system-modified)
   → opportunity-side scoring, O(c,i) (frozen model or HEURISTIC_FALLBACK, per activation gate)
   → allocation preparation (Priority(c,i) computed; freeze-at-run-start invariant engages)
   → DA execution (candidate-proposing Deferred Acceptance)
   → human review (DRAFT→PROPOSED→UNDER_REVIEW)
   → publication (APPROVED→PUBLISHED, or OVERRIDDEN→VALIDATED→PUBLISHED)
   → acceptance/rejection (PUBLISHED→ACCEPTED / REJECTED-VACATED)
   → dropout/recovery (transitive-closure rerun, batched, queue-invariant-respecting)
   → outcome generation (OFFER_EXTENDED generated independently, post-allocation, full eligible-pair universe)
   → analytics (peer-institution aggregates, min sample 10)
   → ecosystem feedback (Cycle T outcomes become eligible TRAIN/CALIBRATION data starting Cycle T+1)
```

**College Round** `RETIRED — OUT OF ACTIVE SCOPE` (see DECISIONS.md D-012) — previously conceived as a simpler, standalone one-sided ranking flow, not covered by this document. No implementation exists or is planned against it; the flow above is the sole active workflow.

---

# PART 5 — FUNCTIONAL REQUIREMENTS

*[Derived — IDs and precise phrasing are implementation-level structure; every requirement traces to a V13-locked rule.]*

| ID | Requirement | Rationale | Actor | Priority |
|---|---|---|---|---|
| FR-001 | System computes `E(c,i) ∈ {0,1}` from mandatory criteria only (degree/track, availability, mandatory certification, quota-category where applicable); a field feeding `E` never also feeds `F`. | E/F separation is structural, not incidental (§3). | System | P0 |
| FR-002 | System computes `F(c,i) ∈ [0,1]` only for pairs where `E(c,i)=1`, from post-eligibility graded factors only. | Same. | System | P0 |
| FR-003 | System excludes declared preference rank from `O`'s feature set entirely. | Tested-and-removed exclusion; ablation-justified (§4). | System | P0 |
| FR-004 | Synthetic label generator for `OFFER_EXTENDED` consumes only pre-allocation-time state (candidate/opportunity attributes, market/regime state, including preference rank) — never allocation-produced or allocation-internal state. | Label-generator feature contract (§4). | System | P0 |
| FR-005 | For Cycle T, `O`'s activation status/config is decided using only the VALIDATION partition and is frozen, evidence included, before Cycle T's scoring begins. | Temporal model-selection contract (§4/§6). | System | P0 |
| FR-006 | TRAIN, CALIBRATION, VALIDATION are cycle-aligned, chronologically disjoint blocks; no cycle is split across a boundary; each independently satisfies `MIN_O_EVENTS_PER_PARTITION = 30` (≥15 positive, ≥15 negative). | Partition-disjointness fix, constant-split fix (§4/§6). | System | P0 |
| FR-007 | If no feasible disjoint partitioning exists (including the case where TRAIN would fall below its own minimum), system uses `HEURISTIC_FALLBACK` for that cycle. | Cold-start/infeasibility rule (§4/§6). | System | P0 |
| FR-008 | `MODEL_ACTIVATION` requires: event-count gate, per-partition class-balance gate, Brier improvement over heuristic baseline > `MIN_PRACTICAL_IMPROVEMENT = 0.01` (evaluated on VALIDATION only), leakage check, multi-seed reporting — all required, decided on VALIDATION, never TEST. | Activation gate (§6). | System | P0 |
| FR-009 | Cycle T's own `OFFER_EXTENDED` labels are generated for the full eligible-pair universe, independently of allocation, and are reserved exclusively for future-cycle training — never used to score or activate for Cycle T itself. | Anti-selection-bias + no-leakage requirement (§4). | System | P0 |
| FR-010 | `Priority(c,i) = α·F(c,i) + (1−α)·O(c,i)`, default `α=0.6`, recorded per run as part of that run's policy version. | Priority formula (§3). | System | P0 |
| FR-011 | Once an allocation run enters execution, `E`, `F`, `O`, `Priority`, capacities, preferences, tiebreak values, and version references are immutable for that run's duration. | Freeze-at-run-start invariant (§2). | System | P0 |
| FR-012 | DA runs candidate-proposing; system never inserts, reorders, or auto-completes a declared preference list; empty/incomplete lists are valid, may result in `UNMATCHED`. | DA mechanism definition (§2). | System | P0 |
| FR-013 | An overridden assignment stores the original proposed assignment, override decision, reason, acting admin, and validation result as distinct linked records; never inherits the DA stability label. | Human governance (§10). | Admin | P0 |
| FR-014 | On dropout/vacancy, recovery reruns DA only over the transitive closure of affected candidates/opportunities, using frozen rankings and unaltered preferences; at most one `ACTIVE` recovery-queue entry per candidate per `allocation_generation`. | Recovery mechanism (§13). | System | P0 |
| FR-015 | `AllocationSnapshot` is immutable once written (`snapshot_blob` + `snapshot_hash` both required); `subject_identity_mapping` is a separate mutable table; deletion/pseudonymization requests act only on the mapping table. | Snapshot/identity separation (§9). | System | P0 |
| FR-016 | A `PROPOSED` run goes stale/`INVALIDATED` if any enumerated trigger (algorithm/config, opportunity lifecycle, evidence, user/account-state change) occurs before publication. | Invalidation rule (§9). | System | P1 |
| FR-017 | Institution and Company accounts activate only via `PENDING → Admin approval → ACTIVATED`; no self-service path to either. | Trust/authorization (§11). | Admin | P0 |
| FR-018 | Editing verified evidence reverts it to `SELF_REPORTED` until re-verified; reactivated institutions' prior verifications stay `STALE` until explicit re-review. | Verification integrity (§11). | System | P0 |
| FR-019 | Real-user profile visibility defaults to `PRIVATE`; `DISCOVERABLE`-by-default applies only to the seeded demo dataset. | Visibility defaults (§12). | System | P0 |
| FR-020 | `tiebreak_key` generated once per candidate at registration from seeded RNG, reused across every run including recovery; never learned from candidate characteristics; never described as a fairness mechanism. | Tie-breaking (§14). | System | P0 |
| FR-021 | Evidence capped at `N=5` items per skill claim; weights `1.0×` self-reported / `2.0×` institution-verified, labeled an unvalidated policy parameter. | Evidence weighting (§15). | System | P1 |
| FR-022 | Peer-institution comparison data requires minimum sample size 10 before any aggregate is shown; aggregated-only, visible only to institution/admin roles. | Peer-institution privacy (§15). | System | P1 |
| FR-023 | UI never labels model output "confidence"; displays a coarse, explicitly-labeled priority tier instead. | UI display rule (§6). | System | P1 |
| FR-024 | Cross-tenant access attempts are logged and UI-visible in the audit trail. | Authorization architecture (§11). | System | P0 |

---

# PART 6 — ALLOCATION ENGINE SPECIFICATION

### 6.1 Eligibility
`E(c,i) ∈ {0,1}` — exclusive binary gate; only `E=1` pairs enter the matching graph. Covers mandatory conditions only: degree/track requirement, availability, mandatory certification, quota-category tag where applicable. `E` never feeds `F`. **Dual-purpose field rule:** where a real-world attribute has both a hard and soft sense, it is represented as two explicitly separate fields — one feeding `E`, one feeding `F` — never one field serving both.

### 6.2 Fit
`F(c,i) ∈ [0,1]` — post-eligibility graded factors only: skill/semantic overlap, location/sector compatibility as a graded signal, combined per the locked `compute_fit` weighting scheme (weighted geometric mean of skill_overlap / location_match / sector_match; skill capped at 1.0, location/sector scored 1.0 match / 0.7 partial-credit mismatch — see DECISIONS.md D-005, ALLOCATION_ENGINE.md §14.2). *(Resolution note, D-013: this sub-section previously read "weighted sub-factors per the College-tier soft-factor weighting scheme" — a phrase with no supporting definition anywhere in this document set and no relationship to any institution/candidate "tier" concept, which does not exist. It has been corrected to cite the actual locked formula rather than left as an unresolved reference, since D-005 already defines precisely the three sub-factors this sentence describes.)* `F` never encodes a hard pass/fail condition. Evidence weighting (self-reported `1.0×` / institution-verified `2.0×`) feeds into the skill/semantic-overlap component. `F` is computed independently of, and never a function of, `E`'s pass/fail outcome beyond the fact that `F` is only computed at all for `E=1` pairs.

### 6.3 Opportunity Signal
`O` is a family: `O_shortlist`, `O_interview`, `O_offer` — genuinely different targets, never treated as interchangeable. Phase 1 locks to `O_offer`, operationalized as `OFFER_EXTENDED ∈ {0,1}`, an observed synthetic event.

- **Target:** the frozen `O` model scoring Cycle T is trained only on labels from strictly earlier cycles (TRAIN/CALIBRATION); Cycle T's own label is generated after Cycle T's allocation, independently of it, and reserved for future training only.
- **Features:** primitives only — raw skill-overlap count, categorical degree/track match, raw location distance, categorical sector match. Never `F`'s derived score. Declared preference rank excluded.
- **Excluded features:** `F`'s output; declared preference rank; any allocation-produced or allocation-internal state (for the label generator specifically, see Part 8).
- **Generator contract:** see Part 8 and 9.
- **Timing:** see Part 7's canonical partition logic.
- **Future production interpretation:** a real-world `O_offer` would derive from independently-collected employer-side offer-decision signals, never from allocation outcomes themselves; `O_shortlist`/`O_interview`, if built, require their own separate target definition — no assumed transfer from `O_offer`.
- **Public/demo terminology:** displayed as "Opportunity-side selection signal"; "offer likelihood" is internal/technical naming only; never framed as predicting real employer decisions.

### 6.4 Priority
`Priority(c,i) = α·F(c,i) + (1−α)·O(c,i)`, default `α = 0.6`. Stored per allocation run as part of that run's policy version (never hardcoded invisibly). **Versioning:** `policy_alpha` is a snapshot field (Part 12). **Deterministic behavior:** given the same frozen inputs, `Priority` recomputation is deterministic. **When ML `O` is unavailable:** system falls back to the deterministic heuristic proxy for `O`; every run logs `outcome_signal_source: ML | HEURISTIC_FALLBACK`; fallback never blocks or invalidates a run.

### 6.5 Deferred Acceptance
- **Preference input:** candidate-declared, ranked, never system-modified; empty/incomplete valid.
- **Proposal behavior:** candidate-proposing — candidates propose in preference order to opportunities.
- **Opportunity capacity:** respected exactly; opportunities accept up to capacity, ranked by `Priority`, with rejection of lower-priority proposals as higher-priority ones arrive.
- **Priority comparison:** per §6.4, with tie resolution via `tiebreak_key` (Part 16) when priorities are equal within `1e-9` epsilon.
- **Termination:** standard DA termination — no candidate has an unrejected proposal pending and no opportunity has an open, unfilled proposal to consider.
- **Unmatched state:** a valid terminal state for candidates with exhausted or empty preference lists.
- **Stability claim:** candidate-proposing DA yields the candidate-optimal stable matching among all stable matchings for the exact declared-preference profile, under the configured `Priority` relation and capacity model — a standard result, not a novel claim. Does not automatically extend to recovery runs or overridden results.
- **Mechanism / priority model / system objective — kept separate:** (1) DA's stability guarantee is a mechanism property; (2) how `Priority(c,i)` is computed is a policy choice, not a stability requirement; (3) Anchor's system objective is "reasonable, explainable, non-manipulable allocation," not "maximize total utility" — none of the three is conflated with another in any claim.

### 6.6 Freeze-at-run-start
Once a run enters execution, `E`, `F`, `O`, `Priority(c,i)`, opportunity capacities, preference lists, tiebreak values, and model/configuration version references are immutable for that run's duration. Any change requires a new run — never an in-place mutation of an executing run. Distinct from, and in addition to, the snapshot-invalidation rule for pre-publication changes (Part 15) — this invariant covers the execution window itself.

### 6.7 Recovery
- **Trigger:** dropout or vacancy of a published allocation.
- **Affected set:** transitive closure — vacated opportunity → competing candidates → their current allocations → alternatives → repeat until the affected set stops growing.
- **Batching:** simultaneous dropouts batch into a single recovery operation.
- **Queue states:** at most one `ACTIVE` recovery-queue entry per candidate per `allocation_generation`.
- **allocation_generation / parent_run_id:** recovery runs carry both; prior runs marked `SUPERSEDED` where applicable, making recovery-vs-full-rerun precedence unambiguous.
- **Retries:** carry `retry_count`, escalating to a full admin-triggered market rerun past a defined threshold. *(Threshold numeric value not specified in V13 — Configurable, Part 29.)*
- **Scope of stability claim:** explicitly a **locally stable recovery heuristic** — never a full-market stability guarantee. This must not be described otherwise in any downstream document.

---

# PART 7 — O MODEL TRAINING / CALIBRATION / VALIDATION / TESTING

**Canonical partition logic (locked):**

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

Every cycle belongs to exactly one partition. No cycle is split. No event crosses a partition boundary.

**Constants:**

```
MIN_O_EVENTS_PER_PARTITION   = 30   (= 15 positive + 15 negative)
MIN_O_MODEL_SELECTION_EVENTS = 90   (= 3 × MIN_O_EVENTS_PER_PARTITION)
```

`MIN_O_MODEL_SELECTION_EVENTS` is a derived selection-history reporting figure — **not a separate gate**. The real per-partition bar is `MIN_O_EVENTS_PER_PARTITION`, applied independently to each of TRAIN, CALIBRATION, VALIDATION. Sensitivity-sweep values: **90 / 135 / 180 total**, correspondingly **30 / 45 / 60 per partition**.

**Activation gate (`MODEL_ACTIVATION`) — all required, decided on VALIDATION only:**
1. Event-count gate: each of TRAIN/CALIBRATION/VALIDATION independently ≥ `MIN_O_EVENTS_PER_PARTITION`.
2. Label-balance-aware gate: ≥15 positive and ≥15 negative *per partition*, not a total-count check.
3. Practical-significance gate: Brier-score improvement over the heuristic baseline, evaluated on VALIDATION, must exceed `MIN_PRACTICAL_IMPROVEMENT = 0.01`.
4. Leakage check: features audited against both feature contracts (Part 6.3 for `O`, Part 8/9 for the label generator).
5. Multi-seed instability reporting: results reported across multiple random seeds.

**VALIDATION is the activation gate. TEST never activates the model** — Cycle T uses the already-frozen configuration purely to score and allocate.

**Fallback:** any failed gate condition, or an unavailable/invalid model → `HEURISTIC_FALLBACK` for that run. Fallback never blocks or invalidates a run. Every run logs `outcome_signal_source`.

**Calibration metrics:** Brier score, log loss, calibration curve — computed for every model version, retained as part of the frozen validation-evidence record (Part 9).

---

# PART 8 — CYCLE-T PIPELINE

```
1. O's activation status and configuration were already decided at the VALIDATION step
   and frozen, evidence included (or HEURISTIC_FALLBACK applies).
2. Construct the full eligible-pair universe for Cycle T (every (c,i) with E(c,i)=1).
3. The frozen O scores every pair in the Cycle-T universe.
   No Cycle-T label is involved in producing these scores.
   No Cycle-T outcome played any role in the activation decision.
4. DA allocation executes for Cycle T using these scores.
5. Independently of allocation — respecting the label-generator feature contract (Part 9) —
   OFFER_EXTENDED is generated for the ENTIRE Cycle-T eligible-pair universe
   (not just allocated pairs) and logged for future training use only,
   becoming eligible starting at the next appropriate training cycle.
```

**Forbidden:** the label generator (step 5) may never consume the allocation result (step 4), proposal counts or round number inside DA, final `Priority(c,i)` values or ranks, post-allocation capacity remainders, or any human override outcome. This is enforced by the label-generator feature contract (Part 9), checked by the leakage-check activation-gate condition (Part 7).

---

# PART 9 — SYNTHETIC DATA GENERATOR

- **Cycle generation:** `CYCLE` advances on the generator's own internal clock, not wall-clock time.
- **Candidate / opportunity generation:** synthetic, versioned (`generator_version`, `dataset_version`).
- **Latent regimes:** at least 3, plus a noise/label-corruption term — the model cannot trivially re-derive the generator's own formula from a single fixed relationship, though this is **not a guarantee** that the model cannot learn the generator's underlying relationship at all (the generator and `O` deliberately share several primitive inputs); the multi-regime design reduces trivial-recovery risk and provides a more demanding synthetic validity test.
- **Preference-rank asymmetry:** the generator sees a candidate's declared preference rank (for market-behavior realism); `O` itself does not (Part 6.3). This asymmetry is by design.
- **Outcome generation:** `OFFER_EXTENDED` generated per the Cycle-T pipeline (Part 8), for the full eligible-pair universe.
- **Label-generator feature contract (locked):**
  - *Allowed:* pre-allocation candidate attributes (skills, degree/track, location, availability, declared preference rank), pre-allocation opportunity attributes (role requirements, capacity, sector, location), pre-allocation market/regime state.
  - *Forbidden:* allocation result, assigned/rejected candidate status, proposal count or round number inside DA, final `Priority`/rank, post-allocation capacity remainders, human override outcome.
- **Reproducibility / random seeds:** `random_seed` recorded per snapshot (Part 12); deterministic replay from a given seed + version set.
- **Dataset versioning:** `dataset_version`, `generator_version` recorded per snapshot.

**Synthetic validity vs deployment validity — kept permanently separate:**
- *Synthetic Validity Test:* does the model recover the designed synthetic relationship? This is what is measured and demonstrated (Part 10).
- *Deployment-Validity Claim:* does this predict real-world employer behavior? **Explicitly NOT ASSESSED.** No real data exists to assess it; no such claim is made anywhere in documentation, demo, or pitch material.

---

# PART 10 — EVALUATION & EXPERIMENTATION

**Evaluation hierarchy:**
- **Primary:** the VALIDATION-partition evaluation (Part 7) — the sole gate for `MODEL_ACTIVATION`.
- **Secondary — diagnostic/future, non-gating:** unseen-student generalization. Phase-1 sketch: at a given Cycle T evaluation, hold out a subset of candidates whose historical interaction data is excluded entirely from TRAIN/CALIBRATION/VALIDATION (not merely their Cycle-T pairs), score them with the frozen model, report separately as a diagnostic signal. Does not gate activation; full protocol still to be defined before this experiment is built.
- **Diagnostic experiments (neither gates activation):**
  - *Synthetic Recovery* (train/test within known regimes) — confirms the model can learn the designed relationship at all.
  - *Synthetic Regime Generalization* (train across a subset of regimes, hold out one entirely) — informs confidence in cross-regime robustness.

**Mandatory ablation:** `F only → F + heuristic O → F + ML O`, reusing the existing 4-tier baseline-comparison infrastructure. Purpose: measure `O`'s actual incremental contribution over `F` alone — without this, "the ML model" risks being a redundant re-encoding of the existing fit score.

**Explicitly NOT evaluated in Phase 1 (named Phase 2):** unseen-opportunity, unseen-company. Dataset scale cannot credibly support company-level holdout evaluation at prototype scale.

---

# PART 11 — DATA ARCHITECTURE

*[Derived logical model — entities and fields are implementation structure required to realize the locked rules above; not independently reviewed line-by-line in V13.]*

| Entity | Purpose | Key fields | Immutable fields | Versioned fields | Privacy class | Tenant ownership |
|---|---|---|---|---|---|---|
| `users` | Base account record | id, role, auth credentials | id | — | Direct identity | Platform |
| `students` | Student profile | user_id, profile fields, `tiebreak_key` | `tiebreak_key` | — | Direct identity (linked) | Self |
| `institutions` | Institution account | id, status (`PENDING/ACTIVATED`) | id | — | Org identity | Self |
| `companies` | Company account | id, status (`PENDING/ACTIVATED`) | id | — | Org identity | Self |
| `opportunities` | Posted role | id, company_id, requirements (E/F inputs), capacity | id | requirement-version | Non-sensitive | Company |
| `applications` | Candidate interest in an opportunity | id, candidate_id, opportunity_id | id | — | Pseudonymous (via snapshot) | Student + Company |
| `skills` | Canonical skill graph nodes | id, name, adjacency edges | id | — | Non-sensitive | Platform |
| `skill_claims` | Student's claimed skill | id, student_id, skill_id | id | — | Pseudonymous | Student |
| `evidence` | Supporting evidence for a skill claim | id, skill_claim_id, content, status (cap 5/claim) | id | verification-version | Pseudonymous | Student |
| `verification` | Institution attestation event | id, evidence_id, verifier (Faculty), `verification_tier` | id | — | Pseudonymous | Institution |
| `preferences` | Candidate's declared ranked list | id, candidate_id, ranked opportunity list | id (per submission) | — | Pseudonymous (via snapshot) | Student |
| `allocation_runs` | One DA execution | id, cycle, `allocation_generation`, status | scores/capacities during execution (freeze invariant) | policy/model versions | Pseudonymous | Platform |
| `allocation_generations` | Groups a run + its recoveries | id, root_run_id | id | — | Pseudonymous | Platform |
| `allocations` | A candidate–opportunity match | id, run_id, candidate_id, opportunity_id, state | — | — | Pseudonymous | Platform |
| `recovery_queue` | Pending recovery entries | id, candidate_id, allocation_generation, status, `retry_count`, `parent_run_id` | — | — | Pseudonymous | Platform |
| `model_versions` | Trained `O` model artifacts | id, model_hash, feature_contract_ref | id, hash | self | Non-sensitive | Platform |
| `calibration_artifacts` | Calibration output per model version | id, model_version_id, Brier/log-loss/curve | id | self | Non-sensitive | Platform |
| `validation_evidence` | Frozen activation-decision record | id, model_version_id, VALIDATION cycle range, event counts, Brier improvement, threshold, leakage result, seed results | all fields once written | self | Non-sensitive | Platform |
| `allocation_snapshots` | Immutable per-run computational record | id, run_id, `candidate_subject_token`, snapshot_blob, snapshot_hash, versions, tiebreak values, `policy_alpha`, `random_seed` | entire record | self | Pseudonymous/potentially linkable (Part 12) | Platform |
| `subject_identity_mapping` | Token → real identity | candidate_subject_token, student_id | — | — | Direct identity | Platform (highly restricted) |
| `audits` | Action/access log | id, actor, action, object, tenant, timestamp | id (append-only) | — | Mixed | Platform |
| `outcomes` | Generated `OFFER_EXTENDED` events | id, cycle, candidate_id, opportunity_id, label, eligible for training as-of | id | — | Pseudonymous | Platform |
| `institutional_analytics` | Peer-institution aggregates | id, institution_id, metric, sample_size (≥10 to display) | — | — | Aggregated only | Institution + Admin |

---

# PART 12 — SNAPSHOT & REPRODUCIBILITY ARCHITECTURE

`AllocationSnapshot` (immutable): `candidate_subject_token` (opaque, never directly identifying) plus pseudonymous and potentially linkable computational data — opportunity_state, preferences, eligibility_results, capacities, scores, `model_hash`, all relevant version fields (algorithm_version, calibration_version, dataset_version, generator_version), actual tiebreak values used, `policy_alpha`, `random_seed`. Both `snapshot_blob` and `snapshot_hash` are required (not either/or). Once written, the artifact and its hash are never modified.

`subject_identity_mapping` (mutable, separate table): holds `candidate_subject_token → real identity`, outside the hashed snapshot artifact.

- **Immutability / hash semantics:** `snapshot_hash` is computed over `snapshot_blob` at write time and never recomputed or altered; any downstream verification re-derives the hash from the stored blob to confirm no tampering.
- **Pseudonymous/linkable nature:** the design does not claim the snapshot is mathematically non-identifying. It claims specifically: (1) direct identity is excluded from the snapshot; (2) re-identification requires access to the separate, access-controlled `subject_identity_mapping` table; (3) snapshot access is itself authorization-controlled (Part 13); (4) only allocation-required attributes are retained. This is the stated privacy scope for the synthetic prototype — not a stronger anonymity guarantee.
- **Access control:** `subject_identity_mapping` access is restricted beyond general snapshot access — treat as a distinct, higher-sensitivity authorization tier under Part 13's action-authorization layer.
- **Deletion/pseudonymization:** acts only on `subject_identity_mapping`. `AllocationSnapshot` itself is never touched — its immutability/reproducibility guarantee is never broken by a privacy request.
- **Reproducibility:** given a snapshot's recorded versions and `random_seed`, the allocation run it describes is deterministically replayable.
- **Invalidation triggers (a `PROPOSED` run goes stale/`INVALIDATED` before publication if any occur):**
  - Algorithm/config: `policy_alpha`, model/calibration version, tiebreak epsilon, capacity-computation formula changes.
  - Opportunity lifecycle: withdrawal/closure, capacity change, eligibility-requirement change, material detail edit.
  - Evidence: added/edited/removed post-snapshot; verification status change (e.g., revocation reverting to `SELF_REPORTED`); degree/track correction.
  - User/account-state: preference-list edit; application withdrawal/opt-out; account deactivation or reactivation (subject to `STALE`-until-re-review, Part 13).

---

# PART 13 — SECURITY / AUTHORIZATION / TRUST

**Contract:** `AuthN → RBAC → object/tenant-authorization → action-authorization → audit`, applied as cross-cutting middleware to **every** endpoint uniformly — never an ad hoc "filter by ownership" rule on list queries only.

- **Authentication:** JWT/OAuth2.
- **Role authorization (RBAC):** per Part 3's role table.
- **Tenant isolation:** Institution/Company/Student data scoped to owning tenant by default.
- **Object ownership:** action must target an object the actor is authorized against, not merely a role check.
- **Action authorization:** distinct from object authorization — an actor may read an object but not perform a given action on it (e.g., a Recruiter reads shared evidence but cannot verify it).
- **Cross-tenant rejection:** attempts are rejected, logged, and UI-visible in the audit trail (Part 22).
- **Audit logging:** every authorization decision-relevant event logged with actor, action, object, tenant, timestamp.

**Institution / Company activation:** both `PENDING → Admin approval → ACTIVATED`. No self-service path to a trusted role for either.

**Verification downgrade:** editing verified evidence reverts it to `SELF_REPORTED` until re-verified.

**Institution reactivation:** after deactivation and later reactivation, prior verification validity is not auto-restored — stays `STALE` until explicit re-review.

**Admin bootstrap:** single pre-seeded Admin account (env-config seeded, hashed, idempotent seeding). No public, self-service Admin role selectable at registration, anywhere. *(Mechanism for provisioning additional admins beyond the seed account is not specified in V13 — Deferred/Configurable, Part 29.)*

---

# PART 14 — PRIVACY & VISIBILITY

**States:** `PRIVATE`, `DISCOVERABLE`, `APPLICATION_SHARED`, `CONTACT_SHARED` (later milestone).

- **Real-user default:** `PRIVATE`, explicit opt-in required to become `DISCOVERABLE`.
- **`DISCOVERABLE`-by-default:** seeded demo dataset only, never real onboarding.
- **`APPLICATION_SHARED` scope:** locked to a specific `application_id` — not student+company or student+company+role. Withdrawing one application does not affect visibility granted via a different application to the same company.
- **`CONTACT_SHARED`:** a separate, later-stage milestone grant, narrower than `APPLICATION_SHARED`, required before full evidence/contact details are shared.

**Visibility-level access matrix:**

| State | Who can see profile | What's visible |
|---|---|---|
| `PRIVATE` | Self, Institution (own students), Admin | Full profile, not discoverable by Companies |
| `DISCOVERABLE` (demo only) | + any Company browsing | Profile summary, not full contact/evidence |
| `APPLICATION_SHARED` | + the specific Company on that `application_id` | Evidence relevant to that application |
| `CONTACT_SHARED` | + that Company | Full contact details |

---

# PART 15 — HUMAN GOVERNANCE

**Allocation state machine:**

```
DRAFT → PROPOSED → UNDER_REVIEW → APPROVED → PUBLISHED
                                 → OVERRIDDEN → VALIDATED → PUBLISHED
                                 → INVALIDATED → (new run)
PUBLISHED → ACCEPTED
          → REJECTED/VACATED → RECOVERY RUN
```

An overridden assignment is a human-modified outcome: the original proposed assignment, the override decision, its reason, the acting admin, and the validation result are stored as distinct, linked records. An override never inherits the DA stability label. `INVALIDATED` runs (Part 12's trigger list) require a new run — never in-place repair.

---

# PART 16 — TIE-BREAKING

- **Deterministic tiebreak key:** persistent, generated once per candidate at registration from a seeded RNG.
- **Persistence/reuse:** reused across every run including recovery.
- **Not a protected attribute; never learned from candidate characteristics.**
- **Opportunity-side ties:** handled symmetrically, same tiebreak discipline.
- **Epsilon:** `1e-9` — a prototype engineering tolerance chosen for this application, not IEEE machine epsilon, not claimed as such.
- **Explicit statement (must propagate to all documentation):** tie-breaking is **not a fairness mechanism** — it resolves ties, it does not correct for or claim to address distributional fairness.

---

# PART 17 — EVIDENCE MODEL

- **Cap:** `N=5` pieces of evidence per skill claim (anti-gaming).
- **Weights:** `1.0×` self-reported, `2.0×` institution-verified — explicitly an **unvalidated policy parameter**, not empirically derived.
- **Status semantics:** `SELF_REPORTED` ↔ institution-verified via `verification_tier`.
- **Verification integrity:** editing verified evidence reverts to `SELF_REPORTED` until re-verified.
- **Re-verification:** required after any post-verification edit.
- **Materiality/sensitivity rule (draft, needs calibration — preserved as such):** a change to evidence weights is material — and requires re-justification before adoption — if, in a backtest against the most recently completed cycle, it changes the relative `Priority(c,i)` ranking order for **5% or more** of eligible candidate-opportunity pairs, or changes the matched/unmatched outcome for any candidate. The 5% figure is a placeholder default pending real backtest calibration.
- **Peer-institution aggregation privacy:** minimum sample size 10 before any aggregate is shown; aggregated-only, no individual-student-level disclosure across institutions; visible only to institution and admin roles.

---

# PART 18 — APIs

*[Derived — endpoint inventory is implementation structure covering Phase-1 scope only; not individually reviewed in V13.]*

| Method | Path | Actor | Authz rule | Side effects | Audit event | Idempotency |
|---|---|---|---|---|---|---|
| POST | `/auth/register` | Student (self-service); Institution/Company (creates `PENDING`) | Public, rate-limited | Creates account | account_created | Yes (email uniqueness) |
| POST | `/admin/institutions/{id}/activate` | Admin | Admin-only | `PENDING→ACTIVATED` | institution_activated | Yes |
| POST | `/admin/companies/{id}/activate` | Admin | Admin-only | `PENDING→ACTIVATED` | company_activated | Yes |
| POST | `/students/{id}/evidence` | Student (self) | Object-owner | Creates evidence (cap 5/claim enforced) | evidence_created | No |
| POST | `/institutions/{id}/verify-evidence/{evidence_id}` | Faculty | Institution must be `ACTIVATED`, object must belong to own student | Sets `verification_tier` | evidence_verified | Yes |
| PUT | `/students/{id}/evidence/{evidence_id}` | Student (self) | Object-owner | Reverts verified evidence to `SELF_REPORTED` | evidence_edited | No |
| POST | `/companies/{id}/opportunities` | Recruiter | Company must be `ACTIVATED`, object-owner | Creates opportunity | opportunity_created | No |
| POST | `/students/{id}/preferences` | Student (self) | Object-owner | Sets/updates ranked preference list | preferences_submitted | No (versioned) |
| POST | `/admin/cycles/{cycle}/allocation-runs` | System/Admin-triggered (background job) | Admin or system job | Executes eligibility→fit→O-scoring→DA; writes snapshot | allocation_run_executed | No (new run each call) |
| GET | `/allocation-runs/{id}` | Admin, Placement Cell (own institution scope) | Tenant-scoped | Read | allocation_run_viewed | Yes |
| POST | `/admin/allocation-runs/{id}/approve` | Admin | Admin-only | `UNDER_REVIEW→APPROVED→PUBLISHED` | allocation_approved | Yes |
| POST | `/admin/allocation-runs/{id}/override` | Admin | Admin-only | `UNDER_REVIEW→OVERRIDDEN→VALIDATED→PUBLISHED`; stores reason | allocation_overridden | No (each override distinct) |
| POST | `/system/recovery/{allocation_generation}/trigger` | System (on dropout/vacancy event) | System-only | Enqueues recovery, respects 1-active-per-candidate invariant | recovery_triggered | Yes (per candidate/generation) |
| POST | `/admin/recovery/{id}/escalate` | Admin | Admin-only, past `retry_count` threshold | Full market rerun | recovery_escalated | Yes |
| GET | `/students/{id}/allocation-status` | Student (self), shared parties per visibility state | Object-owner or visibility-grant | Read | allocation_status_viewed | Yes |
| GET | `/institutions/{id}/analytics` | Placement Cell, Admin | Tenant-scoped, sample-size ≥10 enforced | Read (aggregated) | analytics_viewed | Yes |
| POST | `/system/models/{cycle}/train` | System (background job) | System-only | Trains on TRAIN partition | model_trained | Yes (per cycle) |
| POST | `/system/models/{cycle}/validate-activate` | System (background job) | System-only | Runs activation gate on VALIDATION, freezes evidence | model_activation_decided | Yes (per cycle) |
| POST | `/system/outcomes/{cycle}/generate` | System (background job) | System-only | Generates `OFFER_EXTENDED` for full eligible-pair universe, post-allocation | outcomes_generated | Yes (per cycle) |

---

# PART 19 — BACKGROUND JOBS

*[Derived APScheduler job inventory covering Phase-1 lifecycle.]*

| Job | Trigger | Input state | Prerequisites | Output | Retry policy | Failure behavior | Idempotency |
|---|---|---|---|---|---|---|---|
| `cycle_progression` | Scheduled (generator's internal clock) | Current cycle state | Prior cycle closed | New `CYCLE` opened | N/A (deterministic) | Halts cycle advancement, alerts admin | Yes |
| `model_train` | On VALIDATION-partition-ready | TRAIN partition data | Feasible cycle-aligned partitioning (Part 7) | Model artifact + `model_version` | Retry 3x, then `HEURISTIC_FALLBACK` | Falls back, logs `outcome_signal_source` | Yes (per cycle) |
| `model_calibrate` | After `model_train` | Model artifact + CALIBRATION partition | `model_train` success | Calibration artifact | Retry 3x, then fallback | Same as above | Yes |
| `model_validate_activate` | After `model_calibrate` | VALIDATION partition, calibration artifact | Both above succeeded | `MODEL_ACTIVATION` decision + frozen validation-evidence record | No retry (deterministic gate check) | On any gate failure → `HEURISTIC_FALLBACK`, evidence still recorded | Yes (per cycle) |
| `allocation_run` | Cycle T ready (frozen `O` config available) | Eligible-pair universe, frozen scores | `model_validate_activate` (or fallback) complete | `AllocationSnapshot`, `DRAFT` allocation run | Retry on transient failure; never partial-commit | Full run rollback on failure — no partial allocation persists | Yes (per cycle) |
| `outcome_generation` | After `allocation_run` executes DA | Full eligible-pair universe | `allocation_run` complete (step 4 done) | `OFFER_EXTENDED` labels, full universe | Retry 3x | Alerts admin; Cycle T proceeds without labels if exhausted (flagged, not blocking) | Yes (per cycle) |
| `recovery_processing` | Dropout/vacancy event | Affected transitive closure | Published allocation exists | Recovery run, queue updates | Retry with backoff; escalate past `retry_count` threshold | Escalates to admin-triggered full rerun | Yes (per candidate/generation) |
| `analytics_update` | Scheduled (post-cycle) | Published allocations, outcomes | Cycle closed | Institutional analytics aggregates | Retry 3x | Stale analytics flagged, not blocking | Yes |
| `snapshot_integrity_check` | Scheduled (periodic) | Existing snapshots | N/A | Hash-verification report | N/A | Alerts admin on mismatch (should never occur given immutability) | Yes |

All jobs execute within a transaction boundary scoped to their single output artifact (no job partially writes an allocation, model version, or snapshot) and are safe to re-run given the same input cycle (idempotent per cycle/candidate/generation key as noted).

---

# PART 20 — STATE MACHINES

**User/account lifecycle:**
```
Student:  (self-service) → ACTIVE
Institution/Company: PENDING → ACTIVATED
                            → (deactivated) → (reactivated, verifications STALE until re-review)
```

**Opportunity lifecycle:**
```
DRAFT → POSTED → (eligibility/fit computed each cycle) → CLOSED/WITHDRAWN
```

**Application lifecycle:**
```
SUBMITTED → (feeds preference list) → ALLOCATED / UNMATCHED → ACCEPTED / REJECTED/VACATED
```

**Allocation lifecycle:** see Part 15 (canonical).

**Recovery lifecycle:**
```
TRIGGERED → QUEUED (ACTIVE, ≤1 per candidate per generation) → RUNNING → RESOLVED / ESCALATED (past retry_count threshold)
```

**Verification lifecycle:**
```
SELF_REPORTED → (Faculty verifies) → INSTITUTION_VERIFIED
INSTITUTION_VERIFIED → (edited) → SELF_REPORTED (must re-verify)
INSTITUTION_VERIFIED → (institution deactivated → reactivated) → STALE → (re-review) → INSTITUTION_VERIFIED
```

**Model lifecycle:**
```
TRAIN → CALIBRATE → VALIDATE/ACTIVATION-DECISION → FROZEN → (scores TEST cycle) → SUPERSEDED (next cycle's model)
                                                 → (gate fails) → HEURISTIC_FALLBACK
```

**Profile visibility lifecycle:**
```
PRIVATE → (opt-in) → DISCOVERABLE
PRIVATE / DISCOVERABLE → (application submitted) → APPLICATION_SHARED (scoped to application_id)
APPLICATION_SHARED → (later milestone grant) → CONTACT_SHARED
```

---

# PART 21 — FAILURE / RECOVERY / IDEMPOTENCY

*[Derived, scoped to the actually-selected stack — no distributed-systems complexity beyond FastAPI/Render + PostgreSQL + APScheduler.]*

| Scenario | Behavior |
|---|---|
| Duplicate job execution | Jobs are idempotent per their key (cycle, candidate/generation) — re-execution is a no-op if the output artifact already exists for that key. |
| Worker crash mid-job | No partial artifact is committed (transaction boundary = single output); job resumes/retries from its trigger condition on next scheduler tick. |
| Partial allocation | Never persists — `allocation_run` job commits the full `DRAFT` run or nothing. |
| Stale snapshot | Snapshots are never "stale" themselves (immutable); staleness applies to the *run* referencing it pre-publication — see Part 12 invalidation triggers. |
| Stale account verification | Handled explicitly via `STALE` status on reactivation (Part 13) — not an error state, a defined state. |
| Failed model activation | Not a failure — a defined gate outcome, routes to `HEURISTIC_FALLBACK`. |
| Insufficient training data | Routes to `HEURISTIC_FALLBACK` via the infeasibility rule (Part 7) — defined behavior, not an error. |
| Failed model artifact (training crash) | Retry 3x, then `HEURISTIC_FALLBACK`, logged. |
| Recovery retry | `retry_count` incremented; past threshold, escalates to admin-triggered full market rerun (Part 6.7). |
| Superseded recovery | Prior run marked `SUPERSEDED`, `parent_run_id` preserves lineage. |
| Concurrent execution | Recovery-queue invariant (≤1 `ACTIVE` per candidate per generation) prevents concurrent recovery on the same candidate; allocation runs are single-writer per cycle. |

---

# PART 22 — OBSERVABILITY & AUDIT

- **Structured logs:** per job/request, including correlation/run IDs.
- **Audit events:** per Part 18's endpoint table — every state-changing action logged with actor, action, object, tenant, timestamp.
- **Correlation/run IDs:** `allocation_generation`, `run_id`, `model_version` id, `snapshot_hash` propagated through logs for traceability.
- **Metrics distinguished by category (minimum):** model (Brier, activation rate, fallback rate), allocation (run duration, match rate, unmatched rate), recovery (queue depth, escalation rate), authorization (cross-tenant rejection count), override (frequency, reasons distribution), verification (verification rate, revocation rate), privacy (deletion/pseudonymization request volume).

---

# PART 23 — TEST STRATEGY

| Category | Covers |
|---|---|
| **Unit tests** | `E`/`F`/`O` formula correctness, normalization, `Priority` computation, tiebreak epsilon comparison, evidence weight application. |
| **Contract tests** | `E`/`F` separation (dual-purpose-field rule never violated), `O`'s feature contract, label-generator's feature contract, schema validation on all API payloads. |
| **Temporal tests** | Cycle-aligned partitioning correctness (no split cycles, no cross-boundary events), `MIN_O_EVENTS_PER_PARTITION` enforcement, VALIDATION-block sizing logic, infeasibility → fallback correctness. |
| **Leakage tests** | Cycle-T labels never influence Cycle-T scoring/activation; label generator never consumes allocation-produced/internal state; `O` never consumes `F`'s derived score or preference rank. |
| **Allocation tests** | DA correctness (candidate-optimal stable matching for a given profile), determinism given frozen inputs, capacity respected exactly, unmatched-state correctness. |
| **Snapshot tests** | Immutability (write-once enforcement), hash stability/verification, full reproducibility from recorded versions + seed. |
| **Security tests** | RBAC per role (Part 3), tenant isolation, object authorization, action authorization, cross-tenant rejection + audit-visibility. |
| **State-transition tests** | Every state machine in Part 20 — no transition reachable outside the defined graph. |
| **Recovery tests** | Transitive-closure correctness, batching of simultaneous dropouts, ≤1 active queue entry per candidate/generation, retry escalation threshold behavior. |
| **End-to-end demo test** | Full Part 24 demo path, synthetic data only, runs green before any presentation. |

Every FR in Part 5 must map to at least one test in one of the above categories (see Part 30 traceability matrix).

---

# PART 24 — DEMO SPECIFICATION

**Canonical Main SIH demonstration path:**

1. Candidate profiles/evidence — show a student with self-reported and institution-verified evidence side by side, illustrating `verification_tier`.
2. Opportunities — show a company-posted role with clear eligibility requirements.
3. Eligibility — show `E(c,i)` gating a clearly ineligible pair out, and an eligible one proceeding.
4. Fit — show `F(c,i)` broken into its graded sub-factors, explainably.
5. Opportunity-side signal — show the priority-tier display (never "confidence"), with a visible `outcome_signal_source: ML | HEURISTIC_FALLBACK` indicator.
6. Explainable priority — show `Priority = α·F + (1−α)·O` computed transparently for a specific pair.
7. Candidate preferences — show a declared ranked list, unmodified by the system.
8. DA allocation — run and show a live allocation, with the state machine (`DRAFT→PROPOSED→...`) visibly progressing.
9. Human review — show an admin reviewing, and one override with its stored reason.
10. Snapshot/audit — show the immutable snapshot and its hash, and an audit-log entry.
11. Outcome — show a generated `OFFER_EXTENDED` event, explicitly labeled synthetic.
12. Feedback/analytics — show an institutional analytics aggregate (sample size ≥10) reflecting a prior cycle's outcomes feeding forward.

**Where the "wow factor" comes from:** the visible, inspectable chain from evidence → eligibility → fit → signal → priority → mechanism-grounded allocation → human governance → immutable audit trail — not any single model's accuracy. The demo should make the honesty of the system's claims (visible `HEURISTIC_FALLBACK` indicator, explicit "synthetic" labeling, no "confidence" language) a visible feature, not something hidden to look more impressive.

**Feasibility:** every step above runs entirely on synthetic data generated by Part 9's generator — no external dependency required for the demo to run end-to-end.

---

# PART 25 — NON-CLAIMS & COMMUNICATION GUARDRAILS

Must propagate into every future document and presentation, verbatim in spirit:

- No claim that `O` predicts real-world employer behavior.
- No claim of statistical independence between `F` and `O` — only computational non-dependency is claimed.
- No claim that predicted offer-likelihood is causal — correlational only, under stated synthetic assumptions.
- No claim that DA's stability guarantee extends to recovery runs or overridden results.
- No claim that the tiebreak mechanism is a fairness mechanism.
- No claim that the design being reviewed equals the design being implementation-validated.

**Wording that must not appear in UI or pitch material:** "confidence" (for model output — use priority tier instead); "predicts who will get the offer" or similar real-employer-intent framing (use "opportunity-side selection signal"); "guaranteed fair" or "fairness-guaranteeing" applied to tie-breaking; "fully stable" or "stability-guaranteed" applied to recovery or overridden results without the "locally"/"never inherits" qualifier.

---

# PART 26 — PHASE BOUNDARIES

**Phase 1 / current prototype:** everything specified in Parts 1–25 as locked or as Phase-1-scoped. Synthetic data only. `O_offer` only. No unseen-opportunity/company evaluation. `PRIVATE`/`DISCOVERABLE`/`APPLICATION_SHARED` visibility only for real onboarding purposes (with `DISCOVERABLE` demo-only).

**Phase 2 / future expansion (explicitly deferred, must not silently enter Phase-1 implementation scope):**
- `O_shortlist` / `O_interview` as additional `O` family members, each with its own target definition and evaluation.
- Unseen-opportunity and unseen-company generalization evaluation, once dataset scale supports it.
- `CONTACT_SHARED` as a later-stage visibility milestone.
- Real-world data and, only then, any deployment-validity assessment.
- Full unseen-student evaluation protocol (currently only sketched as diagnostic, Part 10).
- Additional admin-provisioning mechanism beyond the seed bootstrap (Part 13).
- Numeric default for recovery retry-count escalation threshold (Part 6.7) — currently unspecified.

---

# PART 27 — TECHNOLOGY ARCHITECTURE

**Locked stack:** Next.js/Vercel (frontend); FastAPI/Render (backend); PostgreSQL + pgvector (database); relational adjacency tables for the Skill Graph (no separate graph database); APScheduler (scheduling). No unnecessary graph database, vector database beyond pgvector's use for semantic skill matching, standalone ML microservice, or microservice explosion — the design intentionally keeps this a unified backend.

**Service boundaries** *[Derived]*: a single FastAPI service hosting the cross-cutting authz middleware, E/F/O computation, DA engine, recovery engine, snapshot/identity services, and API surface; APScheduler jobs run in-process or as a scheduled worker against the same database — no separate service boundary is introduced for Phase 1.

**Module boundaries** *[Derived]*: `auth`, `eligibility_fit`, `opportunity_signal` (training/calibration/validation/activation), `allocation` (DA + recovery), `snapshots`, `governance` (state machine + override), `evidence_verification`, `analytics`.

**Data flow:** frontend → FastAPI API layer → authz middleware → domain module → PostgreSQL; background jobs read/write PostgreSQL directly, triggering domain-module logic on schedule.

**Dependency flow:** `allocation` depends on `eligibility_fit` and `opportunity_signal` outputs; `opportunity_signal`'s activation pipeline depends on `evidence_verification`-influenced `F` only indirectly (never directly, per the feature contract); `governance` depends on `allocation`; `snapshots` are written by `allocation`, read by `governance` and `analytics`.

**Deployment topology:** Vercel-hosted frontend; Render-hosted FastAPI backend + APScheduler; managed PostgreSQL with pgvector extension.

**Environment configuration** *[Derived]*: separate config for `MIN_O_EVENTS_PER_PARTITION`, `MIN_O_MODEL_SELECTION_EVENTS`, `MIN_PRACTICAL_IMPROVEMENT`, default `α`, tiebreak epsilon, evidence weights, evidence cap, peer-institution minimum sample size, recovery retry threshold (once defined) — all versioned, never hardcoded invisibly per the Priority-formula rule (Part 6.4) extended to all policy constants.

---

# PART 28 — ARCHITECTURAL DECISIONS

| ADR | Decision | Rationale | Alternatives considered | Consequence | Status |
|---|---|---|---|---|---|
| ADR-01 | Use candidate-proposing Deferred Acceptance | Textbook stability guarantee (candidate-optimal among stable matchings), JoSAA-class precedent at scale | Company-proposing DA (favors opportunities); pure ranked-list/greedy matching (no stability guarantee) | Predictable, explainable mechanism-level behavior; unmatched states are legitimate, not failures | Locked |
| ADR-02 | Separate `E`/`F`/`O` structurally | Prevents conflating hard requirements, graded fit, and a learned/uncertain signal into one opaque number | Single blended score with implicit weighting | More explainable, easier to audit and test each stage independently | Locked |
| ADR-03 | `O_offer` is the only Phase-1 `O` family member | Shortlisting/interview/offer are genuinely different targets; building all three without validating one first risks diluted effort and unjustified transfer assumptions | Build all three targets in parallel | Narrower but more defensible Phase-1 scope; `O_shortlist`/`O_interview` explicitly Phase 2 | Locked |
| ADR-04 | Cycle-aligned, chronologically disjoint TRAIN/CALIBRATION/VALIDATION/TEST | Row-level or ambiguous cycle-block splitting risks non-independent partitions and biased calibration/activation metrics | Fixed-size rolling windows; row-level random splits | More implementation complexity in partition-boundary logic, but a materially more trustworthy activation gate | Locked |
| ADR-05 | Deterministic heuristic fallback whenever the activation gate isn't cleared | A cold-start or data-poor cycle should never force an under-supported ML decision | Always use ML regardless of data sufficiency; block allocation entirely if ML unavailable | Allocation always proceeds; `outcome_signal_source` transparently logged | Locked |
| ADR-06 | PostgreSQL + pgvector, relational adjacency tables for Skill Graph | Avoids a separate graph database and vector database for a Phase-1 dataset scale that doesn't need them | Dedicated graph DB (Neo4j-class); dedicated vector DB | Simpler ops surface, one database to reason about | Locked |
| ADR-07 | APScheduler over a distributed task queue | Phase-1 job volume and single-backend deployment (Render) don't justify distributed-queue complexity | Celery/RQ with a separate broker | Simpler deployment; revisit if job volume or scale-out needs grow | Locked |
| ADR-08 | Immutable `AllocationSnapshot` + separate mutable `subject_identity_mapping` | Privacy deletion requests must never break reproducibility of past decisions | Single table with identity inline, soft-deleted on request | Slightly more schema complexity; a real, defensible privacy/reproducibility separation | Locked |
| ADR-09 | Human governance state machine with mandatory review before publication | AI-proposed allocations should never auto-publish without an accountable human step | Auto-publish with post-hoc override only | Slower publication path; materially stronger accountability story | Locked |
| ADR-10 | Synthetic-only data, no company/opportunity holdout evaluation in Phase 1 | No real applicant/company data exists; dataset scale can't credibly support company-level holdout | Attempt limited real-data pilot; skip holdout evaluation entirely | Deployment-validity claims explicitly deferred to Phase 2; synthetic validity is the only claim made | Locked |

---

# PART 29 — OPEN / CONFIGURABLE / DEFERRED ITEMS

**Locked** (must not change without revisiting this Master):
E/F/O structural separation; DA mechanism and stability-claim scope; freeze-at-run-start invariant; cycle-aligned temporal partitioning logic; the two-constant split (`MIN_O_EVENTS_PER_PARTITION` / `MIN_O_MODEL_SELECTION_EVENTS`); activation gate conditions; label-generator and `O` feature contracts; snapshot/identity-mapping separation; human governance state machine; tiebreak mechanism and its non-fairness status; technology stack (Part 27).

**Configurable** (may change via explicit configuration/versioning, without a Master revision):
`α` default (0.6); `MIN_PRACTICAL_IMPROVEMENT` (0.01); tiebreak epsilon (`1e-9`); evidence weights (1.0×/2.0×); evidence cap (5); peer-institution minimum sample size (10); sensitivity-sweep values; recovery `retry_count` escalation threshold (numeric default not yet set); admin-provisioning mechanism beyond the seed bootstrap.

**Deferred** (not part of current implementation):
`O_shortlist` / `O_interview`; unseen-opportunity / unseen-company evaluation; `CONTACT_SHARED` full implementation; full unseen-student evaluation protocol (beyond the diagnostic sketch); any real-world deployment-validity assessment; the exact final wording of the §3-equivalent policy-objective sentence, the §9-equivalent invalidation-trigger list, and the §15-equivalent materiality rule — all currently first-draft text pending product/team sign-off (see Part 25's guardrail against treating them as locked).

---

# PART 30 — TRACEABILITY MATRIX

| Design Decision | FR | Data Model | API/Job | Test Category | Demo Evidence |
|---|---|---|---|---|---|
| E/F separation | FR-001, FR-002 | `opportunities` (requirements), `students`/`skill_claims` | eligibility/fit computation (in `allocation_run` job) | Contract, Unit | Step 3–4 |
| O feature contract | FR-003 | `model_versions` | `model_train` job | Contract, Leakage | Step 5 |
| Label-generator feature contract | FR-004 | `outcomes` | `outcome_generation` job | Contract, Leakage | Step 11 |
| Temporal partitions (cycle-aligned, disjoint) | FR-005, FR-006, FR-007 | — | `model_train`/`model_calibrate`/`model_validate_activate` jobs | Temporal | Step 5 (fallback indicator) |
| Activation gate | FR-008 | `validation_evidence` | `model_validate_activate` job | Temporal, Leakage | Step 5 |
| Fallback | FR-007, FR-008 | `allocation_runs.outcome_signal_source` | `model_train`/`model_validate_activate` jobs | Temporal | Step 5 |
| DA mechanism | FR-012 | `allocation_runs`, `allocations` | `POST /admin/cycles/{cycle}/allocation-runs`, `allocation_run` job | Allocation | Step 8 |
| Snapshot | FR-015 | `allocation_snapshots`, `subject_identity_mapping` | `allocation_run` job | Snapshot | Step 10 |
| Privacy (identity separation) | FR-015 | `subject_identity_mapping` | (deletion endpoint, not yet enumerated — Deferred detail) | Snapshot, Security | Step 10 |
| Authorization (AuthN→RBAC→...→audit) | FR-024 | `audits` | all endpoints (Part 18), cross-cutting middleware | Security | Step 9 |
| Verification | FR-018 | `evidence`, `verification` | `POST /institutions/{id}/verify-evidence/{evidence_id}` | State-transition | Step 1 |
| Recovery | FR-014 | `recovery_queue`, `allocation_generations` | `recovery_processing` job | Recovery | (not in core demo path; available on request) |
| Deterministic tiebreaking | FR-020 | `students.tiebreak_key` | `allocation_run` job | Allocation, Unit | Step 6 |

---

# PART 31 — IMPLEMENTATION ORDER

*[Derived dependency-aware sequence.]*

1. Repository/project foundation.
2. Database/schema (Part 11).
3. Authentication and authorization (Part 13) — needed before any tenant-scoped data exists.
4. Synthetic data generator (Part 9) — needed before any realistic E/F/O testing is possible.
5. Candidate/opportunity/application flows (Part 4) — needed before E/F have real inputs.
6. `E` and `F` (Part 6.1–6.2) — foundational scoring, no dependency on `O`.
7. `O` training/evaluation pipeline (Parts 7–9) — depends on enough synthetic cycles existing (step 4) and `F`'s primitive inputs (step 6, for feature reuse boundary clarity, even though `O` doesn't consume `F` directly).
8. DA engine (Part 6.5) — depends on `E`/`F`/`O` all being available.
9. Snapshots (Part 12) — depends on a working allocation run to snapshot.
10. Governance (Part 15) — depends on snapshots and allocation runs existing to review.
11. Recovery (Part 6.7) — depends on published allocations existing to recover from.
12. Analytics (Part 17's peer-institution aggregates) — depends on outcomes accumulating over cycles.
13. UI integration.
14. End-to-end demo (Part 24).
15. Verification and polish (Part 23's full test suite green).

This ordering follows the dependency chain above; if implementation reveals a better sequence given real dependency discovery, the rationale here (not the exact numbered order) is what should be preserved.

---

# PART 32 — FINAL MASTER CONSISTENCY CHECK

A full cross-document consistency pass was performed before finalizing this Master against the categories below. No contradiction was found between this Master and the V13 baseline it derives from.

- **Mathematics:** `Priority` formula, `α=0.6` default, `MIN_O_EVENTS_PER_PARTITION=30`, `MIN_O_MODEL_SELECTION_EVENTS=90` (3×30, derived not gating), `MIN_PRACTICAL_IMPROVEMENT=0.01`, tiebreak epsilon `1e-9`, evidence weights `1.0×/2.0×` — all consistent between Parts 6, 7, 16, 17 and their single canonical definitions in Part 2.
- **Temporal logic:** cycle ordering, TRAIN/CALIBRATION/VALIDATION/TEST disjointness, VALIDATION-as-flexible-block, Cycle-T label timing — consistent across Parts 4, 6.3, 6.7, 7, 8, 9, 10.
- **Data semantics:** `E`/`F`/`O` never cross-consume in a way that violates their contracts (Parts 6, 8, 9); visibility states (Part 14) consistent with `applications` entity (Part 11); application scope consistent with `APPLICATION_SHARED` definition (Part 2, 14).
- **Allocation semantics:** DA, capacity, ties, recovery, overrides — Parts 6.5–6.7, 15, 16 consistent; recovery and override both correctly never claim full DA stability (Part 25 guardrail matches Parts 6.7, 6.5, 15).
- **Security:** AuthN/RBAC/object/action/tenant/audit — Part 13 consistent with Part 3's role table and Part 18's per-endpoint authz column.
- **Privacy:** direct-identity exclusion, snapshot linkability admission, identity mapping, deletion/pseudonymization scope — Part 12 consistent with Part 2's definitions and Part 25's non-claims.
- **Model governance:** activation, frozen evidence, versions, fallback — Parts 6.4, 7, 11 (`validation_evidence` entity) consistent.
- **Claims:** synthetic validity vs. deployment validity, causal, fairness, independence — Part 25 consistent with Parts 6, 9, 10, 16 wherever those claims are made or explicitly disclaimed.
- **Scope:** Phase 1 vs Phase 2 — Part 26 consistent with Part 1's non-goals and every Part's individual scope notes. *(Correction, D-013: this line previously also claimed "College vs Main SIH — Part 26 consistent," but Part 26 ("Phase Boundaries") only ever defined the Phase 1/Phase 2 boundary — it never independently defined College-vs-Main scope. That distinction lived in Parts 1 and 4, and is now retired per D-012. The mis-citation predates this correction and is fixed here rather than left to imply a check that Part 26 never actually performed.)*

---

**MASTER DESIGN STATUS: FINAL REVIEWED BASELINE — READY FOR IMPLEMENTATION, WITH IMPLEMENTATION-LEVEL VALIDATION NOW REQUIRED.**
