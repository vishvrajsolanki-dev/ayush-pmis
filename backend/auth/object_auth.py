# Phase 2 — auth object authorization module

def verify_object_ownership(actor_identity: dict, object_tenant_id: str, object_owner_id: str | None = None) -> bool:
    from auth.tenant import check_tenant_match
    actor_tenant_id = actor_identity.get("user_id") if actor_identity.get("role") == "Student" else \
        actor_identity.get("institution_id") if actor_identity.get("role") == "Institution" else \
        actor_identity.get("company_id") if actor_identity.get("role") == "Company" else None

    if actor_identity.get("role") == "Administrator":
        return True

    if not check_tenant_match(actor_tenant_id, object_tenant_id):
        return False

    if object_owner_id is not None:
        return actor_identity.get("user_id") == object_owner_id or actor_tenant_id == object_tenant_id

    return True
