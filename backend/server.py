from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'mewayz')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# Basic endpoints
@api_router.get("/")
async def root():
    return {
        "message": "Welcome to MEWAYZ V2 - Complete Business Platform",
        "version": "2.0.0",
        "status": "ready for deployment",
        "features": [
            "E-commerce Platform with Multi-vendor Support",
            "Stripe Payment Integration (Live Keys Configured)",
            "MEWAYZ Bundle Subscriptions with Multi-bundle Discounts",
            "Creator Tools & Bio Links (NEW!)",
            "Content Creation Platform (NEW!)",
            "Business Management Suite",
            "MongoDB Labs Foundation"
        ]
    }

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": "MEWAYZ V2",
        "version": "2.0.0",
        "database": "connected",
        "integrations": {
            "stripe": "configured" if os.environ.get("STRIPE_SECRET_KEY") else "not configured",
            "google_oauth": "configured" if os.environ.get("GOOGLE_CLIENT_ID") else "not configured",
            "openai": "configured" if os.environ.get("OPENAI_API_KEY") else "not configured"
        },
        "bundles": {
            "creator": "✅ Bio Links + Content Creation",
            "ecommerce": "✅ Multi-vendor Marketplace", 
            "social_media": "⏳ Coming Next",
            "education": "⏳ Coming Soon",
            "business": "⏳ Coming Soon",
            "operations": "⏳ Coming Soon"
        }
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# MEWAYZ Bundle Pricing Information (Database-Driven)
@api_router.get("/bundles/pricing")
async def get_mewayz_bundles():
    """Get MEWAYZ bundle pricing with real database statistics"""
    from services.bundle_service import BundleService
    from db.session import MongoDatabase
    
    try:
        # Initialize database and service
        db = MongoDatabase()
        bundle_service = BundleService(db)
        
        # Get real bundle pricing with database statistics
        bundle_pricing = await bundle_service.get_bundle_pricing()
        
        return bundle_pricing
        
    except Exception as e:
        logger.error(f"Error getting bundle pricing: {e}")
        # Return fallback data if database is unavailable
        return {
            "bundles": {
                "creator": {
                    "name": "CREATOR",
                    "price": 19,
                    "status": "✅ AVAILABLE",
                    "features": ["Bio Links", "Content Creation", "Analytics"]
                },
                "ecommerce": {
                    "name": "E-COMMERCE", 
                    "price": 24,
                    "status": "✅ AVAILABLE",
                    "features": ["Online Store", "Payment Processing", "Inventory"]
                }
            },
            "discounts": {"2_bundles": 0.20, "3_bundles": 0.30, "4_plus_bundles": 0.40},
            "enterprise": {"name": "ENTERPRISE", "revenue_share": 0.15, "minimum_monthly": 99},
            "error": "Database temporarily unavailable"
        }

# Creator Bundle Quick Access (NEW!)
@api_router.get("/creator/quick-demo")
async def creator_bundle_demo():
    """Demo endpoints for Creator Bundle features"""
    return {
        "message": "🎨 CREATOR BUNDLE ($19/month) - Now Available!",
        "features": {
            "bio_links": {
                "description": "Professional bio link pages with custom domains",
                "demo_url": "/api/creator/templates",
                "example": "mewayz.app/your-username"
            },
            "content_creation": {
                "description": "Blog posts, articles, and content management",
                "demo_url": "/api/creator/content",
                "features": ["Markdown editor", "SEO optimization", "Analytics"]
            },
            "analytics": {
                "description": "Track views, clicks, and engagement",
                "features": ["Real-time stats", "Referrer tracking", "Button performance"]
            }
        },
        "getting_started": {
            "step_1": "POST /api/creator/bio-pages - Create your bio page",
            "step_2": "POST /api/creator/bio-pages/{id}/buttons - Add buttons",
            "step_3": "Visit /api/creator/p/{slug} - View your page"
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
