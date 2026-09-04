# ANCHOR — FINAL MASTER ANSWER DOCUMENT (SIH26044, Ministry of Ayush)
### Fully researched, source-quoted answers to every pitch-facing question your 15-document ANCHOR set doesn't cover

```text
Status:        FINAL — supersedes ANCHOR_SIH_GAP_ANALYSIS_AND_ANSWERS.md
Corrects:      Market sizing, competitive landscape, and government-integration
               narrative, which previously assumed a generic/AICTE framing.
               See 00-product/PROBLEM_STATEMENT.md for why.
Relation to
the Master:    Additive only — zero edits to any of your 15 original ANCHOR
               documents were needed (verified in the companion doc, §4).
Read with:     00-product/PROBLEM_STATEMENT.md (the exact PS
               text + domain framing this document builds on)
```

---

## 0. WHAT CHANGED FROM THE FIRST DRAFT, AND WHY

The first gap-analysis pass (delivered before the exact PS was verified) built its market, competitor, and government-integration answers around a generic higher-education/AICTE framing. Verifying SIH26044 directly against sih.gov.in mirrors showed the sponsoring body is **Ministry of Ayush**, not Ministry of Education/AICTE. Three sections below (§3 Market Sizing, §4 Competitive Landscape, §11 Government Integration) are therefore fully rewritten with AYUSH-sector data. Every other section (risk register, cost model, references, Q&A script) carries forward unchanged, because nothing in them was domain-specific to begin with — flagged explicitly where that's true.

This document still respects every rule your own documents already established: no invented figures, every number cited to a named source, honest disagreement between sources shown rather than hidden (see §3.2), and no claim stronger than the evidence supports — the same discipline 03-engineering-specs/AI_DS_SPEC.md §16 and 08-audit/DOCUMENTATION_AUDIT.md already apply to the technical spec, now applied to the pitch material.

---

## 1. THE VERIFIED PROBLEM STATEMENT (summary — full detail in the companion doc)

**SIH26044** · Software · **Ministry of Ayush** · *"Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement"* · ₹1,00,000 prize · sih.gov.in. See the companion document for the full verification trail, the two honest source discrepancies (theme classification, absence of an extended official brief), and the reframed one-line problem statement for your title slide.

---

## 2. BUSINESS MODEL — freemium B2B2G, AYUSH-sector grounded

**Model: students free, always. AYUSH institutions and AYUSH industry pay for capability. The Ministry of AYUSH's existing scheme infrastructure is the anchor-tenant and scale channel — not a hypothetical government partner, but one that already runs a structurally identical allocation process (see §2.3).**

### 2.1 Why students must never pay (unchanged from prior draft — this is a hard constraint, not domain-specific)
Charging the mandatory-participant, less-powerful side of a two-sided market for access to a placement process is both an equity failure and a direct contradiction of Anchor's own "AI predicts; matching decides; constraints protect; humans govern" principle (00-product/PRODUCT_NARRATIVE.md §3) and its opt-in-only, `PRIVATE`-by-default data posture (03-engineering-specs/SECURITY_PRIVACY.md §5).

### 2.2 Revenue streams, AYUSH-specific
| Stream | What it buys | Why this payer, this price point |
|---|---|---|
| **AYUSH institution SaaS license** (annual, per-institution or per-seat) | Verified clinical/Panchakarma-internship evidence infrastructure, Placement-Cell analytics, NCISM/NCH-reportable placement data | AYUSH colleges already report placement and internship-completion data upward to their regulator (NCISM for Ayurveda/Unani/Siddha, NCH for Homeopathy) — Anchor substitutes an existing manual reporting burden with structured output, which is budget-substitution, not new spend |
| **AYUSH industry / recruiter subscription** | Bulk opportunity posting beyond a free cap, expanded analytics, priority visibility | Mirrors the market-validated recruiter-subscription model of LinkedIn Talent Solutions / Naukri / Internshala-for-Recruiters — same monetizable surface, lower risk because the model itself is proven, just not yet applied to this vertical |
| **Ministry/scheme co-funding or grant** (the realistic first revenue) | Pilot deployment cost, integration with existing NCISM/NAM infrastructure | The Ministry of AYUSH already funds adjacent digital infrastructure directly — e.g., the **National AYUSH Mission (NAM)**, a centrally sponsored scheme (cited in Rajya Sabha reply, 11.03.2025, Q.1284); **AIIA ICAINE**, the Ministry's own AYUSH startup-incubation centre launched under AIIA (cited in the PIB/RIS release accompanying the "$18.1 billion" market-size announcement, 17 Dec 2024); and the **e-Charak** single-window portal for AYUSH manufacturer/lab licensing (National Government Services Portal, services.india.gov.in). A pilot co-funded through one of these channels is a realistic, precedented first revenue source — not a hypothetical one. |

### 2.3 The single strongest fact for this business-model conversation

**The Ministry of Ayush already runs a national, government-operated, candidate-proposing allocation process in this exact domain.** The **Ayush Admissions Central Counseling Committee (AACCC)**, under the **National Commission for Indian System of Medicine (NCISM)**, conducts online centralized counselling for All-India-Quota UG seats (BAMS/BSMS/BUMS/BHMS/B.Pharm-ITRA) and PG seats (MD/MS) across Government, Government-Aided, Deemed, and Central Universities (source: National Government Services Portal, services.india.gov.in, Ministry of Ayush service listing). This is **JoSAA's exact mechanism-class precedent, already running inside the sponsoring ministry itself**, for *admissions*. Anchor's pitch to the Ministry is not "adopt an unfamiliar mechanism" — it's "extend the same allocation discipline your own AACCC/NCISM process already uses for admissions, into internships and placement." This is a materially stronger version of the JoSAA argument in the original draft, because it's the same ministry, not an analogy from a different one.

**One-line answer if asked cold:** *"Free for every AYUSH student, always. Institutions and AYUSH industry pay for the tooling on top of a free, auditable mechanism — and the Ministry of Ayush already runs an AACCC-style national counselling process for admissions in this exact sector, which is both our credibility anchor and our most realistic first funding channel."*

---

## 3. MARKET SIZING — AYUSH-specific, every figure sourced

### 3.1 The AYUSH sector, sized with government-cited figures

| Metric | Figure | Source |
|---|---|---|
| AYUSH industry market size, 2020-21 | **US $18.1 billion**, up from $2.85B in 2014 (17% CAGR, ~6× growth in 7 years) | PIB Delhi press release, 17 Dec 2024, citing the RIS/FITM report *"Ayush Sector in India: Prospects and Challenges"* — also independently confirmed in Rajya Sabha Unstarred Q.1284, answered 11.03.2025 |
| AYUSH industry market size, 2022 | **US $23.3 billion** (same 17% CAGR trend line) | Rajya Sabha Unstarred Q.267/806, answered 11.02.2025 |
| AYUSH industry market size, 2023 (public ministerial statement) | **US $43 billion** (also cited as $43.4B) | Statement by Union Minister of State Shripad Yesso Naik (newsonair.gov.in, 2 Dec 2024) and by Ayush Ministry Secretary Vaidya Rajesh Kotecha at the CII Kerala Health Tourism & Global Ayurveda Summit 2025 |
| AYUSH exports | $1.09B (2014) → $1.54B (2020) → $2.16B (2023) | Rajya Sabha Unstarred Q.267/806, 11.02.2025; PIB 17 Dec 2024 |
| DPIIT-recognized AYUSH startups | **900+**, with 52% from Tier-2/Tier-3 cities | Rajya Sabha Unstarred Q.267/806, 11.02.2025 |
| MSMEs supported in the sector | **53,000+** | Same source |
| Patients benefiting from AYUSH integration into government hospitals | **5.4 crore** | Same source |
| Projected AYUSH contribution to India's GDP | **5% by 2047**, up from **1.1% today** | Ayush Secretary Kotecha, CII summit 2025, reported via ocacademy.in and multiple outlets |
| Job opportunities the sector is projected to generate | **~3 million** | Invest India sector page (investindia.gov.in/sector/ayush) |

**Honest flag on the range:** the $18.1B → $23.3B trajectory comes from the same RIS-report lineage cited consistently across two separate PIB/Rajya Sabha answers a year apart, and is the more rigorously sourced figure. The $43B figure comes from ministerial public remarks at conferences, without a named published report attached in the sources checked. **Present both, labeled by source type, rather than picking the bigger number** — this is exactly the discipline 03-engineering-specs/AI_DS_SPEC.md §16 already applies to your own O-signal claims, now applied here.

### 3.2 AYUSH academia — the "Academia" side of the market

| Metric | Figure | Source |
|---|---|---|
| Ayurvedic + Unani + Homeopathic institutions, **Uttar Pradesh alone** | 2,127 Ayurvedic + 259 Unani + 1,598 Homeopathic = **3,984 institutions in one state** | PTI, via careers360.com, 17 May 2025, reporting a UP government AYUSH department review chaired by CM Yogi Adityanath |
| National count of AYUSH colleges | **Not confidently sourced in this research** — Indiastat.com indexes an AISHE-linked "Number of Ayurveda, Siddha, Unani, Sowa Rigpa and Homeopathy Colleges" time series (2020-21 to 2024-25) but the aggregate figure itself sits behind a paywall/data-table not retrievable in this search | Flagged as an open item — see Action Item below |
| Admission counselling body | **AACCC (Ayush Admissions Central Counseling Committee), under NCISM** — conducts UG (BAMS/BSMS/BUMS/BHMS/B.Pharm-ITRA) and PG (MD/MS) All-India-Quota counselling annually | services.india.gov.in Ministry of Ayush service listing |

**Action item, stated honestly rather than papered over:** the UP figure (3,984 institutions) is a strong single-state proof point that the national AYUSH academia footprint is large, but a confident *national* aggregate figure was not retrievable in this research pass. **Before presenting a market-size slide, pull the exact national AISHE/NCISM college count** (indiastat.com's AYUSH-education dataset, or a direct NCISM/Ministry of Ayush RTI or annual-report figure) rather than extrapolating from one state. This is exactly the kind of unverified-precision gap your own AISHE-based market slide in the prior draft was already careful about — the same caution applies here, just flagged one level more explicitly because the number wasn't found at all rather than found-but-approximate.

### 3.3 TAM / SAM / SOM funnel, AYUSH-scoped

| Tier | Definition | Best available figure |
|---|---|---|
| **TAM** | All AYUSH academia + AYUSH industry entities nationally that could plausibly use a skill-mapping/internship/placement portal | Order of several thousand institutions (UP alone contributes ~4,000) + 900+ DPIIT-recognized AYUSH startups + thousands of MSMEs (53,000+ sector-wide, not all placement-relevant) — **do not state a single national TAM number without first closing the Action Item in §3.2** |
| **SAM** | AYUSH institutions with an active placement/internship function (BAMS/BHMS/BUMS/BSMS programs specifically, which have structured clinical-internship requirements) plus AYUSH industry/wellness employers actively recruiting interns/placements | A defensible, explicitly-labeled-as-estimated working figure, pending the Action Item |
| **SOM** | Realistic Phase-1→Phase-2 target: 1 pilot AYUSH institution (ideally one already inside the NCISM/AACCC counselling ecosystem, for channel credibility) → regional AYUSH-college cluster rollout | Matches your own Phase-1 conservatism (ADR-10: synthetic-only, no company-holdout claim in Phase 1) |

---

## 4. COMPETITIVE LANDSCAPE — AYUSH-specific, real named entities

| Existing system/precedent | What it does | Where Anchor differs |
|---|---|---|
| **AACCC / NCISM online counselling** | Centralized, government-run, ranked-preference seat allocation for AYUSH UG/PG *admissions* (not internships/placement) | This is Anchor's strongest precedent, not a competitor — it proves government-scale, ranked-preference allocation is already trusted and operational inside the sponsoring ministry. Anchor extends the same discipline downstream, from admissions into internships/placement, which AACCC does not cover. |
| **Manual placement-cell processes at individual AYUSH colleges** | Faculty-driven, ad hoc shortlisting for clinical internships and industry placements, no standardized cross-institution mechanism | Exactly the "manual... opaque" gap your own 00-product/PRODUCT_NARRATIVE.md §2 names generically — now grounded in a real, named, verifiable domain instead of an abstract "college placement cell" |
| **Generic job/internship portals (Internshala, LinkedIn, Naukri)** | Ranked-list discovery, no mechanism-level stability guarantee, no AYUSH-specific evidence/verification model (e.g., no structured way to represent completed Panchakarma-training hours or NCISM-registration status as a hard eligibility criterion) | Structural separation of hard eligibility / graded fit / synthetic signal (ADR-02) plus mandatory human governance (ADR-09) — neither exists in a generic portal |
| **AYUSH-specific government digital infrastructure already live** (for context, not as direct competitors): **e-Charak** (medicinal-plants sourcing platform, National Medicinal Plants Board), the **single-window AYUSH manufacturer/drug-testing-lab licensing system**, **AIIA ICAINE** (AYUSH startup incubation) | Adjacent AYUSH-sector digital infrastructure, none of which does skill-mapping/internship/placement allocation | Anchor is complementary to, not competing with, this existing digital ecosystem — worth naming to a Ministry-of-Ayush jury as evidence you understand what already exists (see the "we didn't know about X" failure mode named in the winning-team retrospectives cited in the original gap-analysis draft) |

**The one sentence that survives competitor cross-examination, AYUSH-corrected:**
> *"The Ministry of Ayush already trusts a candidate-proposing, ranked-preference mechanism for admissions through AACCC/NCISM. Every current option for what happens next — internships and placement — is either a manual, college-by-college process, or a generic portal with no AYUSH-specific evidence model and no mechanism-level guarantee. Anchor is the first system to bring the same discipline AACCC already uses for seats, to internships and placement."*

---

## 5. COST OF IMPLEMENTATION (unchanged from prior draft — genuinely domain-neutral)

Your locked stack (Next.js/Vercel, FastAPI/Render, PostgreSQL+pgvector, APScheduler — 02-architecture/ARCHITECTURE.md §1) was chosen specifically to avoid microservice/graph-DB/queue overhead (ADR-06, ADR-07), and that engineering discipline is also a cost decision:

| Phase | Monthly cost (₹, order-of-magnitude) | Why |
|---|---|---|
| Prototype / SIH demo | **₹0–1,500** | Free/hobby tiers across Vercel, Render, and managed Postgres cover a judged-demo load; runs entirely on synthetic data (ADR-10), so no data-licensing cost |
| Pilot (1 AYUSH institution) | **₹5,000–15,000** | Vertical scaling of the same stack — ADR-06/07 specifically avoid the architecture changes that would make this expensive |
| Regional AYUSH-cluster scale (10–20 institutions) | **₹25,000–60,000** | ADR-07 explicitly names this as the point to "revisit if job volume or scale-out needs grow" — i.e., already anticipated in the Master |

---

## 6. GO-TO-MARKET / PILOT PLAN — AYUSH-sequenced

1. **Pilot partner:** one AYUSH institution — ideally one already inside the NCISM/AACCC ecosystem or affiliated with a state AYUSH directorate (e.g., a state with an active AYUSH push, such as Uttar Pradesh's stated plan to build integrated AYUSH colleges "in every division" — PTI, 17 May 2025 — is a live, current signal of institutional appetite for AYUSH-sector digital investment). `HEURISTIC_FALLBACK` (ADR-05) means the DA + governance system is fully usable from day one with zero training data, so a real (non-synthetic-preference) pilot cycle can run immediately.
2. **Institutional expansion:** Placement-cell adoption sold on the auditability/NCISM-reportability value alone, independent of any AYUSH-industry uptake.
3. **AYUSH-industry-side network effect:** once several institutions run real cycles, recruiter-side (Ayurvedic pharma, wellness centers, hospitals) adoption follows, mirroring the standard two-sided-marketplace cold-start resolution — supply (verified candidates) before demand (recruiters).
4. **Ministry-channel scale:** position for co-funding or integration alongside an existing live Ministry of Ayush initiative — **National AYUSH Mission (NAM)** is the most structurally appropriate channel, being the Ministry's own centrally sponsored scheme for mainstreaming AYUSH systems (cited in Rajya Sabha reply 11.03.2025) — rather than institution-by-institution sales, which does not scale for a student team.

---

## 7. 3–5 YEAR ROADMAP (structure unchanged, AYUSH-contextualized)

| Horizon | Milestone | Grounded in |
|---|---|---|
| Year 1 | Single AYUSH-institution pilot; DA + governance live on `HEURISTIC_FALLBACK` | ADR-05, ADR-10 |
| Year 2 | Regional AYUSH-college cluster; `O_offer` ML activation once `MIN_O_EVENTS_PER_PARTITION` clears on real cycle data | 03-engineering-specs/AI_DS_SPEC.md §6–7 |
| Year 3 | Phase 2 begins per your own Master boundary: `O_shortlist`/`O_interview`, unseen-opportunity/company holdout evaluation, once real dataset scale exists | 00-product/PRD.md §14 |
| Year 4–5 | Potential integration conversation with NAM/AACCC-adjacent Ministry infrastructure; multi-AYUSH-system (Ayurveda/Yoga/Unani/Siddha/Homeopathy) coverage parity — flagged as future scope, not yet designed | New — open item |

---

## 8. SOCIAL / ECONOMIC / ENVIRONMENTAL IMPACT — quantified where possible, restrained where not

- **Social:** structural fairness for AYUSH students without informal industry networks — a declared-preference, mechanism-guaranteed process reduces the advantage of undisclosed manual discretion (ADR-01's stability property), in a sector where NSSO's 79th-round survey (July 2022–June 2023) found AYUSH awareness at 95–96% of the population but usage patterns still concentrated by access (46% rural / 53% urban usage in the past year — Rajya Sabha Q.267/806) — i.e., a sector with broad public reach but uneven structured access, which a transparent placement mechanism can help address at the education-to-employment stage specifically.
- **Economic:** direct line to the Ministry's own stated ambition of AYUSH reaching 5% of GDP by 2047 (Secretary Kotecha, CII 2025) and ~3 million projected jobs (Invest India) — a functioning skill-to-placement pipeline is infrastructure for that stated goal, not a disconnected claim.
- **Environmental:** state plainly, as before, that this is a software allocation system with no direct environmental impact claim to make. The only defensible secondary effect is reduced paper-based manual placement documentation and reduced duplicate/mismatched travel for internships — minor, secondary, not headline claims.

---

## 9. CONSOLIDATED RISK REGISTER (unchanged from prior draft — verified domain-neutral)

| Risk | Mitigation already designed |
|---|---|
| Cold start — no real data at launch | `HEURISTIC_FALLBACK` (ADR-05) |
| Data-poor cycles even post-launch | Same fallback, per-cycle, transparently logged |
| Synthetic-to-real generalization gap | Explicitly scoped as Synthetic Validity only (03-engineering-specs/AI_DS_SPEC.md §16) |
| Adoption resistance from placement cells used to manual control | Mandatory human review + override (ADR-09, 03-engineering-specs/ALLOCATION_ENGINE.md §11) |
| Privacy/re-identification concern | Scoped non-claim (03-engineering-specs/SECURITY_PRIVACY.md §8), identity/computation separation (ADR-08) |
| Recovery/override conflated with full DA stability | Explicit UI rule (04-ux/UX_SPEC.md §17), tested (RT-05) |
| National AYUSH-college count not yet confidently sourced (new, from §3.2) | Explicitly flagged as an open action item rather than papered over — resolve before presenting a hard TAM number |
| Theme-classification / extended-brief ambiguity for SIH26044 itself (new, from companion doc §2) | Explicitly flagged; verify directly on sih.gov.in before finalizing framing |

---

## 10. RESEARCH AND REFERENCES — the mandatory slide, AYUSH-strengthened

- **Gale, D., & Shapley, L. S. (1962). "College Admissions and the Stability of Marriage." *The American Mathematical Monthly*, 69(1), 9–15.** — origin of the Deferred Acceptance mechanism class Anchor implements.
- **AACCC / NCISM online counselling for AYUSH UG/PG admissions** — services.india.gov.in, Ministry of Ayush service listing — the strongest available real-world precedent, being inside the sponsoring ministry itself.
- **JoSAA / CSAB, Government of India** — a second, independent real-world precedent for the same mechanism class at national scale.
- **Research and Information System for Developing Countries (RIS) / Forum on Indian Traditional Medicine (FITM), "Ayush Sector in India: Prospects and Challenges" (2021)** — origin of the $18.1B/$23.3B market-size figures, cited via PIB Delhi (17 Dec 2024) and Rajya Sabha Unstarred Questions (11.02.2025, 11.03.2025).
- **National Sample Survey Office, 79th Round (July 2022–June 2023)** — the first all-India AYUSH-specific household survey, source for the awareness/usage figures in §8.
- **Brier, G. W. (1950). "Verification of Forecasts Expressed in Terms of Probability." *Monthly Weather Review*, 78(1), 1–3.** — origin of the Brier-score calibration metric used in your Practical-Significance activation gate (03-engineering-specs/AI_DS_SPEC.md §6–7).

---

## 11. GOVERNMENT/SCHEME INTEGRATION — corrected, Ministry-of-Ayush-specific (supersedes the AICTE/PM-Internship-Scheme framing in the prior draft)

| Existing Ministry of Ayush infrastructure | What it does | How Anchor relates |
|---|---|---|
| **AACCC (under NCISM)** | National counselling/allocation for AYUSH UG/PG admissions | Direct mechanism precedent (§2.3, §4) — Anchor extends the same discipline downstream into internships/placement, a stage AACCC does not cover |
| **National AYUSH Mission (NAM)** | Centrally sponsored scheme mainstreaming AYUSH systems, strengthening services and infrastructure | Most structurally appropriate co-funding/integration channel for a pilot (§6) |
| **AIIA ICAINE** | The Ministry's own AYUSH startup incubation centre (launched under AIIA, per the Dec 2024 PIB/RIS release) | A credible entry point if Anchor is positioned as an AYUSH-sector startup rather than only a hackathon prototype |
| **e-Charak** | Online platform for medicinal-plant sourcing (National Medicinal Plants Board) | Adjacent digital infrastructure — name it to show domain awareness, not as an integration target |
| **Single-window AYUSH manufacturer/lab licensing system** | License application/tracking for Ayurveda/Siddha/Unani/Homeopathy drug production | Same — adjacent, worth naming, not an integration target |
| **Ayush Visa scheme** | Facilitates international medical tourists seeking AYUSH treatment | Relevant context for why AYUSH industry demand for skilled talent is growing (medical-tourism-driven hiring), not a direct integration point |

**Why naming these matters:** a Ministry-of-Ayush-sponsored jury is disproportionately likely to include people from exactly this infrastructure. Citing AACCC specifically is the single highest-value correction in this whole document — it turns "why should we trust a new mechanism" into "you already trust this mechanism, for admissions, in your own ministry."

---

## 12. ONE-SENTENCE USP (AYUSH-corrected)

> **"Anchor extends the same candidate-proposing, government-trusted allocation discipline the Ministry of Ayush's own AACCC/NCISM counselling process already uses for admissions — structural separation of hard rules, explainable fit, and a synthetic learned signal, full human governance, and an immutable audit trail — into AYUSH internships and placement, where no such mechanism currently exists."**

---

## 13. JUDGE Q&A SCRIPT (carried forward unchanged — verified domain-neutral; AYUSH-specific additions marked NEW)

| Judge asks | Answer |
|---|---|
| "What if two candidates tie for the last seat?" | Deterministic `tiebreak_key`, seeded once at registration, epsilon `1e-9` (03-engineering-specs/ALLOCATION_ENGINE.md §7) |
| "What if there's no training data yet?" | `HEURISTIC_FALLBACK` — allocation never blocks, status shown transparently (ADR-05, DT-02) |
| "Does your AI predict who gets hired?" | No — `O_offer` is trained/evaluated entirely on synthetic data; deployment validity explicitly not assessed (03-engineering-specs/AI_DS_SPEC.md §16) |
| **NEW — "Why should the Ministry of Ayush trust this mechanism?"** | **Because it already does — AACCC/NCISM runs the same mechanism class for AYUSH admissions today. Anchor extends it one stage further.** |
| **NEW — "Isn't this just a generic placement portal renamed for AYUSH?"** | No — the E/F/O separation lets AYUSH-specific hard requirements (e.g., completed clinical-internship hours, NCISM/NCH registration) sit structurally apart from graded fit and from any learned signal, which no generic portal does, and which the sector's own regulator-driven eligibility requirements actually need |
| "What happens if a company withdraws an offer after publication?" | Recovery run over the transitive closure, explicitly labeled a locally stable heuristic, never full-market-stable (03-engineering-specs/ALLOCATION_ENGINE.md §13) |
| "Try it with [an edge-case input]" | Rehearse an empty preference list, a tie, and a zero-data cycle before presenting — crashing on a judge-supplied input is one of the most cited reasons strong SIH teams lose |

---

## 14. WHERE THIS GOES IN YOUR 6-SLIDE DECK

| Official slide | Pull from |
|---|---|
| Slide 1 — Title/Problem | §1 above + the companion problem-statement document's §5 reframed one-liner |
| Slide 2 — Idea, Solution, Uniqueness | §4 (competitive) + §12 (USP) |
| Slide 3 — Technical Approach | Unchanged — your existing 02-architecture/ARCHITECTURE.md / 03-engineering-specs/ALLOCATION_ENGINE.md content already carries this slide |
| Slide 4 — Feasibility & Viability | §2 (business model) + §5 (cost) + §9 (risk register) |
| Slide 5 — Impact & Benefits | §3 (market) + §6 (GTM) + §7 (roadmap) + §8 (impact) + §11 (government integration) |
| Slide 6 — Research & References | §10, directly |
| Judge Q&A prep (not a slide) | §13 |

---

## 15. OUTSTANDING ACTION ITEMS (stated honestly, not resolved by invention)

1. **Confirm SIH26044's theme classification** ("Smart Automation" vs. "Miscellaneous") directly on sih.gov.in.
2. **Confirm whether an extended official brief exists** for SIH26044 beyond the one-sentence overview found in every source checked here.
3. **Source a confident national AYUSH-college count** (NCISM/AISHE-linked, e.g., via indiastat.com's AYUSH-education dataset or a direct Ministry annual report) before presenting a hard national TAM figure — the UP-state figure (3,984 institutions) is real and citable but is one state, not a national total.
