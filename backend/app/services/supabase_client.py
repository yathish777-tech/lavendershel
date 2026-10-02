import logging
from typing import Optional, Any
from app.config import settings

logger = logging.getLogger("lavendershell.supabase")

_supabase_client = None

def get_supabase_client():
    """
    Returns a singleton Supabase Client using the service role key.
    If credentials are placeholder or invalid in local dev, returns None or mock fallback.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or "placeholder" in settings.SUPABASE_URL:
        logger.warning("Supabase URL is placeholder. Database operations will use in-memory/mock fallback.")
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None
