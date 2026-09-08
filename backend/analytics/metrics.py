# Phase 8 — Analytics / Decision Intelligence
def eligible_pair_volume(e_output): return len(e_output.get("eligible_pairs",[])) if e_output else None
def unmatched_rate(da_result, eligible_count): return (1.0 - len(da_result.get("assignments",{}))/eligible_count) if (da_result and eligible_count and eligible_count>0) else None
def preference_satisfaction(da_result, preferences): pref_count=len(preferences) if preferences else 0; return (len(da_result.get("matched_preferences",[]))/pref_count) if pref_count>0 else None
def calibration_evidence(m): return {"brier":m.get("brier"),"calibration_curve":m.get("calibration_curve")} if m else None
def scheduler_success_rate(s): completed=s.get("COMPLETED",0) if s else 0; failed=s.get("FAILED",0) if s else 0; total=completed+failed; return completed/total if total>0 else None
def analytics_mutation_check(b,a): return b==a
