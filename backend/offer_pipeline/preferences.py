# Phase 6 E — Preferences (§6 / sequential; must preserve declared order)
# Invariant: preference_mutations = 0; no automatic insertion/reorder/completion
# DA cannot mutate source preferences (read-only reference)

def preserve_order(declared):
    # Declare exactly; empty/incomplete valid; no insertion/reordering
    assert isinstance(declared, (list, tuple)), "preference must be declared sequence"
    return list(declared)  # copy, never mutate source

def verify_no_mutation(source, after_use):
    assert source == after_use, "preference mutation detected"
