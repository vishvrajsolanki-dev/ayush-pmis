# Phase 2 — auth registration module
from auth.hash import hash_password

class RegistrationStatus:
    STUDENT = "ACTIVE"
    INSTITUTION = "PENDING"
    COMPANY = "PENDING"

def register_user(user_data: dict) -> dict:
    role = user_data.get("role")
    if role == "Administrator":
        raise ValueError("Public admin-registration path is not permitted.")
    return {
        "user_data": user_data,
        "role": role,
        "status": RegistrationStatus.STUDENT if role == "Student" else RegistrationStatus.INSTITUTION,
        "password_hash": hash_password(user_data.get("password", "")),
        "institution_id": user_data.get("institution_id"),
        "company_id": user_data.get("company_id"),
    }
