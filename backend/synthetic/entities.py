# Phase 3 — Synthetic domain foundation (aligned DATA_MODEL.md §1/2.1–2.11)
class SyntheticInstitution:
    def __init__(self, id, name, location, status="ACTIVATED"):
        self.id=id; self.name=name; self.location=location; self.status=status

class SyntheticCompany:
    def __init__(self, id, name, sector, location, status="ACTIVATED"):
        self.id=id; self.name=name; self.sector=sector; self.location=location; self.status=status

class SyntheticCandidate:
    def __init__(self, id, institution_id, degree_track, location, availability,
                 skills=None, preferences=None, tiebreak_key=0.5, regime="regime_a"):
        self.id=id; self.institution_id=institution_id; self.degree_track=degree_track
        self.location=location; self.availability=availability; self.skills=skills or []
        self.preferences=preferences or []; self.tiebreak_key=tiebreak_key; self.regime=regime

class SyntheticOpportunity:
    def __init__(self, id, company_id, capacity, requirements,
                 sector, location, role_name, temporal_cycle=1):
        self.id=id; self.company_id=company_id; self.capacity=capacity
        self.requirements=requirements or {}; self.sector=sector; self.location=location
        self.role_name=role_name; self.temporal_cycle=temporal_cycle

class SyntheticSkill:
    def __init__(self, id, name, adjacency=None):
        self.id=id; self.name=name; self.adjacency=adjacency or []

class SyntheticClaim:
    def __init__(self, id, candidate_id, skill_id, evidence_ids=None):
        self.id=id; self.candidate_id=candidate_id; self.skill_id=skill_id
        self.evidence_ids=evidence_ids or []

class SyntheticEvidence:
    def __init__(self, id, claim_id, content, source, status="PENDING",
                 weight=1.0, verification_tier=None):
        self.id=id; self.claim_id=claim_id; self.content=content
        self.source=source; self.status=status; self.weight=weight
        self.verification_tier=verification_tier  # INSTITUTION_VERIFIED=2.0x, SELF_REPORTED=1.0x (D-005)

class SyntheticPreference:
    def __init__(self, id, candidate_id, opportunity_ids_ordered):
        self.id=id; self.candidate_id=candidate_id; self.opportunity_ids_ordered=opportunity_ids_ordered or []

class SyntheticApplication:
    def __init__(self, id, candidate_id, opportunity_id, cycle):
        self.id=id; self.candidate_id=candidate_id; self.opportunity_id=opportunity_id; self.cycle=cycle
