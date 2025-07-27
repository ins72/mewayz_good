"""
Messages CRUD Operations for MEWAYZ V2
Database operations for messaging functionality
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from db.base import get_database
from models.messages import Message, MessageCreate, MessageUpdate, ConversationSummary

logger = logging.getLogger(__name__)


class MessageCRUD:
    """CRUD operations for messages"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.messages
    
    async def create_message(self, message_data: MessageCreate) -> Message:
        """Create a new message"""
        try:
            message_dict = message_data.dict()
            message_dict["id"] = str(ObjectId())
            message_dict["created_at"] = datetime.utcnow()
            message_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(message_dict)
            if result.inserted_id:
                return Message(**message_dict)
            else:
                raise Exception("Failed to create message")
        except Exception as e:
            logger.error(f"Error creating message: {e}")
            raise
    
    async def get_message(self, message_id: str) -> Optional[Message]:
        """Get a message by ID"""
        try:
            doc = await self.collection.find_one({"id": message_id})
            if doc:
                return Message(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting message {message_id}: {e}")
            raise
    
    async def get_user_messages(
        self, 
        user_id: str, 
        page: int = 1, 
        limit: int = 20,
        unread_only: bool = False
    ) -> List[Message]:
        """Get messages for a user"""
        try:
            skip = (page - 1) * limit
            
            # Build query
            query = {
                "$or": [
                    {"sender_id": user_id},
                    {"recipient_id": user_id}
                ],
                "is_deleted": False
            }
            
            if unread_only:
                query["is_read"] = False
                query["recipient_id"] = user_id  # Only unread messages received by user
            
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Message(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting user messages: {e}")
            raise
    
    async def update_message(self, message_id: str, update_data: MessageUpdate) -> Optional[Message]:
        """Update a message"""
        try:
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"id": message_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return await self.get_message(message_id)
            return None
        except Exception as e:
            logger.error(f"Error updating message {message_id}: {e}")
            raise
    
    async def mark_as_read(self, message_id: str) -> bool:
        """Mark a message as read"""
        try:
            result = await self.collection.update_one(
                {"id": message_id},
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
            logger.error(f"Error marking message as read {message_id}: {e}")
            raise
    
    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all unread messages as read for a user"""
        try:
            result = await self.collection.update_many(
                {
                    "recipient_id": user_id,
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
            logger.error(f"Error marking all messages as read for user {user_id}: {e}")
            raise
    
    async def delete_message(self, message_id: str) -> bool:
        """Delete a message (soft delete)"""
        try:
            result = await self.collection.update_one(
                {"id": message_id},
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
            logger.error(f"Error deleting message {message_id}: {e}")
            raise
    
    async def get_conversations(self, user_id: str) -> List[ConversationSummary]:
        """Get conversation summaries for a user"""
        try:
            # Get all conversations where user is involved
            pipeline = [
                {
                    "$match": {
                        "$or": [
                            {"sender_id": user_id},
                            {"recipient_id": user_id}
                        ],
                        "is_deleted": False
                    }
                },
                {
                    "$addFields": {
                        "other_user": {
                            "$cond": {
                                "if": {"$eq": ["$sender_id", user_id]},
                                "then": "$recipient_id",
                                "else": "$sender_id"
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$other_user",
                        "last_message": {"$first": "$content"},
                        "last_message_time": {"$first": "$created_at"},
                        "unread_count": {
                            "$sum": {
                                "$cond": [
                                    {
                                        "$and": [
                                            {"$eq": ["$recipient_id", user_id]},
                                            {"$eq": ["$is_read", False]}
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        "total_messages": {"$sum": 1}
                    }
                },
                {
                    "$sort": {"last_message_time": -1}
                }
            ]
            
            cursor = self.collection.aggregate(pipeline)
            conversations = await cursor.to_list(length=None)
            
            # Convert to ConversationSummary objects
            result = []
            for conv in conversations:
                # Get user info for other_user (simplified - would need user lookup)
                result.append(ConversationSummary(
                    other_user_id=conv["_id"],
                    other_user_name=f"User {conv['_id'][:8]}",  # Simplified
                    other_user_avatar=None,
                    last_message=conv["last_message"],
                    last_message_time=conv["last_message_time"],
                    unread_count=conv["unread_count"],
                    total_messages=conv["total_messages"]
                ))
            
            return result
        except Exception as e:
            logger.error(f"Error getting conversations for user {user_id}: {e}")
            raise
    
    async def get_conversation_messages(
        self, 
        user_id: str, 
        other_user_id: str,
        page: int = 1,
        limit: int = 20
    ) -> List[Message]:
        """Get messages between two users"""
        try:
            skip = (page - 1) * limit
            
            query = {
                "$or": [
                    {
                        "$and": [
                            {"sender_id": user_id},
                            {"recipient_id": other_user_id}
                        ]
                    },
                    {
                        "$and": [
                            {"sender_id": other_user_id},
                            {"recipient_id": user_id}
                        ]
                    }
                ],
                "is_deleted": False
            }
            
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Message(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting conversation messages: {e}")
            raise
    
    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread messages for a user"""
        try:
            count = await self.collection.count_documents({
                "recipient_id": user_id,
                "is_read": False,
                "is_deleted": False
            })
            return count
        except Exception as e:
            logger.error(f"Error getting unread count for user {user_id}: {e}")
            raise


# CRUD instance
message_crud = MessageCRUD(get_database()) 