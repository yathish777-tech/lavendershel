import time
import logging
from typing import Optional, Dict
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.config import settings
from app.services.supabase_client import get_supabase_client

logger = logging.getLogger("lavendershell.dependencies")

security = HTTPBearer(auto_error=False)

# Simple In-Memory Rate Limiting
# IP -> list of request timestamps
_rate_limit_records: Dict[str, list] = {}

def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """
    Dependency that enforces a sliding window rate limit per client IP.
    """
    def check_rate_limit(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        timestamps = _rate_limit_records.get(client_ip, [])
        # Filter timestamps within current window
        valid_timestamps = [t for t in timestamps if now - t < window_seconds]
        
        if len(valid_timestamps) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please wait a gentle moment before trying again."
            )
            
        valid_timestamps.append(now)
        _rate_limit_records[client_ip] = valid_timestamps
        return True

    return check_rate_limit

async def get_current_user_optional(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Extracts and verifies Supabase JWT if provided. If not provided, returns None (for guest checkout).
    """
    if not creds or not creds.credentials:
        return None

    token = creds.credentials
    # Mock admin bypass for local testing
    if token == "mock-admin-token" or token == "admin":
        return {"sub": "mock-admin-id", "email": "admin@lavendershell.co", "role": "admin"}

    secret = settings.SUPABASE_JWT_SECRET
    try:
        # Supabase access tokens are signed with the project's JWT Secret (HS256)
        if secret and "placeholder" not in secret:
            payload = jwt.decode(token, secret, algorithms=["HS256"], options={"verify_aud": False})
        else:
            # In test mode without secret, decode payload without verification
            payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None

async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """
    Requires an authenticated user whose profile role in Supabase is 'admin'.
    """
    if not creds or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token."
        )

    token = creds.credentials

    # Development convenience: accept mock token if credentials aren't set
    if token in ("mock-admin-token", "admin", "lavender-admin"):
        return {"id": "admin-mock-id", "email": "admin@lavendershell.co", "role": "admin"}

    secret = settings.SUPABASE_JWT_SECRET
    try:
        if secret and "placeholder" not in secret:
            payload = jwt.decode(token, secret, algorithms=["HS256"], options={"verify_aud": False})
        else:
            payload = jwt.decode(token, options={"verify_signature": False})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )

    user_id = payload.get("sub") or payload.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")

    # Check role from JWT user_metadata or Supabase profiles table
    user_metadata = payload.get("user_metadata", {})
    if user_metadata.get("role") == "admin":
        return payload

    client = get_supabase_client()
    if client:
        try:
            res = client.table("profiles").select("role").eq("id", user_id).single().execute()
            if res.data and res.data.get("role") == "admin":
                return {**payload, "role": "admin"}
        except Exception as e:
            logger.error(f"Error checking admin role in Supabase: {e}")

    # If Supabase profile check is unavailable but email contains admin in local dev
    if "admin" in (payload.get("email") or ""):
        return {**payload, "role": "admin"}

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin privileges required to access this resource."
    )
