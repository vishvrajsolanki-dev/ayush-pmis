# ANCHOR — UX / PRODUCT FLOW SPECIFICATION

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

## 1. Information Architecture & Navigation **[Derived]**

Top-level navigation is role-scoped per Master Part 3:

- **Student:** Profile · Evidence · Opportunities · Preferences · Allocation Status
- **Institution (Faculty):** Students · Verification Queue
- **Institution (Placement Cell):** Analytics · Allocation Outcomes (aggregated)
- **Company (Recruiter):** Opportunities · Shared Evidence
- **Mentor:** Assigned Candidates
- **Admin:** Institutions/Companies (activation) · Allocation Runs (review/override) · Recovery Queue · Audit Log

## 2. Role-Based Experiences

Each role sees only what Part 3's role table grants it. No screen below is reachable by a role not listed for it. UI must never surface `E`/`F`/`O`/`Priority` as editable fields to any role — only Admin-level override actions modify allocation outcomes, and only through the override flow (Screen 11, Override Experience).

## 3. Onboarding

- **Purpose:** account creation.
- **User:** Student (self-service), Institution/Company (creates `PENDING`).
- **Inputs:** role selection, credentials, org fields for Institution/Company.
- **Outputs:** `ACTIVE` account (Student) or `PENDING` account (Institution/Company).
- **Actions:** submit registration.
- **States:** `PENDING` (Institution/Company, awaiting Admin approval — no self-service path to a trusted role), `ACTIVE` (Student).
- **Validation:** email uniqueness.
- **Empty state:** N/A.
- **Error state:** duplicate account.
- **Loading state:** submission in progress.
- **Permission behavior:** no public "Admin" role selectable anywhere at registration.

## 4. Student Profile

- **Purpose:** manage identity and visibility.
- **User:** Student.
- **Inputs:** profile fields, visibility opt-in toggle.
- **Outputs:** profile record.
- **Actions:** edit profile, opt into `DISCOVERABLE`.
- **States:** `PRIVATE` (default) → `DISCOVERABLE` (opt-in) → `APPLICATION_SHARED` (per application) → `CONTACT_SHARED` (later milestone, Phase 2).
- **Validation:** none beyond field-level.
- **Empty state:** new profile prompts completion.
- **Error state:** save failure.
- **Loading state:** save in progress.
- **Permission behavior:** visibility toggle never defaults to `DISCOVERABLE` for a real user — that default applies only to seeded demo data.

## 5. Evidence Management

- **Purpose:** capture skill claims and supporting evidence.
- **User:** Student.
- **Inputs:** skill claim, evidence content (max 5 items/claim).
- **Outputs:** evidence records with `status`.
- **Actions:** add evidence, edit evidence.
- **States:** `SELF_REPORTED` ↔ `INSTITUTION_VERIFIED` (via Faculty) → reverts to `SELF_REPORTED` on edit.
- **Validation:** cap enforcement at 5 items/claim, blocking further additions past the cap.
- **Empty state:** "no evidence yet" prompt per skill claim.
- **Error state:** cap-exceeded message.
- **Loading state:** submission in progress.
- **Permission behavior:** only the owning Student can edit; only assigned Faculty can verify.

## 6. Institution Verification

- **Purpose:** Faculty attests to a student's evidence.
- **User:** Faculty (Institution sub-role).
- **Inputs:** evidence item, verification decision.
- **Outputs:** `verification_tier` set, labeled precisely as "verified by institution account" — never implying a stronger guarantee.
- **Actions:** verify, (implicitly) revoke by leaving evidence editable by the student.
- **States:** `SELF_REPORTED → INSTITUTION_VERIFIED`; `INSTITUTION_VERIFIED → STALE` on institution reactivation, requiring explicit re-review.
- **Validation:** institution must be `ACTIVATED`; object must belong to own student.
- **Empty state:** verification queue empty.
- **Error state:** cross-institution attempt (rejected, logged, audit-visible).
- **Loading state:** verification submission in progress.
- **Permission behavior:** Faculty cannot activate accounts; only verifies.

## 7. Company Opportunity Management

- **Purpose:** post and manage roles.
- **User:** Recruiter (Company sub-role).
- **Inputs:** requirements (feeding `E`/`F`), capacity.
- **Outputs:** opportunity record.
- **Actions:** create, edit, close/withdraw.
- **States:** `DRAFT → POSTED → CLOSED/WITHDRAWN`.
- **Validation:** company must be `ACTIVATED`.
- **Empty state:** no opportunities posted yet.
- **Error state:** company not yet `ACTIVATED`.
- **Loading state:** save in progress.
- **Permission behavior:** Recruiter sees only own company's opportunities and evidence shared via `APPLICATION_SHARED`/`CONTACT_SHARED` — never non-shared student evidence.

## 8. Preference Submission

- **Purpose:** capture the candidate's declared, ranked opportunity list.
- **User:** Student.
- **Inputs:** ranked list of opportunities (may be empty or incomplete).
- **Outputs:** stored preference-list version.
- **Actions:** submit/update list.
- **States:** `SUBMITTED`.
- **Validation:** none that alters ranking or content — the system never inserts, reorders, or auto-completes the list.
- **Empty state:** explicitly valid — an empty list is legitimate input, potentially yielding `UNMATCHED`.
- **Error state:** submission failure.
- **Loading state:** submission in progress.
- **Permission behavior:** only the owning Student may submit.

## 9. Allocation Experience (Student-Facing)

- **Purpose:** show allocation status to the affected student.
- **User:** Student (self), shared parties per visibility state.
- **Inputs:** none (read-only).
- **Outputs:** allocation status; if matched, priority tier is shown — **never "confidence."**
- **Actions:** view only.
- **States:** mirrors the allocation lifecycle (see ANCHOR_STATE_MACHINES.md).
- **Empty state:** "not yet allocated" prior to a run.
- **Error state:** N/A (read-only).
- **Loading state:** status loading.
- **Permission behavior:** visible only to the student and parties with an active visibility grant for the relevant application.

## 10. Human Review (Admin)

- **Purpose:** review a proposed allocation run before publication.
- **User:** Admin.
- **Inputs:** proposed run detail (`DRAFT/PROPOSED/UNDER_REVIEW`).
- **Outputs:** approval or override decision.
- **Actions:** approve, override.
- **States:** `DRAFT → PROPOSED → UNDER_REVIEW → APPROVED → PUBLISHED` or `→ OVERRIDDEN → VALIDATED → PUBLISHED`.
- **Validation:** override requires a mandatory reason.
- **Empty state:** no runs pending review.
- **Error state:** run went stale/`INVALIDATED` before action (per Part 12 triggers) — must re-run, never in-place repair.
- **Loading state:** review action in progress.
- **Permission behavior:** Admin-only; every decision audited.

## 11. Override Experience

- **Purpose:** let Admin change a proposed assignment with accountability.
- **User:** Admin.
- **Inputs:** override target, reason (mandatory).
- **Outputs:** distinct linked records — original proposed assignment, decision, reason, acting admin, validation result.
- **Actions:** submit override.
- **States:** `UNDER_REVIEW → OVERRIDDEN → VALIDATED → PUBLISHED`.
- **Validation:** reason field required; override never silently edits — always a new, linked record.
- **Empty state:** N/A.
- **Error state:** validation failure on missing reason.
- **Loading state:** submission in progress.
- **Permission behavior:** UI must never label an overridden result as carrying DA's stability guarantee.

## 12. Publication

- **Purpose:** finalize and expose an allocation to affected parties.
- **User:** Admin (triggers), Student/Company (view).
- **Outputs:** `PUBLISHED` allocations visible to matched parties.
- **States:** `APPROVED/VALIDATED → PUBLISHED`.
- **Permission behavior:** publication is the only event that makes a match externally visible.

## 13. Recovery (Student/Company visibility; Admin action)

- **Purpose:** handle dropout/vacancy.
- **User:** System-triggered; Admin escalates.
- **Outputs:** recovery-run result for the affected transitive closure.
- **States:** `TRIGGERED → QUEUED → RUNNING → RESOLVED/ESCALATED`.
- **Permission behavior:** UI must label recovery results as a **locally stable heuristic**, never full-market-stable.

## 14. Analytics

- **Purpose:** institutional peer comparison.
- **User:** Placement Cell, Admin.
- **Inputs:** none (read-only, computed).
- **Outputs:** aggregated metrics only, shown only when sample size ≥10.
- **Empty state:** "insufficient sample size" if below 10 — never a partial/individual-level fallback.
- **Permission behavior:** Institution/Admin only; never Company or Student.

## 15. Visibility Controls

- **Purpose:** let a Student manage who sees what.
- **User:** Student.
- **Inputs:** opt-in toggles per state.
- **Outputs:** current visibility state per application.
- **States:** `PRIVATE → DISCOVERABLE → APPLICATION_SHARED → CONTACT_SHARED` (Phase 2 milestone; `CONTACT_SHARED` not implemented in Phase 1 UI).
- **Permission behavior:** withdrawing one application does not affect visibility granted via a different application to the same company.

## 16. Audit Views

- **Purpose:** inspect the action/access log.
- **User:** Admin.
- **Inputs:** filter by actor/action/object/tenant/date.
- **Outputs:** append-only audit entries, including cross-tenant rejection attempts.
- **Permission behavior:** Admin-only.

## 17. Cross-Cutting UI Rules (Part 25 — must propagate to every screen)

- Never display "confidence" for model output — use the priority-tier label only.
- Never frame the opportunity-side signal as predicting real employer decisions — label it "Opportunity-side selection signal."
- Never describe tie-breaking as fairness-guaranteeing.
- Never describe recovery or overridden results as "fully stable" or "stability-guaranteed" without the "locally"/"never inherits" qualifier.
- Always visibly indicate `outcome_signal_source: ML | HEURISTIC_FALLBACK` wherever a priority tier is shown.
- Always label synthetic data/outcomes as synthetic where displayed.
