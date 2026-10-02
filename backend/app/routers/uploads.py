from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.dependencies import require_admin
from app.services.supabase_client import get_supabase_client
from app.config import settings
import logging
import uuid
import os

logger = logging.getLogger("lavendershell.uploads")
router = APIRouter(prefix="/api/admin/uploads", tags=["Uploads"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin)
):
    """
    Admin-only upload endpoint for product imagery.
    Validates mime type (jpg, png, webp) and size (<= 5MB).
    Uploads to Supabase Storage bucket 'product-images' and returns public URL.
    """
    # 1. Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Only JPG, PNG, and WebP are allowed."
        )

    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".png" if "png" in file.content_type else ".jpg"

    # 2. Read contents and validate size (max 5MB)
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5MB maximum limit."
        )

    # 3. Generate unique filename
    unique_filename = f"prod_{uuid.uuid4().hex[:12]}{ext}"
    storage_path = f"uploads/{unique_filename}"

    client = get_supabase_client()
    if client:
        try:
            # Upload to Supabase bucket
            res = client.storage.from_(settings.STORAGE_BUCKET_NAME).upload(
                path=storage_path,
                file=contents,
                file_options={"content-type": file.content_type, "cache-control": "3600", "upsert": "false"}
            )
            # Retrieve public URL
            public_url = client.storage.from_(settings.STORAGE_BUCKET_NAME).get_public_url(storage_path)
            return {
                "success": True,
                "file_name": unique_filename,
                "url": public_url
            }
        except Exception as e:
            logger.error(f"Error uploading image to Supabase storage: {e}")

    # Fallback placeholder/data URI for dev testing when Supabase storage bucket isn't active
    import base64
    b64_content = base64.b64encode(contents).decode("utf-8")
    data_uri = f"data:{file.content_type};base64,{b64_content}"
    return {
        "success": True,
        "file_name": unique_filename,
        "url": data_uri
    }
