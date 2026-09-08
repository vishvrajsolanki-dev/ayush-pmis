# Phase 2 auth middleware
from auth.jwt import decode_token
from auth.audit import log_audit_event

def auth_chain(token, action, object_ref, object_tenant_id=None):
    payload = decode_token(token)
    if not payload: return False
    from auth.tenant import get_tenant_identity
    identity = payload
    log_audit_event(identity, action, object_ref)
    return True
