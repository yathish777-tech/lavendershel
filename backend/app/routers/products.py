from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from app.schemas.product import (
    ProductResponse, ProductCreate, ProductUpdate, ProductListResponse
)
from app.dependencies import require_admin
from app.services.supabase_client import get_supabase_client
from app.services.order_service import MOCK_PRODUCTS_DB
from app.config import settings
import logging
import uuid
from datetime import datetime

logger = logging.getLogger("lavendershell.products")
router = APIRouter(tags=["Products"])

# ---------------- PUBLIC ENDPOINTS ----------------

@router.get("/api/products", response_model=ProductListResponse)
def get_public_products(
    category: Optional[str] = Query(None, description="Category ID or Slug"),
    search: Optional[str] = Query(None, description="Keyword search in name/description/tags"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    sort: Optional[str] = Query("featured", description="featured | price-asc | price-desc | name"),
    featured: Optional[bool] = Query(None, description="Filter only featured items"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100)
):
    """
    Public listing of products with filtering, sorting, and pagination.
    """
    client = get_supabase_client()
    if client:
        try:
            query = client.table("products").select("*, categories(name)", count="exact").eq("is_active", True)

            if category and category != "all":
                query = query.eq("category_id", category)
            if min_price is not None:
                query = query.gte("price", min_price)
            if max_price is not None:
                query = query.lte("price", max_price)
            if featured is not None:
                query = query.eq("is_featured", featured)
            if search and search.strip():
                query = query.ilike("name", f"%{search.strip()}%")

            # Sorting
            if sort == "price-asc":
                query = query.order("price", desc=False)
            elif sort == "price-desc":
                query = query.order("price", desc=True)
            elif sort == "name":
                query = query.order("name", desc=False)
            else:  # featured first, then newest
                query = query.order("is_featured", desc=True).order("created_at", desc=True)

            start = (page - 1) * limit
            query = query.range(start, start + limit - 1)
            res = query.execute()

            items = []
            for row in (res.data or []):
                cat_info = row.pop("categories", None)
                cat_name = cat_info.get("name") if cat_info else None
                items.append({**row, "category_name": cat_name})

            total = res.count or len(items)
            total_pages = max(1, (total + limit - 1) // limit)

            return {
                "items": items,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": total_pages
            }
        except Exception as e:
            logger.error(f"Error fetching products from Supabase: {e}")

    # Fallback in-memory catalog
    all_prods = list(MOCK_PRODUCTS_DB.values())
    filtered = [p for p in all_prods if p.get("is_active", True)]

    if category and category != "all":
        filtered = [p for p in filtered if p.get("category_id") == category]
    if min_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) >= min_price]
    if max_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) <= max_price]
    if featured is not None:
        filtered = [p for p in filtered if p.get("is_featured") == featured]
    if search and search.strip():
        q = search.lower()
        filtered = [
            p for p in filtered
            if q in p.get("name", "").lower() or q in p.get("description", "").lower()
        ]

    if sort == "price-asc":
        filtered.sort(key=lambda x: x.get("price", 0))
    elif sort == "price-desc":
        filtered.sort(key=lambda x: x.get("price", 0), reverse=True)
    elif sort == "name":
        filtered.sort(key=lambda x: x.get("name", ""))
    else:
        filtered.sort(key=lambda x: 1 if x.get("is_featured") else 0, reverse=True)

    total = len(filtered)
    start = (page - 1) * limit
    paginated = filtered[start:start + limit]
    total_pages = max(1, (total + limit - 1) // limit)

    return {
        "items": paginated,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }

@router.get("/api/products/{slug_or_id}", response_model=ProductResponse)
def get_product_by_slug_or_id(slug_or_id: str):
    """
    Public single product detail by slug or ID.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("products").select("*, categories(name)").or_(f"slug.eq.{slug_or_id},id.eq.{slug_or_id}").single().execute()
            if res.data:
                row = dict(res.data)
                cat_info = row.pop("categories", None)
                row["category_name"] = cat_info.get("name") if cat_info else None
                return row
        except Exception as e:
            logger.error(f"Error fetching product {slug_or_id} from Supabase: {e}")

    for p in MOCK_PRODUCTS_DB.values():
        if p.get("slug") == slug_or_id or p.get("id") == slug_or_id:
            return p

    raise HTTPException(status_code=404, detail="Product not found.")

# ---------------- ADMIN ENDPOINTS ----------------

@router.get("/api/admin/products", response_model=List[ProductResponse])
def get_admin_products(admin: dict = Depends(require_admin)):
    """
    Admin: returns all products including inactive.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("products").select("*, categories(name)").order("created_at", desc=True).execute()
            if res.data:
                items = []
                for row in res.data:
                    cat_info = row.pop("categories", None)
                    items.append({**row, "category_name": cat_info.get("name") if cat_info else None})
                return items
        except Exception as e:
            logger.error(f"Error fetching admin products from Supabase: {e}")

    return list(MOCK_PRODUCTS_DB.values())

@router.post("/api/admin/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, admin: dict = Depends(require_admin)):
    slug = product.slug or product.name.lower().replace(" ", "-").replace("/", "-")
    prod_id = f"prod-{uuid.uuid4().hex[:10]}"

    data = product.model_dump()
    data["id"] = prod_id
    data["slug"] = slug

    client = get_supabase_client()
    if client:
        try:
            res = client.table("products").insert(data).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error inserting product in Supabase: {e}")

    MOCK_PRODUCTS_DB[prod_id] = data
    return data

@router.put("/api/admin/products/{prod_id}", response_model=ProductResponse)
def update_product(prod_id: str, updates: ProductUpdate, admin: dict = Depends(require_admin)):
    data = {k: v for k, v in updates.model_dump().items() if v is not None}
    data["updated_at"] = datetime.utcnow().isoformat()

    client = get_supabase_client()
    if client:
        try:
            res = client.table("products").update(data).eq("id", prod_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error updating product in Supabase: {e}")

    if prod_id in MOCK_PRODUCTS_DB:
        MOCK_PRODUCTS_DB[prod_id].update(data)
        return MOCK_PRODUCTS_DB[prod_id]

    raise HTTPException(status_code=404, detail="Product not found.")

@router.delete("/api/admin/products/{prod_id}")
def delete_product(prod_id: str, admin: dict = Depends(require_admin)):
    """
    Deletes product and removes any uploaded images from Supabase Storage.
    """
    client = get_supabase_client()
    if client:
        try:
            # Check existing images for cleanup
            res = client.table("products").select("images").eq("id", prod_id).single().execute()
            if res.data and res.data.get("images"):
                for img_url in res.data["images"]:
                    if f"/storage/v1/object/public/{settings.STORAGE_BUCKET_NAME}/" in img_url:
                        file_path = img_url.split(f"/{settings.STORAGE_BUCKET_NAME}/")[-1]
                        try:
                            client.storage.from_(settings.STORAGE_BUCKET_NAME).remove([file_path])
                        except Exception as storage_err:
                            logger.warning(f"Failed to remove storage image {file_path}: {storage_err}")

            client.table("products").delete().eq("id", prod_id).execute()
        except Exception as e:
            logger.error(f"Error deleting product in Supabase: {e}")

    if prod_id in MOCK_PRODUCTS_DB:
        del MOCK_PRODUCTS_DB[prod_id]

    return {"success": True, "message": f"Product {prod_id} deleted."}

@router.patch("/api/admin/products/{prod_id}/toggle-active")
def toggle_product_active(prod_id: str, admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    if client:
        try:
            p = client.table("products").select("is_active").eq("id", prod_id).single().execute()
            if p.data:
                new_state = not p.data.get("is_active", True)
                client.table("products").update({"is_active": new_state}).eq("id", prod_id).execute()
                return {"id": prod_id, "is_active": new_state}
        except Exception as e:
            logger.error(f"Error toggling product active in Supabase: {e}")

    if prod_id in MOCK_PRODUCTS_DB:
        MOCK_PRODUCTS_DB[prod_id]["is_active"] = not MOCK_PRODUCTS_DB[prod_id].get("is_active", True)
        return {"id": prod_id, "is_active": MOCK_PRODUCTS_DB[prod_id]["is_active"]}

    raise HTTPException(status_code=404, detail="Product not found.")

@router.patch("/api/admin/products/{prod_id}/toggle-featured")
def toggle_product_featured(prod_id: str, admin: dict = Depends(require_admin)):
    client = get_supabase_client()
    if client:
        try:
            p = client.table("products").select("is_featured").eq("id", prod_id).single().execute()
            if p.data:
                new_state = not p.data.get("is_featured", False)
                client.table("products").update({"is_featured": new_state}).eq("id", prod_id).execute()
                return {"id": prod_id, "is_featured": new_state}
        except Exception as e:
            logger.error(f"Error toggling product featured in Supabase: {e}")

    if prod_id in MOCK_PRODUCTS_DB:
        MOCK_PRODUCTS_DB[prod_id]["is_featured"] = not MOCK_PRODUCTS_DB[prod_id].get("is_featured", False)
        return {"id": prod_id, "is_featured": MOCK_PRODUCTS_DB[prod_id]["is_featured"]}

    raise HTTPException(status_code=404, detail="Product not found.")
