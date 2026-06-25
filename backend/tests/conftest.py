import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from app.main import app
from app.database.session import Base, get_db

TEST_DATABASE_URL = "sqlite:///./test_greenco_guardian.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    db = TestingSessionLocal()
    from app.models.database_models import Organization, Role, User, AIModel
    from app.core.security import get_password_hash
    
    # Org
    tvs = Organization(name="TVS Motors", trust_score=97, certification_status="Gold (Active)", risk_level="Low", sustainability_score=84)
    hyundai = Organization(name="Hyundai", trust_score=91, certification_status="Silver (Pending Audit)", risk_level="Medium", sustainability_score=76)
    db.add(tvs)
    db.add(hyundai)
    db.commit()
    
    # Roles
    manager_role = Role(name="Sustainability Manager", description="Manager")
    assessor_role = Role(name="GreenCo Assessor", description="Assessor")
    admin_role = Role(name="Certification Administrator", description="Admin")
    db.add(manager_role)
    db.add(assessor_role)
    db.add(admin_role)
    db.commit()
    
    # Users
    u1 = User(email="manager@tvs.com", hashed_password=get_password_hash("password123"), full_name="Manager TVS", organization_id=tvs.id, role_id=manager_role.id)
    u2 = User(email="assessor@greenco.org", hashed_password=get_password_hash("password123"), full_name="Assessor GreenCo", organization_id=tvs.id, role_id=assessor_role.id)
    db.add(u1)
    db.add(u2)
    db.commit()
    
    db.close()
    
    yield
    
    # Clean up test DB file
    if os.path.exists("./test_greenco_guardian.db"):
        os.remove("./test_greenco_guardian.db")

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
