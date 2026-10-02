from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.category import (
    CategoryResponse, CategoryCreate, CategoryUpdate, CategoryReorderItem
)
from app.dependencies import require_admin
from app.services.supabase_client import get_supabase_client
import logging
import uuid

logger = logging.getLogger("lavendershell.categories")
router = APIRouter(tags=["Categories"])

# In-memory categories fallback
MOCK_CATEGORIES = [
    {
        "id": "cat-snail-mail",
        "name": "Monthly Snail Mail & Letters",
        "slug": "monthly-snail-mail",
        "description": "Mindfully curated wax-sealed letters, guided self-growth prompts, and vintage postage delivered right to your mailbox every month.",
        "image_url": None,
        "sort_order": 1,
        "is_active": True
    },
    {
        "id": "cat-seasonal-editions",
        "name": "Seasonal & Special Editions",
        "slug": "seasonal-special-editions",
        "description": "Limited-run solstice and seasonal keepsake boxes adorned with pressed florals, poetic ribbons, and whimsical surprises.",
        "image_url": None,
        "sort_order": 2,
        "is_active": True
    },
    {
        "id": "cat-journaling",
        "name": "Journaling & Self-Reflection",
        "slug": "journaling-self-development",
        "description": "Hardcover linen journals, gold foil bookmark ribbons, prompt cards, and habit trackers designed for your cozy morning pages.",
        "image_url": None,
        "sort_order": 3,
        "is_active": True
    },
    {
        "id": "cat-stationery",
        "name": "Self-Love Stationery & Stickers",
        "slug": "self-love-stationery",
        "description": "Holographic affirmation stickers, pastel washi tapes, brass wax seal stamps, and fine tip pastel gel ink pens.",
        "image_url": None,
        "sort_order": 4,
        "is_active": True
    },
    {
        "id": "cat-bundles",
        "name": "Gift Sets & Cozy Bundles",
        "slug": "bundles-gift-sets",
        "description": "Tied with silk ribbon: the ultimate gift to yourself or a kindred spirit, including our best-loved stationery treasures.",
        "image_url": None,
        "sort_order": 5,
        "is_active": True
    }
]

# ---------------- PUBLIC ENDPOINTS ----------------

@router.get("/api/categories", response_model=List[CategoryResponse])
def get_public_categories():
    """
    Returns all active categories ordered by sort_order.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("categories").select("*").eq("is_active", True).order("sort_order").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching categories from Supabase: {e}")

    active = [c for c in MOCK_CATEGORIES if c.get("is_active", True)]
    return sorted(active, key=lambda x: x.get("sort_order", 0))

# ---------------- ADMIN ENDPOINTS ----------------

@router.get("/api/admin/categories", response_model=List[CategoryResponse])
def get_admin_categories(admin: dict = Depends(require_admin)):
    """
    Admin: Returns all categories including inactive ones.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("categories").select("*").order("sort_order").execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Error fetching admin categories from Supabase: {e}")

    return sorted(MOCK_CATEGORIES, key=lambda x: x.get("sort_order", 0))

@router.post("/api/admin/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(cat: CategoryCreate, admin: dict = Depends(require_admin)):
    slug = cat.slug or cat.name.lower().replace(" ", "-").replace("/", "-")
    cat_id = f"cat-{uuid.uuid4().hex[:8]}"

    payload = {
        "id": cat_id,
        "name": cat.name,
        "slug": slug,
        "description": cat.description,
        "image_url": cat.image_url,
        "sort_order": cat.sort_order or (len(MOCK_CATEGORIES) + 1),
        "is_active": cat.is_active if cat.is_active is not None else True
    }

    client = get_supabase_client()
    if client:
        try:
            res = client.table("categories").insert(payload).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error creating category in Supabase: {e}")

    MOCK_CATEGORIES.append(payload)
    return payload

@router.put("/api/admin/categories/{cat_id}", response_model=CategoryResponse)
def update_category(cat_id: str, updates: CategoryUpdate, admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}

    if client:
        try:
            res = client.table("categories").update(update_data).eq("id", cat_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error updating category in Supabase: {e}")

    for idx, c in enumerate(MOCK_CATEGORIES):
        if c["id"] == cat_id:
            MOCK_CATEGORIES[idx].update(update_data)
            return MOCK_CATEGORIES[idx]

    raise HTTPException(status_code=404, detail="Category not found.")

@router.delete("/api/admin/categories/{cat_id}")
def delete_category(cat_id: str, admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    if client:
        try:
            client.table("categories").delete().eq("id", cat_id).execute()
        except Exception as e:
            logger.error(f"Error deleting category in Supabase: {e}")

    global MOCK_CATEGORIES
    MOCK_CATEGORIES = [c for c in MOCK_CATEGORIES if c["id"] != cat_id]
    return {"success": True, "message": f"Category {cat_id} deleted."}

@router.patch("/api/admin/categories/{cat_id}/toggle-active")
def toggle_category_active(cat_id: str, admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    if client:
        try:
            c = client.table("categories").select("is_active").eq("id", cat_id).single().execute()
            if c.data:
                new_state = not c.data.get("is_active", True)
                res = client.table("categories").update({"is_active": new_state}).eq("id", cat_id).execute()
                return {"id": cat_id, "is_active": new_state}
        except Exception as e:
            logger.error(f"Error toggling category active in Supabase: {e}")

    for c in MOCK_CATEGORIES:
        if c["id"] == cat_id:
            c["is_active"] = not c.get("is_active", True)
            return {"id": cat_id, "is_active": c["is_active"]}

    raise HTTPException(status_code=404, detail="Category not found.")

@router.post("/api/admin/categories/reorder")
def reorder_categories(items: List[CategoryReorderItem], admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    for itm in items:
        if client:
            try:
                client.table("categories").update({"sort_order": itm.sort_order}).eq("id", itm.id).execute()
            except Exception as e:
                logger.error(f"Error updating category order: {e}")
        for c in MOCK_CATEGORIES:
            if c["id"] == itm.id:
                c["sort_order"] = itm.sort_order

    return {"success": True, "message": "Categories reordered."}
