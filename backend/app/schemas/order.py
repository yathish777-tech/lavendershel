from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

class OrderItemRequest(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)
    variant: Optional[Dict[str, Any]] = None

class ShippingAddress(BaseModel):
    address_line: str = Field(..., min_length=3)
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    country: Optional[str] = "India"
    gift_note: Optional[str] = None

class OrderCreateRequest(BaseModel):
    customer_name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    shipping_address: ShippingAddress
    items: List[OrderItemRequest] = Field(..., min_length=1)

class OrderCreateResponse(BaseModel):
    order_id: str
    razorpay_order_id: str
    amount: int  # in paise
    currency: str = "INR"
    key_id: str
    subtotal: float
    shipping_fee: float
    total: float

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|paid|processing|shipped|delivered|cancelled|failed)$")

class OrderItemResponse(BaseModel):
    id: Optional[int] = None
    product_id: Optional[str] = None
    name_snapshot: str
    price_snapshot: float
    quantity: int
    variant: Optional[Dict[str, Any]] = None

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    customer_name: str
    email: str
    phone: Optional[str] = None
    shipping_address: Dict[str, Any]
    subtotal: float
    shipping_fee: float
    total: float
    currency: str
    status: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: Optional[datetime] = None
    items: Optional[List[OrderItemResponse]] = None
