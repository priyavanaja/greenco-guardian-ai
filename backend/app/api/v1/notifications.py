from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.database_models import Notification
from app.schemas.pydantic_schemas import NotificationResponse
from app.core.permissions import get_current_user_token_data
from app.middleware.tenant_isolation import tenant_context
from app.services.notification_service import notification_service
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/list", response_model=List[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    if not org_id:
        raise HTTPException(status_code=400, detail="Tenant context required")
        
    notifications = db.query(Notification).filter(
        Notification.organization_id == org_id
    ).order_by(Notification.created_at.desc()).all()
    
    if not notifications:
        # Initialize default mock notifications
        n1 = Notification(
            organization_id=org_id,
            title="Duplicate Evidence Flagged",
            message="System identified matching sensor screenshot uploaded as previously submitted in 2025.",
            priority="High",
            category="Fraud Detection",
            is_read=False
        )
        n2 = Notification(
            organization_id=org_id,
            title="Water Level Anomaly",
            message="Industrial Water Treatment plant flow spikes above standard benchmark by 38%.",
            priority="Medium",
            category="Sustainability Control Room",
            is_read=False
        )
        db.add(n1)
        db.add(n2)
        db.commit()
        db.refresh(n1)
        db.refresh(n2)
        notifications = [n1, n2]
        
    return notifications

@router.put("/read/{notification_id}")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(get_current_user_token_data)
):
    org_id = tenant_context.get()
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    if org_id and notif.organization_id != org_id:
        raise HTTPException(status_code=403, detail="Cross tenant access blocked")
        
    notif.is_read = True
    db.commit()
    return {"status": "success", "message": "Notification marked as read"}

@router.websocket("/ws/{organization_id}")
async def websocket_endpoint(websocket: WebSocket, organization_id: int):
    """
    Establish WebSockets communication pipeline for real-time dashboard notifications.
    """
    await notification_service.connect(websocket, organization_id)
    try:
        while True:
            # Keep connection alive, receive text if any
            data = await websocket.receive_text()
            # Send echo back or process request
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        notification_service.disconnect(websocket, organization_id)
