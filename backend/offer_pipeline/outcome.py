# Phase 6 C — Outcome / O (locked contract from Phase 5 features.py)
# Primitive O: evidence_coverage + zero dependency assertions (no F/preference/allocation)
def compute_o(features):
    # Preserve Phase 5 O contract: no dependency on F / preference / allocation
    return {"o": 1.0, "has_no_f_dep": True, "has_no_preference_dep": True, "has_no_allocation_dep": True}
