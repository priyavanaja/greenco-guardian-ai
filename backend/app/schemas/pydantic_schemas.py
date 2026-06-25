from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth / User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    organization_name: str # TVS Motors, Hyundai, Ashok Leyland, Company A
    role_name: str # Sustainability Manager, GreenCo Assessor, AI Compliance Officer, Certification Administrator, Executive Viewer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    org_id: Optional[int] = None
    role: Optional[str] = None

class UserResponse(UserBase):
    id: int
    organization_id: int
    role_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Organization
class OrganizationBase(BaseModel):
    name: str
    trust_score: int
    certification_status: str
    risk_level: str
    sustainability_score: int

class OrganizationResponse(OrganizationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Evidence
class EvidenceUpload(BaseModel):
    name: str
    file_type: str # PDF, Image, CSV, etc.

class EvidenceVerificationSchema(BaseModel):
    trust_score: int
    confidence_score: int
    ocr_extracted_text: Optional[str] = None
    is_duplicate: bool
    signature_verified: bool
    metadata_json: Optional[Dict[str, Any]] = None
    verified_at: datetime

    class Config:
        from_attributes = True

class FraudReportSchema(BaseModel):
    tampering_regions: Optional[List[Any]] = None
    deepfake_probability: float
    pixel_manipulation_probability: float
    gps_lat: Optional[float] = None
    gps_lon: Optional[float] = None
    gps_matched: bool
    device_id: Optional[str] = None
    time_matched: bool
    risk_level: str

    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: int
    name: str
    file_path: str
    file_hash: str
    file_size: Optional[str] = None
    file_type: str
    status: str
    uploaded_at: datetime
    uploader_id: int
    organization_id: int
    verification: Optional[EvidenceVerificationSchema] = None
    fraud_report: Optional[FraudReportSchema] = None

    class Config:
        from_attributes = True

# Scoring
class ScoringResponse(BaseModel):
    energy_score: int
    water_score: int
    waste_score: int
    carbon_score: int
    resources_score: int
    overall_score: int
    certification_level: str

    class Config:
        from_attributes = True

class ScoreAdjustment(BaseModel):
    energy_score: int
    water_score: int
    waste_score: int
    carbon_score: int
    resources_score: int

# Risk
class RiskResponse(BaseModel):
    evidence_risk: str
    fraud_risk: str
    compliance_risk: str
    operational_risk: str
    overall_score: int
    category: str
    recommended_action: Optional[str] = None
    calculated_at: datetime

    class Config:
        from_attributes = True

# Copilot
class ChatQuery(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    citations: Optional[List[str]] = None
    reasoning_steps: Optional[List[Dict[str, str]]] = None

# Notification
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    priority: str
    category: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Reports
class ReportResponse(BaseModel):
    id: int
    name: str
    type: str
    format: str
    file_path: Optional[str] = None
    generated_at: datetime

    class Config:
        from_attributes = True

# Certificate
class CertificateResponse(BaseModel):
    id: int
    certificate_id: str
    hash_address: str
    qr_code_path: Optional[str] = None
    issued_at: datetime
    expires_at: Optional[datetime] = None
    status: str
    history_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
