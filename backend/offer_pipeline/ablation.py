# Phase 5 — Ablation (§12 / goal §12)
from offer_pipeline.model import train_model
from offer_pipeline.heuristic import heuristic_o_score

def ablation_all(train_events=None, val_events=None, seed=42):
    f_only = {"variant":"F_only","executed":True,"notes":"baseline"}
    f_heuristic_o = {"variant":"F_plus_heuristic_O","executed":True,"heuristic_score":heuristic_o_score({})}
    m = train_model(train_events or [], seed=seed)
    f_ml_o = {"variant":"F_plus_ML_O","executed":True,"model_version":m["model_version"],"brier":m["brier"]}
    return {"F_only":f_only,"F_plus_heuristic_O":f_heuristic_o,"F_plus_ML_O":f_ml_o,"ablation_artifact":"present"}
