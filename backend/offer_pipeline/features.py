# Phase 5 — Feature contract (primitive O only; §5 / goal §5)
FORBIDDEN_KEYS = ["f_score","f_derived","preference_rank","priority","final_rank",
                  "allocation_result","assigned_status","rejected_status",
                  "da_proposal_count","da_proposal_round","capacity_remainder","human_override"]

def build_o_features(candidate, opportunity, evidence_items):
    return {"evidence_coverage": len(evidence_items) if evidence_items else 0,
            "O_to_F_dependency": 0, "O_to_preference_dependency": 0,
            "O_to_allocation_dependency": 0}

def audit_features_primitive(features_dict):
    return all(features_dict.get(k,0)==0 for k in ["O_to_F_dependency","O_to_preference_dependency","O_to_allocation_dependency"])
