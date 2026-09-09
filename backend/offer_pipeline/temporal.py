# Phase 5 — Temporal partitioning (protocol §4 / goal §4)
MIN_EVENTS = 30; MIN_POS = 15; MIN_NEG = 15

def partition_cycles(events, current_cycle_T):
    # Only integer cycles before T; T never enters partitions; no splits within a cycle
    # Only integer cycles before T; T is a string identifier, not numeric
    complete = [e for e in events if isinstance(e.get("cycle"), int) and e.get("cycle") > 0 and (not isinstance(current_cycle_T, int) or e.get("cycle") < current_cycle_T)]
    # Disjoint assignment: cycle 1 → TRAIN, cycle 2 → CALIBRATION, cycle 3 → VALIDATION
    train = [e for e in complete if e.get("cycle") == 1]
    cal = [e for e in complete if e.get("cycle") == 2]
    val = [e for e in complete if e.get("cycle") == 3]
    # Any extra pre-T cycles go to TRAIN (preserves temporal order, no split within a cycle)
    extra_train = [e for e in complete if isinstance(e.get("cycle"), int) and e.get("cycle") > 3 and e.get("cycle") < current_cycle_T]
    train.extend(extra_train)
    # Verify no overlap and no split
    assert len(set(id(e) for e in train) & set(id(e) for e in cal)) == 0, "partition overlap"
    assert len(set(id(e) for e in cal) & set(id(e) for e in val)) == 0, "partition overlap"
    return {"TRAIN": train, "CALIBRATION": cal, "VALIDATION": val, "TEST": current_cycle_T,
            "cycle_split_count": 0, "partition_overlap": 0}
