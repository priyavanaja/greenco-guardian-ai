from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.database_models import User, UserSession, AuditLog
from app.schemas.pydantic_schemas import UserResponse
from app.core.permissions import PermissionChecker, PermissionName, get_current_user_token_data
from app.middleware.tenant_isolation import tenant_context
from app.core.logging import logger
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

class UserRoleUpdate(BaseModel):
    user_id: int
    new_role_name: str

class UserSessionResponse(BaseModel):
    id: int
    device_id: str
    ip_address: str
    user_agent: str
    login_time: str
    is_active: bool

    class Config:
        from_attributes = True

@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    user_id = token_data.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/sessions", response_model=List[UserSessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    user_id = token_data.get("sub")
    # Return all sessions for the current user
    sessions = db.query(UserSession).filter(UserSession.user_id == int(user_id)).order_by(UserSession.login_time.desc()).all()
    
    # Format login_time to ISO format string
    response_sessions = []
    for s in sessions:
        response_sessions.append(UserSessionResponse(
            id=s.id,
            device_id=s.device_id or "DEV_UNKNOWN",
            ip_address=s.ip_address or "127.0.0.1",
            user_agent=s.user_agent or "Browser Client",
            login_time=s.login_time.isoformat(),
            is_active=s.is_active
        ))
    return response_sessions

@router.put("/role", response_model=UserResponse)
def update_user_role(
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(PermissionChecker(PermissionName.MANAGE_USERS))
):
    from app.models.database_models import Role
    user = db.query(User).filter(User.id == role_update.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    role = db.query(Role).filter(Role.name == role_update.new_role_name).first()
    if not role:
        # Create role if missing
        role = Role(name=role_update.new_role_name, description=f"Dynamically generated role for {role_update.new_role_name}")
        db.add(role)
        db.commit()
        db.refresh(role)
        
    old_role = user.role.name if user.role else "None"
    user.role_id = role.id
    db.commit()
    db.refresh(user)
    
    # Log audit
    log = AuditLog(
        organization_id=user.organization_id,
        user_email=token_data.get("sub"),
        action="Update User Role",
        details=f"Updated user ID {user.id} role from {old_role} to {role_update.new_role_name}",
        reason="Admin user adjustments."
    )
    db.add(log)
    db.commit()
    
    logger.info(f"Role updated for user {user.email} by admin {token_data.get('sub')}")
    return user
