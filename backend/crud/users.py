"""
Users CRUD operations for MEWAYZ V2
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models.user import User

logger = logging.getLogger(__name__)


class UserCRUD:
    """CRUD operations for users"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.users
    
    async def create_user(self, user_data: dict) -> User:
        """Create a new user"""
        try:
            user_data["created_at"] = datetime.utcnow()
            user_data["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(user_data)
            user_data["_id"] = result.inserted_id
            
            return User(**user_data)
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise
    
    async def get_user(self, user_id: str) -> Optional[User]:
        """Get a user by ID"""
        try:
            user_dict = await self.collection.find_one({"_id": ObjectId(user_id)})
            if user_dict:
                return User(**user_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        try:
            user_dict = await self.collection.find_one({"email": email})
            if user_dict:
                return User(**user_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting user by email {email}: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Update a user"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_user(user_id)
            return None
        except Exception as e:
            logger.error(f"Error updating user {user_id}: {e}")
            return None
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user"""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting user {user_id}: {e}")
            return False
    
    async def get_all_users(self, limit: Optional[int] = None) -> List[User]:
        """Get all users"""
        try:
            cursor = self.collection.find().sort("created_at", -1)
            
            if limit:
                cursor = cursor.limit(limit)
            
            users = []
            async for user_dict in cursor:
                users.append(User(**user_dict))
            
            return users
        except Exception as e:
            logger.error(f"Error getting all users: {e}")
            return []
    
    async def get_users_count(self) -> int:
        """Get total count of users"""
        try:
            return await self.collection.count_documents({})
        except Exception as e:
            logger.error(f"Error getting users count: {e}")
            return 0
    
    async def search_users(self, query: str, limit: int = 20) -> List[User]:
        """Search users by name or email"""
        try:
            search_filter = {
                "$or": [
                    {"full_name": {"$regex": query, "$options": "i"}},
                    {"email": {"$regex": query, "$options": "i"}}
                ]
            }
            
            cursor = self.collection.find(search_filter).limit(limit)
            users = []
            async for user_dict in cursor:
                users.append(User(**user_dict))
            
            return users
        except Exception as e:
            logger.error(f"Error searching users: {e}")
            return []


# Global instance
user_crud = None

def get_user_crud(db: AsyncIOMotorDatabase) -> UserCRUD:
    """Get user CRUD instance"""
    global user_crud
    if user_crud is None:
        user_crud = UserCRUD(db)
    return user_crud 