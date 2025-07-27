"""
Comments API Endpoints for MEWAYZ V2
Provides real commenting functionality instead of mock data
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from models.user import User
from models.comments import Comment, CommentCreate, CommentUpdate
from api.deps import get_current_user
from crud.comments import comment_crud

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.get("/product/{product_id}", response_model=List[Comment])
async def get_product_comments(
    product_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("created_at", description="Sort by: created_at, rating"),
    sort_order: str = Query("desc", description="Sort order: asc, desc")
):
    """Get comments for a specific product"""
    try:
        comments = await comment_crud.get_product_comments(
            product_id=product_id,
            page=page,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get comments: {str(e)}")


@router.get("/user/{user_id}", response_model=List[Comment])
async def get_user_comments(
    user_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user)
):
    """Get comments by a specific user"""
    try:
        comments = await comment_crud.get_user_comments(
            user_id=user_id,
            page=page,
            limit=limit
        )
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user comments: {str(e)}")


@router.get("/{comment_id}", response_model=Comment)
async def get_comment(
    comment_id: str
):
    """Get a specific comment by ID"""
    try:
        comment = await comment_crud.get_comment(comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        return comment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get comment: {str(e)}")


@router.post("/", response_model=Comment)
async def add_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """Add a new comment"""
    try:
        # Set user as comment author
        comment_data.user_id = str(current_user.id)
        comment_data.created_at = datetime.utcnow()
        comment_data.updated_at = datetime.utcnow()
        
        comment = await comment_crud.create_comment(comment_data)
        return comment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add comment: {str(e)}")


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: str,
    comment_update: CommentUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a comment"""
    try:
        # Check if comment exists and user owns it
        existing_comment = await comment_crud.get_comment(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        if existing_comment.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only update your own comments")
        
        comment_update.updated_at = datetime.utcnow()
        comment = await comment_crud.update_comment(comment_id, comment_update)
        return comment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update comment: {str(e)}")


@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a comment"""
    try:
        # Check if comment exists and user owns it
        existing_comment = await comment_crud.get_comment(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        if existing_comment.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Can only delete your own comments")
        
        await comment_crud.delete_comment(comment_id)
        return {"success": True, "message": "Comment deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete comment: {str(e)}")


@router.post("/{comment_id}/like")
async def like_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Like a comment"""
    try:
        # Check if comment exists
        existing_comment = await comment_crud.get_comment(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        await comment_crud.like_comment(comment_id, str(current_user.id))
        return {"success": True, "message": "Comment liked"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to like comment: {str(e)}")


@router.delete("/{comment_id}/like")
async def unlike_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Unlike a comment"""
    try:
        # Check if comment exists
        existing_comment = await comment_crud.get_comment(comment_id)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        await comment_crud.unlike_comment(comment_id, str(current_user.id))
        return {"success": True, "message": "Comment unliked"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unlike comment: {str(e)}")


@router.post("/{comment_id}/reply")
async def reply_to_comment(
    comment_id: str,
    reply_data: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """Reply to a comment"""
    try:
        # Check if parent comment exists
        parent_comment = await comment_crud.get_comment(comment_id)
        if not parent_comment:
            raise HTTPException(status_code=404, detail="Parent comment not found")
        
        # Set reply data
        reply_data.user_id = str(current_user.id)
        reply_data.parent_id = comment_id
        reply_data.product_id = parent_comment.product_id
        reply_data.created_at = datetime.utcnow()
        reply_data.updated_at = datetime.utcnow()
        
        reply = await comment_crud.create_comment(reply_data)
        return reply
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reply to comment: {str(e)}")


@router.get("/product/{product_id}/replies/{comment_id}", response_model=List[Comment])
async def get_comment_replies(
    product_id: str,
    comment_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get replies to a specific comment"""
    try:
        replies = await comment_crud.get_comment_replies(
            product_id=product_id,
            comment_id=comment_id,
            page=page,
            limit=limit
        )
        return replies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get comment replies: {str(e)}")


@router.get("/product/{product_id}/stats")
async def get_product_comments_stats(
    product_id: str
):
    """Get comment statistics for a product"""
    try:
        stats = await comment_crud.get_product_comments_stats(product_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get comment stats: {str(e)}") 