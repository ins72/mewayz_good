"""
Notifications CRUD Operations for MEWAYZ V2
Database operations for notification functionality
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from db.base import get_database
from models.notifications import Notification, NotificationCreate, NotificationUpdate, NotificationStats

logger = logging.getLogger(__name__)


class NotificationCRUD:
    """CRUD operations for notifications"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.notifications
    
    async def create_notification(self, notification_data: NotificationCreate) -> Notification:
        """Create a new notification"""
        try:
            notification_dict = notification_data.dict()
            notification_dict["id"] = str(ObjectId())
            notification_dict["created_at"] = datetime.utcnow()
            notification_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(notification_dict)
            if result.inserted_id:
                return Notification(**notification_dict)
            else:
                raise Exception("Failed to create notification")
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            raise
    
    async def create_bulk_notifications(self, notifications_data: List[NotificationCreate]) -> List[Notification]:
        """Create multiple notifications at once"""
        try:
            notifications = []
            for notification_data in notifications_data:
                notification_dict = notification_data.dict()
                notification_dict["id"] = str(ObjectId())
                notification_dict["created_at"] = datetime.utcnow()
                notification_dict["updated_at"] = datetime.utcnow()
                notifications.append(notification_dict)
            
            if notifications:
                result = await self.collection.insert_many(notifications)
                if result.inserted_ids:
                    return [Notification(**notification) for notification in notifications]
            
            return []
        except Exception as e:
            logger.error(f"Error creating bulk notifications: {e}")
            raise
    
    async def get_notification(self, notification_id: str) -> Optional[Notification]:
        """Get a notification by ID"""
        try:
            doc = await self.collection.find_one({"id": notification_id, "is_deleted": False})
            if doc:
                return Notification(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting notification {notification_id}: {e}")
            raise
    
    async def get_user_notifications(
        self, 
        user_id: str, 
        page: int = 1, 
        limit: int = 20,
        unread_only: bool = False,
        type_filter: Optional[str] = None
    ) -> List[Notification]:
        """Get notifications for a user"""
        try:
            skip = (page - 1) * limit
            
            # Build query
            query = {
                "user_id": user_id,
                "is_deleted": False
            }
            
            if unread_only:
                query["is_read"] = False
            
            if type_filter:
                query["notification_type"] = type_filter
            
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Notification(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting user notifications: {e}")
            raise
    
    async def update_notification(self, notification_id: str, update_data: NotificationUpdate) -> Optional[Notification]:
        """Update a notification"""
        try:
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"id": notification_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return await self.get_notification(notification_id)
            return None
        except Exception as e:
            logger.error(f"Error updating notification {notification_id}: {e}")
            raise
    
    async def mark_as_read(self, notification_id: str) -> bool:
        """Mark a notification as read"""
        try:
            result = await self.collection.update_one(
                {"id": notification_id},
                {
                    "$set": {
                        "is_read": True,
                        "read_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error marking notification as read {notification_id}: {e}")
            raise
    
    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all unread notifications as read for a user"""
        try:
            result = await self.collection.update_many(
                {
                    "user_id": user_id,
                    "is_read": False,
                    "is_deleted": False
                },
                {
                    "$set": {
                        "is_read": True,
                        "read_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count
        except Exception as e:
            logger.error(f"Error marking all notifications as read for user {user_id}: {e}")
            raise
    
    async def delete_notification(self, notification_id: str) -> bool:
        """Delete a notification (soft delete)"""
        try:
            result = await self.collection.update_one(
                {"id": notification_id},
                {
                    "$set": {
                        "is_deleted": True,
                        "deleted_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error deleting notification {notification_id}: {e}")
            raise
    
    async def clear_all_notifications(self, user_id: str) -> int:
        """Clear all notifications for a user (soft delete)"""
        try:
            result = await self.collection.update_many(
                {
                    "user_id": user_id,
                    "is_deleted": False
                },
                {
                    "$set": {
                        "is_deleted": True,
                        "deleted_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count
        except Exception as e:
            logger.error(f"Error clearing all notifications for user {user_id}: {e}")
            raise
    
    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications for a user"""
        try:
            count = await self.collection.count_documents({
                "user_id": user_id,
                "is_read": False,
                "is_deleted": False
            })
            return count
        except Exception as e:
            logger.error(f"Error getting unread count for user {user_id}: {e}")
            raise
    
    async def get_notification_types(self) -> List[str]:
        """Get all available notification types"""
        try:
            pipeline = [
                {
                    "$match": {
                        "is_deleted": False
                    }
                },
                {
                    "$group": {
                        "_id": "$notification_type"
                    }
                },
                {
                    "$sort": {"_id": 1}
                }
            ]
            
            cursor = self.collection.aggregate(pipeline)
            types = await cursor.to_list(length=None)
            
            return [doc["_id"] for doc in types]
        except Exception as e:
            logger.error(f"Error getting notification types: {e}")
            raise
    
    async def get_user_notification_stats(self, user_id: str) -> NotificationStats:
        """Get notification statistics for a user"""
        try:
            # Get total notifications
            total_notifications = await self.collection.count_documents({
                "user_id": user_id,
                "is_deleted": False
            })
            
            # Get unread notifications
            unread_notifications = await self.collection.count_documents({
                "user_id": user_id,
                "is_read": False,
                "is_deleted": False
            })
            
            # Get read notifications
            read_notifications = await self.collection.count_documents({
                "user_id": user_id,
                "is_read": True,
                "is_deleted": False
            })
            
            # Get deleted notifications
            deleted_notifications = await self.collection.count_documents({
                "user_id": user_id,
                "is_deleted": True
            })
            
            # Get notifications by type
            pipeline_type = [
                {
                    "$match": {
                        "user_id": user_id,
                        "is_deleted": False
                    }
                },
                {
                    "$group": {
                        "_id": "$notification_type",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            type_result = await self.collection.aggregate(pipeline_type).to_list(length=None)
            notifications_by_type = {doc["_id"]: doc["count"] for doc in type_result}
            
            # Get notifications by priority
            pipeline_priority = [
                {
                    "$match": {
                        "user_id": user_id,
                        "is_deleted": False
                    }
                },
                {
                    "$group": {
                        "_id": "$priority",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            priority_result = await self.collection.aggregate(pipeline_priority).to_list(length=None)
            notifications_by_priority = {doc["_id"]: doc["count"] for doc in priority_result}
            
            # Get recent notifications
            recent_notifications = await self.get_user_notifications(user_id, page=1, limit=10)
            
            return NotificationStats(
                total_notifications=total_notifications,
                unread_notifications=unread_notifications,
                read_notifications=read_notifications,
                deleted_notifications=deleted_notifications,
                notifications_by_type=notifications_by_type,
                notifications_by_priority=notifications_by_priority,
                recent_notifications=recent_notifications
            )
        except Exception as e:
            logger.error(f"Error getting user notification stats: {e}")
            raise
    
    async def delete_expired_notifications(self) -> int:
        """Delete expired notifications (hard delete)"""
        try:
            result = await self.collection.delete_many({
                "expires_at": {"$lt": datetime.utcnow()}
            })
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error deleting expired notifications: {e}")
            raise


# CRUD instance
notification_crud = NotificationCRUD(get_database()) 