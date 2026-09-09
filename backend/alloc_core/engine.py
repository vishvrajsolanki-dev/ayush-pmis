# alloc_core — pure allocation engine (CORE-01)
EVIDENCE_WEIGHTS = {"SELF_REPORTED": 1.0, "INSTITUTION_VERIFIED": 2.0}
ALPHA = 0.6; EPSILON = 1e-9

def _deep_copy(obj):
    import copy
    return copy.deepcopy(obj)

def compute_eligibility(candidate, opportunity):
    req = opportunity.get("requirements", {})
    mand = req.get("mandatory", [])
    if not mand: return 1
    c_certs = set(candidate.get("mandatory_certifications", []))
    ev_ids = {e.get("skill_id") for e in candidate.get("evidence", []) if isinstance(e, dict)}
    missing = [m for m in mand if m not in c_certs and m not in ev_ids]
    return 0 if missing else 1

def compute_fit(candidate, opportunity):
    if compute_eligibility(candidate, opportunity) == 0:
        raise AssertionError("compute_fit requires E==1")
    ev = candidate.get("evidence", [])
    skill_score = 0.0
    req_skills = opportunity.get("requirements", {}).get("graded", {}).get("skills", [])
    if req_skills and ev:
        matched = sum(1 for e in ev if isinstance(e, dict) and e.get("skill_id") in req_skills)
        skill_score = min(1.0, matched / len(req_skills))
    loc_score = 1.0 if candidate.get("location") == opportunity.get("location") else 0.7
    sec_score = 1.0 if candidate.get("sector") == opportunity.get("sector") else 0.7
    import math
    prod = skill_score * loc_score * sec_score
    return float(math.pow(prod, 1.0/3.0)) if prod > 0 else 0.0

def score_opportunity_signal(candidate, opportunity, source="HEURISTIC_FALLBACK", model=None):
    features = {"evidence_weights": EVIDENCE_WEIGHTS, "mandatory_met": compute_eligibility(candidate, opportunity)}
    assert "preference_rank" not in features, "O feature leak: preference_rank"
    assert "fit_score" not in features, "O feature leak: fit_score"
    req = opportunity.get("requirements", {}); graded = req.get("graded", {}); cov = []
    if graded.get("skills"):
        ev = candidate.get("evidence", [])
        cov.append(min(1.0, len([e for e in ev if isinstance(e,dict) and e.get("skill_id") in graded["skills"]]) / len(graded["skills"])))
    if graded.get("location"): cov.append(1.0 if candidate.get("location") == graded.get("location") else 0.0)
    if graded.get("sector"): cov.append(1.0 if candidate.get("sector") == graded.get("sector") else 0.0)
    return float(sum(cov)/len(cov)) if cov else 0.0

def compute_priority(F, O, alpha=ALPHA):
    return alpha * F + (1.0-alpha) * O

def rank_by_priority_with_tiebreak(candidates_list, priority_matrix, tiebreak_keys, epsilon=EPSILON):
    groups = {}
    for cid in candidates_list:
        p = priority_matrix.get(cid, 0.0)
        grp = None
        for gk in groups:
            if abs(p-gk) < epsilon: grp = gk; break
        if grp is None: grp = p; groups[grp] = []
        groups[grp].append(cid)
    ordered = []
    for g in sorted(groups, reverse=True):
        grp_ids = groups[g]; grp_ids.sort(key=lambda c: tiebreak_keys.get(c,0.0)); ordered.extend(grp_ids)
    return ordered

def run_da(candidates, opportunities, priority_matrix, capacities, preferences, tiebreak_keys):
    candidates = _deep_copy(candidates); opportunities = _deep_copy(opportunities)
    priority_matrix = _deep_copy(priority_matrix); capacities = _deep_copy(capacities)
    preferences = _deep_copy(preferences); tiebreak_keys = _deep_copy(tiebreak_keys)
    unproposed = {}
    for c in candidates:
        cid = c.get("id") if isinstance(c,dict) else str(c)
        unproposed[cid] = list(preferences.get(cid, []))
    holds = {}; cap = {}
    for o in opportunities:
        oid = o.get("id") if isinstance(o,dict) else str(o)
        holds[oid] = []; cap[oid] = capacities.get(oid, o.get("capacity",0) if isinstance(o,dict) else 0)
    for cid, prefs in unproposed.items():
        if prefs:
            prop = prefs[0]; holds.setdefault(prop,[]).append(cid); unproposed[cid] = prefs[1:]
    result = {}
    for oid, held in holds.items():
        def sort_key(x):
            pair_p = priority_matrix.get(f"{x}:{oid}", priority_matrix.get(x,0.0))
            return (-pair_p, tiebreak_keys.get(x,0.0))
        held.sort(key=sort_key)
        for cid in held[:cap.get(oid,0)]: result[cid] = oid
    for cid in unproposed:
        if cid not in result: result[cid] = "UNMATCHED"
    return result
