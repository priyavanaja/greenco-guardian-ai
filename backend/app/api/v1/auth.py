from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database.session import get_db
from app.models.database_models import User, Organization, Role, UserSession
from app.schemas.pydantic_schemas import UserCreate, UserLogin, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.logging import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Get or create organization
    org = db.query(Organization).filter(Organization.name == user_data.organization_name).first()
    if not org:
        org = Organization(name=user_data.organization_name)
        db.add(org)
        db.commit()
        db.refresh(org)
        
    # Get or create Role
    role = db.query(Role).filter(Role.name == user_data.role_name).first()
    if not role:
        role = Role(name=user_data.role_name, description=f"Scope role for {user_data.role_name}")
        db.add(role)
        db.commit()
        db.refresh(role)
        
    # Create User
    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        organization_id=org.id,
        role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"Registered user {new_user.email} in organization {org.name}")
    return new_user

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Track login session
    session = UserSession(
        user_id=user.id,
        device_id="DEV_BROWSER_WEB",
        ip_address="127.0.0.1",
        user_agent="Mock Webkit Client"
    )
    db.add(session)
    db.commit()
    
    # Create access & refresh tokens
    role_name = user.role.name if user.role else "Executive Viewer"
    access_token = create_access_token(user.id, user.organization_id, role_name)
    refresh_token = create_refresh_token(user.id, user.organization_id, role_name)
    
    logger.info(f"User {user.email} logged in. Active role: {role_name}")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
