"""
Stripe Payment Integration for MEWAYZ V2
"""

import stripe
import os
from typing import Dict, Any, Optional
from fastapi import HTTPException
from models.ecommerce import Order
from core.config import settings

# Initialize Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

class StripePaymentService:
    def __init__(self):
        self.stripe = stripe
        self.webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    
    async def create_payment_intent(
        self, 
        amount: float, 
        currency: str = "usd",
        customer_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a Stripe payment intent"""
        try:
            # Convert to cents (Stripe expects smallest currency unit)
            amount_cents = int(amount * 100)
            
            intent_data = {
                "amount": amount_cents,
                "currency": currency,
                "automatic_payment_methods": {"enabled": True},
            }
            
            if customer_id:
                intent_data["customer"] = customer_id
            
            if metadata:
                intent_data["metadata"] = metadata
            
            intent = self.stripe.PaymentIntent.create(**intent_data)
            
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
                "amount": amount,
                "currency": currency
            }
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    async def create_customer(
        self, 
        email: str, 
        name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Create a Stripe customer"""
        try:
            customer_data = {"email": email}
            
            if name:
                customer_data["name"] = name
            
            if metadata:
                customer_data["metadata"] = metadata
            
            customer = self.stripe.Customer.create(**customer_data)
            return customer.id
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    async def confirm_payment(self, payment_intent_id: str) -> Dict[str, Any]:
        """Confirm a payment intent"""
        try:
            intent = self.stripe.PaymentIntent.retrieve(payment_intent_id)
            
            return {
                "id": intent.id,
                "status": intent.status,
                "amount": intent.amount / 100,  # Convert back to dollars
                "currency": intent.currency,
                "payment_method": intent.payment_method
            }
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    async def create_connect_account(self, vendor_email: str) -> str:
        """Create Stripe Connect account for vendor"""
        try:
            account = self.stripe.Account.create(
                type="express",
                email=vendor_email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                }
            )
            return account.id
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    async def create_account_link(self, account_id: str, refresh_url: str, return_url: str) -> str:
        """Create account link for vendor onboarding"""
        try:
            account_link = self.stripe.AccountLink.create(
                account=account_id,
                refresh_url=refresh_url,
                return_url=return_url,
                type="account_onboarding",
            )
            return account_link.url
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    async def create_transfer(
        self, 
        amount: float, 
        destination_account: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Transfer money to vendor account"""
        try:
            # Convert to cents
            amount_cents = int(amount * 100)
            
            transfer_data = {
                "amount": amount_cents,
                "currency": "usd",
                "destination": destination_account,
            }
            
            if metadata:
                transfer_data["metadata"] = metadata
            
            transfer = self.stripe.Transfer.create(**transfer_data)
            
            return {
                "id": transfer.id,
                "amount": transfer.amount / 100,
                "destination": transfer.destination,
                "status": "completed"
            }
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    
    def verify_webhook_signature(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """Verify Stripe webhook signature"""
        try:
            event = self.stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
            return event
            
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")


# Initialize payment service
payment_service = StripePaymentService()


# Subscription Management for MEWAYZ bundles
class SubscriptionService:
    def __init__(self):
        self.stripe = stripe
        
        # MEWAYZ Pricing Plans (from your pricing strategy)
        self.plans = {
            "creator": {
                "price": 19.00,
                "name": "Creator Bundle", 
                "features": ["bio_links", "content_creation", "basic_analytics"]
            },
            "ecommerce": {
                "price": 24.00,
                "name": "E-commerce Bundle",
                "features": ["online_store", "inventory", "payment_processing"]
            },
            "social_media": {
                "price": 29.00,
                "name": "Social Media Bundle", 
                "features": ["social_scheduling", "analytics", "automation"]
            },
            "education": {
                "price": 29.00,
                "name": "Education Bundle",
                "features": ["course_creation", "student_management", "certificates"]
            },
            "business": {
                "price": 39.00,
                "name": "Business Bundle",
                "features": ["crm", "team_management", "advanced_analytics"]
            },
            "operations": {
                "price": 24.00,
                "name": "Operations Bundle",
                "features": ["booking_system", "forms", "workflow_automation"]
            }
        }
        
        # Multi-bundle discounts
        self.bundle_discounts = {
            2: 0.20,  # 20% off for 2 bundles
            3: 0.30,  # 30% off for 3 bundles
            4: 0.40,  # 40% off for 4+ bundles
        }
    
    def calculate_bundle_price(self, bundles: list) -> Dict[str, Any]:
        """Calculate price with multi-bundle discounts"""
        if not bundles:
            return {"total": 0, "discount": 0, "original_total": 0}
        
        # Calculate original total
        original_total = sum(self.plans[bundle]["price"] for bundle in bundles if bundle in self.plans)
        
        # Apply discount
        bundle_count = len(bundles)
        discount_rate = 0
        
        if bundle_count >= 4:
            discount_rate = self.bundle_discounts[4]
        elif bundle_count in self.bundle_discounts:
            discount_rate = self.bundle_discounts[bundle_count]
        
        discount_amount = original_total * discount_rate
        final_total = original_total - discount_amount
        
        return {
            "bundles": bundles,
            "original_total": original_total,
            "discount_rate": discount_rate,
            "discount_amount": discount_amount,
            "final_total": final_total,
            "savings": discount_amount
        }
    
    async def create_subscription(
        self, 
        customer_id: str, 
        bundles: list,
        billing_cycle: str = "monthly"
    ) -> Dict[str, Any]:
        """Create subscription for MEWAYZ bundles"""
        try:
            pricing = self.calculate_bundle_price(bundles)
            
            # Create subscription in Stripe
            subscription = self.stripe.Subscription.create(
                customer=customer_id,
                items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"MEWAYZ V2 - {', '.join(bundles).title()} Bundle(s)"
                        },
                        "unit_amount": int(pricing["final_total"] * 100),
                        "recurring": {"interval": billing_cycle}
                    }
                }],
                metadata={
                    "bundles": ",".join(bundles),
                    "original_total": str(pricing["original_total"]),
                    "discount_rate": str(pricing["discount_rate"])
                }
            )
            
            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "current_period_start": subscription.current_period_start,
                "current_period_end": subscription.current_period_end,
                "pricing": pricing
            }
            
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")


# Initialize subscription service
subscription_service = SubscriptionService()