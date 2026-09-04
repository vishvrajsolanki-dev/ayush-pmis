# ANCHOR — API SPECIFICATION

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

*[Derived — endpoint inventory is implementation structure covering Phase-1 scope only; not individually reviewed in the Master line-by-line (Master Part 18). Every endpoint is subject to the cross-cutting `AuthN → RBAC → object/tenant-authorization → action-authorization → audit` contract; the Authz column below states the additional rule specific to that endpoint, not a replacement for the base contract.]*

---

## POST /auth/register
- **Actor:** Student (self-service); Institution/Company (creates `PENDING`)
- **AuthN:** Public, rate-limited
- **RBAC / object-authz:** N/A (account creation)
- **Action-authz:** N/A
- **Request:** role, credentials, org fields (Institution/Company only)
- **Response:** created account, `status` (`ACTIVE` for Student, `PENDING` for Institution/Company)
- **Side effects:** Creates account
- **State transition:** none → `ACTIVE` (Student) / none → `PENDING` (Institution/Company)
- **Audit event:** `account_created`
- **Idempotency:** Yes (email uniqueness)
- **Errors:** 409 on duplicate email; 422 on schema validation failure

## POST /admin/institutions/{id}/activate
- **Actor:** Admin
- **Authz:** Admin-only
- **Request:** institution id (path)
- **Response:** updated institution status
- **Side effects:** `PENDING → ACTIVATED`
- **Audit event:** `institution_activated`
- **Idempotency:** Yes
- **Errors:** 404 unknown id; 409 if not currently `PENDING`

## POST /admin/companies/{id}/activate
- **Actor:** Admin
- **Authz:** Admin-only
- **Side effects:** `PENDING → ACTIVATED`
- **Audit event:** `company_activated`
- **Idempotency:** Yes
- **Errors:** 404 unknown id; 409 if not currently `PENDING`

## POST /students/{id}/evidence
- **Actor:** Student (self)
- **Authz:** Object-owner
- **Request:** skill_claim_id, evidence content
- **Response:** created evidence record, `status: SELF_REPORTED`
- **Side effects:** Creates evidence; cap of 5/claim enforced (FR-021)
- **Audit event:** `evidence_created`
- **Idempotency:** No
- **Errors:** 403 not object-owner; 422 cap exceeded

## POST /institutions/{id}/verify-evidence/{evidence_id}
- **Actor:** Faculty
- **Authz:** Institution must be `ACTIVATED`; object must belong to own student
- **Request:** verification decision
- **Response:** updated evidence, `verification_tier`
- **Side effects:** Sets `verification_tier`
- **State transition:** `SELF_REPORTED → INSTITUTION_VERIFIED`
- **Audit event:** `evidence_verified`
- **Idempotency:** Yes
- **Errors:** 403 cross-institution attempt (logged per FR-024); 409 institution not `ACTIVATED`

## PUT /students/{id}/evidence/{evidence_id}
- **Actor:** Student (self)
- **Authz:** Object-owner
- **Request:** updated evidence content
- **Response:** updated evidence, reverted status
- **Side effects:** Reverts verified evidence to `SELF_REPORTED` (FR-018)
- **State transition:** `INSTITUTION_VERIFIED → SELF_REPORTED`
- **Audit event:** `evidence_edited`
- **Idempotency:** No

## POST /companies/{id}/opportunities
- **Actor:** Recruiter
- **Authz:** Company must be `ACTIVATED`; object-owner
- **Request:** requirements (E/F inputs), capacity
- **Response:** created opportunity, `status: DRAFT`
- **Side effects:** Creates opportunity
- **Audit event:** `opportunity_created`
- **Idempotency:** No

## POST /students/{id}/preferences
- **Actor:** Student (self)
- **Authz:** Object-owner
- **Request:** ranked opportunity list (may be empty/incomplete — valid input, FR-012)
- **Response:** stored preference-list version
- **Side effects:** Sets/updates ranked preference list; system never reorders it
- **Audit event:** `preferences_submitted`
- **Idempotency:** No (versioned — each submission is a new version)

## POST /admin/cycles/{cycle}/allocation-runs
- **Actor:** System/Admin-triggered (background job)
- **Authz:** Admin or system job
- **Request:** cycle id
- **Response:** created `allocation_runs` row, `status: DRAFT`
- **Side effects:** Executes eligibility → fit → O-scoring → DA; writes `AllocationSnapshot`
- **State transition:** none → `DRAFT` → `PROPOSED`
- **Audit event:** `allocation_run_executed`
- **Idempotency:** No (new run each call)

## GET /allocation-runs/{id}
- **Actor:** Admin, Placement Cell (own institution scope)
- **Authz:** Tenant-scoped
- **Response:** run detail, status, snapshot reference
- **Audit event:** `allocation_run_viewed`
- **Idempotency:** Yes (read)

## POST /admin/allocation-runs/{id}/approve
- **Actor:** Admin
- **Authz:** Admin-only
- **Side effects:** `UNDER_REVIEW → APPROVED → PUBLISHED`
- **Audit event:** `allocation_approved`
- **Idempotency:** Yes

## POST /admin/allocation-runs/{id}/override
- **Actor:** Admin
- **Authz:** Admin-only
- **Request:** override decision, reason (mandatory)
- **Side effects:** `UNDER_REVIEW → OVERRIDDEN → VALIDATED → PUBLISHED`; stores original proposed assignment, decision, reason, acting admin, validation result as distinct linked records (FR-013)
- **Audit event:** `allocation_overridden`
- **Idempotency:** No (each override is a distinct event)

## POST /system/recovery/{allocation_generation}/trigger
- **Actor:** System (on dropout/vacancy event)
- **Authz:** System-only
- **Side effects:** Enqueues recovery over the transitive-closure-affected set; respects ≤1-active-per-candidate invariant
- **Audit event:** `recovery_triggered`
- **Idempotency:** Yes (per candidate/generation)

## POST /admin/recovery/{id}/escalate
- **Actor:** Admin
- **Authz:** Admin-only, only past `retry_count` threshold
- **Side effects:** Triggers a full market rerun
- **Audit event:** `recovery_escalated`
- **Idempotency:** Yes

## GET /students/{id}/allocation-status
- **Actor:** Student (self), shared parties per visibility state
- **Authz:** Object-owner or active visibility-grant
- **Response:** allocation status, visible per the requester's granted visibility scope
- **Audit event:** `allocation_status_viewed`
- **Idempotency:** Yes

## GET /institutions/{id}/analytics
- **Actor:** Placement Cell, Admin
- **Authz:** Tenant-scoped; sample-size ≥10 enforced before any aggregate is returned (FR-022)
- **Response:** aggregated-only metrics
- **Audit event:** `analytics_viewed`
- **Idempotency:** Yes
- **Errors:** 204/empty if sample size <10 (no individual-level data ever returned as a fallback)

## POST /system/models/{cycle}/train
- **Actor:** System (background job)
- **Authz:** System-only
- **Side effects:** Trains on TRAIN partition
- **Audit event:** `model_trained`
- **Idempotency:** Yes (per cycle)

## POST /system/models/{cycle}/validate-activate
- **Actor:** System (background job)
- **Authz:** System-only
- **Side effects:** Runs the five-condition activation gate on VALIDATION only; freezes `validation_evidence`, evidence included, regardless of outcome
- **Audit event:** `model_activation_decided`
- **Idempotency:** Yes (per cycle)

## POST /system/outcomes/{cycle}/generate
- **Actor:** System (background job)
- **Authz:** System-only
- **Side effects:** Generates `OFFER_EXTENDED` for the full eligible-pair universe, post-allocation, per the label-generator feature contract
- **Audit event:** `outcomes_generated`
- **Idempotency:** Yes (per cycle)

---

## Endpoints Not Enumerated (Deferred Detail)

- A deletion/pseudonymization endpoint acting on `subject_identity_mapping` is required by FR-015/Part 12 but its exact path is not specified in the Master — Deferred detail (see 01-requirements/TRACEABILITY.md, Privacy row).
- No endpoints exist for `O_shortlist`/`O_interview`, unseen-opportunity/company evaluation, or `CONTACT_SHARED` — all Phase 2 (see 00-product/PRD.md §14). Do not add these endpoints to Phase-1 implementation.

## Naming Consistency

Path segments follow `/{tenant-scope}/{resource}/{id}/{sub-resource}` throughout. Job-triggered endpoints are prefixed `/system/`; admin-only actions are prefixed `/admin/`. This convention is Derived, not Master-locked, and may be revised without a Master update — but must stay consistent across this document.
