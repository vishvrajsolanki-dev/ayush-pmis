# Phase 2 — auth jwt module
from datetime import datetime, timedelta, timezone
from jose import jwt as jose_jwt
from jose.exceptions import JWTError
from auth.roles import Role

import os

# Production fails closed when AUTH_JWT_SECRET_KEY is absent
# Local/dev tests use the dev fallback intentionally
_IS_PRODUCTION = os.environ.get("ENV") == "production" or os.environ.get("RENDER") == "true"
SECRET_KEY = os.environ.get("AUTH_JWT_SECRET_KEY")
if SECRET_KEY is None and _IS_PRODUCTION:
    raise RuntimeError("AUTH_JWT_SECRET_KEY required in production")
if SECRET_KEY is None:
    SECRET_KEY = "dev-local-secret-do-not-use-in-production"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jose_jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict | None:
    try:
        payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user_identity(payload: dict) -> dict:
    user_id = payload.get("sub")
    role = payload.get("role")
    institution_id = payload.get("institution_id")
    company_id = payload.get("company_id")
    status = payload.get("status")
    return {
        "user_id": user_id, "role": role,
        "institution_id": institution_id, "company_id": company_id, "status": status,
    }
