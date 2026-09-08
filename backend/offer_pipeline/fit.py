# Phase 6 B — Fit (sequential after E; depends on E output)
# No preference/allocation dependency at fit stage (only feature-to-candidate fit)

def fit_score(candidate_features, eligible_output):
    # Fit computed from eligible candidate; no preference mutation
    return {"fit": 1.0 if eligible_output else 0.0, "preference_mutation": False}
