# Phase 2 — auth tenant module

def get_tenant_identity(identity: dict) -> dict:
    """Derive tenant context from authenticated identity, NEVER client-supplied."""
    role = identity.get("role")
    if role == "Student":
        return {"tenant_id": identity.get("user_id"), "tenant_type": "student"}
    elif role == "Institution":
        return {"tenant_id": identity.get("institution_id"), "tenant_type": "institution"}
    elif role == "Company":
        return {"tenant_id": identity.get("company_id"), "tenant_type": "company"}
    elif role == "Administrator":
        return {"tenant_id": None, "tenant_type": "platform"}
    return {"tenant_id": None, "tenant_type": "unknown"}

def check_tenant_match(actor_tenant_id: str, object_tenant_id: str) -> bool:
    if actor_tenant_id is None and object_tenant_id is None:
        return True
    return actor_tenant_id == object_tenant_id
