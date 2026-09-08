# ANCHOR — DOCUMENTATION REVIEW & TRACEABILITY AUDIT

```text
Authority 1 (technical): 00-product/MASTER_DESIGN.md
Authority 2 (narrative):  00-product/PRODUCT_NARRATIVE.md
Authority 3 (derivative): the 15 generated documents, reviewed below
Historical documents:     provenance only, not used as authority in this audit
```

---

## 1. EXECUTIVE VERDICT

> **PASS WITH FIXES — NO DESIGN REWORK REQUIRED**

The 15-document set correctly represents every locked decision, constant, non-claim, and structural separation in the Master. No document contradicts the Master, weakens security/privacy, or converts a deferred item into active scope. Three concrete, low-to-medium-severity documentation defects were found (below) — none requires reopening the Master or re-architecting anything. Fix list is finite and small (§9).

---

## 2. MASTER COVERAGE SCORECARD

| Area | Coverage | Consistency | Missing Details | Severity |
|---|---|---|---|---|
| Product | Complete | Consistent | None | — |
| Requirements | Complete | Consistent | None | — |
| Architecture | Complete | Consistent | Job-level retry/idempotency detail lives only in the Master, not restated downstream | P2 |
| Data | Complete | Consistent | None | — |
| APIs | Complete for in-scope endpoints | Consistent | Deletion/pseudonymization endpoint path (Master gap, honestly flagged, not invented) | P3 (documentation gap, not a fault) |
| UX | Complete | One internal cross-reference error | Screen-number self-reference wrong in §2 | P3 |
| AI/DS | Complete | Consistent | None | — |
| Allocation | Complete | Consistent | None | — |
| Security | Complete | Consistent | None | — |
| Privacy | Complete | Consistent | None | — |
| State Machines | Complete | Consistent | Admin deactivation trigger/audit event undefined (Master gap, honestly flagged) | P3 (documentation gap, not a fault) |
| Jobs | Partial | Consistent where present | Full job inventory (9 jobs: trigger/prerequisites/output/retry/idempotency/failure) not reproduced as a standalone table anywhere; 3 of 9 jobs never named downstream | **P2** |
| Testing | Complete | Consistent | FR-009 not explicitly test-ID-mapped in the traceability matrix (it IS covered functionally by LT-01) | P2 |
| Demo | Complete | Consistent | None | — |
| Implementation | Complete | Consistent | None | — |
| ADRs | Complete | Consistent | None | — |
| Traceability | Near-complete | Consistent | FR-009 row missing | **P2** |

---

## 3. FINDINGS

```text
ID: F-01
Severity: P2
Document(s): 01-requirements/TRACEABILITY.md
Master section: Part 8 (label-generation contract) / Part 9 (Cycle-T label generation)
Problem: FR-009 ("Cycle T's OFFER_EXTENDED labels are generated for the full
eligible-pair universe, independently of allocation, and reserved exclusively
for future-cycle training") does not appear in either the main traceability
table or the "Additional Coverage" table. All other 23 FRs (FR-001 through
FR-024, excluding FR-009) are represented.
Why it matters: FR-009 encodes the anti-leakage/no-Cycle-T-contamination rule
— one of the AI/DS layer's most safety-critical properties. It IS correctly
specified in 03-engineering-specs/AI_DS_SPEC.md (§5, Cycle-T rule) and IS tested (LT-01 in
06-testing/TEST_PLAN.md), so this is a traceability-matrix gap, not a functional
gap — but an auditor or new team member scanning only the traceability matrix
would not see that this rule is tracked end-to-end.
Exact correction required: Add one row to 01-requirements/TRACEABILITY.md's
"Additional Coverage" table:
  | Cycle-T label reservation | FR-009 | `outcomes` (`eligible_for_training_as_of`) | `outcome_generation` job | LT-01, TT-06 | Step 11 |
```

```text
ID: F-02
Severity: P2
Document(s): 02-architecture/ARCHITECTURE.md, 05-planning/IMPLEMENTATION_PLAN.md (no document is the clear owner)
Master section: Part 19 (Background Jobs)
Problem: The Master defines 9 background jobs (cycle_progression, model_train,
model_calibrate, model_validate_activate, allocation_run, outcome_generation,
recovery_processing, analytics_update, snapshot_integrity_check), each with
trigger, prerequisites, input, output, transaction boundary, retry policy,
idempotency, and failure behavior. Downstream, only model_train,
model_calibrate, and model_validate_activate are named (in
02-architecture/STATE_MACHINES.md §7) with partial detail. allocation_run and
recovery_processing appear only as row labels in 01-requirements/TRACEABILITY.md.
cycle_progression, analytics_update, and snapshot_integrity_check are never
named in any of the 15 documents. No document contains the full 9-job table
a backend/scheduler engineer could implement from without returning to the
Master.
Why it matters: A team member assigned "background jobs" cannot build a
complete job inventory from the downstream set alone — they would need to
go back to Master Part 19 for cycle_progression, analytics_update, and
snapshot_integrity_check specifically, defeating the purpose of the
downstream documentation set for that workstream.
Exact correction required: Add a "Background Job Inventory" section to
02-architecture/ARCHITECTURE.md (§9, currently a short paragraph) reproducing all 9
jobs with trigger/prerequisites/input/output/retry/idempotency/failure,
sourced directly from Master Part 19. No new jobs, no invented retry
numbers — copy the Master's values as-is.
```

```text
ID: F-03
Severity: P3
Document(s): 04-ux/UX_SPEC.md
Master section: N/A (internal cross-reference only)
Problem: §2 ("Role-Based Experiences") states allocation outcomes are
modifiable "only through the override flow (Screen 12)". The Override
Experience is actually §11 in this same document; §12 is "Publication".
Why it matters: A UI engineer following the cross-reference would land on
the wrong screen spec.
Exact correction required: In 04-ux/UX_SPEC.md §2, change
"(Screen 12)" to "(Screen 11, Override Experience)".
```

No P0 or P1 findings were identified. No document weakens a security/privacy rule, contradicts a constant, invents a feature, or converts a deferred item into active scope.

---

## 4. MISSING-DETAIL REGISTER

### Must fix before implementation
- F-01 (FR-009 traceability row) — five-minute fix, 01-requirements/TRACEABILITY.md.
- F-02 (job inventory) — the background-job workstream (Milestone 7/8/11 in 05-planning/IMPLEMENTATION_PLAN.md) should not start without this table in hand; recommend fixing before that workstream, not before the whole implementation effort.

### Can be clarified during implementation
- Numeric `retry_count` escalation threshold for recovery (Master leaves this unspecified — every downstream document correctly labels it "Configurable"/"not specified in the Master" rather than inventing a number). No action needed unless the Master itself is updated first.
- Additional admin-provisioning mechanism beyond the single seeded bootstrap account (same treatment — correctly deferred everywhere it's mentioned).
- Deletion/pseudonymization endpoint's exact path (Master gap, correctly flagged in 03-engineering-specs/API_SPEC.md and 01-requirements/TRACEABILITY.md as Deferred rather than invented).
- Admin deactivation trigger/audit-event name for Institution/Company accounts (Master gap, correctly flagged "(not enumerated in Master)" in 02-architecture/STATE_MACHINES.md).

### Optional documentation polish
- F-03 (UX self-reference numbering).
- 01-requirements/SRS.md's "Master Ref" column mixes "§N" citations inherited from the Master's own FR table (which itself uses an older internal numbering scheme not fully aligned with this Master's "Part N" headers) alongside directly-added "Part 6.1/6.2"-style references. This ambiguity originates in the Master document itself, not in the SRS — no downstream correction is owed unless the Master's own FR table is revisited, which is out of scope for this audit ("do not repair the Master").
- ADR-01 (candidate-proposing DA) does not itself restate the "never extends to recovery/overrides" caveat inline — this is accurate as written (it makes no false claim), and the caveat is stated clearly and repeatedly elsewhere (03-engineering-specs/ALLOCATION_ENGINE.md §5, 00-product/PRD.md, 01-requirements/SRS.md, 02-architecture/STATE_MACHINES.md, 04-ux/UX_SPEC.md). Adding a one-line cross-reference in ADR-01 would be a nice-to-have, not a correction.

---

## 5. CONTRADICTION REGISTER

**None found.** Every canonical constant (`α = 0.6`, `MIN_O_EVENTS_PER_PARTITION = 30`, `MIN_O_MODEL_SELECTION_EVENTS = 90` labeled derived/non-gating everywhere it appears, `MIN_PRACTICAL_IMPROVEMENT = 0.01`, tiebreak epsilon `1e-9`, evidence cap `5`, evidence weights `1.0×/2.0×`, peer-institution minimum `10`) was checked across every document that references it and found identical in every instance. Terminology (Student/Candidate, E/F/O, CYCLE, Priority, allocation_generation, AllocationSnapshot, verification_tier, visibility states) is used consistently across all 15 documents. No two documents assert different behavior for the same rule.

---

## 6. INVENTION / SCOPE-LEAKAGE REGISTER

| Item | Document(s) | Classification |
|---|---|---|
| Module boundaries, service topology (single FastAPI service, in-process/scheduled-worker APScheduler) | 02-architecture/ARCHITECTURE.md | Harmless derived engineering structure — explicitly labeled **[Derived]** |
| Path-naming convention (`/system/`, `/admin/` prefixes) | 03-engineering-specs/API_SPEC.md | Harmless derived engineering structure — explicitly labeled Derived, stated as revisable without a Master update |
| Entity/field-level schema (tables, columns, indexes) | 02-architecture/DATA_MODEL.md | Harmless derived engineering structure — explicitly labeled **[Derived]**, required to make the Master's locked rules implementable |
| Endpoint inventory (paths, methods, request/response shapes) | 03-engineering-specs/API_SPEC.md | Harmless derived engineering structure — explicitly labeled Derived |
| Milestone numbering/dependency graph | 05-planning/IMPLEMENTATION_PLAN.md | Harmless derived engineering structure — no calendar dates invented, dependency rationale preserved from Master Part 31 |
| Test IDs (UT/CT/TT/LT/AT/ST/SEC/STT/RT/E2E/DT/FB) | 06-testing/TEST_PLAN.md | Harmless derived engineering structure — required to make the Master's test strategy executable |

**No unsupported invention and no scope leakage were found.** Nothing marked Phase 2 in the Master (`O_shortlist`/`O_interview`, unseen-opportunity/company evaluation, `CONTACT_SHARED` implementation, real-world data claims) appears as active Phase-1 scope in any document — every reference to these items is explicitly labeled deferred/Phase 2.

---

## 7. REQUIREMENT → TEST COVERAGE

| Master Requirement | Test ID(s) | Covered? | Evidence |
|---|---|---|---|
| E/F separation | CT-01, UT-01, UT-02 | Yes | 06-testing/TEST_PLAN.md §3, §2 |
| O feature contract | CT-02, LT-03 | Yes | §3, §5 |
| Label-generator contract | CT-03, LT-02 | Yes | §3, §5 |
| Temporal partitioning (no split cycles) | TT-01 | Yes | §4 |
| No Cycle-T activation contamination | TT-06, LT-01 | Yes | §4, §5 |
| Fallback on infeasibility/gate failure | TT-05, FB-04, FB-05 | Yes | §4, §13 |
| DA correctness (stability for declared profile) | AT-01 | Yes | §6 |
| Deterministic allocation | AT-02 | Yes | §6 |
| Capacity respected exactly | AT-03 | Yes | §6 |
| Snapshot immutability | ST-01 | Yes | §7 |
| Hash integrity | ST-02 | Yes | §7 |
| Reproducibility | ST-03, AT-02 | Yes | §7, §6 |
| Tenant isolation | SEC-02 | Yes | §8 |
| Object authorization | SEC-03 | Yes | §8 |
| Action authorization | SEC-04 | Yes | §8 |
| Cross-tenant audit visibility | SEC-05 | Yes | §8 |
| Verification downgrade on edit | STT-06 | Yes | §9 |
| Visibility controls | STT-08 | Yes | §9 |
| Override auditability | STT-04, SEC-05 | Yes | §9, §8 |
| Recovery invariants (queue, transitive closure, stability scope) | RT-01…RT-05 | Yes | §10 |
| State transitions (all 8 lifecycles) | STT-01…STT-08 | Yes | §9 |
| **Cycle-T label reservation (FR-009)** | LT-01 | Yes, functionally — **not listed by FR ID in 01-requirements/TRACEABILITY.md (F-01)** | §5 |

Every P0 requirement and critical invariant has at least one mapped test. The only gap is the traceability-matrix row for FR-009 (F-01) — a documentation-completeness issue, not a testing gap.

---

## 8. SIX-PERSON TEAM READINESS

> **Mostly yes — with one specific place parallel work would diverge: background-job implementation.**

- **Frontend team:** Can build from 04-ux/UX_SPEC.md + 03-engineering-specs/API_SPEC.md + 02-architecture/STATE_MACHINES.md. Ready, modulo the trivial F-03 fix.
- **Backend team (request-driven endpoints):** Can build from 03-engineering-specs/API_SPEC.md + 03-engineering-specs/SECURITY_PRIVACY.md + 02-architecture/DATA_MODEL.md. Ready.
- **Backend team (background jobs):** **Would need to consult the Master directly** for cycle_progression, analytics_update, and snapshot_integrity_check, and for full retry/idempotency detail on the jobs that are named downstream — this is exactly where two engineers working from the downstream set alone could implement inconsistent retry/failure behavior for the same job class. This is the one concrete divergence risk in the set (F-02).
- **Database owner:** Can build the schema directly from 02-architecture/DATA_MODEL.md. Ready.
- **ML engineer:** Can implement the `O` pipeline directly from 03-engineering-specs/AI_DS_SPEC.md (feature contracts, temporal partitioning, activation gate, constants, pseudocode-level activation logic all present). Ready.
- **Allocation engineer:** Can implement DA/recovery directly from 03-engineering-specs/ALLOCATION_ENGINE.md, including runnable pseudocode for all 9 sub-algorithms. Ready.
- **QA:** Can write tests without guessing, using 06-testing/TEST_PLAN.md's ID scheme — except the one FR-009 gap (F-01), which would surface as a five-minute clarifying question, not a blocker.
- **Security/privacy implementer:** Can implement without guessing from 03-engineering-specs/SECURITY_PRIVACY.md; every non-claim and every state transition affecting privacy is present.

---

## 9. FINAL ACTION PLAN

**PASS WITH FIXES.** Three corrections, all editorial, none requiring Master-level design discussion:

1. Add the missing FR-009 row to 01-requirements/TRACEABILITY.md (F-01).
2. Add a full 9-job inventory table (trigger/prerequisites/input/output/retry/idempotency/failure) to 02-architecture/ARCHITECTURE.md §9, sourced verbatim from Master Part 19 — no new jobs, no invented numbers (F-02).
3. Correct the "(Screen 12)" cross-reference in 04-ux/UX_SPEC.md §2 to "(Screen 11, Override Experience)" (F-03).

No re-architecture, no new infrastructure, no new roles, no new endpoints, and no Master-level contradiction were found. Once items 1–3 are applied, the documentation set may be frozen and implementation may begin.

**MASTER → COMPLETE → CONSISTENT → TRACEABLE → IMPLEMENTABLE: confirmed, pending the three fixes above.**
Phase 1 implemented and verified (see docs/08-audit/PHASE_1_COMPLETION.md) — 21 entities, alembic migration, 5 schema tests, 1 alloc_core test, 6/6 pytest PASS.
