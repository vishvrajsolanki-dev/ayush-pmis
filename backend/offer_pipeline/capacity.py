# Phase 6 G — Capacity hard enforcement + deterministic tiebreak (§6)
# Invariant: capacity_violations = 0; tiebreak_determinism_failures = 0
# Tiebreak is deterministic (seed-based, not fairness mechanism); epsilon respected; changed seed => expected change only

def enforce_capacity(assignment_counts, capacity_limits):
    for k, c in assignment_counts.items():
        assert c <= capacity_limits.get(k, float('inf')), "capacity violation"
    return True

def tiebreak_seeded(seed, inputs):
    # Persistent seeded mechanism; identical inputs/config => identical result
    import random
    r = random.Random(seed)
    ordering = sorted(inputs, key=lambda x: (r.random(), x["id"]))
    return ordering
