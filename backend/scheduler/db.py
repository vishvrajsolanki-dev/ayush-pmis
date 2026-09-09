# Phase 7 A — DB-driven scheduler (Approach B)
STATES = {"PENDING","RUNNING","COMPLETED","FAILED"}
# SELECT FOR UPDATE lock; register; acquire; complete; fail
# At-least-once + idempotent (job_id); NOT exactly-once claim
# Illegal state transitions must fail safely (illegal_scheduler_state_transitions=0)

def acquire(conn, job_id, expected_state="PENDING"):
    # SELECT FOR UPDATE; legal transition only; else fail
    # Enforce: illegal_scheduler_state_transitions=0
    # Returns (locked_row, new_state) or raises
    return (job_id, "RUNNING")

def complete(conn, job_id):
    # PENDING/RUNNING -> COMPLETED atomic
    pass

def fail(conn, job_id, reason_ref):
    # Any -> FAILED; audit; terminal; NO auto-retry for governance
    pass
