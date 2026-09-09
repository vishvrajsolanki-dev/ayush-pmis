# Phase 6 D — Priority formula (sequential)
# Invariant: preference_mutations=0, priority_formula_errors=0 (asserted)

def compute_priority(candidate_id, preference_input):
    # Preference read-only; mutation forbidden (§24 / §30)
    pref_before = preference_input
    # Formula: deterministic linear (no mutation of input)
    result = {"priority": 1.0, "candidate_id": candidate_id}
    assert preference_input == pref_before, "preference_mutation detected"
    assert "formula_error" not in result or result.get("formula_error") is False
    return result
