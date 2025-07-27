"""
Dashboard Service for MEWAYZ V2
Provides real database-driven dashboard data
"""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from db.session import MongoDatabase
from crud.users import UserCRUD
from crud.products import ProductCRUD
from crud.orders import OrderCRUD
from crud.biolinks import BioLinkCRUD
from crud.messages import MessageCRUD
from crud.comments import CommentCRUD
from crud.notifications import NotificationCRUD

logger = logging.getLogger(__name__)


class DashboardService:
    """Real dashboard data service"""
    
    def __init__(self, db: MongoDatabase):
        self.db = db
        self.user_crud = UserCRUD(db)
        self.product_crud = ProductCRUD(db)
        self.order_crud = OrderCRUD(db)
        self.biolink_crud = BioLinkCRUD()
        self.message_crud = MessageCRUD(db)
        self.comment_crud = CommentCRUD(db)
        self.notification_crud = NotificationCRUD(db)
    
    async def get_system_overview(self) -> Dict[str, Any]:
        """Get real system overview statistics"""
        try:
            # Get real counts from database
            user_count = await self.user_crud.count_users()
            product_count = await self.product_crud.count_products()
            order_count = await self.order_crud.count_orders()
            biolink_count = await self.biolink_crud.count_biolinks()
            message_count = await self.message_crud.count_messages()
            comment_count = await self.comment_crud.count_comments()
            notification_count = await self.notification_crud.count_notifications()
            
            # Get recent activity
            recent_users = await self.user_crud.get_recent_users(limit=5)
            recent_products = await self.product_crud.get_recent_products(limit=5)
            recent_orders = await self.order_crud.get_recent_orders(limit=5)
            
            return {
                "status": "healthy",
                "database_stats": {
                    "users": user_count,
                    "products": product_count,
                    "orders": order_count,
                    "biolinks": biolink_count,
                    "messages": message_count,
                    "comments": comment_count,
                    "notifications": notification_count
                },
                "recent_activity": {
                    "users": [{"id": u.id, "name": u.full_name, "created_at": u.created_at} for u in recent_users],
                    "products": [{"id": p.id, "name": p.name, "price": p.price} for p in recent_products],
                    "orders": [{"id": o.id, "total": o.total, "status": o.status} for o in recent_orders]
                },
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting system overview: {e}")
            return {
                "status": "error",
                "error": str(e),
                "database_stats": {},
                "recent_activity": {}
            }
    
    async def get_user_dashboard(self, user_id: str) -> Dict[str, Any]:
        """Get real dashboard data for a specific user"""
        try:
            # Get user data
            user = await self.user_crud.get_user(user_id)
            if not user:
                return {"error": "User not found"}
            
            # Get user's products
            user_products = await self.product_crud.get_products_by_vendor(user_id)
            
            # Get user's orders
            user_orders = await self.order_crud.get_orders_by_user(user_id)
            
            # Get user's biolinks
            user_biolinks = await self.biolink_crud.get_biolinks_by_user(user_id)
            
            # Get user's messages
            user_messages = await self.message_crud.get_messages_by_user(user_id)
            
            # Get user's notifications
            user_notifications = await self.notification_crud.get_notifications_by_user(user_id)
            
            # Calculate statistics
            total_revenue = sum(order.total for order in user_orders if order.status == "completed")
            total_products = len(user_products)
            total_orders = len(user_orders)
            total_biolinks = len(user_biolinks)
            unread_messages = len([m for m in user_messages if not m.is_read])
            unread_notifications = len([n for n in user_notifications if not n.is_read])
            
            # Get recent activity
            recent_activity = await self._get_user_recent_activity(user_id)
            
            return {
                "user": {
                    "id": user.id,
                    "name": user.full_name,
                    "email": user.email,
                    "role": user.role,
                    "created_at": user.created_at
                },
                "statistics": {
                    "total_revenue": total_revenue,
                    "total_products": total_products,
                    "total_orders": total_orders,
                    "total_biolinks": total_biolinks,
                    "unread_messages": unread_messages,
                    "unread_notifications": unread_notifications
                },
                "recent_products": [{"id": p.id, "name": p.name, "price": p.price, "status": p.is_active} for p in user_products[:5]],
                "recent_orders": [{"id": o.id, "total": o.total, "status": o.status, "created_at": o.created_at} for o in user_orders[:5]],
                "recent_biolinks": [{"id": b.id, "name": b.name, "url": b.url, "clicks": b.clicks} for b in user_biolinks[:5]],
                "recent_activity": recent_activity,
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting user dashboard: {e}")
            return {"error": str(e)}
    
    async def get_analytics_overview(self) -> Dict[str, Any]:
        """Get real analytics overview"""
        try:
            # Get analytics data
            total_users = await self.user_crud.count_users()
            total_products = await self.product_crud.count_products()
            total_orders = await self.order_crud.count_orders()
            
            # Get revenue data
            all_orders = await self.order_crud.get_all_orders()
            total_revenue = sum(order.total for order in all_orders if order.status == "completed")
            
            # Get growth data (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_users = await self.user_crud.get_users_since(thirty_days_ago)
            recent_products = await self.product_crud.get_products_since(thirty_days_ago)
            recent_orders = await self.order_crud.get_orders_since(thirty_days_ago)
            
            # Calculate growth percentages
            user_growth = len(recent_users) / max(total_users, 1) * 100
            product_growth = len(recent_products) / max(total_products, 1) * 100
            order_growth = len(recent_orders) / max(total_orders, 1) * 100
            
            return {
                "overview": {
                    "total_users": total_users,
                    "total_products": total_products,
                    "total_orders": total_orders,
                    "total_revenue": total_revenue
                },
                "growth": {
                    "user_growth": round(user_growth, 2),
                    "product_growth": round(product_growth, 2),
                    "order_growth": round(order_growth, 2)
                },
                "recent_activity": {
                    "new_users_30d": len(recent_users),
                    "new_products_30d": len(recent_products),
                    "new_orders_30d": len(recent_orders)
                },
                "last_updated": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting analytics overview: {e}")
            return {"error": str(e)}
    
    async def get_revenue_analytics(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Get real revenue analytics"""
        try:
            if user_id:
                # User-specific revenue
                user_orders = await self.order_crud.get_orders_by_user(user_id)
                completed_orders = [o for o in user_orders if o.status == "completed"]
                total_revenue = sum(order.total for order in completed_orders)
                
                # Monthly breakdown
                monthly_revenue = {}
                for order in completed_orders:
                    month_key = order.created_at.strftime("%Y-%m")
                    monthly_revenue[month_key] = monthly_revenue.get(month_key, 0) + order.total
                
                return {
                    "user_id": user_id,
                    "total_revenue": total_revenue,
                    "total_orders": len(completed_orders),
                    "monthly_revenue": monthly_revenue,
                    "average_order_value": total_revenue / max(len(completed_orders), 1)
                }
            else:
                # System-wide revenue
                all_orders = await self.order_crud.get_all_orders()
                completed_orders = [o for o in all_orders if o.status == "completed"]
                total_revenue = sum(order.total for order in completed_orders)
                
                # Monthly breakdown
                monthly_revenue = {}
                for order in completed_orders:
                    month_key = order.created_at.strftime("%Y-%m")
                    monthly_revenue[month_key] = monthly_revenue.get(month_key, 0) + order.total
                
                return {
                    "total_revenue": total_revenue,
                    "total_orders": len(completed_orders),
                    "monthly_revenue": monthly_revenue,
                    "average_order_value": total_revenue / max(len(completed_orders), 1)
                }
        except Exception as e:
            logger.error(f"Error getting revenue analytics: {e}")
            return {"error": str(e)}
    
    async def _get_user_recent_activity(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's recent activity"""
        try:
            activities = []
            
            # Get recent orders
            recent_orders = await self.order_crud.get_recent_orders_by_user(user_id, limit=3)
            for order in recent_orders:
                activities.append({
                    "type": "order",
                    "id": order.id,
                    "description": f"Order #{order.id} - ${order.total}",
                    "timestamp": order.created_at,
                    "status": order.status
                })
            
            # Get recent products
            recent_products = await self.product_crud.get_recent_products_by_vendor(user_id, limit=3)
            for product in recent_products:
                activities.append({
                    "type": "product",
                    "id": product.id,
                    "description": f"Product '{product.name}' created",
                    "timestamp": product.created_at,
                    "status": "active" if product.is_active else "inactive"
                })
            
            # Get recent messages
            recent_messages = await self.message_crud.get_recent_messages_by_user(user_id, limit=3)
            for message in recent_messages:
                activities.append({
                    "type": "message",
                    "id": message.id,
                    "description": f"Message: {message.subject}",
                    "timestamp": message.created_at,
                    "status": "read" if message.is_read else "unread"
                })
            
            # Sort by timestamp
            activities.sort(key=lambda x: x["timestamp"], reverse=True)
            return activities[:10]  # Return top 10 activities
            
        except Exception as e:
            logger.error(f"Error getting user recent activity: {e}")
            return [] 