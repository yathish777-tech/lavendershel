from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Any, Dict
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
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
            # category
            cat = values.get("category_id") or values.get("categoryId")
            if cat:
                values["category_id"] = cat
                values["categoryId"] = cat
            # compare at price
            comp = values.get("compare_at_price") or values.get("compareAtPrice")
            if comp is not None:
                values["compare_at_price"] = comp
                values["compareAtPrice"] = comp
            # subscription
            sub = values.get("is_subscription") if "is_subscription" in values else values.get("isSubscription")
            if sub is not None:
                values["is_subscription"] = sub
                values["isSubscription"] = sub
            # subscription plans
            plans = values.get("subscription_plans") or values.get("subscriptionPlans")
            if plans is not None:
                values["subscription_plans"] = plans
                values["subscriptionPlans"] = plans
            # featured
            feat = values.get("is_featured") if "is_featured" in values else values.get("isFeatured")
            if feat is not None:
                values["is_featured"] = feat
                values["isFeatured"] = feat
            # active
            act = values.get("is_active") if "is_active" in values else values.get("isActive")
            if act is not None:
                values["is_active"] = act
                values["isActive"] = act
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
            cat = values.get("category_id") or values.get("categoryId")
            if cat is not None:
                values["category_id"] = cat
            comp = values.get("compare_at_price") if "compare_at_price" in values else values.get("compareAtPrice")
            if comp is not None:
                values["compare_at_price"] = comp
            sub = values.get("is_subscription") if "is_subscription" in values else values.get("isSubscription")
            if sub is not None:
                values["is_subscription"] = sub
            plans = values.get("subscription_plans") if "subscription_plans" in values else values.get("subscriptionPlans")
            if plans is not None:
                values["subscription_plans"] = plans
            feat = values.get("is_featured") if "is_featured" in values else values.get("isFeatured")
            if feat is not None:
                values["is_featured"] = feat
            act = values.get("is_active") if "is_active" in values else values.get("isActive")
            if act is not None:
                values["is_active"] = act
            ill = values.get("illustrationType") or values.get("illustration_type")
            if ill is not None:
                values["illustrationType"] = ill
        return values

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    category_name: Optional[str] = None
    rating: Optional[float] = 5.0
    reviewCount: Optional[int] = 0

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
