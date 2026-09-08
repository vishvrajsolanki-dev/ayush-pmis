# Phase 2 — auth action authorization module

def verify_action_permission(actor_identity: dict, action: str, object_tenant_id: str = None, object_status: str = None, is_object_owner: bool = False) -> bool:
    role = actor_identity.get("role")
    status = actor_identity.get("status")

    action_rules = {
        "read_profile": {"roles": ["Student", "Institution", "Company", "Administrator"]},
        "create_evidence": {"roles": ["Student"], "require_ownership": True},
        "verify_evidence": {"roles": ["Faculty"], "require_active_org": True},
        "edit_evidence": {"roles": ["Student"], "require_ownership": True},
        "create_opportunity": {"roles": ["Recruiter"], "require_active_org": True, "require_ownership": True},
        "activate_institution": {"roles": ["Administrator"]},
        "activate_company": {"roles": ["Administrator"]},
        "view_allocation_run": {"roles": ["Administrator", "PlacementCell"], "require_active_org": True},
        "approve_allocation": {"roles": ["Administrator"]},
        "override_allocation": {"roles": ["Administrator"]},
        "view_analytics": {"roles": ["Administrator", "PlacementCell"], "require_active_org": True},
    }

    rule = action_rules.get(action)
    if not rule:
        return False
    if role not in rule["roles"]:
        return False
    if rule.get("require_active_org") and status != "ACTIVATED":
        return False
    if rule.get("require_ownership") and not is_object_owner:
        if actor_identity.get("user_id") != object_tenant_id:
            return False
    return True
