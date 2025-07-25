"""
MEWAYZ V2 Bundle Management System
Core infrastructure for managing bundle subscriptions, permissions, and features
"""

import uuid
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from enum import Enum

logger = logging.getLogger(__name__)

class BundleType(str, Enum):
    """Available bundle types"""
    FREE_STARTER = "free_starter"
    CREATOR = "creator"
    ECOMMERCE = "ecommerce" 
    SOCIAL_MEDIA = "social_media"
    EDUCATION = "education"
    BUSINESS = "business"
    OPERATIONS = "operations"
    ENTERPRISE = "enterprise"

class BundleManager:
    """
    Core Bundle Management System
    Handles bundle activation, permissions, pricing, and feature access
    """
    
    # Bundle Configuration - Maps bundles to services and features
    BUNDLE_CONFIGURATIONS = {
        BundleType.FREE_STARTER: {
            "name": "Free Starter",
            "price_monthly": 0,
            "price_yearly": 0,
            "services": ["basic_analytics", "simple_form"],
            "features": ["bio_links_basic", "simple_analytics", "basic_forms"],
            "limitations": {
                "bio_links": 5,
                "forms": 1,
                "analytics_days": 7
            },
            "database_collections": ["basic_analytics", "simple_forms"],
            "api_routes": ["/api/basic/*"]
        },
        BundleType.CREATOR: {
            "name": "Creator Bundle", 
            "price_monthly": 19,
            "price_yearly": 190,
            "services": [
                "complete_link_in_bio_service",
                "website_builder_service",
                "ai_content_generation_service", 
                "template_marketplace_service",
                "seo_service"
            ],
            "features": [
                "advanced_bio_links", "website_builder", "ai_content_creation", 
                "template_marketplace", "seo_optimization", "custom_domains"
            ],
            "limitations": {
                "websites": 10,
                "ai_credits": 500,
                "templates": "unlimited"
            },
            "database_collections": [
                "complete_link_in_bio", "websites", "ai_content", 
                "templates", "seo_data"
            ],
            "api_routes": ["/api/creator/*", "/api/complete-link-in-bio/*", "/api/website-builder/*"]
        },
        BundleType.ECOMMERCE: {
            "name": "E-commerce Bundle",
            "price_monthly": 24, 
            "price_yearly": 240,
            "services": [
                "complete_ecommerce_service",
                "multi_vendor_marketplace_service",
                "stripe_integration_service",
                "escrow_service",
                "promotions_referrals_service"
            ],
            "features": [
                "online_store", "multi_vendor", "payment_processing", 
                "escrow_system", "promotions", "inventory_management"
            ],
            "limitations": {
                "products": "unlimited",
                "vendors": 10,
                "transaction_fee": 0.029
            },
            "database_collections": [
                "complete_ecommerce", "multi_vendor_marketplace", 
                "escrow", "promotions", "orders"
            ],
            "api_routes": ["/api/ecommerce/*", "/api/multi-vendor/*", "/api/escrow/*"]
        },
        BundleType.SOCIAL_MEDIA: {
            "name": "Social Media Bundle",
            "price_monthly": 29,
            "price_yearly": 290,
            "services": [
                "complete_social_media_leads_service",
                "social_media_service", 
                "twitter_service",
                "tiktok_service",
                "analytics_service"
            ],
            "features": [
                "instagram_database", "social_scheduling", "twitter_tools",
                "tiktok_integration", "social_analytics", "hashtag_research"
            ],
            "limitations": {
                "scheduled_posts": 100,
                "instagram_leads": 10000,
                "social_accounts": 10
            },
            "database_collections": [
                "social_media_leads", "social_media", "twitter", "tiktok", "social_analytics"
            ],
            "api_routes": ["/api/social/*", "/api/twitter/*", "/api/tiktok/*"]
        },
        BundleType.EDUCATION: {
            "name": "Education Bundle", 
            "price_monthly": 29,
            "price_yearly": 290,
            "services": [
                "complete_course_community_service",
                "course_service",
                "template_marketplace_service",
                "booking_service"
            ],
            "features": [
                "course_platform", "student_management", "community_features",
                "certificates", "live_streaming", "course_templates"
            ],
            "limitations": {
                "courses": "unlimited",
                "students": 1000,
                "communities": 5
            },
            "database_collections": [
                "courses", "students", "communities", "certificates", "course_templates"
            ],
            "api_routes": ["/api/education/*", "/api/courses/*", "/api/community/*"]
        },
        BundleType.BUSINESS: {
            "name": "Business Bundle",
            "price_monthly": 39,
            "price_yearly": 390,
            "services": [
                "crm_service",
                "email_marketing_service",
                "workflow_automation_service",
                "lead_service",
                "campaign_service",
                "business_intelligence_service"
            ],
            "features": [
                "advanced_crm", "email_marketing", "lead_management",
                "workflow_automation", "campaign_management", "business_intelligence"
            ],
            "limitations": {
                "contacts": "unlimited",
                "emails_per_month": 10000,
                "workflows": 10
            },
            "database_collections": [
                "crm", "email_campaigns", "workflows", "leads", "campaigns", "business_intelligence"
            ],
            "api_routes": ["/api/business/*", "/api/crm/*", "/api/email-marketing/*"]
        },
        BundleType.OPERATIONS: {
            "name": "Operations Bundle",
            "price_monthly": 24,
            "price_yearly": 240,
            "services": [
                "booking_service",
                "complete_financial_service",
                "form_builder_service",
                "survey_service"
            ],
            "features": [
                "booking_system", "financial_management", "form_builder",
                "surveys", "invoicing", "appointment_scheduling"
            ],
            "limitations": {
                "bookings_per_month": 500,
                "forms": "unlimited",
                "surveys": "unlimited"
            },
            "database_collections": [
                "bookings", "financial", "forms", "surveys", "invoices"
            ],
            "api_routes": ["/api/operations/*", "/api/booking/*", "/api/financial/*"]
        },
        BundleType.ENTERPRISE: {
            "name": "Enterprise Bundle",
            "price_monthly": 299,
            "price_yearly": 2990,
            "services": ["all"],  # All services included
            "features": ["all"],  # All features included
            "limitations": {},  # No limitations
            "database_collections": ["all"],
            "api_routes": ["/api/*"],
            "extra_features": [
                "white_label", "dedicated_support", "custom_integrations",
                "advanced_security", "sla_guarantee", "custom_development"
            ]
        }
    }
    
    # Multi-Bundle Discount Configuration
    MULTI_BUNDLE_DISCOUNTS = {
        2: 0.20,  # 20% off for 2 bundles
        3: 0.30,  # 30% off for 3 bundles
        4: 0.40   # 40% off for 4+ bundles
    }
    
    def __init__(self):
        self.service_name = "bundle_manager"
        
    def _get_db(self):
        """Get database connection"""
        try:
            from core.database import get_database
            return get_database()
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            return None
    
    async def _get_db_async(self):
        """Get async database connection"""
        try:
            from core.database import get_database_async
            return await get_database_async()
        except Exception as e:
            logger.error(f"Async database connection error: {e}")
            return None
    
    def get_bundle_configuration(self, bundle_type: BundleType) -> Dict[str, Any]:
        """Get configuration for a specific bundle"""
        try:
            return self.BUNDLE_CONFIGURATIONS.get(bundle_type, {})
        except Exception as e:
            logger.error(f"Error getting bundle configuration: {e}")
            return {}
    
    def get_all_bundles(self) -> Dict[str, Any]:
        """Get all available bundle configurations"""
        return self.BUNDLE_CONFIGURATIONS
    
    def calculate_bundle_pricing(self, 
                                bundles: List[BundleType], 
                                billing_cycle: str = "monthly") -> Dict[str, Any]:
        """
        Calculate pricing for multiple bundles with discounts
        """
        try:
            if not bundles:
                return {"error": "No bundles specified"}
            
            # Calculate base cost
            base_cost = 0
            bundle_details = []
            
            for bundle in bundles:
                config = self.get_bundle_configuration(bundle)
                if not config:
                    continue
                    
                price_key = f"price_{billing_cycle}"
                bundle_price = config.get(price_key, 0)
                base_cost += bundle_price
                
                bundle_details.append({
                    "bundle": bundle,
                    "name": config.get("name", "Unknown"),
                    "price": bundle_price
                })
            
            # Apply multi-bundle discount
            bundle_count = len(bundles)
            discount_rate = self.MULTI_BUNDLE_DISCOUNTS.get(bundle_count, 0)
            if bundle_count >= 4:
                discount_rate = self.MULTI_BUNDLE_DISCOUNTS[4]
            
            discount_amount = base_cost * discount_rate
            final_cost = base_cost - discount_amount
            
            return {
                "success": True,
                "bundle_count": bundle_count,
                "base_cost": base_cost,
                "discount_rate": discount_rate,
                "discount_amount": discount_amount, 
                "final_cost": final_cost,
                "billing_cycle": billing_cycle,
                "bundle_details": bundle_details,
                "savings": discount_amount
            }
            
        except Exception as e:
            logger.error(f"Pricing calculation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def activate_bundle(self, user_id: str, bundle_type: BundleType) -> Dict[str, Any]:
        """Activate a bundle for a user"""
        try:
            db = await self._get_db_async()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            collection = db["user_bundles"]
            bundle_config = self.get_bundle_configuration(bundle_type)
            
            if not bundle_config:
                return {"success": False, "error": "Invalid bundle type"}
            
            # Check if bundle already active
            existing = await collection.find_one({
                "user_id": user_id,
                "bundle_type": bundle_type,
                "status": "active"
            })
            
            if existing:
                return {"success": False, "error": "Bundle already active"}
            
            # Create bundle activation record
            bundle_record = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "bundle_type": bundle_type,
                "bundle_name": bundle_config["name"],
                "services": bundle_config["services"],
                "features": bundle_config["features"], 
                "limitations": bundle_config["limitations"],
                "status": "active",
                "activated_at": datetime.utcnow().isoformat(),
                "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
            }
            
            result = await collection.insert_one(bundle_record)
            
            if result.inserted_id:
                return {
                    "success": True,
                    "message": f"{bundle_config['name']} activated successfully",
                    "bundle_id": bundle_record["id"],
                    "activated_services": bundle_config["services"],
                    "activated_features": bundle_config["features"]
                }
            else:
                return {"success": False, "error": "Activation failed"}
                
        except Exception as e:
            logger.error(f"Bundle activation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def deactivate_bundle(self, user_id: str, bundle_type: BundleType) -> Dict[str, Any]:
        """Deactivate a bundle for a user"""
        try:
            db = await self._get_db_async()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            collection = db["user_bundles"]
            
            result = await collection.update_one(
                {
                    "user_id": user_id,
                    "bundle_type": bundle_type,
                    "status": "active"
                },
                {
                    "$set": {
                        "status": "inactive",
                        "deactivated_at": datetime.utcnow().isoformat()
                    }
                }
            )
            
            if result.matched_count > 0:
                return {
                    "success": True,
                    "message": f"Bundle {bundle_type} deactivated successfully"
                }
            else:
                return {"success": False, "error": "Bundle not found or already inactive"}
                
        except Exception as e:
            logger.error(f"Bundle deactivation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_user_bundles(self, user_id: str) -> Dict[str, Any]:
        """Get all active bundles for a user"""
        try:
            db = await self._get_db_async()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            collection = db["user_bundles"]
            
            cursor = collection.find({
                "user_id": user_id,
                "status": "active"
            })
            
            bundles = await cursor.to_list(length=None)
            
            # Clean up MongoDB ObjectId
            for bundle in bundles:
                if '_id' in bundle:
                    del bundle['_id']
            
            return {
                "success": True,
                "user_id": user_id,
                "active_bundles": bundles,
                "bundle_count": len(bundles)
            }
            
        except Exception as e:
            logger.error(f"Get user bundles error: {e}")
            return {"success": False, "error": str(e)}
    
    async def check_feature_access(self, user_id: str, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        try:
            user_bundles_result = await self.get_user_bundles(user_id)
            
            if not user_bundles_result.get("success"):
                return False
            
            bundles = user_bundles_result.get("active_bundles", [])
            
            for bundle in bundles:
                bundle_features = bundle.get("features", [])
                if feature in bundle_features or "all" in bundle_features:
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Feature access check error: {e}")
            return False
    
    async def check_service_access(self, user_id: str, service: str) -> bool:
        """Check if user has access to a specific service"""
        try:
            user_bundles_result = await self.get_user_bundles(user_id)
            
            if not user_bundles_result.get("success"):
                return False
            
            bundles = user_bundles_result.get("active_bundles", [])
            
            for bundle in bundles:
                bundle_services = bundle.get("services", [])
                if service in bundle_services or "all" in bundle_services:
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Service access check error: {e}")
            return False
    
    async def get_bundle_analytics(self, bundle_type: BundleType = None) -> Dict[str, Any]:
        """Get analytics for bundle usage"""
        try:
            db = await self._get_db_async()
            if not db:
                return {"success": False, "error": "Database unavailable"}
            
            collection = db["user_bundles"]
            
            # Build query
            query = {"status": "active"}
            if bundle_type:
                query["bundle_type"] = bundle_type
            
            # Get analytics
            total_active = await collection.count_documents(query)
            
            # Get breakdown by bundle type
            pipeline = [
                {"$match": {"status": "active"}},
                {"$group": {
                    "_id": "$bundle_type",
                    "count": {"$sum": 1}
                }}
            ]
            
            breakdown_cursor = collection.aggregate(pipeline)
            breakdown = await breakdown_cursor.to_list(length=None)
            
            return {
                "success": True,
                "total_active_bundles": total_active,
                "bundle_breakdown": breakdown,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Bundle analytics error: {e}")
            return {"success": False, "error": str(e)}

# Singleton instance
_bundle_manager = None

def get_bundle_manager() -> BundleManager:
    """Get Bundle Manager singleton instance"""
    global _bundle_manager
    if _bundle_manager is None:
        _bundle_manager = BundleManager()
    return _bundle_manager

# Convenience functions
bundle_manager = get_bundle_manager()