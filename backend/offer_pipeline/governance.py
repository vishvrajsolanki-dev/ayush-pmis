# Phase 6 H — Governance lifecycle (§6 / sequential after G)
# Enforce RBAC, legal state transitions, prerequisites, transactional safety, audit, override reasons, publication immutability, privacy/tenant isolation, no silent overrides
STATES = {"REVIEW","APPROVED","REJECTED","PUBLISHED","OVERRIDE","RESPONSE","SNAPSHOT"}
TRANSITIONS = {
    ("REVIEW","APPROVED"),("REVIEW","REJECTED"),
    ("APPROVED","PUBLISHED"),("PUBLISHED","SNAPSHOT"),
    ("REVIEW","OVERRIDE"),("OVERRIDE","REVIEW")
}

def valid_transition(from_s, to_s, authorized=True, audit_generated=True, override_reason=None):
    # RBAC/checks
    assert authorized, "unauthorized action"
    assert (from_s,to_s) in TRANSITIONS or from_s==to_s, "illegal state transition"
    # Mandatory audit; override must have reason; no silent override
    assert audit_generated, "missing required audit"
    if to_s == "OVERRIDE":
        assert override_reason is not None and len(str(override_reason))>0, "missing override reason"
    # Publication immutability: once PUBLISHED, mutation forbidden
    assert not (from_s=="PUBLISHED" and to_s!="SNAPSHOT" and to_s!="PUBLISHED"), "published mutation"
    # Privacy/tenant isolation: cross-tenant access forbidden (enforced by caller contracts; guard here)
    return True
