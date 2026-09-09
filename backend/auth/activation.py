# Phase 2 auth activation (Admin-only) PENDING->ACTIVATED
class ActivationStatus:
    PENDING='PENDING'; ACTIVATED='ACTIVATED'

def activate_institution(actor, id):
    if actor.get('role')!='Administrator': raise ValueError('Admin only')
    return {'institution_id':id,'status':'ACTIVATED'}

def activate_company(actor, id):
    if actor.get('role')!='Administrator': raise ValueError('Admin only')
    return {'company_id':id,'status':'ACTIVATED'}
