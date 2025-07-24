"""
Payment API Endpoints for MEWAYZ V2
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from models.user import User
from api.deps import get_current_user
from services.stripe_service import payment_service, subscription_service
from crud.ecommerce import order_crud
import json

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentIntentRequest(BaseModel):
    amount: float
    currency: str = "usd"
    order_id: Optional[str] = None


class SubscriptionRequest(BaseModel):
    bundles: List[str]
    billing_cycle: str = "monthly"


class WebhookEvent(BaseModel):
    type: str
    data: Dict[str, Any]


@router.post("/create-payment-intent")
async def create_payment_intent(
    request: PaymentIntentRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a Stripe payment intent"""
    try:
        metadata = {"user_id": str(current_user.id)}
        if request.order_id:
            metadata["order_id"] = request.order_id
        
        intent = await payment_service.create_payment_intent(
            amount=request.amount,
            currency=request.currency,
            metadata=metadata
        )
        
        return intent
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/create-customer")
async def create_stripe_customer(current_user: User = Depends(get_current_user)):
    """Create a Stripe customer for the user"""
    try:
        customer_id = await payment_service.create_customer(
            email=current_user.email,
            name=current_user.full_name if hasattr(current_user, 'full_name') else None,
            metadata={"user_id": str(current_user.id)}
        )
        
        # TODO: Save customer_id to user profile
        # await user_crud.update_user_stripe_customer(str(current_user.id), customer_id)
        
        return {"customer_id": customer_id}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bundles/pricing")
async def get_bundle_pricing():
    """Get MEWAYZ bundle pricing information"""
    return {
        "plans": subscription_service.plans,
        "discounts": subscription_service.bundle_discounts,
        "description": "Multi-bundle discounts: 20% off for 2 bundles, 30% off for 3, 40% off for 4+"
    }


@router.post("/bundles/calculate-price")
async def calculate_bundle_price(bundles: List[str]):
    """Calculate price for selected bundles with discounts"""
    try:
        pricing = subscription_service.calculate_bundle_price(bundles)
        return pricing
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/subscriptions/create")
async def create_subscription(
    request: SubscriptionRequest,
    current_user: User = Depends(get_current_user)
):
    """Create subscription for MEWAYZ bundles"""
    try:
        # First create or get Stripe customer
        customer_id = await payment_service.create_customer(
            email=current_user.email,
            name=getattr(current_user, 'full_name', str(current_user.id)),
            metadata={"user_id": str(current_user.id)}
        )
        
        subscription = await subscription_service.create_subscription(
            customer_id=customer_id,
            bundles=request.bundles,
            billing_cycle=request.billing_cycle
        )
        
        return subscription
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/confirm-payment/{payment_intent_id}")
async def confirm_payment(
    payment_intent_id: str,
    current_user: User = Depends(get_current_user)
):
    """Confirm a payment and update order status"""
    try:
        payment = await payment_service.confirm_payment(payment_intent_id)
        
        # If payment was successful, update order status
        if payment["status"] == "succeeded":
            # TODO: Update order status in database
            # order_id = payment.get("metadata", {}).get("order_id")
            # if order_id:
            #     await order_crud.update_order_status(order_id, "confirmed")
            pass
        
        return payment
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        
        if not sig_header:
            raise HTTPException(status_code=400, detail="Missing signature header")
        
        event = payment_service.verify_webhook_signature(payload, sig_header)
        
        # Handle different event types
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            # Handle successful payment
            print(f"Payment succeeded: {payment_intent['id']}")
            
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            # Handle failed payment
            print(f"Payment failed: {payment_intent['id']}")
            
        elif event["type"] == "invoice.payment_succeeded":
            invoice = event["data"]["object"]
            # Handle successful subscription payment
            print(f"Subscription payment succeeded: {invoice['id']}")
            
        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            # Handle subscription cancellation
            print(f"Subscription cancelled: {subscription['id']}")
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Vendor payment endpoints
@router.post("/vendors/connect-account")
async def create_vendor_connect_account(current_user: User = Depends(get_current_user)):
    """Create Stripe Connect account for vendor"""
    try:
        account_id = await payment_service.create_connect_account(current_user.email)
        
        # TODO: Save account_id to vendor profile
        # await vendor_crud.update_stripe_account(str(current_user.id), account_id)
        
        return {"account_id": account_id}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/vendors/account-link")
async def create_vendor_account_link(
    account_id: str,
    current_user: User = Depends(get_current_user)
):
    """Create account link for vendor onboarding"""
    try:
        # These would be your actual URLs in production
        refresh_url = "https://mewayz.app/vendor/onboarding/refresh"
        return_url = "https://mewayz.app/vendor/onboarding/complete"
        
        link_url = await payment_service.create_account_link(
            account_id, refresh_url, return_url
        )
        
        return {"link_url": link_url}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/vendors/transfer")
async def transfer_to_vendor(
    vendor_account_id: str,
    amount: float,
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """Transfer payment to vendor (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        transfer = await payment_service.create_transfer(
            amount=amount,
            destination_account=vendor_account_id,
            metadata={"order_id": order_id}
        )
        
        return transfer
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))