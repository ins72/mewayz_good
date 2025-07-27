"""
Bio Link Models for MEWAYZ V2 Creator Bundle
Extracted and adapted from chroline/lynk project
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from bson import ObjectId
import uuid


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.with_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x))
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)


class BioLinkBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: lambda v: str(v)}


class BioLinkButton(BaseModel):
    """Individual button/link on bio page"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: HttpUrl
    icon: Optional[str] = None  # Icon name or emoji
    color: str = "blue.500"  # Theme color
    style: str = "default"  # default, muted, flat
    size: str = "normal"  # sm, normal, lg
    position: int = 0  # Order position
    is_active: bool = True
    click_count: int = 0
    
    # Style options from Lynk
    dark: bool = False
    muted: bool = False
    flat: bool = False
    left_align: bool = False


class BioLinkTheme(BaseModel):
    """Theme configuration for bio page"""
    primary_color: str = "#3b82f6"
    secondary_color: str = "#1f2937"
    background_color: str = "#ffffff"
    text_color: str = "#111827"
    font_family: str = "Inter"
    background_image: Optional[str] = None
    gradient_enabled: bool = False
    gradient_start: str = "#3b82f6"
    gradient_end: str = "#8b5cf6"


class SocialLink(BaseModel):
    """Social media links"""
    platform: str  # instagram, twitter, linkedin, github, etc.
    username: str
    url: HttpUrl
    icon: str
    is_visible: bool = True


class BioLinkPage(BioLinkBaseModel):
    """Complete bio link page"""
    user_id: str
    
    # Page Settings
    slug: str  # Custom URL slug (mewayz.app/username)
    custom_domain: Optional[str] = None
    title: str
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Content
    buttons: List[BioLinkButton] = []
    social_links: List[SocialLink] = []
    theme: BioLinkTheme = Field(default_factory=BioLinkTheme)
    
    # SEO & Meta
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_image: Optional[str] = None
    
    # Analytics
    view_count: int = 0
    total_clicks: int = 0
    is_published: bool = True
    
    # MEWAYZ Features
    monetization_enabled: bool = False
    subscription_tier: str = "free"  # free, creator, business
    analytics_enabled: bool = False
    
    # Professional Features (Creator Bundle+)
    custom_css: Optional[str] = None
    custom_js: Optional[str] = None
    password_protected: bool = False
    password_hash: Optional[str] = None


class BioLinkPageCreate(BaseModel):
    """Create bio link page request"""
    slug: str
    title: str
    description: Optional[str] = None
    custom_domain: Optional[str] = None


class BioLinkPageUpdate(BaseModel):
    """Update bio link page request"""
    title: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    custom_domain: Optional[str] = None
    theme: Optional[BioLinkTheme] = None
    is_published: Optional[bool] = None
    password_protected: Optional[bool] = None
    custom_css: Optional[str] = None
    custom_js: Optional[str] = None


class BioLinkButtonCreate(BaseModel):
    """Create button request"""
    title: str
    url: HttpUrl
    icon: Optional[str] = None
    color: str = "blue.500"
    style: str = "default"
    size: str = "normal"


class BioLinkButtonUpdate(BaseModel):
    """Update button request"""
    title: Optional[str] = None
    url: Optional[HttpUrl] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    style: Optional[str] = None
    size: Optional[str] = None
    position: Optional[int] = None
    is_active: Optional[bool] = None


class BioLinkAnalytics(BioLinkBaseModel):
    """Analytics for bio link page"""
    bio_page_id: str
    date: datetime = Field(default_factory=datetime.utcnow)
    
    # Daily metrics
    views: int = 0
    unique_views: int = 0
    total_clicks: int = 0
    
    # Button-specific clicks
    button_clicks: Dict[str, int] = {}  # button_id -> click_count
    
    # Referrer data
    referrers: Dict[str, int] = {}  # referrer -> count
    
    # Geographic data (if enabled)
    countries: Dict[str, int] = {}
    cities: Dict[str, int] = {}
    
    # Device data
    devices: Dict[str, int] = {}  # mobile, desktop, tablet
    browsers: Dict[str, int] = {}


class BioLinkTemplate(BioLinkBaseModel):
    """Pre-made templates for bio pages"""
    name: str
    category: str  # personal, business, creator, musician, etc.
    preview_image: str
    theme: BioLinkTheme
    sample_buttons: List[BioLinkButton]
    sample_social_links: List[SocialLink]
    is_premium: bool = False
    price: float = 0.00
    
    # Template metadata
    author_id: Optional[str] = None
    download_count: int = 0
    rating: float = 0.0
    tags: List[str] = []


# Content Creation Models (for Creator Bundle)
class ContentPost(BioLinkBaseModel):
    """Blog posts, articles, or content pieces"""
    user_id: str
    title: str
    slug: str
    content: str  # Markdown or HTML
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    
    # Publishing
    status: str = "draft"  # draft, published, scheduled
    published_at: Optional[datetime] = None
    scheduled_for: Optional[datetime] = None
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    
    # Categories and tags
    category: Optional[str] = None
    tags: List[str] = []
    
    # Analytics
    view_count: int = 0
    like_count: int = 0
    share_count: int = 0
    
    # Monetization
    is_premium: bool = False
    paywall_position: Optional[int] = None


class ContentPostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    status: str = "draft"


class ContentPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    published_at: Optional[datetime] = None