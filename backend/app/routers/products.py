from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List, Dict, Any
from app.schemas.product import (
    ProductResponse, ProductCreate, ProductUpdate, ProductListResponse
)
from app.dependencies import require_admin
from app.services.supabase_client import get_supabase_client, is_supabase_configured
from app.services.order_service import MOCK_PRODUCTS_DB
from app.config import settings
import logging
import uuid
from datetime import datetime

logger = logging.getLogger("lavendershell.products")
router = APIRouter(tags=["Products"])

# Valid PostgreSQL database columns in public.products table
DB_PRODUCT_COLUMNS = {
    "id", "name", "title", "slug", "category_id", "description",
    "price", "compare_at_price", "images", "variants",
    "tags", "badges", "is_subscription", "subscription_plans",
    "stock", "is_featured", "is_active", "created_at", "updated_at"
}

def sanitize_product_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitizes dictionary so only valid columns defined in PostgreSQL public.products
    are sent to PostgREST, preventing PGRST column-not-found errors.
    """
    db_data: Dict[str, Any] = {}

    # name / title
    name = data.get("name") or data.get("title") or ""
    db_data["name"] = name
    db_data["title"] = data.get("title") or name

    # slug
    if data.get("slug"):
        db_data["slug"] = data["slug"]
    elif name:
        db_data["slug"] = name.lower().replace(" ", "-").replace("/", "-")

    # id
    if data.get("id"):
        db_data["id"] = data["id"]

    # category_id
    cat = data.get("category_id") or data.get("categoryId") or data.get("category")
    if cat:
        db_data["category_id"] = cat

    # description
    if "description" in data:
        db_data["description"] = data.get("description")

    # price
    if data.get("price") is not None:
        try:
            db_data["price"] = float(data["price"])
        except (ValueError, TypeError):
            pass

    # compare_at_price
    comp = data.get("compare_at_price") if "compare_at_price" in data else data.get("compareAtPrice")
    if comp is not None:
        try:
            db_data["compare_at_price"] = float(comp) if comp != "" else None
        except (ValueError, TypeError):
            db_data["compare_at_price"] = None

    # images
    imgs = data.get("images")
    if imgs is not None:
        db_data["images"] = list(imgs) if isinstance(imgs, list) else ([imgs] if imgs else [])

    # variants
    vars_ = data.get("variants")
    if vars_ is not None:
        db_data["variants"] = list(vars_) if isinstance(vars_, list) else []

    # tags
    tags = data.get("tags")
    if tags is not None:
        db_data["tags"] = list(tags) if isinstance(tags, list) else []

    # badges
    badges = data.get("badges")
    if badges is not None:
        db_data["badges"] = list(badges) if isinstance(badges, list) else []
    elif data.get("badge"):
        db_data["badges"] = [data["badge"]]

    # is_subscription
    sub = data.get("is_subscription") if "is_subscription" in data else data.get("isSubscription")
    if sub is not None:
        db_data["is_subscription"] = bool(sub)

    # subscription_plans
    plans = data.get("subscription_plans") if "subscription_plans" in data else data.get("subscriptionPlans")
    if plans is not None:
        db_data["subscription_plans"] = list(plans) if isinstance(plans, list) else []

    # stock
    if data.get("stock") is not None:
        try:
            db_data["stock"] = int(data["stock"])
        except (ValueError, TypeError):
            pass

    # is_featured
    feat = data.get("is_featured") if "is_featured" in data else data.get("isFeatured") if "isFeatured" in data else data.get("featured")
    if feat is not None:
        db_data["is_featured"] = bool(feat)

    # is_active
    act = data.get("is_active") if "is_active" in data else data.get("isActive") if "isActive" in data else data.get("active")
    if act is not None:
        db_data["is_active"] = bool(act)

    if data.get("created_at"):
        db_data["created_at"] = data["created_at"]
    if data.get("updated_at"):
        db_data["updated_at"] = data["updated_at"]

    # Filter strictly to valid PostgreSQL table columns
    return {k: v for k, v in db_data.items() if k in DB_PRODUCT_COLUMNS and v is not None}

def format_product_response(row: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensures every product returned by the API has both camelCase and snake_case properties
    so both Storefront and Admin frontend components bind effortlessly.
    """
    row = dict(row)
    name = row.get("name") or row.get("title") or ""
    cat_id = row.get("category_id") or row.get("categoryId")
    is_feat = row.get("is_featured") if "is_featured" in row else row.get("isFeatured", False)
    is_act = row.get("is_active") if "is_active" in row else row.get("isActive", True)
    is_sub = row.get("is_subscription") if "is_subscription" in row else row.get("isSubscription", False)
    comp_price = row.get("compare_at_price") if "compare_at_price" in row else row.get("compareAtPrice")
    plans = row.get("subscription_plans") or row.get("subscriptionPlans") or []
    badges = row.get("badges") or []
    if isinstance(badges, str):
        badges = [badges]
    images = row.get("images") or []
    if isinstance(images, str):
        images = [images]

    row["name"] = name
    row["title"] = name
    row["category_id"] = cat_id
    row["categoryId"] = cat_id
    row["is_featured"] = bool(is_feat)
    row["isFeatured"] = bool(is_feat)
    row["is_active"] = bool(is_act)
    row["isActive"] = bool(is_act)
    row["is_subscription"] = bool(is_sub)
    row["isSubscription"] = bool(is_sub)
    row["compare_at_price"] = comp_price
    row["compareAtPrice"] = comp_price
    row["subscription_plans"] = plans
    row["subscriptionPlans"] = plans
    row["badges"] = badges
    row["badge"] = badges[0] if badges else None
    row["images"] = images
    row["image"] = images[0] if images else None
    row["rating"] = float(row.get("rating", 5.0))
    row["reviewCount"] = int(row.get("reviewCount", 0))
    row["illustrationType"] = row.get("illustrationType") or row.get("illustration_type") or "envelope"
    row["illustration_type"] = row["illustrationType"]
    return row

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
    limit: int = Query(100, ge=1, le=200)
):
    """
    Public listing of products with filtering, sorting, and pagination.
    Operates strictly against Supabase when configured, with NO silent mock fallback.
    """
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
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
                kw = search.strip()
                query = query.or_(f"name.ilike.%{kw}%,description.ilike.%{kw}%")

            # Sorting
            if sort == "price-asc":
                query = query.order("price", desc=False)
            elif sort == "price-desc":
                query = query.order("price", desc=True)
            elif sort == "name":
                query = query.order("name", desc=False)
            else:
                query = query.order("is_featured", desc=True).order("created_at", desc=True)

            start = (page - 1) * limit
            query = query.range(start, start + limit - 1)
            res = query.execute()

            items = []
            for raw_row in (res.data or []):
                cat_info = raw_row.pop("categories", None)
                cat_name = cat_info.get("name") if cat_info else None
                row_dict = format_product_response(raw_row)
                row_dict["category_name"] = cat_name
                items.append(row_dict)

            total = res.count or len(items)
            total_pages = max(1, (total + limit - 1) // limit)

            return {
                "items": items,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": total_pages
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching products from Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error fetching products: {str(e)}"
            )

    # Fallback only when Supabase is in placeholder/offline mode
    all_prods = [format_product_response(p) for p in MOCK_PRODUCTS_DB.values()]
    filtered = [p for p in all_prods if p.get("is_active", True)]

    if category and category != "all":
        filtered = [p for p in filtered if p.get("category_id") == category or p.get("categoryId") == category]
    if min_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) >= min_price]
    if max_price is not None:
        filtered = [p for p in filtered if p.get("price", 0) <= max_price]
    if featured is not None:
        filtered = [p for p in filtered if p.get("is_featured") == featured]
    if search and search.strip():
        q = search.lower().strip()
        filtered = [
            p for p in filtered
            if q in p.get("name", "").lower()
            or q in p.get("title", "").lower()
            or q in p.get("description", "").lower()
            or any(q in t.lower() for t in p.get("tags", []))
            or any(q in b.lower() for b in p.get("badges", []))
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
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            res = client.table("products").select("*, categories(name)").or_(f"slug.eq.{slug_or_id},id.eq.{slug_or_id}").limit(1).execute()
            if res.data and len(res.data) > 0:
                raw_row = res.data[0]
                cat_info = raw_row.pop("categories", None)
                row_dict = format_product_response(raw_row)
                row_dict["category_name"] = cat_info.get("name") if cat_info else None
                return row_dict
            raise HTTPException(status_code=404, detail="Product not found.")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching product {slug_or_id} from Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error fetching product: {str(e)}"
            )

    for p in MOCK_PRODUCTS_DB.values():
        if p.get("slug") == slug_or_id or p.get("id") == slug_or_id:
            return format_product_response(p)

    raise HTTPException(status_code=404, detail="Product not found.")

# ---------------- ADMIN ENDPOINTS ----------------

@router.get("/api/admin/products", response_model=List[ProductResponse])
def get_admin_products(admin: dict = Depends(require_admin)):
    """
    Admin: returns all products including inactive.
    Operates strictly against Supabase when configured.
    """
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            res = client.table("products").select("*, categories(name)").order("created_at", desc=True).execute()
            items = []
            for raw_row in (res.data or []):
                cat_info = raw_row.pop("categories", None)
                row_dict = format_product_response(raw_row)
                row_dict["category_name"] = cat_info.get("name") if cat_info else None
                items.append(row_dict)
            return items
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching admin products from Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error fetching products: {str(e)}"
            )

    return [format_product_response(p) for p in MOCK_PRODUCTS_DB.values()]

@router.post("/api/admin/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, admin: dict = Depends(require_admin)):
    """
    Admin create product.
    Persists to Supabase public.products table.
    Does NOT silently fall back or pretend success if Supabase fails.
    """
    raw_dict = product.model_dump()
    prod_id = f"prod-{uuid.uuid4().hex[:10]}"
    slug = product.slug or product.name.lower().replace(" ", "-").replace("/", "-")
    raw_dict["id"] = prod_id
    raw_dict["slug"] = slug
    raw_dict["created_at"] = datetime.utcnow().isoformat()
    raw_dict["updated_at"] = datetime.utcnow().isoformat()

    db_data = sanitize_product_to_db(raw_dict)

    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            res = client.table("products").insert(db_data).execute()
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database returned empty response after product insertion."
                )
            created_prod = format_product_response(res.data[0])
            MOCK_PRODUCTS_DB[prod_id] = created_prod
            logger.info(f"Successfully inserted product '{created_prod['name']}' ({prod_id}) in Supabase.")
            return created_prod
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error inserting product in Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error creating product: {str(e)}"
            )

    # Local fallback
    created_prod = format_product_response(raw_dict)
    MOCK_PRODUCTS_DB[prod_id] = created_prod
    return created_prod

@router.put("/api/admin/products/{prod_id}", response_model=ProductResponse)
def update_product(prod_id: str, updates: ProductUpdate, admin: dict = Depends(require_admin)):
    """
    Admin update product.
    Persists updates to Supabase public.products table.
    """
    raw_updates = {k: v for k, v in updates.model_dump().items() if v is not None}
    raw_updates["updated_at"] = datetime.utcnow().isoformat()

    db_updates = sanitize_product_to_db(raw_updates)

    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            # Check existence first
            existing = client.table("products").select("id").eq("id", prod_id).execute()
            if not existing.data:
                raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")

            res = client.table("products").update(db_updates).eq("id", prod_id).execute()
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database returned empty response after product update."
                )
            updated_prod = format_product_response(res.data[0])
            MOCK_PRODUCTS_DB[prod_id] = updated_prod
            logger.info(f"Successfully updated product '{prod_id}' in Supabase.")
            return updated_prod
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating product in Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error updating product: {str(e)}"
            )

    if prod_id in MOCK_PRODUCTS_DB:
        MOCK_PRODUCTS_DB[prod_id].update(raw_updates)
        return format_product_response(MOCK_PRODUCTS_DB[prod_id])

    raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")

@router.delete("/api/admin/products/{prod_id}")
def delete_product(prod_id: str, admin: dict = Depends(require_admin)):
    """
    Deletes product from Supabase public.products and cleans up images from storage.
    Fails with HTTP error on database failure; never returns 200 on error.
    """
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            # Verify product exists in Supabase
            existing = client.table("products").select("id, images").eq("id", prod_id).execute()
            if not existing.data:
                raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found in database.")

            # Cleanup images from storage bucket
            images = existing.data[0].get("images") or []
            for img_url in images:
                if f"/{settings.STORAGE_BUCKET_NAME}/" in img_url:
                    file_path = img_url.split(f"/{settings.STORAGE_BUCKET_NAME}/")[-1]
                    try:
                        client.storage.from_(settings.STORAGE_BUCKET_NAME).remove([file_path])
                    except Exception as storage_err:
                        logger.warning(f"Failed to remove storage image {file_path}: {storage_err}")

            client.table("products").delete().eq("id", prod_id).execute()
            MOCK_PRODUCTS_DB.pop(prod_id, None)
            logger.info(f"Successfully deleted product '{prod_id}' from Supabase.")
            return {"success": True, "message": f"Product {prod_id} deleted."}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting product in Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error deleting product: {str(e)}"
            )

    if prod_id in MOCK_PRODUCTS_DB:
        del MOCK_PRODUCTS_DB[prod_id]
        return {"success": True, "message": f"Product {prod_id} deleted."}

    raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")

@router.patch("/api/admin/products/{prod_id}/toggle-active")
def toggle_product_active(prod_id: str, admin: dict = Depends(require_admin)):
    """
    Toggles the is_active state of a product in Supabase.
    """
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            p = client.table("products").select("is_active").eq("id", prod_id).execute()
            if not p.data:
                raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")
            new_state = not p.data[0].get("is_active", True)
            res = client.table("products").update({"is_active": new_state}).eq("id", prod_id).execute()
            if prod_id in MOCK_PRODUCTS_DB:
                MOCK_PRODUCTS_DB[prod_id]["is_active"] = new_state
                MOCK_PRODUCTS_DB[prod_id]["isActive"] = new_state
            return {"id": prod_id, "is_active": new_state, "isActive": new_state}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error toggling product active in Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error toggling active status: {str(e)}"
            )

    if prod_id in MOCK_PRODUCTS_DB:
        current = MOCK_PRODUCTS_DB[prod_id].get("is_active", True)
        MOCK_PRODUCTS_DB[prod_id]["is_active"] = not current
        MOCK_PRODUCTS_DB[prod_id]["isActive"] = not current
        return {"id": prod_id, "is_active": not current, "isActive": not current}

    raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")

@router.patch("/api/admin/products/{prod_id}/toggle-featured")
def toggle_product_featured(prod_id: str, admin: dict = Depends(require_admin)):
    """
    Toggles the is_featured state of a product in Supabase.
    """
    if is_supabase_configured():
        client = get_supabase_client()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase client could not be initialized."
            )
        try:
            p = client.table("products").select("is_featured").eq("id", prod_id).execute()
            if not p.data:
                raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")
            new_state = not p.data[0].get("is_featured", False)
            res = client.table("products").update({"is_featured": new_state}).eq("id", prod_id).execute()
            if prod_id in MOCK_PRODUCTS_DB:
                MOCK_PRODUCTS_DB[prod_id]["is_featured"] = new_state
                MOCK_PRODUCTS_DB[prod_id]["isFeatured"] = new_state
            return {"id": prod_id, "is_featured": new_state, "isFeatured": new_state}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error toggling product featured in Supabase: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error toggling featured status: {str(e)}"
            )

    if prod_id in MOCK_PRODUCTS_DB:
        current = MOCK_PRODUCTS_DB[prod_id].get("is_featured", False)
        MOCK_PRODUCTS_DB[prod_id]["is_featured"] = not current
        MOCK_PRODUCTS_DB[prod_id]["isFeatured"] = not current
        return {"id": prod_id, "is_featured": not current, "isFeatured": not current}

    raise HTTPException(status_code=404, detail=f"Product '{prod_id}' not found.")
