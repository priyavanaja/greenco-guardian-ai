from enum import Enum
from typing import List, Dict
from fastapi import Depends, HTTPException, status
from app.middleware.tenant_isolation import tenant_context
from app.core.security import decode_token
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

class PermissionName(str, Enum):
    VIEW_DASHBOARD = "view_dashboard"
    UPLOAD_EVIDENCE = "upload_evidence"
    VERIFY_EVIDENCE = "verify_evidence"
    MANAGE_USERS = "manage_users"
    MANAGE_SETTINGS = "manage_settings"
    ADJUST_SCORES = "adjust_scores"
    GENERATE_REPORTS = "generate_reports"
    VIEW_AUDIT_LOGS = "view_audit_logs"
    AI_GOVERNANCE_VIEW = "ai_governance_view"

# Mapping roles to their lists of permissions
ROLE_PERMISSIONS: Dict[str, List[PermissionName]] = {
    "Sustainability Manager": [
        PermissionName.VIEW_DASHBOARD,
        PermissionName.UPLOAD_EVIDENCE,
        PermissionName.GENERATE_REPORTS,
        PermissionName.AI_GOVERNANCE_VIEW
    ],
    "GreenCo Assessor": [
        PermissionName.VIEW_DASHBOARD,
        PermissionName.VERIFY_EVIDENCE,
        PermissionName.ADJUST_SCORES,
        PermissionName.GENERATE_REPORTS,
        PermissionName.VIEW_AUDIT_LOGS
    ],
    "AI Compliance Officer": [
        PermissionName.VIEW_DASHBOARD,
        PermissionName.VERIFY_EVIDENCE,
        PermissionName.VIEW_AUDIT_LOGS,
        PermissionName.AI_GOVERNANCE_VIEW
    ],
    "Certification Administrator": [
        PermissionName.VIEW_DASHBOARD,
        PermissionName.UPLOAD_EVIDENCE,
        PermissionName.VERIFY_EVIDENCE,
        PermissionName.MANAGE_USERS,
        PermissionName.MANAGE_SETTINGS,
        PermissionName.ADJUST_SCORES,
        PermissionName.GENERATE_REPORTS,
        PermissionName.VIEW_AUDIT_LOGS,
        PermissionName.AI_GOVERNANCE_VIEW
    ],
    "Executive Viewer": [
        PermissionName.VIEW_DASHBOARD
    ]
}

def get_current_user_token_data(token: str = Depends(oauth2_scheme)) -> Dict[str, any]:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

class PermissionChecker:
    def __init__(self, required_permission: PermissionName):
        self.required_permission = required_permission

    def __call__(self, token_data: Dict[str, any] = Depends(get_current_user_token_data)) -> Dict[str, any]:
        role = token_data.get("role")
        if not role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Role not specified in token context"
            )
        
        # Admin bypass
        if role == "Certification Administrator":
            return token_data
            
        allowed_permissions = ROLE_PERMISSIONS.get(role, [])
        if self.required_permission not in allowed_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required permission: {self.required_permission.value}"
            )
        return token_data
