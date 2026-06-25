import contextvars
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import decode_token

# Context variable to hold the tenant (organization) ID for the current request context
tenant_context = contextvars.ContextVar("tenant_id", default=None)

class TenantIsolationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip tenant check for endpoints that don't need isolation (docs, auth)
        path = request.url.path
        if path.startswith("/api/v1/auth") or path in ["/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
            
        tenant_id = None
        
        # 1. Try to get tenant_id from header X-Tenant-ID
        header_tenant = request.headers.get("X-Tenant-ID")
        if header_tenant:
            try:
                tenant_id = int(header_tenant)
            except ValueError:
                pass
                
        # 2. Try to get tenant_id from JWT token if header is not present
        if not tenant_id:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                if payload:
                    tenant_id = payload.get("org_id")
                    
        # If tenant_id was successfully resolved, set the context
        if tenant_id:
            token_context = tenant_context.set(tenant_id)
            try:
                response = await call_next(request)
                return response
            finally:
                tenant_context.reset(token_context)
        else:
            # Fallback block: allow request to proceed, but context remains None
            # The database helper should verify context is present if filtering is required
            response = await call_next(request)
            return response
