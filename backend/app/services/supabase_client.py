import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("lavendershell.supabase")

_supabase_client = None

def is_supabase_configured() -> bool:
    """
    Checks if Supabase credentials are configured with actual (non-placeholder) values.
    """
    url = getattr(settings, "SUPABASE_URL", "") or ""
    key = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", "") or ""
    if not url or not key:
        return False
    url_lower = url.lower()
    key_lower = key.lower()
    if "placeholder" in url_lower or "placeholder" in key_lower:
        return False
    if "your-project" in url_lower or "your-supabase" in key_lower:
        return False
    return True

def ensure_storage_bucket(client) -> bool:
    """
    Ensures the product-images storage bucket exists and is public in Supabase.
    """
    if not client:
        return False
    try:
        bucket_name = settings.STORAGE_BUCKET_NAME
        buckets = client.storage.list_buckets()
        existing_names = [b.name for b in buckets] if buckets else []
        if bucket_name not in existing_names:
            logger.info(f"Storage bucket '{bucket_name}' not found. Creating public bucket...")
            client.storage.create_bucket(bucket_name, options={"public": True})
            logger.info(f"Successfully created public storage bucket '{bucket_name}'.")
        return True
    except Exception as e:
        logger.warning(f"Could not verify or auto-create Supabase storage bucket: {e}")
        return False

def get_supabase_client():
    """
    Returns a singleton Supabase Client using the service role key.
    If credentials are placeholder or unconfigured in local dev, returns None.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not is_supabase_configured():
        logger.warning(
            "Supabase URL is placeholder or unconfigured. "
            "Database operations will use in-memory/mock fallback."
        )
        return None

    try:
        from supabase import create_client
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        logger.info(f"Successfully initialized Supabase client for {settings.SUPABASE_URL}")
        # Auto-ensure bucket exists
        ensure_storage_bucket(_supabase_client)
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None

def check_supabase_health() -> Dict[str, Any]:
    """
    Diagnostic helper to test Supabase connection, table access, and bucket status.
    """
    configured = is_supabase_configured()
    if not configured:
        return {
            "configured": False,
            "status": "placeholder",
            "message": "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are placeholders. Using in-memory fallback.",
            "url": settings.SUPABASE_URL
        }

    client = get_supabase_client()
    if not client:
        return {
            "configured": True,
            "status": "failed_init",
            "message": "Failed to create Supabase client with current credentials.",
            "url": settings.SUPABASE_URL
        }

    # Test products table access
    table_ok = False
    table_error = None
    product_count = 0
    try:
        res = client.table("products").select("id", count="exact").limit(1).execute()
        table_ok = True
        product_count = res.count or 0
    except Exception as te:
        table_error = str(te)
        logger.error(f"Supabase products table check failed: {te}")

    # Test bucket access
    bucket_ok = False
    bucket_error = None
    try:
        ensure_storage_bucket(client)
        bucket_ok = True
    except Exception as be:
        bucket_error = str(be)

    return {
        "configured": True,
        "status": "connected" if table_ok else "schema_error",
        "url": settings.SUPABASE_URL,
        "products_table_ok": table_ok,
        "products_table_error": table_error,
        "product_count": product_count,
        "storage_bucket_ok": bucket_ok,
        "storage_bucket_error": bucket_error
    }
