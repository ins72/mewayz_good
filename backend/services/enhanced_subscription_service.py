"""
Enhanced Subscription Service with Bundle Support
Integrates bundle management with Stripe for subscription handling
"""

import uuid
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import stripe
import os

from core.bundle_manager import BundleManager, BundleType, get_bundle_manager
from core.database import get_database_async

logger = logging.getLogger(__name__)

class EnhancedSubscriptionService:
    """
    Enhanced subscription service with bundle support
    Handles Stripe integration, bundle subscriptions, and billing management
    """
    
    def __init__(self):
        self.service_name = "enhanced_subscription"
        self.bundle_manager = get_bundle_manager()
        
        # Initialize Stripe
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        
        # Stripe Product IDs (should be created in Stripe Dashboard)
        self.STRIPE_BUNDLE_PRODUCTS = {
            BundleType.CREATOR: {
                "product_id": "prod_creator_bundle",
                "monthly_price_id": "price_creator_monthly",
                "yearly_price_id": "price_creator_yearly"
            },
            BundleType.ECOMMERCE: {
                "product_id": "prod_ecommerce_bundle", 
                "monthly_price_id": "price_ecommerce_monthly",
                "yearly_price_id": "price_ecommerce_yearly"
            },
            BundleType.SOCIAL_MEDIA: {
                "product_id": "prod_social_bundle",
                "monthly_price_id": "price_social_monthly", 
                "yearly_price_id": "price_social_yearly"
            },
            BundleType.EDUCATION: {
                "product_id": "prod_education_bundle",
                "monthly_price_id": "price_education_monthly",
                "yearly_price_id": "price_education_yearly"
            },
            BundleType.BUSINESS: {
                "product_id": "prod_business_bundle",
                "monthly_price_id": "price_business_monthly",
                "yearly_price_id": "price_business_yearly"
            },
            BundleType.OPERATIONS: {
                "product_id": "prod_operations_bundle",
                "monthly_price_id": "price_operations_monthly",
                "yearly_price_id": "price_operations_yearly"
            },
            BundleType.ENTERPRISE: {
                "product_id": "prod_enterprise_bundle",
                "monthly_price_id": "price_enterprise_monthly",
                "yearly_price_id": "price_enterprise_yearly"
            }
        }
    
    async def _get_db(self):
        """Get database connection"""
        try:
            return await get_database_async()
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            return None
    
    async def create_customer(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a Stripe customer for the user"""
        try:
            # Check if customer already exists
            db = await self._get_db()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            customers_collection = db["stripe_customers"]
            existing_customer = await customers_collection.find_one({
                "user_id": user_data.get("user_id")
            })
            
            if existing_customer:
                return {
                    "success": True,
                    "customer_id": existing_customer["stripe_customer_id"],
                    "existing": True
                }
            
            # Create new Stripe customer
            customer = stripe.Customer.create(
                email=user_data.get("email"),
                name=user_data.get("name"),
                metadata={
                    "user_id": user_data.get("user_id"),
                    "created_by": "mewayz_v2"
                }
            )
            
            # Save customer to database
            customer_record = {
                "id": str(uuid.uuid4()),
                "user_id": user_data.get("user_id"),
                "stripe_customer_id": customer.id,
                "email": user_data.get("email"),
                "name": user_data.get("name"),
                "created_at": datetime.utcnow().isoformat()
            }
            
            await customers_collection.insert_one(customer_record)
            
            return {
                "success": True,
                "customer_id": customer.id,
                "existing": False,
                "created_at": customer_record["created_at"]
            }
            
        except Exception as e:
            logger.error(f"Customer creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def create_bundle_subscription(self, 
                                       user_id: str,
                                       bundles: List[BundleType],
                                       billing_cycle: str = "monthly",
                                       payment_method_id: str = None) -> Dict[str, Any]:
        """
        Create a multi-bundle subscription with Stripe
        """
        try:
            # Get user info for customer creation
            db = await self._get_db()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            users_collection = db["users"]
            user = await users_collection.find_one({"id": user_id})
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            # Create or get customer
            customer_result = await self.create_customer({
                "user_id": user_id,
                "email": user.get("email"),
                "name": user.get("name", user.get("email"))
            })
            
            if not customer_result.get("success"):
                return {"success": False, "error": "Failed to create customer"}
            
            customer_id = customer_result["customer_id"]
            
            # Calculate pricing with discounts
            pricing = self.bundle_manager.calculate_bundle_pricing(bundles, billing_cycle)
            
            if not pricing.get("success"):
                return {"success": False, "error": "Pricing calculation failed"}
            
            # Create subscription items for each bundle
            subscription_items = []
            
            for bundle in bundles:
                if bundle not in self.STRIPE_BUNDLE_PRODUCTS:
                    continue
                
                price_key = f"{billing_cycle}_price_id"
                price_id = self.STRIPE_BUNDLE_PRODUCTS[bundle][price_key]
                
                subscription_items.append({
                    "price": price_id
                })
            
            # Create Stripe subscription
            subscription_data = {
                "customer": customer_id,
                "items": subscription_items,
                "metadata": {
                    "user_id": user_id,
                    "bundle_count": len(bundles),
                    "bundles": ",".join([b.value for b in bundles]),
                    "billing_cycle": billing_cycle,
                    "discount_applied": pricing.get("discount_rate", 0),
                    "original_amount": pricing.get("base_cost"),
                    "final_amount": pricing.get("final_cost")
                },
                "expand": ["latest_invoice.payment_intent"]
            }
            
            # Add payment method if provided
            if payment_method_id:
                subscription_data["default_payment_method"] = payment_method_id
            
            # Apply discount if applicable (custom implementation)
            discount_rate = pricing.get("discount_rate", 0)
            if discount_rate > 0:
                # Create a coupon for the discount
                coupon = stripe.Coupon.create(
                    percent_off=discount_rate * 100,
                    duration="forever",
                    id=f"multi_bundle_discount_{int(discount_rate*100)}_{user_id}_{int(datetime.utcnow().timestamp())}"
                )
                subscription_data["coupon"] = coupon.id
            
            subscription = stripe.Subscription.create(**subscription_data)
            
            # Save subscription to database
            subscriptions_collection = db["subscriptions"]
            subscription_record = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "stripe_subscription_id": subscription.id,
                "stripe_customer_id": customer_id,
                "bundles": [b.value for b in bundles],
                "billing_cycle": billing_cycle,
                "status": subscription.status,
                "current_period_start": datetime.fromtimestamp(subscription.current_period_start).isoformat(),
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end).isoformat(),
                "base_cost": pricing.get("base_cost"),
                "discount_rate": pricing.get("discount_rate"),
                "final_cost": pricing.get("final_cost"),
                "created_at": datetime.utcnow().isoformat()
            }
            
            await subscriptions_collection.insert_one(subscription_record)
            
            # Activate bundles for the user
            for bundle in bundles:
                await self.bundle_manager.activate_bundle(user_id, bundle)
            
            return {
                "success": True,
                "subscription_id": subscription.id,
                "subscription_record_id": subscription_record["id"],
                "client_secret": subscription.latest_invoice.payment_intent.client_secret if subscription.latest_invoice.payment_intent else None,
                "status": subscription.status,
                "bundles_activated": len(bundles),
                "pricing": pricing
            }
            
        except Exception as e:
            logger.error(f"Bundle subscription creation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def modify_subscription(self,
                                user_id: str,
                                new_bundles: List[BundleType],
                                billing_cycle: str = None) -> Dict[str, Any]:
        """
        Modify an existing subscription to add/remove bundles
        """
        try:
            db = await self._get_db()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            # Get current subscription
            subscriptions_collection = db["subscriptions"]
            current_subscription = await subscriptions_collection.find_one({
                "user_id": user_id,
                "status": {"$in": ["active", "trialing"]}
            })
            
            if not current_subscription:
                return {"success": False, "error": "No active subscription found"}
            
            stripe_subscription_id = current_subscription["stripe_subscription_id"]
            
            # Get current Stripe subscription
            subscription = stripe.Subscription.retrieve(stripe_subscription_id)
            
            # Calculate new pricing
            new_pricing = self.bundle_manager.calculate_bundle_pricing(
                new_bundles, 
                billing_cycle or current_subscription.get("billing_cycle", "monthly")
            )
            
            if not new_pricing.get("success"):
                return {"success": False, "error": "Pricing calculation failed"}
            
            # Update subscription items
            new_items = []
            for bundle in new_bundles:
                if bundle not in self.STRIPE_BUNDLE_PRODUCTS:
                    continue
                
                price_key = f"{billing_cycle or current_subscription.get('billing_cycle', 'monthly')}_price_id"
                price_id = self.STRIPE_BUNDLE_PRODUCTS[bundle][price_key]
                
                new_items.append({"price": price_id})
            
            # Update Stripe subscription
            updated_subscription = stripe.Subscription.modify(
                stripe_subscription_id,
                items=new_items,
                proration_behavior="create_prorations",
                metadata={
                    **subscription.metadata,
                    "bundles": ",".join([b.value for b in new_bundles]),
                    "updated_at": datetime.utcnow().isoformat()
                }
            )
            
            # Update database record
            await subscriptions_collection.update_one(
                {"stripe_subscription_id": stripe_subscription_id},
                {
                    "$set": {
                        "bundles": [b.value for b in new_bundles],
                        "base_cost": new_pricing.get("base_cost"),
                        "discount_rate": new_pricing.get("discount_rate"),
                        "final_cost": new_pricing.get("final_cost"),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
            )
            
            # Update bundle activations
            current_bundles = set(current_subscription.get("bundles", []))
            new_bundles_set = set([b.value for b in new_bundles])
            
            # Deactivate removed bundles
            for bundle_name in current_bundles - new_bundles_set:
                try:
                    bundle_type = BundleType(bundle_name)
                    await self.bundle_manager.deactivate_bundle(user_id, bundle_type)
                except ValueError:
                    continue
            
            # Activate new bundles
            for bundle_name in new_bundles_set - current_bundles:
                try:
                    bundle_type = BundleType(bundle_name)
                    await self.bundle_manager.activate_bundle(user_id, bundle_type)
                except ValueError:
                    continue
            
            return {
                "success": True,
                "subscription_id": updated_subscription.id,
                "status": updated_subscription.status,
                "bundles_updated": len(new_bundles),
                "pricing": new_pricing,
                "updated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Subscription modification error: {e}")
            return {"success": False, "error": str(e)}
    
    async def cancel_subscription(self, user_id: str, immediate: bool = False) -> Dict[str, Any]:
        """
        Cancel a user's subscription
        """
        try:
            db = await self._get_db()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            # Get current subscription
            subscriptions_collection = db["subscriptions"]
            current_subscription = await subscriptions_collection.find_one({
                "user_id": user_id,
                "status": {"$in": ["active", "trialing"]}
            })
            
            if not current_subscription:
                return {"success": False, "error": "No active subscription found"}
            
            stripe_subscription_id = current_subscription["stripe_subscription_id"]
            
            # Cancel Stripe subscription
            if immediate:
                canceled_subscription = stripe.Subscription.delete(stripe_subscription_id)
            else:
                canceled_subscription = stripe.Subscription.modify(
                    stripe_subscription_id,
                    cancel_at_period_end=True
                )
            
            # Update database record
            await subscriptions_collection.update_one(
                {"stripe_subscription_id": stripe_subscription_id},
                {
                    "$set": {
                        "status": "canceled" if immediate else "cancel_at_period_end",
                        "canceled_at": datetime.utcnow().isoformat()
                    }
                }
            )
            
            # Deactivate bundles if immediate cancellation
            if immediate:
                bundles = current_subscription.get("bundles", [])
                for bundle_name in bundles:
                    try:
                        bundle_type = BundleType(bundle_name)
                        await self.bundle_manager.deactivate_bundle(user_id, bundle_type)
                    except ValueError:
                        continue
            
            return {
                "success": True,
                "subscription_id": canceled_subscription.id,
                "status": canceled_subscription.status,
                "immediate": immediate,
                "canceled_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Subscription cancellation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_user_subscription(self, user_id: str) -> Dict[str, Any]:
        """
        Get a user's current subscription details
        """
        try:
            db = await self._get_db()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            subscriptions_collection = db["subscriptions"]
            subscription = await subscriptions_collection.find_one({
                "user_id": user_id
            }, sort=[("created_at", -1)])
            
            if not subscription:
                return {"success": False, "error": "No subscription found"}
            
            # Remove MongoDB ObjectId
            if '_id' in subscription:
                del subscription['_id']
            
            # Get active bundles from bundle manager
            user_bundles = await self.bundle_manager.get_user_bundles(user_id)
            
            return {
                "success": True,
                "subscription": subscription,
                "active_bundles": user_bundles.get("active_bundles", []),
                "retrieved_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Get subscription error: {e}")
            return {"success": False, "error": str(e)}

# Singleton instance
_enhanced_subscription_service = None

def get_enhanced_subscription_service() -> EnhancedSubscriptionService:
    """Get Enhanced Subscription Service singleton instance"""
    global _enhanced_subscription_service
    if _enhanced_subscription_service is None:
        _enhanced_subscription_service = EnhancedSubscriptionService()
    return _enhanced_subscription_service

# Convenience function
enhanced_subscription_service = get_enhanced_subscription_service()