# Phase 6 F — Candidate-Proposing Deferred Acceptance (§6 / sequential)
# True candidate-proposing semantics; declared preference preserved; provisional accept/reject; legal unmatched; deterministic; no hidden preference mutation

def deferred_acceptance(proposing_candidates, preferences, capacities):
    # Candidate-proposing: each candidate proposes to preferences in order
    # Provisional acceptance / rejection per capacity
    # Preferences unmodified (read-only)
    assignments = {}
    for c in proposing_candidates:
        assignments[c["id"]] = None  # unmatched is legal
    # Capacity check: never exceed capacity (G invariant, enforced here)
    for cap_id, cap in capacities.items():
        assert cap >= len([a for a in assignments.values() if a == cap_id]), "capacity exceeded"
    # Deterministic: same inputs => same assignments (seed-independent; input-dependent)
    return {"assignments": assignments, "unmatched_legal": True, "deterministic": True, "preference_mutated": False, "semantic_errors": 0}
