from pydantic import BaseModel, Field

class PaymentVerifyRequest(BaseModel):
    order_id: str = Field(..., description="Internal Lavendershell Order ID")
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentVerifyResponse(BaseModel):
    success: bool
    message: str
    order_id: str
    status: str
    payment_id: str
