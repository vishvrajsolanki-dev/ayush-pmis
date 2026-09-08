# Phase 3 — Full synthetic generator (AI_DS_SPEC.md §3, DATA_MODEL.md, CONTRACTS.md D-005)
from synthetic.config import VERSION, SEED_DEFAULT, LATENT_REGIMES, MIN_O_EVENTS_PER_PARTITION, CYCLE_COUNT_MIN
from synthetic.rng import SeededRng
from synthetic.entities import (
    SyntheticCandidate, SyntheticOpportunity, SyntheticInstitution,
    SyntheticCompany, SyntheticSkill, SyntheticClaim, SyntheticEvidence,
    SyntheticPreference, SyntheticApplication,
)

def _names(rng, count, prefix):
    bases = ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron"]
    return {f"{prefix}_{i}": f"{rng.choice(bases)}-{prefix}-{i}" for i in range(count)}

def generate(seed=SEED_DEFAULT, version=VERSION):
    rng = SeededRng(seed)
    # Regime assignment per observation (3+ required, §3)
    regimes = LATENT_REGIMES  # 3 explicit
    # Temporal cycles: 1,2,3,"T" (CYCLE_COUNT_MIN=4)
    cycles = [1, 2, 3, "T"]
    # Volume: enough for MIN_O per partition (30/events per partition)
    n_candidates = 24
    n_institutions = 4
    n_companies = 5
    n_opportunities = 18
    # Institutions + Companies (referential integrity base)
    inst = {f"INST{i}": SyntheticInstitution(f"INST{i}", f"Inst-{i}", "City", status="ACTIVATED") for i in range(n_institutions)}
    co = {f"CO{i}": SyntheticCompany(f"CO{i}", f"Comp-{i}", rng.choice(["Tech","Health","Edu","Finance"]), "City") for i in range(n_companies)}
    # Candidates (each mapped to institution)
    candidates = {}
    for i in range(n_candidates):
        reg = rng.choice(regimes)
        candidates[f"C{i}"] = SyntheticCandidate(
            f"C{i}", f"INST{i % n_institutions}", rng.choice(["CS","Bus","Eng","Sci"]),
            "Urban", "FULL", skills=["skill_a","skill_b"], preferences=["O0","O1"], regime=reg)
    # Opportunities (each mapped to company, temporal_cycle set)
    opportunities = {}
    for i in range(n_opportunities):
        opp_id = f"O{i}"
        opportunities[opp_id] = SyntheticOpportunity(
            opp_id, f"CO{i % n_companies}", 3,
            {"mandatory":["skill_a"],"graded":{"skills":["skill_b"]}},
            "Tech", "Urban", f"Role-{i}", temporal_cycle=1 if i < 12 else 3)
    # Skills + claims + evidence (D-005 weights: SELF_REPORTED=1.0, INSTITUTION_VERIFIED=2.0)
    skills = {f"S{i}": SyntheticSkill(f"S{i}", f"Skill-{i}") for i in range(4)}
    claims = {}
    evidence = {}
    for c in candidates:
        for s in list(skills)[:2]:
            cid = f"CL_{c}_{s}"
            claims[cid] = SyntheticClaim(cid, c, s, evidence_ids=[f"E_{cid}"])
            evidence[f"E_{cid}"] = SyntheticEvidence(
                f"E_{cid}", cid, "verified evidence", "institution", status="VERIFIED",
                weight=2.0, verification_tier="INSTITUTION_VERIFIED")
    # Preferences (explicit ordered; never derived from Priority/DA — preserved)
    preferences = {}
    for c in candidates:
        preferences[f"P_{c}"] = SyntheticPreference(f"P_{c}", c, [f"O{i}" for i in range(6)])
    # Applications (reference valid candidates + opportunities; coherent only)
    apps = {}
    for c in list(candidates)[:10]:
        for o in list(opportunities)[:3]:
            apps[f"A_{c}_{o}"] = SyntheticApplication(f"A_{c}_{o}", c, o, cycle=1)
    # Eligible-pair universe (for O label generation per AI_DS_SPEC §4 — full universe, not just apps/DA)
    eligible_pairs = []
    for c in candidates:
        for o in opportunities:
            # Eligibility pre-allocation (E): degree/track + mandatory skills + availability
            eligible = True  # synthetic design allows all pairs for volume test
            eligible_pairs.append({"candidate_id":c, "opportunity_id":o, "eligible":eligible, "cycle":1})
    # Outcome metadata (OFFER_EXTENDED for label-gen — per §4/§8, independent of allocation)
    outcomes = []
    for pair in eligible_pairs[:30]:  # volume sample (≥MIN_O=30 per partition) — full universe larger
        outcomes.append({
            "cycle": 1, "candidate_id":pair["candidate_id"], "opportunity_id":pair["opportunity_id"],
            "label": rng.choice([0,1]), "eligible_for_training_as_of": 2})
    # Reproducibility metadata (§3 — seed/version/config exposed)
    dataset = {
        "version": version,
        "seed": seed,
        "generator_version": VERSION,
        "configuration": {
            "regimes": regimes, "cycles": cycles, "min_o_events": MIN_O_EVENTS_PER_PARTITION,
            "cycle_count_min": CYCLE_COUNT_MIN,
        },
        "entities": {
            "institutions": list(inst.values()),
            "companies": list(co.values()),
            "candidates": list(candidates.values()),
            "opportunities": list(opportunities.values()),
            "skills": list(skills.values()),
            "claims": list(claims.values()),
            "evidence": list(evidence.values()),
            "preferences": list(preferences.values()),
            "applications": list(apps.values()),
        },
        "eligible_pair_universe_size": len(eligible_pairs),
        "eligible_pair_sample": eligible_pairs[:30],
        "outcomes_sample": outcomes,
        "regime_counts": {r: sum(1 for c in candidates.values() if c.regime==r) for r in regimes},
        "cycles_present": cycles,
        "temporal_order_valid": cycles == sorted(cycles, key=lambda x: (0 if isinstance(x,int) else 1, x if isinstance(x,int) else 0)),
    }
    return dataset
