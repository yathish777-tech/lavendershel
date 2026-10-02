from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime
from decimal import Decimal

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    compare_at_price: Optional[float] = None
    images: List[str] = Field(default_factory=list)
    variants: List[Dict[str, Any]] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    badges: List[str] = Field(default_factory=list)
    is_subscription: bool = False
    subscription_plans: List[Dict[str, Any]] = Field(default_factory=list)
    stock: int = Field(default=0, ge=0)
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    compare_at_price: Optional[float] = None
    images: Optional[List[str]] = None
    variants: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None
    badges: Optional[List[str]] = None
    is_subscription: Optional[bool] = None
    subscription_plans: Optional[List[Dict[str, Any]]] = None
    stock: Optional[int] = Field(default=None, ge=0)
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    category_name: Optional[str] = None

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
