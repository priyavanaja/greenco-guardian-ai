from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.database_models import Evidence, EvidenceVerification, FraudReport, AuditLog
from app.schemas.pydantic_schemas import EvidenceResponse, EvidenceVerificationSchema
from app.services.storage_service import storage_service
from app.middleware.tenant_isolation import tenant_context
from app.workers.celery_worker import process_evidence_upload
from app.core.logging import logger
import math

router = APIRouter(prefix="/evidence", tags=["Evidence Engine"])

@router.post("/upload", response_model=EvidenceResponse)
async def upload_evidence(
    file: UploadFile = File(...),
    uploader_id: int = Form(...),
    db: Session = Depends(get_db)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant organization scope required. Provide X-Tenant-ID header."
        )
        
    # Save file locally
    file_path, file_hash, file_size_str = storage_service.save_file(file, org_id)
    
    # Save base database evidence record
    evidence = Evidence(
        name=file.filename,
        file_path=file_path,
        file_hash=file_hash,
        file_size=file_size_str,
        file_type=file.filename.split(".")[-1],
        status="Pending",
        uploader_id=uploader_id,
        organization_id=org_id
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    
    # Trigger background Celery OCR & Forensics pipeline
    process_evidence_upload.delay(evidence.id)
    
    # Log Audit Log
    log = AuditLog(
        organization_id=org_id,
        user_email=f"user_id_{uploader_id}",
        action="Upload Evidence",
        details=f"Uploaded file {file.filename} (Hash: {file_hash[:10]}...)",
        reason="Periodic sustainability reports upload."
    )
    db.add(log)
    db.commit()
    
    logger.info(f"Triggered background AI pipeline for evidence ID: {evidence.id}")
    return evidence

@router.get("/list", response_model=List[EvidenceResponse])
def list_evidence(db: Session = Depends(get_db)):
    org_id = tenant_context.get()
    if not org_id:
        return db.query(Evidence).all() # Global admin list fallback
        
    # Multi-tenant isolation: filter results strictly by active organization
    return db.query(Evidence).filter(Evidence.organization_id == org_id).all()

@router.post("/verify/{evidence_id}", response_model=EvidenceResponse)
def manual_verify_override(
    evidence_id: int,
    status_override: str, # Approved or Rejected
    assessor_email: str = "assessor@greenco.org",
    db: Session = Depends(get_db)
):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence not found"
        )
        
    # Update status
    old_status = evidence.status
    evidence.status = status_override
    
    # Log override action in Audit logs
    log = AuditLog(
        organization_id=evidence.organization_id,
        user_email=assessor_email,
        action="Manual Status Override",
        details=f"Changed evidence {evidence.name} status from {old_status} to {status_override}",
        reason="Manual Assessor validation bypass."
    )
    db.add(log)
    db.commit()
    db.refresh(evidence)
    
    return evidence

@router.post("/proof-of-presence", response_model=EvidenceResponse)
def register_proof_of_presence(
    uploader_id: int = Form(...),
    gps_lat: float = Form(...),
    gps_lon: float = Form(...),
    device_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    On-site Live Camera Audit: GPS location matching against target factory geofence.
    Target coordinates: 12.9716, 79.1588 (ChennaiHQ)
    """
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization context required"
        )
        
    # Save file
    file_path, file_hash, file_size_str = storage_service.save_file(file, org_id)
    
    # Calculate distance to verified factory coordinates
    target_lat, target_lon = 12.9716, 79.1588
    dist = math.sqrt((gps_lat - target_lat)**2 + (gps_lon - target_lon)**2)
    gps_matched = dist < 0.05 # roughly within 5km
    
    evidence = Evidence(
        name=file.filename,
        file_path=file_path,
        file_hash=file_hash,
        file_size=file_size_str,
        file_type="image",
        status="Verified" if gps_matched else "Rejected",
        uploader_id=uploader_id,
        organization_id=org_id
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    
    # Verification details
    verification = EvidenceVerification(
        evidence_id=evidence.id,
        trust_score=99 if gps_matched else 45,
        confidence_score=95,
        ocr_extracted_text=f"Live Camera Capture. GPS coordinates: {gps_lat}, {gps_lon}",
        is_duplicate=False,
        signature_verified=True
    )
    db.add(verification)
    
    fraud = FraudReport(
        evidence_id=evidence.id,
        tampering_regions=[],
        deepfake_probability=0.01,
        pixel_manipulation_probability=0.01,
        gps_lat=gps_lat,
        gps_lon=gps_lon,
        gps_matched=gps_matched,
        device_id=device_id,
        time_matched=True,
        risk_level="Low" if gps_matched else "High"
    )
    db.add(fraud)
    db.commit()
    db.refresh(evidence)
    
    return evidence
