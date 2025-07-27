"""
Message Models for MEWAYZ V2
Database models for messaging functionality
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from odmantic import Field
from bson import ObjectId
from db.base_class import Base


class MessageBase(BaseModel):
    """Base message model"""
    sender_id: str
    recipient_id: str
    subject: Optional[str] = None
    content: str
    message_type: str = Field(default="text", description="text, image, file, system")
    is_read: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    metadata: Optional[dict] = Field(default_factory=dict)


class MessageCreate(MessageBase):
    """Model for creating a new message"""
    pass


class MessageUpdate(BaseModel):
    """Model for updating a message"""
    subject: Optional[str] = None
    content: Optional[str] = None
    is_read: Optional[bool] = None
    is_deleted: Optional[bool] = None
    metadata: Optional[dict] = None


class Message(MessageBase, Base):
    """Complete message model"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None


class ConversationSummary(BaseModel):
    """Model for conversation summary"""
    other_user_id: str
    other_user_name: str
    other_user_avatar: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
    total_messages: int = 0


class MessageStats(BaseModel):
    """Model for message statistics"""
    total_messages: int = 0
    unread_messages: int = 0
    sent_messages: int = 0
    received_messages: int = 0
    conversations_count: int = 0 