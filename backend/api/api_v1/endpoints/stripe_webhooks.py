"""
Stripe Webhooks Handler for MEWAYZ V2
Handles critical subscription lifecycle events
"""

from fastapi import APIRouter, HTTPException, Request, Header
from typing import Optional
import stripe
import os
import logging
from api.deps import get_current_user

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/stripe-webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature")
):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        
        if not stripe_signature or not webhook_secret:
            raise HTTPException(status_code=400, detail="Missing signature or webhook secret")
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, webhook_secret
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle different event types
        event_type = event['type']
        data = event['data']['object']
        
        if event_type == 'customer.subscription.created':
            await handle_subscription_created(data)
        elif event_type == 'customer.subscription.updated':
            await handle_subscription_updated(data)
        elif event_type == 'customer.subscription.deleted':
            await handle_subscription_deleted(data)
        elif event_type == 'invoice.payment_succeeded':
            await handle_payment_succeeded(data)
        elif event_type == 'invoice.payment_failed':
            await handle_payment_failed(data)
        elif event_type == 'customer.subscription.trial_will_end':
            await handle_trial_ending(data)
        else:
            logger.info(f"Unhandled event type: {event_type}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def handle_subscription_created(subscription):
    """Handle new subscription creation"""
    logger.info(f"Subscription created: {subscription['id']}")
    
    # Update user access based on subscription
    customer_id = subscription['customer']
    user_id = subscription['metadata'].get('user_id')
    bundles = subscription['metadata'].get('bundles', '').split(',')
    
    # TODO: Update user permissions in database
    # await update_user_subscription_access(user_id, bundles, 'active')

async def handle_subscription_updated(subscription):
    """Handle subscription changes"""
    logger.info(f"Subscription updated: {subscription['id']}")
    
    # Handle subscription status changes
    status = subscription['status']
    user_id = subscription['metadata'].get('user_id')
    
    # TODO: Update user access based on new status
    # await update_user_subscription_status(user_id, status)

async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation"""
    logger.info(f"Subscription deleted: {subscription['id']}")
    
    user_id = subscription['metadata'].get('user_id')
    
    # TODO: Revoke user access
    # await revoke_user_subscription_access(user_id)

async def handle_payment_succeeded(invoice):
    """Handle successful payment"""
    logger.info(f"Payment succeeded for invoice: {invoice['id']}")
    
    subscription_id = invoice.get('subscription')
    if subscription_id:
        # Ensure user access is active
        pass

async def handle_payment_failed(invoice):
    """Handle failed payment"""
    logger.error(f"Payment failed for invoice: {invoice['id']}")
    
    subscription_id = invoice.get('subscription')
    if subscription_id:
        # TODO: Send payment failure notification to user
        # TODO: Implement grace period logic
        pass

async def handle_trial_ending(subscription):
    """Handle trial period ending"""
    logger.info(f"Trial ending for subscription: {subscription['id']}")
    
    # TODO: Send trial ending notification
    pass