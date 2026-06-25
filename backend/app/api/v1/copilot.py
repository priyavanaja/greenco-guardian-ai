from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database_models import ChatHistory, SustainabilityScore, Organization
from app.schemas.pydantic_schemas import ChatQuery, ChatResponse
from app.middleware.tenant_isolation import tenant_context
from app.services.ai_service import ai_service
from app.core.logging import logger

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_copilot(
    query_data: ChatQuery,
    user_id: int = 1, # Default user context fallback
    db: Session = Depends(get_db)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization context required"
        )
        
    org = db.query(Organization).filter(Organization.id == org_id).first()
    org_name = org.name if org else "TVS Motors"
    
    # Retrieve current scores context
    score = db.query(SustainabilityScore).filter(SustainabilityScore.organization_id == org_id).first()
    scores_dict = {}
    if score:
        scores_dict = {
            "energy": score.energy_score,
            "water": score.water_score,
            "waste": score.waste_score,
            "carbon": score.carbon_score,
            "resources": score.resources_score
        }
    else:
        scores_dict = {"energy": 85, "water": 72, "waste": 91, "carbon": 88, "resources": 84}
        
    # Process through explainable AI responder
    ai_res = ai_service.generate_copilot_response(query_data.query, org_name, scores_dict)
    
    # Log chat history in database
    chat_log = ChatHistory(
        user_id=user_id,
        query=query_data.query,
        response=ai_res["response"],
        context_json={
            "citations": ai_res["citations"],
            "reasoning_steps": ai_res["reasoning_steps"]
        }
    )
    db.add(chat_log)
    db.commit()
    
    return ai_res
