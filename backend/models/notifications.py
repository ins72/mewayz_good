"""
Notification Models for MEWAYZ V2
Database models for notification functionality
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from odmantic import Field
from bson import ObjectId
from db.base_class import Base


class NotificationBase(BaseModel):
    """Base notification model"""
    user_id: str
    title: str
    message: str
    notification_type: str = Field(description="order, product, message, system, payment, etc.")
    priority: str = Field(default="normal", description="low, normal, high, urgent")
    is_read: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    action_url: Optional[str] = None  # URL to navigate to when notification is clicked
    action_data: Optional[Dict[str, Any]] = Field(default_factory=dict)  # Additional data for the action
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class NotificationCreate(NotificationBase):
    """Model for creating a new notification"""
    pass


class NotificationUpdate(BaseModel):
    """Model for updating a notification"""
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None
    is_deleted: Optional[bool] = None
    action_url: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None


class Notification(NotificationBase, Base):
    """Complete notification model"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None  # Optional expiration date


class NotificationWithUser(BaseModel):
    """Notification model with user information"""
    id: str
    user_id: str
    user_name: str
    user_email: str
    title: str
    message: str
    notification_type: str
    priority: str
    is_read: bool
    is_deleted: bool
    action_url: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    read_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None


class NotificationStats(BaseModel):
    """Model for notification statistics"""
    total_notifications: int = 0
    unread_notifications: int = 0
    read_notifications: int = 0
    deleted_notifications: int = 0
    notifications_by_type: Dict[str, int] = Field(default_factory=dict)
    notifications_by_priority: Dict[str, int] = Field(default_factory=dict)
    recent_notifications: List[Notification] = Field(default_factory=list)


class NotificationTemplate(BaseModel):
    """Model for notification templates"""
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    title_template: str
    message_template: str
    notification_type: str
    priority: str = "normal"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationPreferences(BaseModel):
    """Model for user notification preferences"""
    user_id: str
    email_notifications: bool = True
    push_notifications: bool = True
    sms_notifications: bool = False
    notification_types: Dict[str, bool] = Field(default_factory=dict)  # {type: enabled}
    quiet_hours_start: Optional[str] = None  # "22:00"
    quiet_hours_end: Optional[str] = None    # "08:00"
    timezone: str = "UTC"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationBulkCreate(BaseModel):
    """Model for bulk notification creation"""
    user_ids: List[str]
    title: str
    message: str
    notification_type: str = "system"
    priority: str = "normal"
    action_url: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None
    expires_at: Optional[datetime] = None 