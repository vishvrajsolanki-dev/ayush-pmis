# Phase 2 FastAPI dependencies
from auth.jwt import decode_token
from auth.tenant import get_tenant_identity

def require_auth(token):
    payload = decode_token(token)
    if not payload: raise Exception('Invalid')
    return payload
