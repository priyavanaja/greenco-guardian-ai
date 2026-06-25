from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.database_models import SustainabilityScore, AIRecommendation, Organization
from app.core.permissions import get_current_user_token_data
from app.middleware.tenant_isolation import tenant_context
from app.services.ai_service import ai_service
from pydantic import BaseModel

router = APIRouter(prefix="/analytics", tags=["Analytics & Recommendations"])

class TwinTelemetryResponse(BaseModel):
    temperature: float
    voltage: float
    carbon_flow: float
    load_factor: float
    status: str

class RecommendationResponse(BaseModel):
    category: str
    recommendation_text: str
    estimated_impact: str
    cost_saving_inr: float

class SimulationRequest(BaseModel):
    energy: int
    water: int
    waste: int
    carbon: int
    resources: int

class SimulationResponse(BaseModel):
    predicted_score: int
    predicted_level: str
    improvement_percent: float

@router.get("/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    score = db.query(SustainabilityScore).filter(SustainabilityScore.organization_id == org_id).first()
    org = db.query(Organization).filter(Organization.id == org_id).first()
    
    # Defaults
    energy = score.energy_score if score else 85
    water = score.water_score if score else 72
    waste = score.waste_score if score else 91
    carbon = score.carbon_score if score else 88
    resources = score.resources_score if score else 84
    
    # Calculate carbon reduction base
    reduction = 12400 if org_id == 1 else (9800 if org_id == 2 else 4500)
    
    return {
        "sustainability_score": score.overall_score if score else 84,
        "certification_level": score.certification_level if score else "Gold",
        "trust_score": org.trust_score if org else 95,
        "carbon_reduction_tco2": reduction,
        "metrics": {
            "energy": energy,
            "water": water,
            "waste": waste,
            "carbon": carbon,
            "resources": resources
        },
        "trends": [
            {"month": "Jan", "score": 78},
            {"month": "Feb", "score": 80},
            {"month": "Mar", "score": 81},
            {"month": "Apr", "score": 83},
            {"month": "May", "score": 84},
            {"month": "Jun", "score": score.overall_score if score else 84}
        ]
    }

@router.get("/digital-twin", response_model=TwinTelemetryResponse)
def get_digital_twin_telemetry(
    token_data: dict = Depends(get_current_user_token_data)
):
    """
    Live factory WebGL telemetry feed simulation
    """
    import random
    return TwinTelemetryResponse(
        temperature=round(random.uniform(22.0, 28.5), 1),
        voltage=round(random.uniform(415.0, 422.0), 1),
        carbon_flow=round(random.uniform(1.2, 2.8), 2),
        load_factor=round(random.uniform(0.72, 0.88), 2),
        status="Optimal"
    )

@router.get("/recommendations", response_model=List[RecommendationResponse])
def get_ai_recommendations(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    recs = db.query(AIRecommendation).filter(AIRecommendation.organization_id == org_id).all()
    if not recs:
        # Seed defaults
        rec1 = AIRecommendation(
            organization_id=org_id,
            category="Water",
            recommendation_text="Install reverse osmosis recycling systems in production floor A. Reduces municipal fresh intake.",
            estimated_impact="Reduce water consumption by 15% to achieve Platinum certification.",
            cost_saving_inr=45000.0
        )
        rec2 = AIRecommendation(
            organization_id=org_id,
            category="Energy",
            recommendation_text="Integrate eastern yard solar controller into the main telemetry feed. Optimizes peak grid drawing.",
            estimated_impact="Saves 12% in peak grid electricity load.",
            cost_saving_inr=32000.0
        )
        db.add(rec1)
        db.add(rec2)
        db.commit()
        db.refresh(rec1)
        db.refresh(rec2)
        recs = [rec1, rec2]
        
    return [
        RecommendationResponse(
            category=r.category,
            recommendation_text=r.recommendation_text,
            estimated_impact=r.estimated_impact,
            cost_saving_inr=r.cost_saving_inr
        ) for r in recs
    ]

@router.post("/simulation", response_model=SimulationResponse)
def run_score_simulation(
    sim: SimulationRequest,
    token_data: dict = Depends(get_current_user_token_data)
):
    # Call AI Service weight score calculation
    calc = ai_service.calculate_green_score(
        sim.energy, sim.water, sim.waste, sim.carbon, sim.resources
    )
    
    current_overall = 84
    improvement = calc["overall_score"] - current_overall
    
    return SimulationResponse(
        predicted_score=calc["overall_score"],
        predicted_level=calc["certification_level"],
        improvement_percent=round(improvement, 2)
    )
