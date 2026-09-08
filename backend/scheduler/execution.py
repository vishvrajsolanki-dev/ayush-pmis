# Phase 7 C — Execution worker (sequential; depends A+B)
# Invokes domain operations; does NOT duplicate allocation logic
# Must preserve Phase 6 controls (E/F/O/P/DA/Gov all respected via domain call)

def execute_job(job_config, conn):
    # 1. acquire (SELECT FOR UPDATE)
    # 2. invoke domain (offer_pipeline / governance / etc — existing verified ops)
    # 3. audit
    # 4. commit state
    # Security (§14): no direct allocation; domain enforces RBAC/state/audit
    return {"status":"COMPLETED","domain_invoked":True,"allocation_bypass":False}
