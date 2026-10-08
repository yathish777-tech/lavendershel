from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Any, Dict
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    title: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[str] = None
    categoryId: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    compare_at_price: Optional[float] = None
    compareAtPrice: Optional[float] = None
    images: List[str] = Field(default_factory=list)
    variants: List[Dict[str, Any]] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    badges: List[str] = Field(default_factory=list)
    badge: Optional[str] = None
    is_subscription: bool = False
    isSubscription: Optional[bool] = None
    subscription_plans: List[Dict[str, Any]] = Field(default_factory=list)
    subscriptionPlans: Optional[List[Dict[str, Any]]] = None
    stock: int = Field(default=0, ge=0)
    is_featured: bool = False
    isFeatured: Optional[bool] = None
    is_active: bool = True
    isActive: Optional[bool] = None
    illustrationType: Optional[str] = "envelope"
    illustration_type: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def harmonize_casing(cls, values: Any) -> Any:
        if isinstance(values, dict):
            # name / title
            name = values.get("name") or values.get("title")
            if name:
                values["name"] = name
                values["title"] = name

            # category
            cat = values.get("category_id") or values.get("categoryId") or values.get("category")
            if cat:
                values["category_id"] = cat
                values["categoryId"] = cat

            # compare at price
            comp = values.get("compare_at_price") if "compare_at_price" in values else values.get("compareAtPrice")
            if comp is not None:
                try:
                    comp_val = float(comp) if comp != "" else None
                except (ValueError, TypeError):
                    comp_val = None
                values["compare_at_price"] = comp_val
                values["compareAtPrice"] = comp_val

            # subscription
            sub = values.get("is_subscription") if "is_subscription" in values else values.get("isSubscription")
            if sub is not None:
                values["is_subscription"] = bool(sub)
                values["isSubscription"] = bool(sub)

            # subscription plans
            plans = values.get("subscription_plans") or values.get("subscriptionPlans")
            if plans is not None:
                values["subscription_plans"] = plans
                values["subscriptionPlans"] = plans

            # featured
            feat = values.get("is_featured") if "is_featured" in values else values.get("isFeatured") if "isFeatured" in values else values.get("featured")
            if feat is not None:
                values["is_featured"] = bool(feat)
                values["isFeatured"] = bool(feat)

            # active
            act = values.get("is_active") if "is_active" in values else values.get("isActive") if "isActive" in values else values.get("active")
            if act is not None:
                values["is_active"] = bool(act)
                values["isActive"] = bool(act)

            # badges / badge
            bdgs = values.get("badges")
            if bdgs is not None:
                bdg_list = list(bdgs) if isinstance(bdgs, list) else [bdgs]
                values["badges"] = bdg_list
                values["badge"] = bdg_list[0] if bdg_list else None
            elif values.get("badge"):
                values["badges"] = [values["badge"]]
                values["badge"] = values["badge"]

            # illustration
            ill = values.get("illustrationType") or values.get("illustration_type")
            if ill is not None:
                values["illustrationType"] = ill
                values["illustration_type"] = ill
        return values

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[str] = None
    categoryId: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    compare_at_price: Optional[float] = None
    compareAtPrice: Optional[float] = None
    images: Optional[List[str]] = None
    variants: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None
    badges: Optional[List[str]] = None
    badge: Optional[str] = None
    is_subscription: Optional[bool] = None
    isSubscription: Optional[bool] = None
    subscription_plans: Optional[List[Dict[str, Any]]] = None
    subscriptionPlans: Optional[List[Dict[str, Any]]] = None
    stock: Optional[int] = Field(default=None, ge=0)
    is_featured: Optional[bool] = None
    isFeatured: Optional[bool] = None
    is_active: Optional[bool] = None
    isActive: Optional[bool] = None
    illustrationType: Optional[str] = None
    illustration_type: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def harmonize_update_casing(cls, values: Any) -> Any:
        if isinstance(values, dict):
            name = values.get("name") or values.get("title")
            if name is not None:
                values["name"] = name
                values["title"] = name

            cat = values.get("category_id") or values.get("categoryId") or values.get("category")
            if cat is not None:
                values["category_id"] = cat
                values["categoryId"] = cat

            comp = values.get("compare_at_price") if "compare_at_price" in values else values.get("compareAtPrice")
            if comp is not None:
                try:
                    comp_val = float(comp) if comp != "" else None
                except (ValueError, TypeError):
                    comp_val = None
                values["compare_at_price"] = comp_val
                values["compareAtPrice"] = comp_val

            sub = values.get("is_subscription") if "is_subscription" in values else values.get("isSubscription")
            if sub is not None:
                values["is_subscription"] = bool(sub)
                values["isSubscription"] = bool(sub)

            plans = values.get("subscription_plans") if "subscription_plans" in values else values.get("subscriptionPlans")
            if plans is not None:
                values["subscription_plans"] = plans
                values["subscriptionPlans"] = plans

            feat = values.get("is_featured") if "is_featured" in values else values.get("isFeatured") if "isFeatured" in values else values.get("featured")
            if feat is not None:
                values["is_featured"] = bool(feat)
                values["isFeatured"] = bool(feat)

            act = values.get("is_active") if "is_active" in values else values.get("isActive") if "isActive" in values else values.get("active")
            if act is not None:
                values["is_active"] = bool(act)
                values["isActive"] = bool(act)

            bdgs = values.get("badges")
            if bdgs is not None:
                bdg_list = list(bdgs) if isinstance(bdgs, list) else [bdgs]
                values["badges"] = bdg_list
                values["badge"] = bdg_list[0] if bdg_list else None
            elif values.get("badge"):
                values["badges"] = [values["badge"]]
                values["badge"] = values["badge"]

            ill = values.get("illustrationType") or values.get("illustration_type")
            if ill is not None:
                values["illustrationType"] = ill
                values["illustration_type"] = ill
        return values

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[Any] = None
    updated_at: Optional[Any] = None
    category_name: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = 5.0
    reviewCount: Optional[int] = 0

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
