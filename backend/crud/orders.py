"""
Orders CRUD operations for MEWAYZ V2
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models.ecommerce import Order, OrderCreate

logger = logging.getLogger(__name__)


class OrderCRUD:
    """CRUD operations for orders"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.orders
    
    async def create_order(self, order_data: OrderCreate, user_id: str) -> Order:
        """Create a new order"""
        try:
            order_dict = order_data.dict()
            order_dict["user_id"] = user_id
            order_dict["created_at"] = datetime.utcnow()
            order_dict["updated_at"] = datetime.utcnow()
            order_dict["status"] = "pending"
            
            # Calculate totals
            subtotal = sum(item.total for item in order_data.items)
            tax = subtotal * 0.08  # 8% tax
            total = subtotal + tax
            
            order_dict["subtotal"] = subtotal
            order_dict["tax"] = tax
            order_dict["total"] = total
            order_dict["total_amount"] = total  # For compatibility
            
            result = await self.collection.insert_one(order_dict)
            order_dict["_id"] = result.inserted_id
            
            return Order(**order_dict)
        except Exception as e:
            logger.error(f"Error creating order: {e}")
            raise
    
    async def get_order(self, order_id: str) -> Optional[Order]:
        """Get an order by ID"""
        try:
            order_dict = await self.collection.find_one({"_id": ObjectId(order_id)})
            if order_dict:
                return Order(**order_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting order {order_id}: {e}")
            return None
    
    async def get_user_orders(self, user_id: str, start_date: Optional[datetime] = None, 
                            end_date: Optional[datetime] = None, limit: Optional[int] = None) -> List[Order]:
        """Get all orders for a user"""
        try:
            query = {"user_id": user_id}
            
            if start_date and end_date:
                query["created_at"] = {
                    "$gte": start_date,
                    "$lte": end_date
                }
            
            cursor = self.collection.find(query).sort("created_at", -1)
            
            if limit:
                cursor = cursor.limit(limit)
            
            orders = []
            async for order_dict in cursor:
                orders.append(Order(**order_dict))
            
            return orders
        except Exception as e:
            logger.error(f"Error getting user orders: {e}")
            return []
    
    async def get_user_orders_count(self, user_id: str) -> int:
        """Get count of orders for a user"""
        try:
            return await self.collection.count_documents({"user_id": user_id})
        except Exception as e:
            logger.error(f"Error getting user orders count: {e}")
            return 0
    
    async def get_product_orders(self, product_id: str, start_date: Optional[datetime] = None, 
                               end_date: Optional[datetime] = None) -> List[Order]:
        """Get orders for a specific product"""
        try:
            query = {"items.product_id": product_id}
            
            if start_date and end_date:
                query["created_at"] = {
                    "$gte": start_date,
                    "$lte": end_date
                }
            
            cursor = self.collection.find(query).sort("created_at", -1)
            orders = []
            async for order_dict in cursor:
                orders.append(Order(**order_dict))
            
            return orders
        except Exception as e:
            logger.error(f"Error getting product orders: {e}")
            return []
    
    async def update_order_status(self, order_id: str, status: str, user_id: str) -> Optional[Order]:
        """Update order status"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if status == "shipped":
                update_data["shipped_at"] = datetime.utcnow()
            elif status == "delivered":
                update_data["delivered_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(order_id), "user_id": user_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_order(order_id)
            return None
        except Exception as e:
            logger.error(f"Error updating order status {order_id}: {e}")
            return None
    
    async def get_orders_by_status(self, user_id: str, status: str) -> List[Order]:
        """Get orders by status"""
        try:
            cursor = self.collection.find({"user_id": user_id, "status": status}).sort("created_at", -1)
            orders = []
            async for order_dict in cursor:
                orders.append(Order(**order_dict))
            
            return orders
        except Exception as e:
            logger.error(f"Error getting orders by status: {e}")
            return []
    
    async def get_recent_orders(self, user_id: str, limit: int = 10) -> List[Order]:
        """Get recent orders for a user"""
        try:
            cursor = self.collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
            orders = []
            async for order_dict in cursor:
                orders.append(Order(**order_dict))
            
            return orders
        except Exception as e:
            logger.error(f"Error getting recent orders: {e}")
            return []


# Global instance
order_crud = None

def get_order_crud(db: AsyncIOMotorDatabase) -> OrderCRUD:
    """Get order CRUD instance"""
    global order_crud
    if order_crud is None:
        order_crud = OrderCRUD(db)
    return order_crud 