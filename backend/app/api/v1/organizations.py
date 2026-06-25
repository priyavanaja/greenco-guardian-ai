from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.database_models import Organization, TenantSettings, TenantUsage, SubscriptionPlan
from app.schemas.pydantic_schemas import OrganizationResponse
from app.core.permissions import PermissionChecker, PermissionName, get_current_user_token_data
from app.middleware.tenant_isolation import tenant_context
from pydantic import BaseModel

router = APIRouter(prefix="/organizations", tags=["Organizations"])

class TenantSettingsUpdate(BaseModel):
    energy_alert_threshold: Optional[int] = None
    water_alert_threshold: Optional[int] = None
    carbon_alert_threshold: Optional[int] = None
    double_verification_required: Optional[bool] = None

class TenantSettingsResponse(BaseModel):
    energy_alert_threshold: int
    water_alert_threshold: int
    carbon_alert_threshold: int
    double_verification_required: bool

class TenantUsageResponse(BaseModel):
    month_year: str
    api_calls_count: int
    file_uploads_count: int
    ocr_credits_used: int

@router.get("/details", response_model=OrganizationResponse)
def get_details(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant organization context required."
        )
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org

@router.get("/list", response_model=List[OrganizationResponse])
def list_organizations(
    db: Session = Depends(get_db),
    token_data: dict = Depends(PermissionChecker(PermissionName.VIEW_AUDIT_LOGS))
):
    # Only assessors and admins can view global organization list
    return db.query(Organization).all()

@router.get("/settings", response_model=TenantSettingsResponse)
def get_tenant_settings(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    settings = db.query(TenantSettings).filter(TenantSettings.organization_id == org_id).first()
    if not settings:
        settings = TenantSettings(
            organization_id=org_id,
            energy_alert_threshold=80,
            water_alert_threshold=75,
            carbon_alert_threshold=85,
            double_verification_required=False
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=TenantSettingsResponse)
def update_tenant_settings(
    settings_data: TenantSettingsUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(PermissionChecker(PermissionName.MANAGE_SETTINGS))
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    settings = db.query(TenantSettings).filter(TenantSettings.organization_id == org_id).first()
    if not settings:
        settings = TenantSettings(organization_id=org_id)
        db.add(settings)
        
    if settings_data.energy_alert_threshold is not None:
        settings.energy_alert_threshold = settings_data.energy_alert_threshold
    if settings_data.water_alert_threshold is not None:
        settings.water_alert_threshold = settings_data.water_alert_threshold
    if settings_data.carbon_alert_threshold is not None:
        settings.carbon_alert_threshold = settings_data.carbon_alert_threshold
    if settings_data.double_verification_required is not None:
        settings.double_verification_required = settings_data.double_verification_required
        
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/usage", response_model=List[TenantUsageResponse])
def get_tenant_usage(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    usage = db.query(TenantUsage).filter(TenantUsage.organization_id == org_id).all()
    if not usage:
        # Initialize default mock usage
        default_usage = TenantUsage(
            organization_id=org_id,
            month_year="2026-06",
            api_calls_count=1240,
            file_uploads_count=8,
            ocr_credits_used=35
        )
        db.add(default_usage)
        db.commit()
        usage = [default_usage]
        
    return usage
