"""
Comment Models for MEWAYZ V2
Database models for commenting functionality
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, validator
from odmantic import Field
from bson import ObjectId
from db.base_class import Base


class CommentBase(BaseModel):
    """Base comment model"""
    user_id: str
    product_id: str
    content: str
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1 to 5")
    parent_id: Optional[str] = None  # For replies to comments
    is_approved: bool = Field(default=True)
    is_deleted: bool = Field(default=False)
    metadata: Optional[dict] = Field(default_factory=dict)

    @validator('content')
    def validate_content(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Comment content cannot be empty')
        if len(v) > 1000:
            raise ValueError('Comment content cannot exceed 1000 characters')
        return v.strip()


class CommentCreate(CommentBase):
    """Model for creating a new comment"""
    pass


class CommentUpdate(BaseModel):
    """Model for updating a comment"""
    content: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_approved: Optional[bool] = None
    is_deleted: Optional[bool] = None
    metadata: Optional[dict] = None

    @validator('content')
    def validate_content(cls, v):
        if v is not None:
            if len(v.strip()) == 0:
                raise ValueError('Comment content cannot be empty')
            if len(v) > 1000:
                raise ValueError('Comment content cannot exceed 1000 characters')
            return v.strip()
        return v


class Comment(CommentBase, Base):
    """Complete comment model"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
    likes_count: int = Field(default=0)
    replies_count: int = Field(default=0)
    user_liked: List[str] = Field(default_factory=list)  # List of user IDs who liked this comment


class CommentWithUser(BaseModel):
    """Comment model with user information"""
    id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    product_id: str
    content: str
    rating: Optional[int] = None
    parent_id: Optional[str] = None
    is_approved: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    likes_count: int
    replies_count: int
    user_liked: List[str]
    metadata: Optional[dict] = None


class CommentStats(BaseModel):
    """Model for comment statistics"""
    total_comments: int = 0
    approved_comments: int = 0
    pending_comments: int = 0
    average_rating: float = 0.0
    rating_distribution: dict = Field(default_factory=dict)  # {1: count, 2: count, ...}
    total_likes: int = 0
    total_replies: int = 0


class CommentReply(BaseModel):
    """Model for comment replies"""
    id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    content: str
    created_at: datetime
    updated_at: datetime
    likes_count: int
    user_liked: List[str] 