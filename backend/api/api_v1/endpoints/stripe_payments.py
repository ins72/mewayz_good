"""
Stripe Payment Processing for MEWAYZ V2
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import stripe
import os
from api.deps import get_current_user

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

router = APIRouter()

class SubscriptionRequest(BaseModel):
    payment_method_id: str
    bundles: List[str]
    payment_interval: str  # 'monthly' or 'yearly'
    customer_info: dict

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = 'usd'
    payment_method_id: str
    customer_info: dict

@router.post("/create-subscription")
async def create_subscription(
    request: SubscriptionRequest,
    current_user=Depends(get_current_user)
):
    """Create a Stripe subscription for selected bundles"""
    try:
        # Bundle pricing (in cents)
        bundle_prices = {
            'creator': {'monthly': 1900, 'yearly': 19000},     # $19/month, $190/year
            'ecommerce': {'monthly': 2400, 'yearly': 24000},   # $24/month, $240/year
            'social_media': {'monthly': 2900, 'yearly': 29000}, # $29/month, $290/year
            'education': {'monthly': 2900, 'yearly': 29000},   # $29/month, $290/year
            'business': {'monthly': 3900, 'yearly': 39000},    # $39/month, $390/year
            'operations': {'monthly': 2400, 'yearly': 24000}   # $24/month, $240/year
        }

        # Calculate total amount
        total_amount = 0
        for bundle_id in request.bundles:
            if bundle_id in bundle_prices:
                total_amount += bundle_prices[bundle_id][request.payment_interval]

        # Apply multi-bundle discount
        bundle_count = len(request.bundles)
        discount_rate = 0
        if bundle_count >= 4:
            discount_rate = 0.40  # 40% discount
        elif bundle_count == 3:
            discount_rate = 0.30  # 30% discount
        elif bundle_count == 2:
            discount_rate = 0.20  # 20% discount

        discounted_amount = int(total_amount * (1 - discount_rate))

        # Create or retrieve customer
        try:
            # Try to find existing customer by email
            customers = stripe.Customer.list(email=request.customer_info['email'], limit=1)
            if customers.data:
                customer = customers.data[0]
            else:
                # Create new customer
                customer = stripe.Customer.create(
                    email=request.customer_info['email'],
                    name=request.customer_info.get('name', ''),
                    metadata={
                        'user_id': str(current_user.id),
                        'bundles': ','.join(request.bundles)
                    }
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Customer creation failed: {str(e)}")

        # Attach payment method to customer
        try:
            stripe.PaymentMethod.attach(
                request.payment_method_id,
                customer=customer.id,
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Payment method attachment failed: {str(e)}")

        # Create price object for the subscription
        try:
            price = stripe.Price.create(
                currency='usd',
                unit_amount=discounted_amount,
                recurring={
                    'interval': 'month' if request.payment_interval == 'monthly' else 'year'
                },
                product_data={
                    'name': f"MEWAYZ V2 - {', '.join([bundle.title() for bundle in request.bundles])} Bundle(s)"
                },
                metadata={
                    'bundles': ','.join(request.bundles),
                    'original_amount': str(total_amount),
                    'discount_rate': str(discount_rate),
                    'bundle_count': str(bundle_count)
                }
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Price creation failed: {str(e)}")

        # Create subscription
        try:
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{
                    'price': price.id,
                }],
                default_payment_method=request.payment_method_id,
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'user_id': str(current_user.id),
                    'bundles': ','.join(request.bundles),
                    'payment_interval': request.payment_interval
                }
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Subscription creation failed: {str(e)}")

        # Check if additional action is required (3D Secure)
        latest_invoice = subscription.latest_invoice
        payment_intent = latest_invoice.payment_intent

        if payment_intent.status == 'requires_action':
            return {
                'subscription_id': subscription.id,
                'client_secret': payment_intent.client_secret,
                'requires_action': True,
                'payment_intent_client_secret': payment_intent.client_secret
            }
        elif payment_intent.status == 'succeeded':
            return {
                'subscription_id': subscription.id,
                'status': 'active',
                'requires_action': False,
                'customer_id': customer.id,
                'amount_paid': discounted_amount,
                'discount_applied': discount_rate * 100,
                'bundles': request.bundles
            }
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Payment failed with status: {payment_intent.status}"
            )

    except stripe.error.CardError as e:
        raise HTTPException(status_code=400, detail=f"Card error: {e.user_message}")
    except stripe.error.RateLimitError as e:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    except stripe.error.InvalidRequestError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except stripe.error.AuthenticationError as e:
        raise HTTPException(status_code=401, detail="Authentication with Stripe failed")
    except stripe.error.APIConnectionError as e:
        raise HTTPException(status_code=503, detail="Network error")
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/create-payment-intent")
async def create_payment_intent(
    request: PaymentIntentRequest,
    current_user=Depends(get_current_user)
):
    """Create a one-time payment intent"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            payment_method=request.payment_method_id,
            confirm=True,
            return_url='https://your-website.com/return',
            metadata={
                'user_id': str(current_user.id),
                'customer_email': request.customer_info.get('email', ''),
                'customer_name': request.customer_info.get('name', '')
            }
        )

        return {
            'payment_intent_id': intent.id,
            'status': intent.status,
            'client_secret': intent.client_secret if intent.status == 'requires_action' else None
        }

    except stripe.error.CardError as e:
        raise HTTPException(status_code=400, detail=f"Card error: {e.user_message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

@router.get("/subscription-status/{subscription_id}")
async def get_subscription_status(
    subscription_id: str,
    current_user=Depends(get_current_user)
):
    """Get the status of a subscription"""
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return {
            'subscription_id': subscription.id,
            'status': subscription.status,
            'current_period_end': subscription.current_period_end,
            'cancel_at_period_end': subscription.cancel_at_period_end,
            'customer_id': subscription.customer
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Subscription not found: {str(e)}")

@router.post("/cancel-subscription/{subscription_id}")
async def cancel_subscription(
    subscription_id: str,
    current_user=Depends(get_current_user)
):
    """Cancel a subscription"""
    try:
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        return {
            'subscription_id': subscription.id,
            'status': subscription.status,
            'cancel_at_period_end': subscription.cancel_at_period_end,
            'current_period_end': subscription.current_period_end
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cancellation failed: {str(e)}")

@router.get("/customer-subscriptions")
async def get_customer_subscriptions(current_user=Depends(get_current_user)):
    """Get all subscriptions for the current user"""
    try:
        # Find customer by email
        customers = stripe.Customer.list(
            email=current_user.email,
            limit=1
        )
        
        if not customers.data:
            return {'subscriptions': []}
        
        customer = customers.data[0]
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status='all'
        )
        
        return {
            'subscriptions': [
                {
                    'id': sub.id,
                    'status': sub.status,
                    'current_period_end': sub.current_period_end,
                    'cancel_at_period_end': sub.cancel_at_period_end,
                    'metadata': sub.metadata
                }
                for sub in subscriptions.data
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching subscriptions: {str(e)}")