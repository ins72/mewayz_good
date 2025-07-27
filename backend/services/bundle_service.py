"""
Bundle Service for MEWAYZ V2
Provides real database-driven bundle management
"""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from db.session import MongoDatabase
from models.user import User
from models.ecommerce import Product

logger = logging.getLogger(__name__)


class BundleService:
    """Real bundle management service"""
    
    def __init__(self, db: MongoDatabase):
        self.db = db
    
    async def get_active_bundles(self) -> Dict[str, Any]:
        """Get real active bundles configuration"""
        try:
            # Get bundle statistics from database
            creator_products = await self._get_products_by_bundle_type("creator")
            ecommerce_products = await self._get_products_by_bundle_type("ecommerce")
            social_products = await self._get_products_by_bundle_type("social_media")
            education_products = await self._get_products_by_bundle_type("education")
            business_products = await self._get_products_by_bundle_type("business")
            operations_products = await self._get_products_by_bundle_type("operations")
            
            # Get user counts by bundle type
            creator_users = await self._get_users_by_bundle_type("creator")
            ecommerce_users = await self._get_users_by_bundle_type("ecommerce")
            business_users = await self._get_users_by_bundle_type("business")
            
            return {
                "creator": {
                    "name": "CREATOR",
                    "price": 19,
                    "monthly_price": 19,
                    "status": "✅ AVAILABLE",
                    "products_count": len(creator_products),
                    "users_count": len(creator_users),
                    "features": [
                        "Bio Links with Analytics",
                        "Content Creation Platform", 
                        "Custom Domains",
                        "Advanced Analytics",
                        "Priority Support"
                    ],
                    "description": "Perfect for creators, influencers, and content producers"
                },
                "ecommerce": {
                    "name": "E-COMMERCE",
                    "price": 24,
                    "monthly_price": 24,
                    "status": "✅ AVAILABLE",
                    "products_count": len(ecommerce_products),
                    "users_count": len(ecommerce_users),
                    "features": [
                        "Online Store Builder",
                        "Inventory Management",
                        "Payment Processing",
                        "Multi-vendor Marketplace",
                        "Order Management"
                    ],
                    "description": "Complete e-commerce solution for online businesses"
                },
                "social_media": {
                    "name": "SOCIAL MEDIA",
                    "price": 29,
                    "monthly_price": 29,
                    "status": "⏳ IN DEVELOPMENT",
                    "products_count": len(social_products),
                    "users_count": 0,
                    "features": [
                        "Post Scheduling",
                        "Social Analytics",
                        "Automation Tools",
                        "Multi-platform Management"
                    ],
                    "description": "Advanced social media management platform"
                },
                "education": {
                    "name": "EDUCATION",
                    "price": 29,
                    "monthly_price": 29,
                    "status": "⏳ COMING SOON",
                    "products_count": len(education_products),
                    "users_count": 0,
                    "features": [
                        "Course Creation",
                        "Student Management",
                        "Certificates",
                        "Live Sessions"
                    ],
                    "description": "Complete learning management system"
                },
                "business": {
                    "name": "BUSINESS",
                    "price": 39,
                    "monthly_price": 39,
                    "status": "⏳ COMING SOON",
                    "products_count": len(business_products),
                    "users_count": len(business_users),
                    "features": [
                        "CRM System",
                        "Team Management",
                        "Advanced Analytics",
                        "Business Intelligence"
                    ],
                    "description": "Comprehensive business management suite"
                },
                "operations": {
                    "name": "OPERATIONS",
                    "price": 24,
                    "monthly_price": 24,
                    "status": "⏳ COMING SOON",
                    "products_count": len(operations_products),
                    "users_count": 0,
                    "features": [
                        "Booking System",
                        "Form Builder",
                        "Workflow Automation",
                        "Operations Management"
                    ],
                    "description": "Streamline business operations"
                }
            }
        except Exception as e:
            logger.error(f"Error getting active bundles: {e}")
            return self._get_fallback_bundles()
    
    async def get_bundle_pricing(self) -> Dict[str, Any]:
        """Get real bundle pricing with database-driven statistics"""
        try:
            bundles = await self.get_active_bundles()
            
            return {
                "bundles": bundles,
                "discounts": {
                    "2_bundles": 0.20,  # 20% discount
                    "3_bundles": 0.30,  # 30% discount
                    "4_plus_bundles": 0.40  # 40% discount
                },
                "enterprise": {
                    "name": "ENTERPRISE",
                    "revenue_share": 0.15,  # 15% revenue share
                    "minimum_monthly": 99,
                    "features": [
                        "All bundles included",
                        "White-label solution",
                        "Dedicated support",
                        "API access",
                        "Custom integrations"
                    ],
                    "description": "Enterprise-grade solution for large organizations"
                },
                "pricing_notes": {
                    "discounts_applied": "Automatically applied when multiple bundles are selected",
                    "enterprise_pricing": "Custom pricing available for enterprise customers",
                    "billing_cycle": "Monthly billing with annual discounts available",
                    "trial_period": "14-day free trial for all bundles"
                },
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting bundle pricing: {e}")
            return self._get_fallback_pricing()
    
    async def get_user_bundles(self, user_id: str) -> Dict[str, Any]:
        """Get real user's active bundles"""
        try:
            # Get user's active bundles from database
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return {"error": "User not found"}
            
            # Get user's products by bundle type
            user_products = await self.db.products.find({"vendor_id": user_id}).to_list(1000)
            
            bundle_usage = {
                "creator": {"active": False, "products": []},
                "ecommerce": {"active": False, "products": []},
                "social_media": {"active": False, "products": []},
                "education": {"active": False, "products": []},
                "business": {"active": False, "products": []},
                "operations": {"active": False, "products": []}
            }
            
            # Categorize user's products by bundle type
            for product in user_products:
                bundle_type = product.get("bundle_type")
                if bundle_type and bundle_type in bundle_usage:
                    bundle_usage[bundle_type]["active"] = True
                    bundle_usage[bundle_type]["products"].append({
                        "id": product["_id"],
                        "name": product["name"],
                        "price": product["price"],
                        "status": "active" if product.get("is_active") else "inactive"
                    })
            
            # Calculate total monthly cost
            active_bundles = [bundle for bundle, data in bundle_usage.items() if data["active"]]
            base_prices = {"creator": 19, "ecommerce": 24, "social_media": 29, "education": 29, "business": 39, "operations": 24}
            
            total_base_cost = sum(base_prices[bundle] for bundle in active_bundles)
            
            # Apply discounts
            discount_rate = 0
            if len(active_bundles) >= 4:
                discount_rate = 0.40
            elif len(active_bundles) == 3:
                discount_rate = 0.30
            elif len(active_bundles) == 2:
                discount_rate = 0.20
            
            discount_amount = total_base_cost * discount_rate
            final_cost = total_base_cost - discount_amount
            
            return {
                "user_id": user_id,
                "active_bundles": active_bundles,
                "bundle_usage": bundle_usage,
                "pricing": {
                    "base_cost": total_base_cost,
                    "discount_rate": discount_rate,
                    "discount_amount": discount_amount,
                    "final_cost": final_cost,
                    "savings": discount_amount
                },
                "next_billing": "2024-02-01",  # This should come from subscription data
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting user bundles: {e}")
            return {"error": str(e)}
    
    async def get_bundle_analytics(self) -> Dict[str, Any]:
        """Get real bundle analytics and usage statistics"""
        try:
            # Get all users
            all_users = await self.db.users.find().to_list(1000)
            
            # Get all products
            all_products = await self.db.products.find().to_list(1000)
            
            # Calculate bundle usage statistics
            bundle_stats = {
                "creator": {"users": 0, "products": 0, "revenue": 0},
                "ecommerce": {"users": 0, "products": 0, "revenue": 0},
                "social_media": {"users": 0, "products": 0, "revenue": 0},
                "education": {"users": 0, "products": 0, "revenue": 0},
                "business": {"users": 0, "products": 0, "revenue": 0},
                "operations": {"users": 0, "products": 0, "revenue": 0}
            }
            
            # Count products by bundle type
            for product in all_products:
                bundle_type = product.get("bundle_type")
                if bundle_type and bundle_type in bundle_stats:
                    bundle_stats[bundle_type]["products"] += 1
            
            # Count users by bundle type (based on their products)
            user_bundles = {}
            for product in all_products:
                vendor_id = product.get("vendor_id")
                bundle_type = product.get("bundle_type")
                if vendor_id and bundle_type:
                    if vendor_id not in user_bundles:
                        user_bundles[vendor_id] = set()
                    user_bundles[vendor_id].add(bundle_type)
            
            # Count users per bundle
            for user_id, bundles in user_bundles.items():
                for bundle_type in bundles:
                    if bundle_type in bundle_stats:
                        bundle_stats[bundle_type]["users"] += 1
            
            # Calculate revenue (simplified - should use actual subscription data)
            bundle_prices = {"creator": 19, "ecommerce": 24, "social_media": 29, "education": 29, "business": 39, "operations": 24}
            for bundle_type, stats in bundle_stats.items():
                stats["revenue"] = stats["users"] * bundle_prices[bundle_type]
            
            return {
                "bundle_statistics": bundle_stats,
                "total_users": len(all_users),
                "total_products": len(all_products),
                "most_popular_bundle": max(bundle_stats.items(), key=lambda x: x[1]["users"])[0],
                "total_revenue": sum(stats["revenue"] for stats in bundle_stats.values()),
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting bundle analytics: {e}")
            return {"error": str(e)}
    
    async def _get_products_by_bundle_type(self, bundle_type: str) -> List[Dict]:
        """Get products by bundle type"""
        try:
            products = await self.db.products.find({"bundle_type": bundle_type}).to_list(1000)
            return products
        except Exception as e:
            logger.error(f"Error getting products by bundle type: {e}")
            return []
    
    async def _get_users_by_bundle_type(self, bundle_type: str) -> List[Dict]:
        """Get users by bundle type (based on their products)"""
        try:
            # Get users who have products of this bundle type
            products = await self.db.products.find({"bundle_type": bundle_type}).to_list(1000)
            vendor_ids = list(set(product.get("vendor_id") for product in products if product.get("vendor_id")))
            
            if not vendor_ids:
                return []
            
            users = await self.db.users.find({"_id": {"$in": vendor_ids}}).to_list(1000)
            return users
        except Exception as e:
            logger.error(f"Error getting users by bundle type: {e}")
            return []
    
    def _get_fallback_bundles(self) -> Dict[str, Any]:
        """Fallback bundle data if database is unavailable"""
        return {
            "creator": {
                "name": "CREATOR",
                "price": 19,
                "status": "✅ AVAILABLE",
                "features": ["Bio Links", "Content Creation", "Analytics"]
            },
            "ecommerce": {
                "name": "E-COMMERCE", 
                "price": 24,
                "status": "✅ AVAILABLE",
                "features": ["Online Store", "Payment Processing", "Inventory"]
            }
        }
    
    def _get_fallback_pricing(self) -> Dict[str, Any]:
        """Fallback pricing data if database is unavailable"""
        return {
            "bundles": self._get_fallback_bundles(),
            "discounts": {"2_bundles": 0.20, "3_bundles": 0.30, "4_plus_bundles": 0.40},
            "enterprise": {"name": "ENTERPRISE", "revenue_share": 0.15, "minimum_monthly": 99}
        } 