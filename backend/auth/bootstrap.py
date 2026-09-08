# Phase 2 auth bootstrap (env-seeded admin, idempotent)
import os
from auth.hash import hash_password

# Production fails closed when ADMIN_PASSWORD is absent
_IS_PRODUCTION = os.environ.get("ENV") == "production" or os.environ.get("RENDER") == "true"

def bootstrap_admin():
    admin_password = os.getenv("ADMIN_PASSWORD")
    if admin_password is None and _IS_PRODUCTION:
        raise RuntimeError("ADMIN_PASSWORD required in production")
    if admin_password is None:
        admin_password = "changeme"
    return {'user_id':'admin-001','email':os.getenv('ADMIN_EMAIL','admin@system.local'),
            'role':'Administrator','status':'ACTIVATED',
            'password_hash':hash_password(admin_password),
            'institution_id':None,'company_id':None}
