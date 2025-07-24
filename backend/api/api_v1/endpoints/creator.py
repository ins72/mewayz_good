"""
Bio Link API Endpoints for MEWAYZ V2 Creator Bundle
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status, Request
from models.biolinks import (
    BioLinkPage, BioLinkPageCreate, BioLinkPageUpdate,
    BioLinkButton, BioLinkButtonCreate, BioLinkButtonUpdate,
    BioLinkAnalytics, BioLinkTemplate, ContentPost, ContentPostCreate, ContentPostUpdate
)
from crud.biolinks import biolink_crud, template_crud, content_crud
from api.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/creator", tags=["Creator Bundle"])


# ===== BIO LINK PAGES =====
@router.post("/bio-pages", response_model=BioLinkPage)
async def create_bio_page(
    page_data: BioLinkPageCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new bio link page"""
    try:
        bio_page = await biolink_crud.create_bio_page(str(current_user.id), page_data)
        return bio_page
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bio-pages", response_model=List[BioLinkPage])
async def get_my_bio_pages(current_user: User = Depends(get_current_user)):
    """Get current user's bio pages"""
    return await biolink_crud.get_user_bio_pages(str(current_user.id))


@router.get("/bio-pages/{page_id}", response_model=BioLinkPage)
async def get_bio_page(
    page_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get bio page by ID"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id) and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    return bio_page


@router.put("/bio-pages/{page_id}", response_model=BioLinkPage)
async def update_bio_page(
    page_id: str,
    page_update: BioLinkPageUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id) and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    updated_page = await biolink_crud.update_bio_page(page_id, page_update)
    return updated_page


@router.delete("/bio-pages/{page_id}")
async def delete_bio_page(
    page_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id) and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    success = await biolink_crud.delete_bio_page(page_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    return {"message": "Bio page deleted successfully"}


# ===== PUBLIC BIO PAGE ACCESS =====
@router.get("/p/{slug}", response_model=BioLinkPage)
async def get_public_bio_page(slug: str, request: Request):
    """Get public bio page by slug (for visitors)"""
    bio_page = await biolink_crud.get_bio_page_by_slug(slug)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    if not bio_page.is_published:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Track page view
    referrer = request.headers.get("referer")
    await biolink_crud.track_page_view(str(bio_page.id), referrer)
    
    return bio_page


@router.post("/p/{slug}/click/{button_id}")
async def track_button_click(slug: str, button_id: str):
    """Track button click (for analytics)"""
    bio_page = await biolink_crud.get_bio_page_by_slug(slug)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    await biolink_crud.track_button_click(str(bio_page.id), button_id)
    return {"message": "Click tracked"}


# ===== BUTTONS MANAGEMENT =====
@router.post("/bio-pages/{page_id}/buttons", response_model=BioLinkPage)
async def add_button(
    page_id: str,
    button_data: BioLinkButtonCreate,
    current_user: User = Depends(get_current_user)
):
    """Add button to bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    updated_page = await biolink_crud.add_button(page_id, button_data)
    return updated_page


@router.put("/bio-pages/{page_id}/buttons/{button_id}", response_model=BioLinkPage)
async def update_button(
    page_id: str,
    button_id: str,
    button_update: BioLinkButtonUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update specific button"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    updated_page = await biolink_crud.update_button(page_id, button_id, button_update)
    if not updated_page:
        raise HTTPException(status_code=404, detail="Button not found")
    
    return updated_page


@router.delete("/bio-pages/{page_id}/buttons/{button_id}")
async def delete_button(
    page_id: str,
    button_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete button from bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    updated_page = await biolink_crud.delete_button(page_id, button_id)
    return {"message": "Button deleted successfully"}


@router.put("/bio-pages/{page_id}/buttons/reorder")
async def reorder_buttons(
    page_id: str,
    button_ids: List[str],
    current_user: User = Depends(get_current_user)
):
    """Reorder buttons on bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    updated_page = await biolink_crud.reorder_buttons(page_id, button_ids)
    return updated_page


# ===== ANALYTICS =====
@router.get("/bio-pages/{page_id}/analytics", response_model=List[BioLinkAnalytics])
async def get_bio_page_analytics(
    page_id: str,
    days: int = 30,
    current_user: User = Depends(get_current_user)
):
    """Get analytics for bio page"""
    bio_page = await biolink_crud.get_bio_page(page_id)
    if not bio_page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    
    # Check ownership
    if bio_page.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    # Check if user has analytics enabled (Creator Bundle+)
    if bio_page.subscription_tier == "free":
        raise HTTPException(status_code=403, detail="Upgrade to Creator Bundle for analytics")
    
    return await biolink_crud.get_analytics(page_id, days)


# ===== TEMPLATES =====
@router.get("/templates", response_model=List[BioLinkTemplate])
async def get_bio_templates(category: Optional[str] = None):
    """Get bio link templates"""
    return await template_crud.get_templates(category)


# ===== SLUG AVAILABILITY =====
@router.get("/slugs/check/{slug}")
async def check_slug_availability(slug: str):
    """Check if slug is available"""
    existing = await biolink_crud.get_bio_page_by_slug(slug)
    return {
        "slug": slug,
        "available": existing is None,
        "suggestions": await biolink_crud.search_available_slugs(slug) if existing else []
    }


# ===== CONTENT CREATION =====
@router.post("/content", response_model=ContentPost)
async def create_content_post(
    post_data: ContentPostCreate,
    current_user: User = Depends(get_current_user)
):
    """Create content post"""
    return await content_crud.create_post(str(current_user.id), post_data)


@router.get("/content", response_model=List[ContentPost])
async def get_my_content(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get user's content posts"""
    return await content_crud.get_user_posts(str(current_user.id), status)


@router.get("/content/{slug}", response_model=ContentPost)
async def get_content_by_slug(slug: str):
    """Get published content by slug"""
    post = await content_crud.get_post_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="Content not found")
    
    if post.status != "published":
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Track view
    post.view_count += 1
    await content_crud.update_post(str(post.id), ContentPostUpdate())
    
    return post


@router.put("/content/{post_id}", response_model=ContentPost)
async def update_content_post(
    post_id: str,
    post_update: ContentPostUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update content post"""
    post = await content_crud.get_post_by_slug("dummy")  # Get by ID instead
    # Note: This needs to be fixed to get by ID
    
    updated_post = await content_crud.update_post(post_id, post_update)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return updated_post


# ===== CREATOR DASHBOARD =====
@router.get("/dashboard")
async def get_creator_dashboard(current_user: User = Depends(get_current_user)):
    """Get creator dashboard statistics"""
    bio_pages = await biolink_crud.get_user_bio_pages(str(current_user.id))
    content_posts = await content_crud.get_user_posts(str(current_user.id))
    
    # Calculate totals
    total_views = sum(page.view_count for page in bio_pages)
    total_clicks = sum(page.total_clicks for page in bio_pages)
    published_content = len([post for post in content_posts if post.status == "published"])
    
    return {
        "bio_pages": {
            "total": len(bio_pages),
            "published": len([page for page in bio_pages if page.is_published]),
            "total_views": total_views,
            "total_clicks": total_clicks
        },
        "content": {
            "total_posts": len(content_posts),
            "published": published_content,
            "drafts": len([post for post in content_posts if post.status == "draft"])
        },
        "recent_bio_pages": bio_pages[:5],  # Recent 5
        "recent_content": content_posts[:5]  # Recent 5
    }