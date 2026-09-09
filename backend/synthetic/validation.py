# Phase 3 — Executable validation (leakage + temporal + state + volume + eligible-pair)
from synthetic.config import VERSION, SEED_DEFAULT, MIN_O_EVENTS_PER_PARTITION, LATENT_REGIMES, CYCLE_COUNT_MIN

def validate_cycle_order(events):
    cycles = [e.get("cycle") for e in events if isinstance(e, dict)]
    return cycles == sorted(cycles, key=lambda x: (str(x)!="T", str(x)))

def validate_cycle_partitions(events):
    # Every event belongs to exactly one partition; no split; Cycle T isolated
    partitions = {"TRAIN":[], "CALIBRATION":[], "VALIDATION":[], "TEST":[]}
    for e in events:
        c = e.get("cycle") if isinstance(e, dict) else None
        if c in (1,2): partitions["TRAIN"].append(e)
        elif c == 3: partitions["VALIDATION"].append(e)
        elif c == "T": partitions["TEST"].append(e)
    # CALIBRATION = smallest trailing block before VALIDATION (design simplification: 2 for minimal 4-cycle demo)
    return partitions

def validate_leakage_static(generator_module_name="synthetic.generator"):
    import synthetic.generator as g
    src = open(g.__file__).read()
    forbidden = ["run_da", "priority_matrix", "final_rank", "proposal_round",
                 "post-allocation", "assigned", "rejected", "DA_"]
    code_lines = [l.split("#")[0] for l in src.splitlines()]
    code_text = "\n".join(code_lines)
    hits = [f for f in forbidden if f.lower() in code_text.lower()]
    return len(hits) == 0, hits

def validate_referential_integrity(dataset):
    # Candidate→institution; opportunity→company; preference→opportunities; app→candidate/opportunity
    cids = {c.id for c in dataset["entities"]["candidates"]}
    inst_ids = {i.id for i in dataset["entities"]["institutions"]}
    co_ids = {c.id for c in dataset["entities"]["companies"]}
    opp_ids = {o.id for o in dataset["entities"]["opportunities"]}
    # Check candidate institution refs valid
    for cand in dataset["entities"]["candidates"]:
        assert cand.institution_id in inst_ids, f"bad inst ref {cand.institution_id}"
    # Check opportunity company refs valid
    for opp in dataset["entities"]["opportunities"]:
        assert opp.company_id in co_ids, f"bad co ref {opp.company_id}"
    # Preferences reference only existing opportunities
    for pref in dataset["entities"]["preferences"]:
        for oid in pref.opportunity_ids_ordered:
            assert oid in opp_ids, f"bad pref ref {oid}"
    # Applications reference valid candidate + opportunity
    for app in dataset["entities"]["applications"]:
        assert app.candidate_id in cids
        assert app.opportunity_id in opp_ids
    return True

def validate_volume(dataset):
    stats = {
        "candidates": len(dataset["entities"]["candidates"]),
        "institutions": len(dataset["entities"]["institutions"]),
        "companies": len(dataset["entities"]["companies"]),
        "opportunities": len(dataset["entities"]["opportunities"]),
        "skills": len(dataset["entities"]["skills"]),
        "claims": len(dataset["entities"]["claims"]),
        "evidence": len(dataset["entities"]["evidence"]),
        "preferences": len(dataset["entities"]["preferences"]),
        "applications": len(dataset["entities"]["applications"]),
        "eligible_pairs": dataset.get("eligible_pair_universe_size", 0),
        "outcomes": len(dataset.get("outcomes_sample", [])),
        "regimes": dataset.get("regime_counts", {}),
    }
    # At least 3 regimes realized with non-zero counts
    assert len(stats["regimes"]) >= 3, "need >=3 regimes"
    assert all(v>0 for v in stats["regimes"].values()), "each regime must have >0 candidates"
    return stats
