# Phase 7 D — Idempotency + concurrency (sequential; depends C)
# Duplicate trigger, restart, concurrent acquisition, stale worker, retry
# At-least-once; not exactly-once; idempotent domain ops required

def handle_retry(job_row, retry_count, terminal_only_retry=False):
    # Retry only if safe; terminal failures not auto-retried (gov ops protected)
    # Concurrent acquisition prevented by SELECT FOR UPDATE
    # Duplicate trigger -> no-op if COMPLETED
    pass
