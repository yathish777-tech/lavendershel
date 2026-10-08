import time
import logging
from typing import Optional, Dict
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.config import settings
from app.services.admin_auth_service import verify_admin_token
from app.services.supabase_client import get_supabase_client

logger = logging.getLogger("lavendershell.dependencies")

security = HTTPBearer(auto_error=False)

# Simple In-Memory Sliding Window Rate Limiting
# IP -> list of request timestamps
_rate_limit_records: Dict[str, list] = {}

def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """
    Dependency that enforces a sliding window rate limit per client IP.
    """
    def check_rate_limit(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        # Forwarded header check
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()

        now = time.time()
        timestamps = _rate_limit_records.get(client_ip, [])
        valid_timestamps = [t for t in timestamps if now - t < window_seconds]

        if len(valid_timestamps) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please wait a gentle moment before trying again."
            )

        valid_timestamps.append(now)
        _rate_limit_records[client_ip] = valid_timestamps
        return True

    return check_rate_limit

async def get_current_user_optional(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Extracts optional user token (for guest checkout vs logged-in customer).
    """
    if not creds or not creds.credentials:
        return None

    token = creds.credentials
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None

async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """
    Requires a valid admin JWT issued by POST /api/admin/login and signed with ADMIN_JWT_SECRET.
    Replaces the earlier Supabase Auth role check.
    """
    if not creds or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in with admin credentials.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = creds.credentials

    # Verify against ADMIN_JWT_SECRET
    try:
        payload = verify_admin_token(token)
        return payload
    except Exception as e:
        logger.warning(f"Admin authentication failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin session. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
