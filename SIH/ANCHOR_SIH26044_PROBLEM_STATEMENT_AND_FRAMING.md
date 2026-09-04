# SIH26044 — EXACT PROBLEM STATEMENT & ANCHOR FRAMING

```text
Purpose:   Ground ANCHOR in the actual, verified SIH26044 problem statement —
           not an assumed one.
Status:    New. Corrects a domain assumption in earlier gap-analysis work.
Relation
to Master: Additive only. Nothing in ANCHOR_MASTER_DESIGN.md or the 15
           derived documents is edited by this file — see §4.
```

---

## 1. THE EXACT, VERIFIED PROBLEM STATEMENT

| Field | Value |
|---|---|
| **PS Code** | **SIH26044** |
| **Track** | Software |
| **Title** | **"Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement"** |
| **Sponsoring Organisation** | **Ministry of Ayush, Government of India** |
| **Prize** | ₹1,00,000 |
| **Submission deadline (as scraped)** | 20 September 2026 |
| **Official portal** | sih.gov.in |
| **Theme** | Listed inconsistently across mirrors — see §2 |

**Full "Overview" text as published** (this is the complete brief text found in every source checked — see §2 for why this is shorter than most other PS briefs):

> *"Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement. Sponsoring ministry specifications, guidelines, and submission requirements released on the official portal sih.gov.in."*

**Source:** SIH 2026 Official Master Catalogue, curated from sih.gov.in, cross-verified against two independent scrapes:
- BlinkNBuild SIH 2026 Master Catalogue PDF (curated from sih.gov.in; entry for SIH26044, Ministry of Ayush) — blinknbuild.in/Assets/SIH_2026_All_226_Problem_Statements_Master_Catalogue.pdf
- SIH 2026 Problem Statement viewer (independent scrape, same title/ministry/PS-code triple) — sih2026-ps-viewer.vercel.app and sih2026.vuce.in
- A third independent GitHub scrape (NoBugNinja/Smart-India-Hackathon-SIH-2026-Problem-Statements) — same title/ministry/PS-code triple

All three independently-scraped sources agree on: **PS code, exact title text, and sponsoring ministry (Ministry of Ayush)**. This triple agreement is why the PS code, title, and ministry above are reported with high confidence.

---

## 2. TWO HONEST DISCREPANCIES — DO NOT PAPER OVER THESE

Following ANCHOR's own documentation discipline (never invent detail the source doesn't give — see ANCHOR_DOCUMENTATION_AUDIT.md's own "no invented figures" standard), two things are flagged rather than resolved by guessing:

**(a) Theme classification is inconsistent across sources.**
- The BlinkNBuild Master Catalogue lists SIH26044 under theme **"Smart Automation."**
- The independently-scraped sih2026-ps-viewer.vercel.app / sih2026.vuce.in and the NoBugNinja GitHub scrape list it under theme **"Miscellaneous."**
- **Recommendation:** verify the theme directly on sih.gov.in before finalizing any theme-specific framing (e.g., if pitching to a "Smart Automation"-track jury vs. a general jury, the emphasis differs). Do not assume either is authoritative from this research alone.

**(b) No extended Background / Detailed Description / Expected Solution text is available for SIH26044.**
Most other PS entries in the same catalogue (e.g., SIH26101, SIH26104, SIH26105, SIH26106, SIH26149, SIH26156) carry a multi-paragraph Background → Problem Statement → Proposed Solution → Key Components → Expected Outcomes structure, sometimes running 500+ words. **SIH26044's entry, across every source checked, is only the one-sentence Overview quoted in §1** — no such extended structure exists for it in any indexed source.

Two honest possibilities, stated plainly rather than resolved by invention:
1. The Ministry of Ayush genuinely published only a short-form brief for this PS (some ministries do this, leaving teams more interpretive latitude), **or**
2. A longer official brief exists on sih.gov.in's interactive portal but was not captured by the scrapers indexed here (the portal is a filtered, JS-rendered app rather than a static page).

**Action item, stated as an open item, not answered here:** confirm directly on sih.gov.in (or with your SIH mentor/SPOC) whether a longer official brief exists before finalizing your PPT's Problem Statement slide. If none exists, the short title is itself the full official scope — which is common for AICTE/ministry-sourced "portal-class" PS entries and is not a red flag by itself.

---

## 3. WHAT THE VERIFIED PROBLEM STATEMENT MEANS FOR ANCHOR — FRAMING

This is the most consequential correction from this research: **the sponsoring ministry is the Ministry of Ayush, not the Ministry of Education, AICTE, or any general higher-education body.** Read literally and in context, "Academia" and "Industry" in this PS title are far more likely to mean **AYUSH academia and AYUSH industry** specifically — not engineering/generic higher education. This is a *domain* signal about the ministry's intent, even though it is not stated in so many words in the short brief.

### 3.1 What this does — and does not — change about ANCHOR

**Does NOT change:** Anything in the Locked Master architecture. The candidate-proposing Deferred Acceptance mechanism (ADR-01), the E/F/O structural separation (ADR-02), governance (ADR-09), snapshot/privacy design (ADR-08), and the entire technical stack are domain-agnostic by construction — nothing in them assumes "engineering student" or "IT company" specifically. This is a genuine strength of the existing design: it was built correctly, without an unstated domain assumption baked into the mechanism layer. See §4 for the explicit contradiction check.

**DOES change:** The domain used for *framing, examples, market sizing, competitive analysis, and government-integration narrative* in any pitch material — including the previously delivered ANCHOR_SIH_GAP_ANALYSIS_AND_ANSWERS.md, which assumed a generic/AICTE-style engineering-placement framing (JoSAA comparison, AISHE-wide market sizing, PM Internship Scheme/AICTE government-channel narrative). That framing is not *wrong* as a fallback general-education narrative, but it is not the *best* narrative for a PS explicitly sponsored by the Ministry of Ayush.

### 3.2 The corrected reading of "Academia" and "Industry" for SIH26044

| Term in PS title | Best-fit interpretation for Ministry of Ayush | Real-world entities this maps to |
|---|---|---|
| **Academia** | AYUSH educational institutions — Ayurveda (BAMS), Homeopathy (BHMS), Unani (BUMS), Siddha (BSMS), Yoga & Naturopathy, and Pharmacy-ITRA programs | ~800+ Ayurveda colleges, 250+ Homeopathy colleges, plus Unani/Siddha/Sowa-Rigpa colleges nationally (state figures below); National Institutes (NIA Jaipur, AIIA Delhi, NIH Kolkata, NIUM Bangalore, NIS Chennai, NISR Leh); regulated by the **National Commission for Indian System of Medicine (NCISM)** and **National Commission for Homoeopathy (NCH)** |
| **Industry** | The AYUSH manufacturing, wellness, and healthcare-delivery industry | Herbal/Ayurvedic pharmaceutical manufacturers (Dabur, Himalaya, Patanjali, Baidyanath, Zandu, and thousands of smaller/MSME producers), Panchakarma and wellness centers, AYUSH hospitals, nutraceutical and cosmeceutical firms, AYUSH-focused startups |
| **Skill Mapping, Internships, Placement** | Same functional shape ANCHOR already solves (candidates, opportunities, evidence, allocation) — but skill claims, eligibility criteria, and evidence types are domain-specific (e.g., a BAMS student's mandatory clinical-internship/Panchakarma-training hours are a different eligibility criterion than a "mandatory certification" in the generic framing) | N/A — this is a mechanism-layer implication, addressed in §3.3 |

### 3.3 What actually needs adapting in ANCHOR's `E`/`F` inputs (illustrative, not a Master change)

The Master's `E`/`F` definitions are already written generically enough to absorb this without modification — ANCHOR_ALLOCATION_ENGINE.md §2 defines `E` as "mandatory criteria only (degree/track, availability, mandatory certification, quota-category)" and `F` as "skill/semantic overlap ... location/sector compatibility." These fields were never hardcoded to an engineering-specific vocabulary. What changes is only the **populated content** of those fields for this domain, e.g.:
- `E` mandatory criteria would plausibly include: BAMS/BHMS/BUMS/BSMS degree-track match, completion of mandatory clinical/Panchakarma internship hours (an AYUSH-specific accreditation requirement, analogous to how the generic spec already treats "mandatory certification"), NCISM/NCH registration status where applicable.
- `F` graded skill overlap would plausibly include: specific therapeutic specialization (e.g., Panchakarma, Kayachikitsa, Rasashastra) semantic overlap with a wellness center's or manufacturer's posted requirements, exactly as the generic "skill/semantic overlap" sub-factor is already specified to work.

**This is a configuration/data question, not an architecture question** — and is explicitly the kind of decision the Master already delegates to implementation (ANCHOR_ARCHITECTURE.md §22's Locked-vs-Derived table: "exact module boundaries and their internal decomposition" is Derived, not Locked). No ADR needs reopening.

---

## 4. CONTRADICTION CHECK AGAINST THE 15 ORIGINAL ANCHOR DOCUMENTS

Each of the 15 uploaded documents was re-read specifically against this new Ministry-of-Ayush information, checking for any explicit or implicit claim that would now be **false or misleading**. Result:

**No original ANCHOR document contains a contradiction that requires a change.** Specifically:

- **ANCHOR_LATEST_IDEA.md, ANCHOR_PRD.md, ANCHOR_SRS.md** — describe "Institution," "Company," "Student," "Recruiter" generically throughout; never assert an engineering-only or IT-only domain. No line requires editing.
- **ANCHOR_ALLOCATION_ENGINE.md, ANCHOR_AI_DS_SPEC.md, ANCHOR_DATA_MODEL.md** — `E`/`F`/`O` are defined at the level of "mandatory criteria," "skill overlap," "sector compatibility" — domain-neutral by design (confirmed in §3.3 above). No line requires editing.
- **ANCHOR_ADRS.md** — ADR-01's JoSAA comparison remains valid: JoSAA is cited as a *mechanism*-level precedent (candidate-proposing DA at government scale), not a claim that ANCHOR serves the engineering-admissions domain. This stays accurate regardless of which ministry sponsors the PS. No line requires editing.
- **ANCHOR_ARCHITECTURE.md, ANCHOR_API_SPEC.md, ANCHOR_SECURITY_PRIVACY.md, ANCHOR_STATE_MACHINES.md, ANCHOR_TEST_PLAN.md, ANCHOR_TRACEABILITY.md, ANCHOR_IMPLEMENTATION_PLAN.md, ANCHOR_UX_SPEC.md, ANCHOR_DEMO_SCRIPT.md, ANCHOR_DOCUMENTATION_AUDIT.md** — all domain-neutral in the same way; the Documentation Audit's own PASS verdict is unaffected because nothing it verified was a domain-specific claim.

**Conclusion: zero edits to the 15 original documents are needed or made.** This is not a gap — it is confirmation that the Master's original discipline (never hardcoding an unstated domain assumption into E/F/O, ADRs, or the data model) was the right call, and it is exactly what makes this ministry correction low-cost to absorb.

**What DID need correction, and has been corrected:** the previously delivered `ANCHOR_SIH_GAP_ANALYSIS_AND_ANSWERS.md` (a supplementary document I generated, not part of your original 15) assumed a generic/AICTE-style engineering-education framing in three places — market sizing (used all-India AISHE higher-ed figures), competitive analysis (used generic placement-portal competitors), and government-integration narrative (named AICTE/PM Internship Scheme/NCS as the primary channel). Those three sections are superseded by the corrected, Ministry-of-Ayush-grounded versions in the companion document **ANCHOR_SIH_FINAL_MASTER_ANSWERS.md**. Treat that new document as authoritative going forward; the original gap-analysis document's *structure* (the 15-question framework, the risk register, the references list, the Q&A script) remains valid and is carried forward unchanged, since none of that content was domain-specific.

---

## 5. ONE-LINE REFRAMED PROBLEM STATEMENT FOR YOUR TITLE SLIDE

> *"India's AYUSH academia and AYUSH industry currently have no structured, mechanism-grounded system connecting verified student skill evidence to real internship/placement capacity — matching today is manual, opaque, and disconnected, exactly the gap SIH26044 (Ministry of Ayush) asks to close."*

This sentence is deliberately conservative: it restates the verified PS title (§1) plus the two-clause problem framing your own ANCHOR_LATEST_IDEA.md §2 already argues in general terms ("fragmented, low-fidelity channels... manual... naively automated"), now pointed at the correct, verified sponsoring domain instead of an assumed one.
