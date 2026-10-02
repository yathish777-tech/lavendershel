from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.order import (
    OrderCreateRequest, OrderCreateResponse, OrderResponse, OrderStatusUpdate
)
from app.dependencies import require_admin, get_current_user_optional, rate_limit
from app.services.order_service import order_service, MOCK_ORDERS_DB
from app.services.razorpay_service import razorpay_service
from app.services.supabase_client import get_supabase_client
from app.config import settings
import logging

logger = logging.getLogger("lavendershell.orders")
router = APIRouter(tags=["Orders"])

# ---------------- PUBLIC ENDPOINTS ----------------

@router.post(
    "/api/orders/create",
    response_model=OrderCreateResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit(max_requests=10, window_seconds=60))]
)
def create_order(
    payload: OrderCreateRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Public order creation with backend price verification.
    Creates a pending order, initiates a Razorpay order in paise, and returns checkout keys.
    """
    user_id = current_user.get("sub") or current_user.get("id") if current_user else None

    # Step 1: Create pending order with verified DB pricing
    order = order_service.create_pending_order(
        customer_name=payload.customer_name,
        email=str(payload.email),
        phone=payload.phone,
        shipping_address=payload.shipping_address.model_dump(),
        items=payload.items,
        user_id=user_id
    )

    # Step 2: Convert total to paise (integer) for Razorpay
    amount_in_paise = int(round(order["total"] * 100))

    # Step 3: Create Razorpay Order
    rzp_order = razorpay_service.create_order(
        amount_in_paise=amount_in_paise,
        receipt=order["id"],
        notes={
            "customer_name": order["customer_name"],
            "email": order["email"]
        }
    )

    # Step 4: Associate razorpay_order_id
    order_service.set_razorpay_order_id(order["id"], rzp_order["id"])

    return {
        "order_id": order["id"],
        "razorpay_order_id": rzp_order["id"],
        "amount": amount_in_paise,
        "currency": settings.CURRENCY,
        "key_id": settings.RAZORPAY_KEY_ID,
        "subtotal": order["subtotal"],
        "shipping_fee": order["shipping_fee"],
        "total": order["total"]
    }

@router.get("/api/orders/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: str):
    """
    Public order confirmation lookup.
    """
    order = order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order

# ---------------- ADMIN ENDPOINTS ----------------

@router.get("/api/admin/orders", response_model=List[OrderResponse])
def get_admin_orders(admin: dict = Depends(require_admin)):
    """
    Admin: returns all orders with their line items.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("orders").select("*, order_items(*)").order("created_at", desc=True).execute()
            if res.data:
                orders = []
                for row in res.data:
                    data = dict(row)
                    data["items"] = data.pop("order_items", [])
                    orders.append(data)
                return orders
        except Exception as e:
            logger.error(f"Error fetching admin orders from Supabase: {e}")

    # Fallback to in-memory orders
    return list(MOCK_ORDERS_DB.values())

@router.patch("/api/admin/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    admin: dict = Depends(require_admin)
):
    """
    Admin: update order dispatch status (e.g. Processing, Shipped, Delivered).
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("orders").update({"status": payload.status}).eq("id", order_id).execute()
        except Exception as e:
            logger.error(f"Error updating order status in Supabase: {e}")

    if order_id in MOCK_ORDERS_DB:
        MOCK_ORDERS_DB[order_id]["status"] = payload.status
        return MOCK_ORDERS_DB[order_id]

    order = order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    order["status"] = payload.status
    return order
