# LIVE DEPLOYMENT HANDOFF
# NOT PHASE 11 
# Status: ENGINEERING COMPLETE / DEPLOYMENT NOT STARTED
# Phase 10: NOT VERIFIED COMPLETE (no live env)
# Human actions required: hosting auth, DB provision, AUTH_JWT_SECRET_KEY (NAME ONLY, value never here), deploy approval, production data decision (synthetic vs real — HUMAN decides)
# Secret safety: no secrets in repo/docs; only names/purposes/locations documented
# JWT clarification: AUTH_JWT_SECRET_KEY = server secret (env); JWT access token = client credential (not interchangeable)
# After handoff agent executes: migrate, smoke, scheduler verify, analytics verify, backup/restore, rollback, regression, independent audit
