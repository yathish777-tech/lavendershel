from fastapi import APIRouter, Request, HTTPException, Header, status
from typing import Optional
from app.schemas.payment import PaymentVerifyRequest, PaymentVerifyResponse
from app.services.razorpay_service import razorpay_service
from app.services.order_service import order_service
import logging

logger = logging.getLogger("lavendershell.payments")
router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment(payload: PaymentVerifyRequest):
    """
    Verifies Razorpay payment signature after customer completes payment on frontend.
    On success, transitions order to 'paid' and decrements inventory atomically.
    """
    order = order_service.get_order_by_id(payload.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    # Verify signature
    is_valid = razorpay_service.verify_payment_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature
    )

    if not is_valid:
        order_service.mark_order_failed(payload.order_id, reason="Signature verification failed")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment signature verification failed. Please contact support."
        )

    # Success: mark paid and decrement stock
    order_service.mark_order_paid(
        order_id=payload.order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature
    )

    return {
        "success": True,
        "message": "Payment verified and order placed with love! ✿",
        "order_id": payload.order_id,
        "status": "paid",
        "payment_id": payload.razorpay_payment_id
    }

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None)
):
    """
    Razorpay Webhook handler for asynchronous payment captures or failures.
    Processes idempotently.
    """
    body_bytes = await request.body()

    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing X-Razorpay-Signature header.")

    is_valid = razorpay_service.verify_webhook_signature(body_bytes, x_razorpay_signature)
    if not is_valid:
        logger.warning("Invalid Razorpay webhook signature received.")
        raise HTTPException(status_code=400, detail="Invalid signature.")

    try:
        event_data = await request.json()
        event_type = event_data.get("event")
        payload = event_data.get("payload", {})
        payment_entity = payload.get("payment", {}).get("entity", {})
        
        razorpay_order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        logger.info(f"Webhook received: {event_type} for order {razorpay_order_id}")

        if event_type == "payment.captured":
            # Find order by razorpay_order_id and mark paid
            # Check in DB or memory
            from app.services.supabase_client import get_supabase_client
            client = get_supabase_client()
            if client and razorpay_order_id:
                res = client.table("orders").select("id, status").eq("razorpay_order_id", razorpay_order_id).execute()
                if res.data and res.data[0]["status"] != "paid":
                    order_service.mark_order_paid(res.data[0]["id"], payment_id, "webhook_captured")

        elif event_type == "payment.failed":
            client = get_supabase_client()
            if client and razorpay_order_id:
                res = client.table("orders").select("id").eq("razorpay_order_id", razorpay_order_id).execute()
                if res.data:
                    order_service.mark_order_failed(res.data[0]["id"], reason="Webhook reported payment.failed")

        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error handling Razorpay webhook: {e}")
        return {"status": "error", "message": str(e)}
