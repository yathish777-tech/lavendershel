from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import require_admin, get_current_user_optional, rate_limit
from app.schemas.admin_login import AdminLoginRequest, AdminLoginResponse
from app.services.admin_auth_service import verify_admin_credentials, create_admin_token
from app.services.supabase_client import get_supabase_client
import logging

logger = logging.getLogger("lavendershell.auth")
router = APIRouter(tags=["Auth & Admin Login"])

@router.post(
    "/api/admin/login",
    response_model=AdminLoginResponse,
    dependencies=[Depends(rate_limit(max_requests=5, window_seconds=60))]
)
def admin_login(payload: AdminLoginRequest):
    """
    Admin authentication endpoint.
    Validates username and bcrypt-hashed password stored in backend/.env with constant-time checks.
    Rate limited to 5 attempts per minute per client IP.
    Returns an 8-hour JWT signed with ADMIN_JWT_SECRET.
    """
    is_valid = verify_admin_credentials(payload.username, payload.password)
    if not is_valid:
        logger.warning(f"Failed admin login attempt for username '{payload.username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

    logger.info(f"Admin login successful for '{payload.username}'")
    token_data = create_admin_token(payload.username)
    return token_data

@router.get("/api/admin/verify")
def verify_admin_session(admin: dict = Depends(require_admin)):
    """
    Guarded check to confirm the admin JWT is currently valid and active.
    """
    return {
        "valid": True,
        "username": admin.get("sub"),
        "role": "admin"
    }

@router.get("/api/auth/me")
def get_current_profile(current_user: dict = Depends(get_current_user_optional)):
    """
    Returns current user info from optional JWT and Supabase profiles.
    """
    if not current_user:
        return {"authenticated": False, "user": None}

    user_id = current_user.get("sub") or current_user.get("id")
    client = get_supabase_client()
    profile_data = {}

    if client and user_id:
        try:
            res = client.table("profiles").select("*").eq("id", user_id).single().execute()
            if res.data:
                profile_data = res.data
        except Exception as e:
            logger.error(f"Error fetching profile: {e}")

    return {
        "authenticated": True,
        "user_id": user_id,
        "email": current_user.get("email"),
        "role": profile_data.get("role", current_user.get("role", "customer")),
        "profile": profile_data
    }
