# ANCHOR — SECURITY & PRIVACY SPECIFICATION

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

## 1. Canonical Authorization Chain

```
AuthN → RBAC → object/tenant-authorization → action-authorization → audit
```

Applied as cross-cutting middleware to **every** endpoint uniformly — never an ad hoc "filter by ownership" rule on list queries only. Do not reduce this to a simple role check anywhere in implementation.

- **AuthN:** JWT/OAuth2.
- **RBAC:** per Master Part 3's role table (Student, Institution, Faculty, Placement Cell, Company, Recruiter, Mentor, Administrator).
- **Tenant isolation:** Institution/Company/Student data scoped to owning tenant by default.
- **Object authorization:** the action must target an object the actor is authorized against — not merely a role check.
- **Action authorization:** distinct from object authorization — an actor may read an object but not perform a given action on it (e.g., a Recruiter reads shared evidence but cannot verify it).
- **Cross-tenant rejection:** attempts are rejected, logged, and UI-visible in the audit trail.
- **Audit logging:** every authorization-decision-relevant event logged with actor, action, object, tenant, timestamp.

## 2. Institution/Company Activation

Both activate only via `PENDING → Admin approval → ACTIVATED`. No self-service path to a trusted role for either, anywhere in the system.

## 3. Evidence Verification

- Faculty sets `verification_tier`, precisely scoped to "verified by institution account" — never implying a stronger guarantee.
- **Verification downgrade:** editing verified evidence reverts it to `SELF_REPORTED` until re-verified.
- **Institution reactivation:** after deactivation and later reactivation, prior verification validity is not auto-restored — stays `STALE` until explicit re-review.

## 4. Admin Bootstrap

Single pre-seeded Admin account (env-config seeded, hashed, idempotent seeding). No public, self-service Admin role selectable at registration, anywhere. *(Mechanism for provisioning additional admins beyond the seed account is not specified in the Master — Deferred/Configurable.)*

## 5. Profile Visibility

| State | Who can see profile | What's visible |
|---|---|---|
| `PRIVATE` | Self, Institution (own students), Admin | Full profile, not discoverable by Companies |
| `DISCOVERABLE` (demo only) | + any Company browsing | Profile summary, not full contact/evidence |
| `APPLICATION_SHARED` | + the specific Company on that `application_id` | Evidence relevant to that application |
| `CONTACT_SHARED` (Phase 2 milestone) | + that Company | Full contact details |

- **Real-user default:** `PRIVATE`, explicit opt-in required for `DISCOVERABLE`.
- **`DISCOVERABLE`-by-default:** seeded demo dataset only — never real onboarding.
- **`APPLICATION_SHARED` scope:** locked to a specific `application_id` — not student+company or student+company+role. Withdrawing one application does not affect visibility granted via a different application to the same company.
- **`CONTACT_SHARED`:** separate, later-stage milestone, narrower than `APPLICATION_SHARED`, required before full evidence/contact details are shared.

## 6. Application-Scoped Sharing

Visibility grants are always scoped to a single `application_id`, never broadened implicitly to "this student and this company" as a standing relationship.

## 7. Identity Mapping

`subject_identity_mapping` (mutable): `candidate_subject_token → real identity`, stored outside the hashed snapshot artifact. Access-controlled at a stricter tier than general snapshot access — treated as a distinct, higher-sensitivity authorization tier under the action-authorization layer.

## 8. Snapshot Privacy

`AllocationSnapshot` (immutable): direct identity excluded by construction. The design does **not** claim mathematical non-identifiability — it claims specifically:
1. Direct identity is excluded from the snapshot.
2. Re-identification requires access to the separate, access-controlled `subject_identity_mapping` table.
3. Snapshot access is itself authorization-controlled.
4. Only allocation-required attributes are retained.

This is the stated privacy scope for the synthetic prototype — not a stronger anonymity guarantee. The combination of attributes inside a snapshot can still act as a quasi-identifier; this is acknowledged, not overclaimed away.

## 9. Deletion / Pseudonymization

Acts **only** on `subject_identity_mapping`. `AllocationSnapshot` is never touched — its immutability/reproducibility guarantee is never broken by a privacy request. *(The exact deletion-endpoint path is not enumerated in the Master — Deferred detail, see ANCHOR_API_SPEC.md.)*

## 10. Reproducibility

Given a snapshot's recorded versions and `random_seed`, the allocation run it describes is deterministically replayable. `snapshot_hash` is computed over `snapshot_blob` at write time and never recomputed or altered — downstream verification re-derives the hash from the stored blob to confirm no tampering.

## 11. Invalidation Triggers (Security/Privacy-Relevant)

A `PROPOSED` run goes stale/`INVALIDATED` before publication if:
- **Algorithm/config:** `policy_alpha`, model/calibration version, tiebreak epsilon, capacity-computation formula changes.
- **Opportunity lifecycle:** withdrawal/closure, capacity change, eligibility-requirement change, material detail edit.
- **Evidence:** added/edited/removed post-snapshot; verification status change (e.g., revocation reverting to `SELF_REPORTED`); degree/track correction.
- **User/account-state:** preference-list edit; application withdrawal/opt-out; account deactivation or reactivation (subject to `STALE`-until-re-review).

## 12. Threat/Access Model Summary

| Concern | Mitigation |
|---|---|
| Cross-tenant data access | Tenant-scoped middleware; every rejection logged and audit-visible |
| Trusted-role impersonation | Admin-only activation gate; no self-service path for Institution/Company/Admin roles |
| Stale verification exploited post-reactivation | `STALE` status forces explicit re-review before verification is trusted again |
| Re-identification from allocation data | Identity separated into its own access-controlled table; snapshot itself never carries direct identity |
| Snapshot tampering | Hash computed at write time; downstream verification re-derives and compares, never trusts a re-supplied hash |
| Unauthorized action on an owned-but-not-permitted object | Action-authorization layer, distinct from object-ownership check |
| Silent, unaccountable allocation edits | Mandatory human-review gate before publication; overrides always produce distinct, linked, reasoned records |

## 13. Non-Claims (must propagate to every security/privacy statement)

- No claim of mathematical anonymity for `AllocationSnapshot` — only the specific, scoped claims in §8.
- No claim that deletion/pseudonymization removes all trace of a subject — it acts only on the identity-mapping table.
- No claim that `tiebreak_key` is a protected or fairness-relevant attribute.
