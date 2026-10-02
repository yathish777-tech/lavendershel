import logging
import uuid
from typing import List, Dict, Any, Tuple
from fastapi import HTTPException
from app.config import settings
from app.services.supabase_client import get_supabase_client
from app.schemas.order import OrderItemRequest, ShippingAddress

logger = logging.getLogger("lavendershell.order_service")

# Fallback in-memory catalog for local testing when Supabase is not connected
MOCK_PRODUCTS_DB = {
    "prod-snail-mail-club": {
        "id": "prod-snail-mail-club",
        "name": "The Monthly Snail Mail Club Subscription",
        "slug": "monthly-snail-mail-club",
        "price": 599.00,
        "stock": 45,
        "is_active": True,
        "category_id": "cat-snail-mail"
    },
    "prod-snail-mail-singles": {
        "id": "prod-snail-mail-singles",
        "name": "One-Time Cozy Postal Care Parcel",
        "slug": "cozy-postal-care-parcel",
        "price": 799.00,
        "stock": 30,
        "is_active": True,
        "category_id": "cat-snail-mail"
    },
    "prod-penpal-stationery-pack": {
        "id": "prod-penpal-stationery-pack",
        "name": "The Vintage Penpal Correspondence Set",
        "slug": "vintage-penpal-correspondence-set",
        "price": 699.00,
        "stock": 25,
        "is_active": True,
        "category_id": "cat-snail-mail"
    },
    "prod-spring-solstice-edition": {
        "id": "prod-spring-solstice-edition",
        "name": "Spring Solstice Limited Keepsake Vault",
        "slug": "spring-solstice-limited-keepsake-vault",
        "price": 1899.00,
        "stock": 18,
        "is_active": True,
        "category_id": "cat-seasonal-editions"
    },
    "prod-mindful-morning-journal": {
        "id": "prod-mindful-morning-journal",
        "name": "Mindful Mornings Guided Self-Reflection Journal",
        "slug": "mindful-mornings-guided-journal",
        "price": 999.00,
        "stock": 62,
        "is_active": True,
        "category_id": "cat-journaling"
    },
    "prod-affirmation-sticker-book": {
        "id": "prod-affirmation-sticker-book",
        "name": "500+ Holographic Affirmation Sticker Vault",
        "slug": "holographic-affirmation-sticker-vault",
        "price": 499.00,
        "stock": 80,
        "is_active": True,
        "category_id": "cat-stationery"
    },
    "prod-brass-wax-seal-kit": {
        "id": "prod-brass-wax-seal-kit",
        "name": "Heirloom Brass Wax Seal Starter Kit",
        "slug": "heirloom-brass-wax-seal-starter-kit",
        "price": 1199.00,
        "stock": 35,
        "is_active": True,
        "category_id": "cat-stationery"
    },
    "prod-self-love-sanctuary-bundle": {
        "id": "prod-self-love-sanctuary-bundle",
        "name": "The Ultimate Self-Love Sanctuary Gift Box",
        "slug": "ultimate-self-love-sanctuary-gift-box",
        "price": 2499.00,
        "stock": 20,
        "is_active": True,
        "category_id": "cat-bundles"
    }
}

# Fallback in-memory orders
MOCK_ORDERS_DB: Dict[str, Dict[str, Any]] = {}

class OrderService:
    @staticmethod
    def get_product_from_db(product_id: str) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("products").select("*").eq("id", product_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.error(f"Error fetching product {product_id} from Supabase: {e}")

        # Fallback to in-memory store
        return MOCK_PRODUCTS_DB.get(product_id)

    @classmethod
    def calculate_order_totals(cls, items: List[OrderItemRequest]) -> Tuple[float, float, float, List[Dict[str, Any]]]:
        """
        Re-fetches prices from DB, validates stock, computes subtotal, shipping fee, total.
        Returns: (subtotal, shipping_fee, total, verified_items)
        """
        subtotal = 0.0
        verified_items = []

        for item in items:
            product = cls.get_product_from_db(item.product_id)
            if not product:
                raise HTTPException(status_code=400, detail=f"Product with ID '{item.product_id}' was not found.")
            
            if not product.get("is_active", True):
                raise HTTPException(status_code=400, detail=f"Product '{product.get('name')}' is currently not available.")

            available_stock = product.get("stock", 0)
            if available_stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.get('name')}'. Available: {available_stock}, Requested: {item.quantity}"
                )

            # Price strictly from DB
            unit_price = float(product.get("price", 0.0))
            line_total = unit_price * item.quantity
            subtotal += line_total

            verified_items.append({
                "product_id": item.product_id,
                "name_snapshot": product.get("name"),
                "price_snapshot": unit_price,
                "quantity": item.quantity,
                "variant": item.variant
            })

        # Calculate shipping based on threshold
        if subtotal >= settings.FREE_SHIPPING_THRESHOLD or subtotal == 0:
            shipping_fee = 0.0
        else:
            shipping_fee = float(settings.FLAT_SHIPPING_FEE)

        total = round(subtotal + shipping_fee, 2)
        return round(subtotal, 2), round(shipping_fee, 2), total, verified_items

    @classmethod
    def create_pending_order(
        cls,
        customer_name: str,
        email: str,
        phone: Optional[str],
        shipping_address: Dict[str, Any],
        items: List[OrderItemRequest],
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates totals, generates order ID, and stores pending order in DB.
        """
        subtotal, shipping_fee, total, verified_items = cls.calculate_order_totals(items)

        order_id = f"LS-{uuid.uuid4().hex[:6].upper()}"
        order_record = {
            "id": order_id,
            "user_id": user_id,
            "customer_name": customer_name,
            "email": email,
            "phone": phone,
            "shipping_address": shipping_address,
            "subtotal": subtotal,
            "shipping_fee": shipping_fee,
            "total": total,
            "currency": settings.CURRENCY,
            "status": "pending",
            "razorpay_order_id": None,
            "razorpay_payment_id": None,
            "razorpay_signature": None,
            "items": verified_items
        }

        client = get_supabase_client()
        if client:
            try:
                # Insert order into Supabase
                order_insert = {k: v for k, v in order_record.items() if k != "items"}
                client.table("orders").insert(order_insert).execute()

                # Insert order items
                order_items_insert = [
                    {**item, "order_id": order_id} for item in verified_items
                ]
                client.table("order_items").insert(order_items_insert).execute()
            except Exception as e:
                logger.error(f"Error saving order to Supabase: {e}. Storing in memory.")

        # Always track in local memory as fallback
        MOCK_ORDERS_DB[order_id] = order_record
        return order_record

    @classmethod
    def set_razorpay_order_id(cls, order_id: str, razorpay_order_id: str):
        client = get_supabase_client()
        if client:
            try:
                client.table("orders").update({"razorpay_order_id": razorpay_order_id}).eq("id", order_id).execute()
            except Exception as e:
                logger.error(f"Error updating razorpay_order_id in Supabase: {e}")

        if order_id in MOCK_ORDERS_DB:
            MOCK_ORDERS_DB[order_id]["razorpay_order_id"] = razorpay_order_id

    @classmethod
    def mark_order_paid(cls, order_id: str, payment_id: str, signature: str):
        """
        Marks order as paid, records payment details, and decrements stock atomically.
        """
        client = get_supabase_client()
        if client:
            try:
                client.table("orders").update({
                    "status": "paid",
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature
                }).eq("id", order_id).execute()

                # Decrement stock in Supabase for each item
                res_items = client.table("order_items").select("product_id, quantity").eq("order_id", order_id).execute()
                for itm in (res_items.data or []):
                    prod_id = itm["product_id"]
                    qty = itm["quantity"]
                    p = client.table("products").select("stock").eq("id", prod_id).single().execute()
                    if p.data:
                        new_stock = max(0, p.data["stock"] - qty)
                        client.table("products").update({"stock": new_stock}).eq("id", prod_id).execute()
            except Exception as e:
                logger.error(f"Error updating paid order in Supabase: {e}")

        if order_id in MOCK_ORDERS_DB:
            MOCK_ORDERS_DB[order_id]["status"] = "paid"
            MOCK_ORDERS_DB[order_id]["razorpay_payment_id"] = payment_id
            MOCK_ORDERS_DB[order_id]["razorpay_signature"] = signature

            # Decrement mock stock
            for item in MOCK_ORDERS_DB[order_id].get("items", []):
                p_id = item.get("product_id")
                qty = item.get("quantity", 1)
                if p_id in MOCK_PRODUCTS_DB:
                    MOCK_PRODUCTS_DB[p_id]["stock"] = max(0, MOCK_PRODUCTS_DB[p_id]["stock"] - qty)

    @classmethod
    def mark_order_failed(cls, order_id: str, reason: str = ""):
        client = get_supabase_client()
        if client:
            try:
                client.table("orders").update({"status": "failed"}).eq("id", order_id).execute()
            except Exception as e:
                logger.error(f"Error updating failed order in Supabase: {e}")

        if order_id in MOCK_ORDERS_DB:
            MOCK_ORDERS_DB[order_id]["status"] = "failed"

    @classmethod
    def get_order_by_id(cls, order_id: str) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("orders").select("*, order_items(*)").eq("id", order_id).single().execute()
                if res.data:
                    data = dict(res.data)
                    data["items"] = data.pop("order_items", [])
                    return data
            except Exception as e:
                logger.error(f"Error getting order from Supabase: {e}")

        return MOCK_ORDERS_DB.get(order_id)

order_service = OrderService()
