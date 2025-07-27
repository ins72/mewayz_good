"""
Notifications API Endpoints for MEWAYZ V2
Provides real notification functionality instead of mock data
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from models.user import User
from models.notifications import Notification, NotificationCreate, NotificationUpdate
from api.deps import get_current_user
from crud.notifications import notification_crud

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[Notification])
async def get_user_notifications(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    unread_only: bool = Query(False, description="Show only unread notifications"),
    type_filter: Optional[str] = Query(None, description="Filter by notification type"),
    current_user: User = Depends(get_current_user)
):
    """Get notifications for the current user"""
    try:
        notifications = await notification_crud.get_user_notifications(
            user_id=str(current_user.id),
            page=page,
            limit=limit,
            unread_only=unread_only,
            type_filter=type_filter
        )
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get notifications: {str(e)}")


@router.get("/{notification_id}", response_model=Notification)
async def get_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific notification by ID"""
    try:
        notification = await notification_crud.get_notification(notification_id)
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        # Check if user owns this notification
        if notification.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return notification
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get notification: {str(e)}")


@router.post("/", response_model=Notification)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new notification (admin/system use)"""
    try:
        # Set creation timestamp
        notification_data.created_at = datetime.utcnow()
        notification_data.updated_at = datetime.utcnow()
        
        notification = await notification_crud.create_notification(notification_data)
        return notification
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create notification: {str(e)}")


@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    notification_id: str,
    notification_update: NotificationUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a notification"""
    try:
        # Check if notification exists and user owns it
        existing_notification = await notification_crud.get_notification(notification_id)
        if not existing_notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        if existing_notification.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only update your own notifications")
        
        notification_update.updated_at = datetime.utcnow()
        notification = await notification_crud.update_notification(notification_id, notification_update)
        return notification
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update notification: {str(e)}")


@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
    try:
        # Check if notification exists and user owns it
        existing_notification = await notification_crud.get_notification(notification_id)
        if not existing_notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        if existing_notification.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only mark your own notifications as read")
        
        await notification_crud.mark_as_read(notification_id)
        return {"success": True, "message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark notification as read: {str(e)}")


@router.put("/mark-all-read")
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user)
):
    """Mark all unread notifications as read"""
    try:
        count = await notification_crud.mark_all_as_read(str(current_user.id))
        return {
            "success": True, 
            "message": f"Marked {count} notifications as read",
            "count": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark notifications as read: {str(e)}")


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a notification"""
    try:
        # Check if notification exists and user owns it
        existing_notification = await notification_crud.get_notification(notification_id)
        if not existing_notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        if existing_notification.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only delete your own notifications")
        
        await notification_crud.delete_notification(notification_id)
        return {"success": True, "message": "Notification deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete notification: {str(e)}")


@router.delete("/clear-all")
async def clear_all_notifications(
    current_user: User = Depends(get_current_user)
):
    """Clear all notifications for the current user"""
    try:
        count = await notification_crud.clear_all_notifications(str(current_user.id))
        return {
            "success": True, 
            "message": f"Cleared {count} notifications",
            "count": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear notifications: {str(e)}")


@router.get("/unread/count")
async def get_unread_count(
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications"""
    try:
        count = await notification_crud.get_unread_count(str(current_user.id))
        return {"unread_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get unread count: {str(e)}")


@router.get("/types/", response_model=List[str])
async def get_notification_types():
    """Get all available notification types"""
    try:
        types = await notification_crud.get_notification_types()
        return types
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get notification types: {str(e)}")


@router.post("/bulk-create")
async def create_bulk_notifications(
    notifications_data: List[NotificationCreate],
    current_user: User = Depends(get_current_user)
):
    """Create multiple notifications at once (admin/system use)"""
    try:
        # Set creation timestamps for all notifications
        for notification in notifications_data:
            notification.created_at = datetime.utcnow()
            notification.updated_at = datetime.utcnow()
        
        created_notifications = await notification_crud.create_bulk_notifications(notifications_data)
        return {
            "success": True,
            "message": f"Created {len(created_notifications)} notifications",
            "count": len(created_notifications),
            "notifications": created_notifications
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create bulk notifications: {str(e)}")


@router.get("/stats/summary")
async def get_notification_stats(
    current_user: User = Depends(get_current_user)
):
    """Get notification statistics for the current user"""
    try:
        stats = await notification_crud.get_user_notification_stats(str(current_user.id))
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get notification stats: {str(e)}") 