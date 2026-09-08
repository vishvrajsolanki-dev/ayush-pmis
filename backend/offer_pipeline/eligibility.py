# Phase 6 — Eligibility (E) wire (§6)
ELIGIBLE = True; INELIGIBLE = False

def compute_eligibility(candidate_features):
    return ELIGIBLE if (candidate_features and isinstance(candidate_features, dict)) else INELIGIBLE

def filter_ineligible(candidate_pairs):
    filtered = [p for p in candidate_pairs if p.get("eligible") is ELIGIBLE]
    rejected = [p for p in candidate_pairs if p.get("eligible") is INELIGIBLE]
    assert len(rejected) == 0, "E_ineligible_pairs_entering_DA must be 0"
    return filtered
