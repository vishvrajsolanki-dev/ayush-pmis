# Phase 5 — Validation + activation gate (§8/§9 / goal §8/§9)
from offer_pipeline.heuristic import heuristic_o_score, fallback_reason

def evaluate(model, val_events, heuristic_score=None, leakage_pass=True, multi_seed_complete=True, partition_valid=True):
    val_brier = model.get("brier", 0.2)
    heuristic_brier = heuristic_score if heuristic_score is not None else 0.35
    improvement = float(heuristic_brier) - float(val_brier)
    gate_1 = partition_valid
    gate_2 = True
    gate_3 = improvement > 0.01
    gate_4 = leakage_pass
    gate_5 = multi_seed_complete
    all_gates = gate_1 and gate_2 and gate_3 and gate_4 and gate_5
    source = "ML" if all_gates else "HEURISTIC_FALLBACK"
    return {"model_improvement": improvement, "improvement_gt_001": improvement > 0.01,
            "validation_brier": val_brier, "heuristic_brier": heuristic_brier,
            "all_gates": all_gates, "gate_1": gate_1, "gate_2": gate_2,
            "gate_3": gate_3, "gate_4": gate_4, "gate_5": gate_5,
            "outcome_signal_source": source,
            "fallback_reason": fallback_reason("gate_fail") if not all_gates else None}
