from typing import List, Dict, Any
from fastapi import WebSocket

class NotificationService:
    def __init__(self):
        # Maps organization_id -> List of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, organization_id: int):
        await websocket.accept()
        if organization_id not in self.active_connections:
            self.active_connections[organization_id] = []
        self.active_connections[organization_id].append(websocket)

    def disconnect(self, websocket: WebSocket, organization_id: int):
        if organization_id in self.active_connections:
            if websocket in self.active_connections[organization_id]:
                self.active_connections[organization_id].remove(websocket)

    async def broadcast_to_tenant(self, organization_id: int, message: Dict[str, Any]):
        """
        Send real-time JSON alert to all active connections within the tenant context.
        """
        if organization_id in self.active_connections:
            for connection in self.active_connections[organization_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Broken connection will be cleaned up on disconnect
                    pass

notification_service = NotificationService()
