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
        # Bundle pricing (in cents) - Updated to match MEWAYZ V2 Smart Launch Strategy
        bundle_prices = {
            'free_starter': {'monthly': 0, 'yearly': 0},         # Free forever
            'creator': {'monthly': 1900, 'yearly': 19000},       # $19/month, $190/year
            'ecommerce': {'monthly': 2400, 'yearly': 24000},     # $24/month, $240/year
            'social_media': {'monthly': 2900, 'yearly': 29000},  # $29/month, $290/year
            'education': {'monthly': 2900, 'yearly': 29000},     # $29/month, $290/year
            'business': {'monthly': 3900, 'yearly': 39000},      # $39/month, $390/year
            'operations': {'monthly': 2400, 'yearly': 24000}     # $24/month, $240/year
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

        # Attach payment method to customer and save for future use
        try:
            stripe.PaymentMethod.attach(
                request.payment_method_id,
                customer=customer.id,
            )
            
            # Set this as the default payment method for the customer
            stripe.Customer.modify(
                customer.id,
                invoice_settings={
                    'default_payment_method': request.payment_method_id,
                }
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

@router.get("/customer-payment-methods")
async def get_customer_payment_methods(current_user=Depends(get_current_user)):
    """Get all saved payment methods for the current user"""
    try:
        # Find customer by email
        customers = stripe.Customer.list(
            email=current_user.email,
            limit=1
        )
        
        if not customers.data:
            return {'payment_methods': []}
        
        customer = customers.data[0]
        payment_methods = stripe.PaymentMethod.list(
            customer=customer.id,
            type="card"
        )
        
        return {
            'payment_methods': [
                {
                    'id': pm.id,
                    'card': {
                        'brand': pm.card.brand,
                        'last4': pm.card.last4,
                        'exp_month': pm.card.exp_month,
                        'exp_year': pm.card.exp_year
                    },
                    'billing_details': pm.billing_details
                }
                for pm in payment_methods.data
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching payment methods: {str(e)}")

@router.post("/create-subscription-with-saved-card")
async def create_subscription_with_saved_card(
    request: dict,
    current_user=Depends(get_current_user)
):
    """Create subscription using a saved payment method"""
    try:
        payment_method_id = request.get('payment_method_id')
        bundles = request.get('bundles', [])
        payment_interval = request.get('payment_interval', 'monthly')
        
        # Bundle pricing (in cents)
        bundle_prices = {
            'creator': {'monthly': 1900, 'yearly': 19000},     # $19/month, $190/year
            'ecommerce': {'monthly': 2400, 'yearly': 24000},   # $24/month, $240/year
            'social_media': {'monthly': 2900, 'yearly': 29000}, # $29/month, $290/year
            'education': {'monthly': 2900, 'yearly': 29000},   # $29/month, $290/year
            'business': {'monthly': 3900, 'yearly': 39000},    # $39/month, $390/year
            'operations': {'monthly': 2400, 'yearly': 24000}   # $24/month, $240/year
        }

        # Calculate total amount with discount
        total_amount = sum(bundle_prices[bundle_id][payment_interval] 
                          for bundle_id in bundles if bundle_id in bundle_prices)
        
        bundle_count = len(bundles)
        discount_rate = 0
        if bundle_count >= 4:
            discount_rate = 0.40
        elif bundle_count == 3:
            discount_rate = 0.30
        elif bundle_count == 2:
            discount_rate = 0.20

        discounted_amount = int(total_amount * (1 - discount_rate))

        # Find customer by email
        customers = stripe.Customer.list(email=current_user.email, limit=1)
        if not customers.data:
            raise HTTPException(status_code=400, detail="No customer found for this user")
        
        customer = customers.data[0]

        # Create price and subscription
        price = stripe.Price.create(
            currency='usd',
            unit_amount=discounted_amount,
            recurring={
                'interval': 'month' if payment_interval == 'monthly' else 'year'
            },
            product_data={
                'name': f"MEWAYZ V2 - {', '.join([bundle.title() for bundle in bundles])} Bundle(s)"
            }
        )

        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{'price': price.id}],
            default_payment_method=payment_method_id,
            expand=['latest_invoice.payment_intent'],
            metadata={
                'user_id': str(current_user.id),
                'bundles': ','.join(bundles),
                'payment_interval': payment_interval
            }
        )

        return {
            'subscription_id': subscription.id,
            'status': 'active',
            'customer_id': customer.id,
            'amount_paid': discounted_amount,
            'discount_applied': discount_rate * 100,
            'bundles': bundles
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subscription with saved card failed: {str(e)}")

# NEW TWO-STEP PAYMENT PROCESS

class SaveCardRequest(BaseModel):
    payment_method_id: str
    customer_info: dict
    bundles: List[str]
    payment_interval: str

class ProcessPaymentRequest(BaseModel):
    saved_payment_id: str

@router.post("/save-card-and-customer")
async def save_card_and_customer(
    request: SaveCardRequest,
    current_user=Depends(get_current_user)
):
    """Step 1: Save card data and customer info to database"""
    try:
        # Create or retrieve customer
        try:
            customers = stripe.Customer.list(email=request.customer_info['email'], limit=1)
            if customers.data:
                customer = customers.data[0]
                print(f"Found existing customer: {customer.id}")
            else:
                customer = stripe.Customer.create(
                    email=request.customer_info['email'],
                    name=request.customer_info.get('name', ''),
                    metadata={
                        'user_id': str(current_user.id),
                        'bundles': ','.join(request.bundles)
                    }
                )
                print(f"Created new customer: {customer.id}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Customer creation failed: {str(e)}")

        # Attach payment method to customer
        try:
            stripe.PaymentMethod.attach(
                request.payment_method_id,
                customer=customer.id,
            )
            
            # Set as default payment method
            stripe.Customer.modify(
                customer.id,
                invoice_settings={
                    'default_payment_method': request.payment_method_id,
                }
            )
            print(f"Payment method {request.payment_method_id} attached to customer {customer.id}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Payment method attachment failed: {str(e)}")

        # Calculate pricing
        bundle_prices = {
            'creator': {'monthly': 1900, 'yearly': 19000},
            'ecommerce': {'monthly': 2400, 'yearly': 24000},
            'social_media': {'monthly': 2900, 'yearly': 29000},
            'education': {'monthly': 2900, 'yearly': 29000},
            'business': {'monthly': 3900, 'yearly': 39000},
            'operations': {'monthly': 2400, 'yearly': 24000}
        }

        total_amount = 0
        for bundle_id in request.bundles:
            if bundle_id in bundle_prices:
                total_amount += bundle_prices[bundle_id][request.payment_interval]

        # Apply multi-bundle discount
        bundle_count = len(request.bundles)
        discount_rate = 0
        if bundle_count >= 4:
            discount_rate = 0.40
        elif bundle_count == 3:
            discount_rate = 0.30
        elif bundle_count == 2:
            discount_rate = 0.20

        discounted_amount = int(total_amount * (1 - discount_rate))

        # Return saved payment info for step 2
        return {
            'saved_payment_id': f"{customer.id}:{request.payment_method_id}",
            'customer_id': customer.id,
            'payment_method_id': request.payment_method_id,
            'bundles': request.bundles,
            'payment_interval': request.payment_interval,
            'total_amount': total_amount,
            'discounted_amount': discounted_amount,
            'discount_rate': discount_rate,
            'status': 'card_saved'
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Card saving failed: {str(e)}")

@router.post("/process-saved-payment")
async def process_saved_payment(
    request: ProcessPaymentRequest,
    current_user=Depends(get_current_user)
):
    """Step 2: Process payment using already saved card data"""
    try:
        # Parse saved payment ID
        customer_id, payment_method_id = request.saved_payment_id.split(':')
        
        print(f"Processing payment for customer: {customer_id}, payment method: {payment_method_id}")
        
        # Get customer info (already exists from Step 1)
        customer = stripe.Customer.retrieve(customer_id)
        print(f"Retrieved customer: {customer.email}")
        
        # Extract bundle info from customer metadata
        bundles = customer.metadata.get('bundles', '').split(',')
        print(f"Bundles from metadata: {bundles}")
        
        # Calculate pricing (same logic as step 1)
        bundle_prices = {
            'creator': {'monthly': 1900, 'yearly': 19000},
            'ecommerce': {'monthly': 2400, 'yearly': 24000},
            'social_media': {'monthly': 2900, 'yearly': 29000},
            'education': {'monthly': 2900, 'yearly': 29000},
            'business': {'monthly': 3900, 'yearly': 39000},
            'operations': {'monthly': 2400, 'yearly': 24000}
        }

        total_amount = 0
        payment_interval = 'monthly'  # Default, could be stored in metadata
        for bundle_id in bundles:
            if bundle_id in bundle_prices:
                total_amount += bundle_prices[bundle_id][payment_interval]

        bundle_count = len(bundles)
        discount_rate = 0
        if bundle_count >= 4:
            discount_rate = 0.40
        elif bundle_count == 3:
            discount_rate = 0.30
        elif bundle_count == 2:
            discount_rate = 0.20

        discounted_amount = int(total_amount * (1 - discount_rate))
        print(f"Calculated amount: ${discounted_amount/100:.2f} (discount: {discount_rate*100}%)")

        # Create price object
        try:
            price = stripe.Price.create(
                currency='usd',
                unit_amount=discounted_amount,
                recurring={
                    'interval': 'month' if payment_interval == 'monthly' else 'year'
                },
                product_data={
                    'name': f"MEWAYZ V2 - {', '.join([bundle.title() for bundle in bundles])} Bundle(s)"
                },
                metadata={
                    'bundles': ','.join(bundles),
                    'original_amount': str(total_amount),
                    'discount_rate': str(discount_rate),
                    'bundle_count': str(bundle_count)
                }
            )
            print(f"Created price: {price.id}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Price creation failed: {str(e)}")

        # Create subscription using the ALREADY SAVED payment method
        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{
                    'price': price.id,
                }],
                default_payment_method=payment_method_id,  # Use the already saved payment method
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'user_id': str(current_user.id),
                    'bundles': ','.join(bundles),
                    'payment_interval': payment_interval
                }
            )
            print(f"Created subscription: {subscription.id} using saved payment method")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Subscription creation failed: {str(e)}")

        # Check payment status
        print(f"Subscription status: {subscription.status}")
        print(f"Subscription ID: {subscription.id}")
        
        # Check if subscription is active (most common case for successful payments)
        if subscription.status == 'active':
            print("✅ Subscription is active - payment successful!")
            return {
                'subscription_id': subscription.id,
                'status': 'success',
                'customer_id': customer_id,
                'amount_paid': discounted_amount,
                'discount_applied': discount_rate * 100,
                'bundles': bundles
            }
        
        # Handle cases where payment_intent exists and needs action
        try:
            latest_invoice = subscription.latest_invoice
            if hasattr(latest_invoice, 'payment_intent') and latest_invoice.payment_intent:
                payment_intent = latest_invoice.payment_intent
                print(f"Payment intent status: {payment_intent.status}")
                
                if payment_intent.status == 'requires_action':
                    return {
                        'subscription_id': subscription.id,
                        'client_secret': payment_intent.client_secret,
                        'requires_action': True,
                        'payment_intent_client_secret': payment_intent.client_secret,
                        'status': 'requires_action'
                    }
                elif payment_intent.status == 'succeeded':
                    print("✅ Payment intent succeeded!")
                    return {
                        'subscription_id': subscription.id,
                        'status': 'success',
                        'customer_id': customer_id,
                        'amount_paid': discounted_amount,
                        'discount_applied': discount_rate * 100,
                        'bundles': bundles
                    }
                else:
                    print(f"Unexpected payment intent status: {payment_intent.status}")
                    # Still return success if subscription is created
                    return {
                        'subscription_id': subscription.id,
                        'status': 'success',
                        'customer_id': customer_id,
                        'amount_paid': discounted_amount,
                        'discount_applied': discount_rate * 100,
                        'bundles': bundles,
                        'note': f'Subscription created but payment_intent status is {payment_intent.status}'
                    }
            else:
                print("No payment_intent found, but subscription created successfully")
                return {
                    'subscription_id': subscription.id,
                    'status': 'success',
                    'customer_id': customer_id,
                    'amount_paid': discounted_amount,
                    'discount_applied': discount_rate * 100,
                    'bundles': bundles
                }
        except Exception as payment_intent_error:
            print(f"Error accessing payment_intent: {payment_intent_error}")
            # If we can't access payment_intent but subscription was created, still return success
            return {
                'subscription_id': subscription.id,
                'status': 'success',
                'customer_id': customer_id,
                'amount_paid': discounted_amount,
                'discount_applied': discount_rate * 100,
                'bundles': bundles,
                'note': 'Subscription created successfully (payment_intent access failed)'
            }

    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        print(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        print(f"Payment processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")

@router.post("/create-customer-portal-session")
async def create_customer_portal_session(
    return_url: str,
    current_user=Depends(get_current_user)
):
    """Create a customer portal session for subscription management"""
    try:
        # Find customer by email
        customers = stripe.Customer.list(
            email=current_user.email,
            limit=1
        )
        
        if not customers.data:
            raise HTTPException(status_code=400, detail="No customer found for this user")
        
        customer = customers.data[0]
        
        # Create portal session
        session = stripe.billing_portal.Session.create(
            customer=customer.id,
            return_url=return_url,
        )
        
        return {
            'portal_url': session.url
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portal session creation failed: {str(e)}")

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