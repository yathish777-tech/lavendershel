from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.contact import ContactCreate, ContactResponse
from app.dependencies import rate_limit, require_admin
from app.services.supabase_client import get_supabase_client
import logging
from datetime import datetime

logger = logging.getLogger("lavendershell.contact")
router = APIRouter(tags=["Contact"])

MOCK_MESSAGES = []

@router.post(
    "/api/contact",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit(max_requests=5, window_seconds=60))]
)
def submit_contact_message(payload: ContactCreate):
    """
    Public contact form submission with rate limiting (5/min).
    Saves message into contact_messages table.
    """
    client = get_supabase_client()
    data = payload.model_dump()
    data["created_at"] = datetime.utcnow().isoformat()

    if client:
        try:
            res = client.table("contact_messages").insert(data).execute()
            if res.data:
                return {"success": True, "message": "Your gentle note has reached the studio with love! ✿"}
        except Exception as e:
            logger.error(f"Error saving contact message to Supabase: {e}")

    MOCK_MESSAGES.append(data)
    return {"success": True, "message": "Your gentle note has reached the studio with love! ✿"}

@router.get("/api/admin/contact-messages", response_model=List[ContactResponse])
def get_contact_messages(admin: dict = Depends(require_admin)):
    """
    Admin: view customer contact messages.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("contact_messages").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching contact messages: {e}")

    return MOCK_MESSAGES
