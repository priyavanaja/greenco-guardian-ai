from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
from app.database.session import get_db
from app.models.database_models import Report, AuditLog
from app.schemas.pydantic_schemas import ReportResponse
from app.core.permissions import PermissionChecker, PermissionName, get_current_user_token_data
from app.middleware.tenant_isolation import tenant_context
from app.workers.celery_worker import celery_app
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["Report Automation"])

class ReportRequest(BaseModel):
    name: str
    type: str # Sustainability, Compliance, Audit
    format: str # PDF, Excel

@router.post("/generate", response_model=ReportResponse)
def trigger_report_generation(
    report_data: ReportRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    # Create DB entry
    report = Report(
        organization_id=org_id,
        name=report_data.name,
        type=report_data.type,
        format=report_data.format,
        file_path=f"uploads/org_{org_id}/reports/{report_data.name.lower().replace(' ', '_')}.{report_data.format.lower()}"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # In a real setup, Celery task generates it. We mock trigger here.
    # Write empty mock report to file
    file_dir = os.path.dirname(report.file_path)
    os.makedirs(file_dir, exist_ok=True)
    with open(report.file_path, "w") as f:
        f.write(f"GreenCo Automated {report_data.type} Report for org {org_id}. Format: {report_data.format}.")
        
    # Audit log
    log = AuditLog(
        organization_id=org_id,
        user_email=token_data.get("sub"),
        action="Generate Report",
        details=f"Triggered generation of report {report.name} ({report_data.format})",
        reason="Periodic reporting request."
    )
    db.add(log)
    db.commit()
    
    return report

@router.get("/list", response_model=List[ReportResponse])
def list_reports(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    reports = db.query(Report).filter(Report.organization_id == org_id).all()
    if not reports:
        # Generate default reports
        r1 = Report(
            organization_id=org_id,
            name="Q2 Water Consumption Audit",
            type="Audit",
            format="PDF",
            file_path=f"uploads/org_{org_id}/reports/q2_water_audit.pdf"
        )
        r2 = Report(
            organization_id=org_id,
            name="Annual ESG Compliance Statement",
            type="Compliance",
            format="Excel",
            file_path=f"uploads/org_{org_id}/reports/annual_esg_statement.xlsx"
        )
        db.add(r1)
        db.add(r2)
        db.commit()
        db.refresh(r1)
        db.refresh(r2)
        
        # Write dummy files
        for r in [r1, r2]:
            os.makedirs(os.path.dirname(r.file_path), exist_ok=True)
            with open(r.file_path, "w") as f:
                f.write(f"Mock report data for {r.name}")
        reports = [r1, r2]
        
    return reports

@router.get("/download/{report_id}")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    # Isolation check
    if org_id and report.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Access denied. Cross tenant report download blocked.")
        
    if not os.path.exists(report.file_path):
        # Create a mock file on the fly if deleted
        os.makedirs(os.path.dirname(report.file_path), exist_ok=True)
        with open(report.file_path, "w") as f:
            f.write(f"Mock report data file re-created for download.")
            
    return FileResponse(
        path=report.file_path,
        filename=os.path.basename(report.file_path),
        media_type="application/octet-stream"
    )
