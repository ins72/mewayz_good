"""
Messages API Endpoints for MEWAYZ V2
Provides real messaging functionality instead of mock data
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from models.user import User
from models.messages import Message, MessageCreate, MessageUpdate
from api.deps import get_current_user
from crud.messages import message_crud

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=List[Message])
async def get_user_messages(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    unread_only: bool = Query(False, description="Show only unread messages"),
    current_user: User = Depends(get_current_user)
):
    """Get messages for the current user"""
    try:
        messages = await message_crud.get_user_messages(
            user_id=str(current_user.id),
            page=page,
            limit=limit,
            unread_only=unread_only
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get messages: {str(e)}")


@router.get("/{message_id}", response_model=Message)
async def get_message(
    message_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific message by ID"""
    try:
        message = await message_crud.get_message(message_id)
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        # Check if user has access to this message
        if message.sender_id != str(current_user.id) and message.recipient_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get message: {str(e)}")


@router.post("/", response_model=Message)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user)
):
    """Send a new message"""
    try:
        # Set sender as current user
        message_data.sender_id = str(current_user.id)
        message_data.created_at = datetime.utcnow()
        message_data.updated_at = datetime.utcnow()
        
        message = await message_crud.create_message(message_data)
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")


@router.put("/{message_id}", response_model=Message)
async def update_message(
    message_id: str,
    message_update: MessageUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a message"""
    try:
        # Check if message exists and user owns it
        existing_message = await message_crud.get_message(message_id)
        if not existing_message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        if existing_message.sender_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only update your own messages")
        
        message_update.updated_at = datetime.utcnow()
        message = await message_crud.update_message(message_id, message_update)
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update message: {str(e)}")


@router.put("/{message_id}/read")
async def mark_message_as_read(
    message_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a message as read"""
    try:
        # Check if message exists and user is recipient
        existing_message = await message_crud.get_message(message_id)
        if not existing_message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        if existing_message.recipient_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only mark messages sent to you as read")
        
        await message_crud.mark_as_read(message_id)
        return {"success": True, "message": "Message marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark message as read: {str(e)}")


@router.put("/mark-all-read")
async def mark_all_messages_as_read(
    current_user: User = Depends(get_current_user)
):
    """Mark all unread messages as read"""
    try:
        count = await message_crud.mark_all_as_read(str(current_user.id))
        return {
            "success": True, 
            "message": f"Marked {count} messages as read",
            "count": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark messages as read: {str(e)}")


@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a message"""
    try:
        # Check if message exists and user owns it
        existing_message = await message_crud.get_message(message_id)
        if not existing_message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        if existing_message.sender_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only delete your own messages")
        
        await message_crud.delete_message(message_id)
        return {"success": True, "message": "Message deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete message: {str(e)}")


@router.get("/conversations/", response_model=List[dict])
async def get_conversations(
    current_user: User = Depends(get_current_user)
):
    """Get all conversations for the current user"""
    try:
        conversations = await message_crud.get_conversations(str(current_user.id))
        return conversations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get conversations: {str(e)}")


@router.get("/conversations/{other_user_id}", response_model=List[Message])
async def get_conversation_with_user(
    other_user_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user)
):
    """Get conversation messages with a specific user"""
    try:
        messages = await message_crud.get_conversation_messages(
            user_id=str(current_user.id),
            other_user_id=other_user_id,
            page=page,
            limit=limit
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get conversation: {str(e)}")


@router.get("/unread/count")
async def get_unread_count(
    current_user: User = Depends(get_current_user)
):
    """Get count of unread messages"""
    try:
        count = await message_crud.get_unread_count(str(current_user.id))
        return {"unread_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get unread count: {str(e)}") 