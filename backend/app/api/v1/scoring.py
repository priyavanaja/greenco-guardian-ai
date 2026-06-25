from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database_models import SustainabilityScore, AuditLog
from app.schemas.pydantic_schemas import ScoringResponse, ScoreAdjustment
from app.middleware.tenant_isolation import tenant_context
from app.services.ai_service import ai_service
from app.core.logging import logger

router = APIRouter(prefix="/scoring", tags=["Scoring Engine"])

@router.get("/details", response_model=ScoringResponse)
def get_scoring_details(db: Session = Depends(get_db)):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization context required"
        )
        
    score = db.query(SustainabilityScore).filter(SustainabilityScore.organization_id == org_id).first()
    if not score:
        # Default mock values initialization
        score = SustainabilityScore(
            organization_id=org_id,
            energy_score=85,
            water_score=72,
            waste_score=91,
            carbon_score=88,
            resources_score=84,
            overall_score=84,
            certification_level="Gold"
        )
        db.add(score)
        db.commit()
        db.refresh(score)
        
    return score

@router.post("/adjust", response_model=ScoringResponse)
def adjust_scores(
    adjustment: ScoreAdjustment,
    editor_email: str = "manager@tvs.com",
    db: Session = Depends(get_db)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization context required"
        )
        
    score = db.query(SustainabilityScore).filter(SustainabilityScore.organization_id == org_id).first()
    if not score:
        score = SustainabilityScore(organization_id=org_id)
        db.add(score)
        
    # Re-calculate overall score using AI engine rules
    calc_res = ai_service.calculate_green_score(
        energy=adjustment.energy_score,
        water=adjustment.water_score,
        waste=adjustment.waste_score,
        carbon=adjustment.carbon_score,
        resources=adjustment.resources_score
    )
    
    score.energy_score = adjustment.energy_score
    score.water_score = adjustment.water_score
    score.waste_score = adjustment.waste_score
    score.carbon_score = adjustment.carbon_score
    score.resources_score = adjustment.resources_score
    score.overall_score = calc_res["overall_score"]
    score.certification_level = calc_res["certification_level"]
    
    # Audit log
    log = AuditLog(
        organization_id=org_id,
        user_email=editor_email,
        action="Adjust Scores",
        details=f"Recalculated overall score: {score.overall_score} ({score.certification_level})",
        reason="Manual adjustment simulator weights."
    )
    db.add(log)
    db.commit()
    db.refresh(score)
    
    logger.info(f"Updated green score for org {org_id} to {score.overall_score}%")
    return score
