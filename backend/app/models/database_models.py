from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    trust_score = Column(Integer, default=95)
    certification_status = Column(String(50), default="Pending")
    risk_level = Column(String(20), default="Low")
    sustainability_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="organization", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="organization", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="organization", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="organization", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="organization", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="organization", cascade="all, delete-orphan")


class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(200))


class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(200))
    
    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(200), nullable=False)
    full_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    organization = relationship("Organization", back_populates="users")
    role = relationship("Role", back_populates="users")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="uploader")
    chat_histories = relationship("ChatHistory", back_populates="user")


class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_id = Column(String(100))
    ip_address = Column(String(50))
    user_agent = Column(String(250))
    login_time = Column(DateTime, default=lambda: datetime.now(UTC))
    last_activity = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="sessions")


class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    file_path = Column(String(250), nullable=False)
    file_hash = Column(String(64), nullable=False) # SHA256
    file_size = Column(String(50))
    file_type = Column(String(50)) # PDF, Image, CSV, etc.
    status = Column(String(20), default="Pending") # Pending, Verified, Rejected, Approved
    uploaded_at = Column(DateTime, default=lambda: datetime.now(UTC))
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    uploader = relationship("User", back_populates="evidence")
    organization = relationship("Organization", back_populates="evidence")
    verification = relationship("EvidenceVerification", uselist=False, back_populates="evidence", cascade="all, delete-orphan")
    fraud_report = relationship("FraudReport", uselist=False, back_populates="evidence", cascade="all, delete-orphan")


class EvidenceVerification(Base):
    __tablename__ = "evidence_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False, unique=True)
    trust_score = Column(Integer, default=0)
    confidence_score = Column(Integer, default=0)
    ocr_extracted_text = Column(Text)
    is_duplicate = Column(Boolean, default=False)
    signature_verified = Column(Boolean, default=False)
    metadata_json = Column(JSON)
    verified_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    evidence = relationship("Evidence", back_populates="verification")


class FraudReport(Base):
    __tablename__ = "fraud_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False, unique=True)
    tampering_regions = Column(JSON) # Heatmap zones
    deepfake_probability = Column(Float, default=0.0)
    pixel_manipulation_probability = Column(Float, default=0.0)
    gps_lat = Column(Float)
    gps_lon = Column(Float)
    gps_matched = Column(Boolean, default=True)
    device_id = Column(String(100))
    time_matched = Column(Boolean, default=True)
    risk_level = Column(String(20), default="Low") # Low, Medium, High, Critical
    
    evidence = relationship("Evidence", back_populates="fraud_report")


class RiskScore(Base):
    __tablename__ = "risk_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    evidence_risk = Column(String(20), default="Low")
    fraud_risk = Column(String(20), default="Low")
    compliance_risk = Column(String(20), default="Low")
    operational_risk = Column(String(20), default="Low")
    overall_score = Column(Integer, default=0)
    category = Column(String(20), default="Low")
    recommended_action = Column(String(300))
    calculated_at = Column(DateTime, default=lambda: datetime.now(UTC))


class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String(50), default="Registration") # Registration, Evidence Collection, AI Verification, Assessor Review, Scoring, Certification
    status = Column(String(20), default="In Progress") # Pending, In Progress, Completed, Reverted
    assigned_assessor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    workflow_history = Column(JSON) # Timeline log
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    
    organization = relationship("Organization", back_populates="assessments")


class SustainabilityScore(Base):
    __tablename__ = "sustainability_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    energy_score = Column(Integer, default=0)
    water_score = Column(Integer, default=0)
    waste_score = Column(Integer, default=0)
    carbon_score = Column(Integer, default=0)
    resources_score = Column(Integer, default=0)
    overall_score = Column(Integer, default=0)
    certification_level = Column(String(20), default="Bronze") # Bronze, Silver, Gold, Platinum
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))


class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    certificate_id = Column(String(100), unique=True, nullable=False)
    hash_address = Column(String(64), nullable=False) # Verifiable Blockchain style Hash
    qr_code_path = Column(String(250))
    issued_at = Column(DateTime, default=lambda: datetime.now(UTC))
    expires_at = Column(DateTime)
    status = Column(String(20), default="Active")
    history_json = Column(JSON) # Created, Verified, Approved, Renewed
    
    organization = relationship("Organization", back_populates="certificates")


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(50)) # Audit, Compliance, Sustainability
    format = Column(String(10)) # PDF, Excel
    file_path = Column(String(250))
    generated_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    organization = relationship("Organization", back_populates="reports")


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(String(300), nullable=False)
    priority = Column(String(20), default="Low") # Critical, High, Medium, Low
    category = Column(String(50)) # Fraud, Risk, Compliance, Scoring
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    organization = relationship("Organization", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_email = Column(String(150), nullable=False)
    action = Column(String(150), nullable=False)
    details = Column(Text)
    reason = Column(String(200))
    ip_address = Column(String(50))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    organization = relationship("Organization", back_populates="audit_logs")


class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    context_json = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    
    user = relationship("User", back_populates="chat_histories")


class AIModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    version = Column(String(20), nullable=False)
    accuracy = Column(Float, default=95.0)
    confidence = Column(Float, default=95.0)
    bias_score = Column(Float, default=0.0)
    status = Column(String(20), default="Healthy") # Healthy, Warning, Down
    last_evaluated = Column(DateTime, default=lambda: datetime.now(UTC))

    metrics = relationship("ModelMetric", back_populates="ai_model", cascade="all, delete-orphan")
    bias_reports = relationship("BiasReport", back_populates="ai_model", cascade="all, delete-orphan")


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False) # Basic, Pro, Enterprise
    max_users = Column(Integer, default=5)
    max_evidence_uploads = Column(Integer, default=50)
    price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class TenantSettings(Base):
    __tablename__ = "tenant_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, unique=True)
    energy_alert_threshold = Column(Integer, default=80)
    water_alert_threshold = Column(Integer, default=75)
    carbon_alert_threshold = Column(Integer, default=85)
    double_verification_required = Column(Boolean, default=False)


class TenantUsage(Base):
    __tablename__ = "tenant_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    month_year = Column(String(7), nullable=False) # YYYY-MM
    api_calls_count = Column(Integer, default=0)
    file_uploads_count = Column(Integer, default=0)
    ocr_credits_used = Column(Integer, default=0)


class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False) # Energy, Water, Carbon, Waste, Resources
    recommendation_text = Column(String(300), nullable=False)
    estimated_impact = Column(String(100))
    cost_saving_inr = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class KnowledgeEmbedding(Base):
    __tablename__ = "knowledge_embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(String(150), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text_content = Column(Text, nullable=False)
    embedding_json = Column(JSON) # Mock vector representation
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))


class ModelMetric(Base):
    __tablename__ = "model_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("ai_models.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=lambda: datetime.now(UTC))
    accuracy_score = Column(Float, default=95.0)
    confidence_score = Column(Float, default=95.0)
    latency_ms = Column(Integer, default=150)

    ai_model = relationship("AIModel", back_populates="metrics")


class BiasReport(Base):
    __tablename__ = "bias_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("ai_models.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=lambda: datetime.now(UTC))
    bias_index = Column(Float, default=0.0)
    status = Column(String(20), default="No Bias") # No Bias, Warning

    ai_model = relationship("AIModel", back_populates="bias_reports")


class SuspiciousLogin(Base):
    __tablename__ = "suspicious_logins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    ip_address = Column(String(50))
    device_name = Column(String(100))
    location_country = Column(String(100))
    login_time = Column(DateTime, default=lambda: datetime.now(UTC))
    reason = Column(String(200))

