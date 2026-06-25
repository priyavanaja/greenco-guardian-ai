from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.database.session import engine, Base, SessionLocal
from app.middleware.request_logging import RequestLoggingMiddleware
from app.middleware.tenant_isolation import TenantIsolationMiddleware

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.scoring import router as scoring_router
from app.api.v1.copilot import router as copilot_router
from app.api.v1.users import router as users_router
from app.api.v1.organizations import router as org_router
from app.api.v1.fraud import router as fraud_router
from app.api.v1.certificates import router as cert_router
from app.api.v1.reports import router as reports_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.notifications import router as notifications_router

def seed_database():
    """
    Seeding basic configuration metrics on startup
    """
    db = SessionLocal()
    from app.models.database_models import Organization, Role, User, AIModel
    from app.core.security import get_password_hash
    try:
        # 1. Seed Organizations
        orgs = ["TVS Motors", "Hyundai", "Ashok Leyland", "Company A"]
        org_instances = {}
        for name in orgs:
            org = db.query(Organization).filter(Organization.name == name).first()
            if not org:
                # Mock values matches frontend stores
                trust = 97 if name == "TVS Motors" else (91 if name == "Hyundai" else (98 if name == "Ashok Leyland" else 48))
                status = "Gold (Active)" if name == "TVS Motors" else ("Silver (Pending Audit)" if name == "Hyundai" else ("Platinum (Active)" if name == "Ashok Leyland" else "Suspended (Fraud Alert)"))
                risk = "Low" if name in ["TVS Motors", "Ashok Leyland"] else ("Medium" if name == "Hyundai" else "Critical")
                score = 84 if name == "TVS Motors" else (76 if name == "Hyundai" else (92 if name == "Ashok Leyland" else 35))
                
                org = Organization(
                    name=name,
                    trust_score=trust,
                    certification_status=status,
                    risk_level=risk,
                    sustainability_score=score
                )
                db.add(org)
                db.commit()
                db.refresh(org)
            org_instances[name] = org

        # 2. Seed Roles
        roles = [
            "Sustainability Manager",
            "GreenCo Assessor",
            "AI Compliance Officer",
            "Certification Administrator",
            "Executive Viewer"
        ]
        role_instances = {}
        for r_name in roles:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(name=r_name, description=f"Standard Enterprise {r_name} role profile.")
                db.add(role)
                db.commit()
                db.refresh(role)
            role_instances[r_name] = role

        # 3. Seed Default Representative Users
        users_seed = [
            ("manager@tvs.com", "Sustainability Manager", "TVS Motors"),
            ("assessor@greenco.org", "GreenCo Assessor", "TVS Motors"),
            ("compliance@greenco.org", "AI Compliance Officer", "TVS Motors"),
            ("admin@greenco.org", "Certification Administrator", "TVS Motors"),
            ("viewer@tvs.com", "Executive Viewer", "TVS Motors"),
            ("manager@hyundai.com", "Sustainability Manager", "Hyundai"),
            ("manager@company-a.com", "Sustainability Manager", "Company A")
        ]
        
        for email, r_name, o_name in users_seed:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    hashed_password=get_password_hash("password123"),
                    full_name=f"{r_name} Representative",
                    organization_id=org_instances[o_name].id,
                    role_id=role_instances[r_name].id
                )
                db.add(user)
                db.commit()

        # 4. Seed Default AI Models
        models_seed = [
            ("Document AI Extractor", "5.0.0", 98.2),
            ("Image Verification Forensics", "4.2.1", 96.5),
            ("Deepfake Classifier", "2.1.0", 99.1)
        ]
        for m_name, m_ver, m_acc in models_seed:
            model = db.query(AIModel).filter(AIModel.name == m_name).first()
            if not model:
                model = AIModel(
                    name=m_name,
                    version=m_ver,
                    accuracy=m_acc,
                    confidence=m_acc - 2.0,
                    status="Healthy"
                )
                db.add(model)
                db.commit()

        logger.info("Successfully seeded database with roles, organizations, users, and models.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup Loggers
    setup_logging()
    
    # Run table creation (SQLite fallback-ready)
    logger.info("Verifying database schema connection...")
    Base.metadata.create_all(bind=engine)
    
    # Run database seeds
    seed_database()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise GreenCo Sustainability Certification SaaS backend API.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middlewares
app.add_middleware(TenantIsolationMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Mount Routes
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(org_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)
app.include_router(fraud_router, prefix=settings.API_V1_STR)
app.include_router(scoring_router, prefix=settings.API_V1_STR)
app.include_router(cert_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
@app.get("/api/v1/health", tags=["System"])
def health_check():
    return {
        "status": "Healthy",
        "project": settings.PROJECT_NAME,
        "database": "Connected",
        "version": "1.0.0"
    }
