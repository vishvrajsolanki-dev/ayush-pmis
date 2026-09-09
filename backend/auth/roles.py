# Phase 2 — auth roles module
from enum import Enum

class Role(str, Enum):
    STUDENT = "Student"
    INSTITUTION = "Institution"
    COMPANY = "Company"
    ADMINISTRATOR = "Administrator"

SUB_ROLES = {"Faculty", "PlacementCell", "Recruiter", "Mentor"}

def is_role(user_role: str, required: Role) -> bool:
    return user_role == required.value

def has_sub_role(user_role: str, sub_role: str) -> bool:
    return user_role in SUB_ROLES or sub_role in SUB_ROLES

def is_institution_activated(user_status: str) -> bool:
    return user_status == "ACTIVATED"

def is_company_activated(user_status: str) -> bool:
    return user_status == "ACTIVATED"
