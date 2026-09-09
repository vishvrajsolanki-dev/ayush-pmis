# Phase 5 — Heuristic O fallback (protocol §13 / goal §10)
def heuristic_o_score(features): return 0.5
def fallback_reason(trigger): return f"HEURISTIC_FALLBACK: triggered by {trigger}"
