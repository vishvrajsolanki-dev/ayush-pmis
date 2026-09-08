# Phase 1 — DATA_MODEL entities (verified from docs/02-architecture/DATA_MODEL.md)
from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, DateTime, Text, Index, CheckConstraint
from sqlalchemy.orm import declarative_base
import enum, uuid
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    password_hash = Column(String, nullable=False)
    status = Column(String(50), default="ACTIVE")
    institution_id = Column(String(36), ForeignKey("institutions.id"))
    company_id = Column(String(36), ForeignKey("companies.id"))

class Student(Base):
    __tablename__ = "students"
    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    profile = Column(String)
    tiebreak_key = Column(Float, nullable=False)
    visibility = Column(String(50), default="PRIVATE")

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    status = Column(String(50), default="PENDING")

class Company(Base):
    __tablename__ = "companies"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    status = Column(String(50), default="PENDING")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)

class SkillClaim(Base):
    __tablename__ = "skill_claims"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.user_id"), nullable=False)
    skill_id = Column(String(36), ForeignKey("skills.id"), nullable=False)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    skill_claim_id = Column(String(36), ForeignKey("skill_claims.id"), nullable=False)
    content = Column(String)
    status = Column(String(50), default="SELF_REPORTED")
    verification_tier = Column(String)
    weight = Column(Float, default=1.0)

class Verification(Base):
    __tablename__ = "verification"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String(36), ForeignKey("evidence.id"), nullable=False)
    verifier_institution_id = Column(String(36), ForeignKey("institutions.id"), nullable=False)
    verification_tier = Column(String, nullable=False)

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    status = Column(String(50), default="DRAFT")
    capacity = Column(Integer, nullable=False)
    location = Column(String)
    sector = Column(String)
    requirements = Column(String)

class Preference(Base):
    __tablename__ = "preferences"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_user_id = Column(String(36), ForeignKey("students.user_id"), nullable=False)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id"), nullable=False)
    rank = Column(Integer, nullable=False)

class AllocationRun(Base):
    __tablename__ = "allocation_runs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cycle = Column(String, nullable=False)
    allocation_generation_id = Column(String(36), ForeignKey("allocation_generations.id"), nullable=False)
    status = Column(String(50), default="DRAFT")
    outcome_signal_source = Column(String, nullable=False)
    policy_alpha = Column(Float, default=0.6)
    model_version_id = Column(String(36), ForeignKey("model_versions.id"))

class AllocationGeneration(Base):
    __tablename__ = "allocation_generations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    root_run_id = Column(String(36), ForeignKey("allocation_runs.id"))

class Allocation(Base):
    __tablename__ = "allocations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("allocation_runs.id"), nullable=False)
    candidate_id = Column(String(36), nullable=False)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id"), nullable=False)
    state = Column(String(50), default="PROPOSED")

class Application(Base):
    __tablename__ = "applications"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.user_id"), nullable=False)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id"), nullable=False)

class RecoveryQueue(Base):
    __tablename__ = "recovery_queue"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String(36), nullable=False)
    allocation_generation_id = Column(String(36), ForeignKey("allocation_generations.id"), nullable=False)
    status = Column(String(50), default="TRIGGERED")
    retry_count = Column(Integer, default=0)
    parent_run_id = Column(String(36), ForeignKey("allocation_runs.id"))

class AllocationSnapshot(Base):
    __tablename__ = "allocation_snapshots"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("allocation_runs.id"), nullable=False)
    candidate_subject_token = Column(String, nullable=False)
    snapshot_blob = Column(String, nullable=False)
    snapshot_hash = Column(String, nullable=False)
    versions = Column(String, default="{}")
    tiebreak_values = Column(String, default="{}")
    policy_alpha = Column(Float, nullable=False)
    random_seed = Column(String, nullable=False)

class SubjectIdentityMapping(Base):
    __tablename__ = "subject_identity_mapping"
    candidate_subject_token = Column(String, primary_key=True)
    student_id = Column(String(36), ForeignKey("students.user_id"), nullable=False)

class Audit(Base):
    __tablename__ = "audits"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    object_ref = Column(String, nullable=False)
    tenant = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default="now()")

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_hash = Column(String, nullable=False, unique=True)
    feature_contract_ref = Column(String, nullable=False)

class CalibrationArtifact(Base):
    __tablename__ = "calibration_artifacts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_version_id = Column(String(36), ForeignKey("model_versions.id"), nullable=False)

class ValidationEvidence(Base):
    __tablename__ = "validation_evidence"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_version_id = Column(String(36), ForeignKey("model_versions.id"), nullable=False)
    validation_cycle_range = Column(String, nullable=False)

class Outcome(Base):
    __tablename__ = "outcomes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cycle = Column(String, nullable=False)
    candidate_id = Column(String(36), nullable=False)
    opportunity_id = Column(String(36), nullable=False)
    label = Column(String, nullable=False)
    eligible_for_training_as_of = Column(String, nullable=False)

class InstitutionalAnalytics(Base):
    __tablename__ = "institutional_analytics"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id = Column(String(36), ForeignKey("institutions.id"), nullable=False)
    metric = Column(String, nullable=False)
    sample_size = Column(Integer, nullable=False)
    value = Column(Float)
