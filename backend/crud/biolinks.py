"""
Bio Link CRUD Operations for MEWAYZ V2 Creator Bundle
"""

from typing import List, Optional, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from models.biolinks import (
    BioLinkPage, BioLinkPageCreate, BioLinkPageUpdate,
    BioLinkButton, BioLinkButtonCreate, BioLinkButtonUpdate,
    BioLinkAnalytics, BioLinkTemplate, ContentPost, ContentPostCreate, ContentPostUpdate
)
from db.session import get_engine
from datetime import datetime, timedelta
import hashlib
import secrets


class BioLinkCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def create_bio_page(self, user_id: str, page_data: BioLinkPageCreate) -> BioLinkPage:
        """Create a new bio link page"""
        # Check if slug is available
        existing = await self.engine.find_one(BioLinkPage, BioLinkPage.slug == page_data.slug)
        if existing:
            raise ValueError(f"Slug '{page_data.slug}' is already taken")
        
        bio_page = BioLinkPage(
            user_id=user_id,
            **page_data.dict()
        )
        
        await self.engine.save(bio_page)
        return bio_page
    
    async def get_bio_page(self, page_id: str) -> Optional[BioLinkPage]:
        """Get bio page by ID"""
        return await self.engine.find_one(BioLinkPage, BioLinkPage.id == ObjectId(page_id))
    
    async def get_bio_page_by_slug(self, slug: str) -> Optional[BioLinkPage]:
        """Get bio page by slug"""
        return await self.engine.find_one(BioLinkPage, BioLinkPage.slug == slug)
    
    async def get_user_bio_pages(self, user_id: str) -> List[BioLinkPage]:
        """Get all bio pages for a user"""
        return await self.engine.find(BioLinkPage, {"user_id": user_id})
    
    async def update_bio_page(self, page_id: str, page_update: BioLinkPageUpdate) -> Optional[BioLinkPage]:
        """Update bio page"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        update_data = page_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(bio_page, field, value)
        
        await self.engine.save(bio_page)
        return bio_page
    
    async def delete_bio_page(self, page_id: str) -> bool:
        """Delete bio page"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return False
        
        await self.engine.delete(bio_page)
        return True
    
    async def add_button(self, page_id: str, button_data: BioLinkButtonCreate) -> Optional[BioLinkPage]:
        """Add button to bio page"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        # Create button with next position
        max_position = max([btn.position for btn in bio_page.buttons], default=-1)
        button = BioLinkButton(
            **button_data.dict(),
            position=max_position + 1
        )
        
        bio_page.buttons.append(button)
        bio_page.updated_at = datetime.utcnow()
        
        await self.engine.save(bio_page)
        return bio_page
    
    async def update_button(self, page_id: str, button_id: str, button_update: BioLinkButtonUpdate) -> Optional[BioLinkPage]:
        """Update specific button"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        # Find and update button
        for button in bio_page.buttons:
            if button.id == button_id:
                update_data = button_update.dict(exclude_unset=True)
                for field, value in update_data.items():
                    setattr(button, field, value)
                break
        else:
            return None  # Button not found
        
        bio_page.updated_at = datetime.utcnow()
        await self.engine.save(bio_page)
        return bio_page
    
    async def delete_button(self, page_id: str, button_id: str) -> Optional[BioLinkPage]:
        """Delete button from bio page"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        bio_page.buttons = [btn for btn in bio_page.buttons if btn.id != button_id]
        bio_page.updated_at = datetime.utcnow()
        
        await self.engine.save(bio_page)
        return bio_page
    
    async def reorder_buttons(self, page_id: str, button_ids: List[str]) -> Optional[BioLinkPage]:
        """Reorder buttons on bio page"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        # Create a mapping of button_id to button
        button_map = {btn.id: btn for btn in bio_page.buttons}
        
        # Reorder buttons based on provided order
        reordered_buttons = []
        for i, button_id in enumerate(button_ids):
            if button_id in button_map:
                button = button_map[button_id]
                button.position = i
                reordered_buttons.append(button)
        
        bio_page.buttons = reordered_buttons
        bio_page.updated_at = datetime.utcnow()
        
        await self.engine.save(bio_page)
        return bio_page
    
    async def track_page_view(self, page_id: str, referrer: Optional[str] = None) -> BioLinkPage:
        """Track page view for analytics"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        # Increment view count
        bio_page.view_count += 1
        bio_page.updated_at = datetime.utcnow()
        
        await self.engine.save(bio_page)
        
        # Create/update daily analytics
        await self._update_daily_analytics(page_id, "view", referrer)
        
        return bio_page
    
    async def track_button_click(self, page_id: str, button_id: str) -> Optional[BioLinkPage]:
        """Track button click for analytics"""
        bio_page = await self.get_bio_page(page_id)
        if not bio_page:
            return None
        
        # Increment button click count
        for button in bio_page.buttons:
            if button.id == button_id:
                button.click_count += 1
                break
        
        # Increment total clicks
        bio_page.total_clicks += 1
        bio_page.updated_at = datetime.utcnow()
        
        await self.engine.save(bio_page)
        
        # Update daily analytics
        await self._update_daily_analytics(page_id, "click", button_id=button_id)
        
        return bio_page
    
    async def _update_daily_analytics(self, page_id: str, event_type: str, referrer: Optional[str] = None, button_id: Optional[str] = None):
        """Update daily analytics record"""
        today = datetime.utcnow().date()
        
        # Find or create today's analytics record
        analytics = await self.engine.find_one(
            BioLinkAnalytics, 
            {
                "bio_page_id": page_id,
                "date": {"$gte": datetime.combine(today, datetime.min.time())}
            }
        )
        
        if not analytics:
            analytics = BioLinkAnalytics(bio_page_id=page_id)
        
        # Update based on event type
        if event_type == "view":
            analytics.views += 1
            if referrer:
                analytics.referrers[referrer] = analytics.referrers.get(referrer, 0) + 1
        elif event_type == "click":
            analytics.total_clicks += 1
            if button_id:
                analytics.button_clicks[button_id] = analytics.button_clicks.get(button_id, 0) + 1
        
        await self.engine.save(analytics)
    
    async def get_analytics(self, page_id: str, days: int = 30) -> List[BioLinkAnalytics]:
        """Get analytics for bio page"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        return await self.engine.find(
            BioLinkAnalytics,
            {
                "bio_page_id": page_id,
                "date": {"$gte": start_date}
            }
        )
    
    async def search_available_slugs(self, query: str, limit: int = 10) -> List[str]:
        """Search for available slugs"""
        # Generate suggestions based on query
        suggestions = [
            query,
            f"{query}1",
            f"{query}2",
            f"{query}_official",
            f"{query}_page",
            f"my_{query}",
            f"{query}_{secrets.token_hex(3)}"
        ]
        
        available = []
        for suggestion in suggestions:
            existing = await self.engine.find_one(BioLinkPage, BioLinkPage.slug == suggestion)
            if not existing:
                available.append(suggestion)
                if len(available) >= limit:
                    break
        
        return available


class BioLinkTemplatesCRUD:
    def __init__(self):
        self.engine = get_engine()
    
    async def get_templates(self, category: Optional[str] = None) -> List[BioLinkTemplate]:
        """Get bio link templates"""
        filters = {}
        if category:
            filters["category"] = category
        
        return await self.engine.find(BioLinkTemplate, filters)
    
    async def create_template(self, template_data: dict) -> BioLinkTemplate:
        """Create a new template"""
        template = BioLinkTemplate(**template_data)
        await self.engine.save(template)
        return template


class ContentCRUD:
    def __init__(self):
        self.engine = get_engine()
    
    async def create_post(self, user_id: str, post_data: ContentPostCreate) -> ContentPost:
        """Create content post"""
        # Generate slug from title
        slug = post_data.title.lower().replace(" ", "-").replace("'", "")
        
        # Ensure unique slug
        counter = 1
        original_slug = slug
        while await self.engine.find_one(ContentPost, ContentPost.slug == slug):
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        post = ContentPost(
            user_id=user_id,
            slug=slug,
            **post_data.dict()
        )
        
        await self.engine.save(post)
        return post
    
    async def get_user_posts(self, user_id: str, status: Optional[str] = None) -> List[ContentPost]:
        """Get user's content posts"""
        filters = {"user_id": user_id}
        if status:
            filters["status"] = status
        
        return await self.engine.find(ContentPost, filters)
    
    async def get_post_by_slug(self, slug: str) -> Optional[ContentPost]:
        """Get post by slug"""
        return await self.engine.find_one(ContentPost, ContentPost.slug == slug)
    
    async def update_post(self, post_id: str, post_update: ContentPostUpdate) -> Optional[ContentPost]:
        """Update content post"""
        post = await self.engine.find_one(ContentPost, ContentPost.id == ObjectId(post_id))
        if not post:
            return None
        
        update_data = post_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(post, field, value)
        
        await self.engine.save(post)
        return post


# Initialize CRUD instances
biolink_crud = BioLinkCRUD()
template_crud = BioLinkTemplatesCRUD()
content_crud = ContentCRUD()