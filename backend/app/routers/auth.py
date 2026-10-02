from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import require_admin, get_current_user_optional
from app.services.supabase_client import get_supabase_client
import logging

logger = logging.getLogger("lavendershell.auth")
router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/me")
def get_current_profile(current_user: dict = Depends(get_current_user_optional)):
    """
    Returns current user info from JWT and Supabase profiles.
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

@router.post("/verify-admin")
def verify_admin_status(admin: dict = Depends(require_admin)):
    """
    Validates that the provided token belongs to an administrator.
    """
    return {
        "is_admin": True,
        "user": admin
    }
