"""
Comments CRUD Operations for MEWAYZ V2
Database operations for commenting functionality
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from db.base import get_database
from models.comments import Comment, CommentCreate, CommentUpdate, CommentStats

logger = logging.getLogger(__name__)


class CommentCRUD:
    """CRUD operations for comments"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.comments
    
    async def create_comment(self, comment_data: CommentCreate) -> Comment:
        """Create a new comment"""
        try:
            comment_dict = comment_data.dict()
            comment_dict["id"] = str(ObjectId())
            comment_dict["created_at"] = datetime.utcnow()
            comment_dict["updated_at"] = datetime.utcnow()
            comment_dict["likes_count"] = 0
            comment_dict["replies_count"] = 0
            comment_dict["user_liked"] = []
            
            result = await self.collection.insert_one(comment_dict)
            if result.inserted_id:
                return Comment(**comment_dict)
            else:
                raise Exception("Failed to create comment")
        except Exception as e:
            logger.error(f"Error creating comment: {e}")
            raise
    
    async def get_comment(self, comment_id: str) -> Optional[Comment]:
        """Get a comment by ID"""
        try:
            doc = await self.collection.find_one({"id": comment_id, "is_deleted": False})
            if doc:
                return Comment(**doc)
            return None
        except Exception as e:
            logger.error(f"Error getting comment {comment_id}: {e}")
            raise
    
    async def get_product_comments(
        self, 
        product_id: str, 
        page: int = 1, 
        limit: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> List[Comment]:
        """Get comments for a product"""
        try:
            skip = (page - 1) * limit
            
            # Build sort criteria
            sort_direction = -1 if sort_order == "desc" else 1
            sort_criteria = [(sort_by, sort_direction)]
            
            query = {
                "product_id": product_id,
                "parent_id": None,  # Only top-level comments
                "is_deleted": False,
                "is_approved": True
            }
            
            cursor = self.collection.find(query).sort(sort_criteria).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Comment(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting product comments: {e}")
            raise
    
    async def get_user_comments(
        self, 
        user_id: str, 
        page: int = 1, 
        limit: int = 20
    ) -> List[Comment]:
        """Get comments by a specific user"""
        try:
            skip = (page - 1) * limit
            
            query = {
                "user_id": user_id,
                "is_deleted": False
            }
            
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Comment(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting user comments: {e}")
            raise
    
    async def update_comment(self, comment_id: str, update_data: CommentUpdate) -> Optional[Comment]:
        """Update a comment"""
        try:
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"id": comment_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return await self.get_comment(comment_id)
            return None
        except Exception as e:
            logger.error(f"Error updating comment {comment_id}: {e}")
            raise
    
    async def delete_comment(self, comment_id: str) -> bool:
        """Delete a comment (soft delete)"""
        try:
            result = await self.collection.update_one(
                {"id": comment_id},
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
            logger.error(f"Error deleting comment {comment_id}: {e}")
            raise
    
    async def like_comment(self, comment_id: str, user_id: str) -> bool:
        """Like a comment"""
        try:
            # Check if user already liked the comment
            comment = await self.get_comment(comment_id)
            if not comment:
                return False
            
            if user_id in comment.user_liked:
                return True  # Already liked
            
            result = await self.collection.update_one(
                {"id": comment_id},
                {
                    "$push": {"user_liked": user_id},
                    "$inc": {"likes_count": 1},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error liking comment {comment_id}: {e}")
            raise
    
    async def unlike_comment(self, comment_id: str, user_id: str) -> bool:
        """Unlike a comment"""
        try:
            # Check if user liked the comment
            comment = await self.get_comment(comment_id)
            if not comment:
                return False
            
            if user_id not in comment.user_liked:
                return True  # Already not liked
            
            result = await self.collection.update_one(
                {"id": comment_id},
                {
                    "$pull": {"user_liked": user_id},
                    "$inc": {"likes_count": -1},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error unliking comment {comment_id}: {e}")
            raise
    
    async def get_comment_replies(
        self, 
        product_id: str,
        comment_id: str, 
        page: int = 1, 
        limit: int = 20
    ) -> List[Comment]:
        """Get replies to a specific comment"""
        try:
            skip = (page - 1) * limit
            
            query = {
                "product_id": product_id,
                "parent_id": comment_id,
                "is_deleted": False,
                "is_approved": True
            }
            
            cursor = self.collection.find(query).sort("created_at", 1).skip(skip).limit(limit)
            docs = await cursor.to_list(length=limit)
            
            return [Comment(**doc) for doc in docs]
        except Exception as e:
            logger.error(f"Error getting comment replies: {e}")
            raise
    
    async def get_product_comments_stats(self, product_id: str) -> CommentStats:
        """Get comment statistics for a product"""
        try:
            # Get total comments
            total_comments = await self.collection.count_documents({
                "product_id": product_id,
                "is_deleted": False
            })
            
            # Get approved comments
            approved_comments = await self.collection.count_documents({
                "product_id": product_id,
                "is_deleted": False,
                "is_approved": True
            })
            
            # Get pending comments
            pending_comments = await self.collection.count_documents({
                "product_id": product_id,
                "is_deleted": False,
                "is_approved": False
            })
            
            # Calculate average rating
            pipeline = [
                {
                    "$match": {
                        "product_id": product_id,
                        "is_deleted": False,
                        "is_approved": True,
                        "rating": {"$exists": True, "$ne": None}
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "average_rating": {"$avg": "$rating"},
                        "rating_distribution": {
                            "$push": "$rating"
                        }
                    }
                }
            ]
            
            rating_result = await self.collection.aggregate(pipeline).to_list(length=1)
            average_rating = 0.0
            rating_distribution = {}
            
            if rating_result:
                average_rating = rating_result[0].get("average_rating", 0.0)
                ratings = rating_result[0].get("rating_distribution", [])
                for rating in ratings:
                    rating_distribution[rating] = rating_distribution.get(rating, 0) + 1
            
            # Get total likes
            pipeline_likes = [
                {
                    "$match": {
                        "product_id": product_id,
                        "is_deleted": False
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "total_likes": {"$sum": "$likes_count"},
                        "total_replies": {"$sum": "$replies_count"}
                    }
                }
            ]
            
            likes_result = await self.collection.aggregate(pipeline_likes).to_list(length=1)
            total_likes = 0
            total_replies = 0
            
            if likes_result:
                total_likes = likes_result[0].get("total_likes", 0)
                total_replies = likes_result[0].get("total_replies", 0)
            
            return CommentStats(
                total_comments=total_comments,
                approved_comments=approved_comments,
                pending_comments=pending_comments,
                average_rating=average_rating,
                rating_distribution=rating_distribution,
                total_likes=total_likes,
                total_replies=total_replies
            )
        except Exception as e:
            logger.error(f"Error getting product comments stats: {e}")
            raise


# CRUD instance
comment_crud = CommentCRUD(get_database()) 