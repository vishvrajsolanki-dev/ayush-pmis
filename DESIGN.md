# Anchor — DESIGN.md
### Canonical reference for coding agents building from Stitch MCP

This file is the single source of truth for which Stitch screens are final and what rules every generated screen must obey. Agents should re-read this file before generating or reviewing any screen — do not rely on chat history or earlier drafts.

**Project:** Anchor Allocation Platform
**Stitch Project ID:** 14147166360881603789

⚠️ **This Stitch project contains 100 screens total.** Only the 28 listed below are final/accepted. All others are prior iterations, "Updated," or "Corrected" duplicates from earlier correction rounds (e.g. multiple non-final versions of "Run Review - Admin," "Activation Queue - Admin," etc. exist under different titles/IDs). **Always fetch by the exact screen ID below — never by title alone**, since several rejected iterations share similar or identical titles with the final ones.

---

## 1. Screen Manifest (confirmed final — fetch by ID only)

| # | Role | Screen | Stitch Screen Name | Screen ID |
|---|---|---|---|---|
| 1 | Student | Onboarding | FINAL_Student_Onboarding | `8c1c04dd5a9b4c5e920985e1ca2a557b` |
| 2 | Student | Profile | FINAL_Student_Profile | `78a72feab75242178cdf67e86ce7ef94` |
| 3 | Student | Evidence Management | FINAL_Student_Evidence | `5326babbb6b54cccb6eaf947b78193a9` |
| 4 | Student | Opportunities Browse | FINAL_Student_Opportunities | `930f0fc01b8c4417b6525f187615a100` |
| 5 | Student | Preference Submission | FINAL_Student_Preferences | `da1720733493477aa1f2a84214127d31` |
| 6 | Student | Allocation Status | FINAL_Student_AllocationStatus | `6d65326de4d04aecabb07ad946331178` |
| 7 | Faculty | Verification Queue | FINAL_Faculty_VerificationQueue | `404310bf24284776b02ec96aa08b131d` |
| 8 | Faculty | Verification Detail — Success | FINAL_Faculty_VerificationDetail_Success | `89512e5bb9dd4aa2a8ea34776023a81e` |
| 8b | Faculty | Verification Detail — Denied | FINAL_Faculty_VerificationDetail_Denied | `8d656eedea894ea9a63916f9b1024027` |
| 9 | Faculty | Student Roster | FINAL_Faculty_StudentRoster | `9baa3c8700484685a6ffc5c9c96ce718` |
| 10 | Placement Cell | Analytics / Allocation Outcomes | FINAL_PlacementCell_Analytics | `398c200a41cf424d9f79561732ea5e3e` |
| 11 | Recruiter | Opportunity Management | FINAL_Recruiter_OpportunityManagement | `28ab70cfc8684b3cbbdd4e7903ddecd7` |
| 12 | Recruiter | Shared Evidence (view-only) | FINAL_Recruiter_SharedEvidence | `4e34a3ccaf414553847df91592c8222b` |
| 13 | Admin | Activation Queue | FINAL_Admin_ActivationQueue | `715f26a198f848e8b5448ad5b56ed02b` |
| 14 | Admin | Organization Detail | FINAL_Admin_OrganizationDetail | `655d13e67b084a929cff344710176ee4` |
| 15 | Admin | Allocation Runs List | FINAL_Admin_AllocationRunsList | `05e6ca91b92943e08396a8f7a6a40a10` |
| 16 | Admin | Run Review | FINAL_Admin_RunReview | `a343283b22e844c7bc69bf22fcbcb7a4` |
| 17 | Admin | Override Modal | FINAL_Admin_OverrideModal | `ab3291344f684bd0b6114610326a129b` |
| 18 | Admin | Recovery Queue | FINAL_Admin_RecoveryQueue | `7a6f3a59c6084364a05704ea36391fa4` |
| 19 | Admin | Recovery Detail / Escalate | FINAL_Admin_RecoveryDetail | `789686321de24393a5b4f087c3e0da85` |
| 20 | Admin | Audit Log | FINAL_Admin_AuditLog | `a70cc3a7ad474155a2adfbeb98c819a5` |
| 21 | Mentor | Assigned Candidates — Default | FINAL_Mentor_AssignedCandidates_Default | `1505340c5ae1485b8c2a02d7ca369215` |
| 22 | Mentor | Assigned Candidates — Empty | FINAL_Mentor_AssignedCandidates_Empty | `e02995307286427d83ffeea44f488b99` |
| 23 | Mentor | Assigned Candidates — Loading | FINAL_Mentor_AssignedCandidates_Loading | `50b11ff4c0b44c6f94b1716506ac0dec` |
| 24 | Faculty | Permission-Denied (cross-institution) | FINAL_Faculty_PermissionDenied | `81e2ad3f2c074319afc586b8eacd5c54` |
| 25 | Student | Evidence — Cap-Reached | FINAL_Student_Evidence_CapReached | `6115da80dd254009b970a6e015cac389` |
| 26 | Institution | Analytics — Insufficient-Sample-Size | FINAL_Institution_Analytics_InsufficientSample | `91d23f9dc73649ba8f1f547df556e8df` |
| 27 | Admin | Run Review — Invalidated | FINAL_Admin_RunReview_Invalidated | `a63827dd85f84d1fb1f21138c8c78949` |

**28 screens total** (item 8 and 8b are two states of one screen).

---

## 2. Role → Nav Map (do not deviate)

| Role | Sidebar Nav Items (exactly these) |
|---|---|
| Student | Profile · Evidence · Opportunities · Preferences · Allocation Status |
| Faculty | Verification Queue · Student Roster |
| Placement Cell | Analytics · Allocation Outcomes |
| Recruiter | Opportunities · Shared Evidence |
| Mentor | Assigned Candidates *(one item only)* |
| Admin | Institutions/Companies (Activation Queue list, with Organization Detail as a row drill-down) · Allocation Runs · Recovery Queue · Audit Log |

Never share a nav item set across roles. Never add an item not listed here. Admin's sidebar must show exactly 4 top-level items — Organization Detail is reached by clicking into a row from Institutions/Companies, not a separate sidebar entry.

---

## 3. Global Product & Copy Rules (apply to every screen, every state)

1. Never display "confidence" anywhere — model/heuristic output is a **priority tier** only.
2. Every priority tier must show a visible `outcome_signal_source`: **Model** or **Fallback**.
3. `α` (alpha) is one fixed value per allocation run — never varying row-by-row.
4. Never label tie-breaking as a fairness mechanism.
5. Recovery results are always labeled **"locally stable heuristic"** — never full DA stability. Overrides never inherit the original run's stability label.
6. Never show a numeric recovery retry-count threshold.
7. No transcripts, GPA, or "Academic Standing" anywhere — only skill claims, evidence, and verification tiers.
8. No financial/banking data anywhere (no dollar ledgers, Risk Tiers, Tax ID Match) — on every state of every screen, including error/invalidated variants.
9. Every status badge has its own distinct color — no two statuses share a color. Allocation run statuses are exactly 7: DRAFT, PROPOSED, UNDER_REVIEW, APPROVED, OVERRIDDEN, INVALIDATED, PUBLISHED.
10. Admin sidebar always shows "Current Tenant: Global Administration" + a "Scope: Global Administration" pill — identical on every Admin screen, never a specific org name.
11. Evidence verification tier is always the full phrase **"Verified by institution account"** — never truncated or strengthened. Verification states are exactly: SELF_REPORTED, INSTITUTION_VERIFIED, STALE — no invented tiers (e.g. no "Tier 3 / Assessed").
12. An Invalidated run never shows live Approve/Publish — only "Start New Run."
13. Analytics never shows a raw number below sample size 10 — locked/suppressed state with a real (non-placeholder) sector name.
14. Synthetic data is labeled "synthetic" wherever shown.

---

## 4. Verification Instruction for Reviewing Agents

Before marking any screen complete, check it against every rule in Section 3 and confirm its nav matches Section 2 exactly for its role. If a rule was applied to one state of a multi-state screen (e.g., default vs. empty vs. invalidated), confirm it was applied to **all** states of that screen, not just the one generated first. This project has repeatedly regressed on exactly this failure mode — a fix landing on one state without propagating to its siblings.
