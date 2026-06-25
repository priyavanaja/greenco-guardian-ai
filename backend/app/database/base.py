# Import all the models so that Base has them before Alembic imports them
from app.database.session import Base
from app.models.database_models import (
    Organization, Role, Permission, User, UserSession,
    Evidence, EvidenceVerification, FraudReport, RiskScore,
    Assessment, SustainabilityScore, Certificate, Report,
    Notification, AuditLog, ChatHistory, AIModel,
    SubscriptionPlan, TenantSettings, TenantUsage, AIRecommendation,
    KnowledgeEmbedding, ModelMetric, BiasReport, SuspiciousLogin
)

