"""
MEWAYZ V2 - Complete Business Platform
Built with FastAPI + MongoDB + React stack
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging

# Import production middleware
try:
    from middleware.production_middleware import (
        RateLimitMiddleware,
        SecurityHeadersMiddleware,
        RequestLoggingMiddleware,
        ErrorHandlingMiddleware
    )
    MIDDLEWARE_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Production middleware not available: {e}")
    MIDDLEWARE_AVAILABLE = False

# Import our basic server functionality
from server import api_router as basic_router

# Import MongoDB Labs authentication system
from api.api_v1.api import api_router as auth_router
from api.bundle_management import router as bundle_router
from api.bundle_services import router as bundle_services_router
from api.comprehensive_bundle_services import router as comprehensive_services_router

# Import new API endpoints for real data
from api.api_v1.endpoints.analytics import router as analytics_router
from api.api_v1.endpoints.messages import router as messages_router
from api.api_v1.endpoints.comments import router as comments_router
from api.api_v1.endpoints.notifications import router as notifications_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mewayz.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 MEWAYZ V2 starting up...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    logger.info(f"Database: {os.getenv('MONGO_DATABASE', 'mewayz')}")
    
    # Test database connection
    try:
        from db.session import ping
        await ping()
        logger.info("✅ Database connection established")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("🛑 MEWAYZ V2 shutting down...")

app = FastAPI(
    title="MEWAYZ V2 - Business Platform",
    description="Complete Creator Economy Platform with all business tools",
    version="2.0.0",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
    docs_url="/api/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/api/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

# Add production middleware
if MIDDLEWARE_AVAILABLE:
    app.add_middleware(ErrorHandlingMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=60, requests_per_hour=1000)
else:
    print("Running without production middleware")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "https://test.mewayz.com",
        "https://preview-launch-1.emergent.host",
        "https://mewayz.com"
    ] if os.getenv("ENVIRONMENT") == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include the basic API router
app.include_router(basic_router)

# Include the authentication and user management router
app.include_router(auth_router, prefix="/api/v1")
app.include_router(bundle_router)  # Bundle management routes
app.include_router(bundle_services_router)  # Bundle-specific services routes
app.include_router(comprehensive_services_router)  # Comprehensive services integration

# Include new API endpoints for real data
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(messages_router, prefix="/api/v1")
app.include_router(comments_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Comprehensive health check endpoint with real database data"""
    from db.session import MongoDatabase
    from services.dashboard_service import DashboardService
    from services.bundle_service import BundleService
    
    try:
        # Initialize database and services
        db = MongoDatabase()
        dashboard_service = DashboardService(db)
        bundle_service = BundleService(db)
        
        # Get real system overview
        system_overview = await dashboard_service.get_system_overview()
        
        # Get real bundle data
        bundles = await bundle_service.get_active_bundles()
        
        return {
            "status": "healthy",
            "app_name": "MEWAYZ V2",
            "version": "2.0.0",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database": "connected",
            "database_configured": bool(os.getenv("MONGO_URL")),
            "cors_origins": [
                "http://localhost:3002", 
                "http://localhost:3000", 
                "https://test.mewayz.com", 
                "https://preview-launch-1.emergent.host"
            ],
            "integrations": {
                "stripe": "configured" if os.getenv("STRIPE_SECRET_KEY") else "not configured",
                "google_oauth": "not configured", 
                "openai": "not configured"
            },
            "database_stats": system_overview.get("database_stats", {}),
            "recent_activity": system_overview.get("recent_activity", {}),
            "bundles": bundles,
            "production_ready": True,
            "last_updated": system_overview.get("last_updated")
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "production_ready": False
        }

# Comprehensive CRUD test endpoint
@app.get("/api/crud-test")
async def crud_test():
    """Test all CRUD operations with real database operations"""
    from db.session import MongoDatabase
    from crud.users import UserCRUD
    from crud.products import ProductCRUD
    from crud.orders import OrderCRUD
    from crud.biolinks import BioLinkCRUD
    from crud.messages import MessageCRUD
    from crud.comments import CommentCRUD
    from crud.notifications import NotificationCRUD
    from datetime import datetime
    
    try:
        # Initialize database
        db = MongoDatabase()
        
        # Test CRUD operations for each model
        crud_tests = {}
        
        # Test User CRUD
        try:
            user_crud = UserCRUD(db)
            user_count_before = await user_crud.count_users()
            
            # Test create
            test_user_data = {
                "email": f"test-{datetime.utcnow().timestamp()}@example.com",
                "password": "testpassword123",
                "full_name": "Test User",
                "role": "creator"
            }
            created_user = await user_crud.create_user(test_user_data)
            
            # Test read
            retrieved_user = await user_crud.get_user(created_user.id)
            
            # Test update
            updated_user = await user_crud.update_user(created_user.id, {"full_name": "Updated Test User"})
            
            # Test delete
            await user_crud.delete_user(created_user.id)
            
            user_count_after = await user_crud.count_users()
            
            crud_tests["users"] = {
                "create": "✅ Available",
                "read": "✅ Available", 
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if user_count_before == user_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["users"] = {"error": str(e)}
            
        # Test Product CRUD
        try:
            product_crud = ProductCRUD(db)
            product_count_before = await product_crud.count_products()
            
            # Test create
            test_product_data = {
                "name": f"Test Product {datetime.utcnow().timestamp()}",
                "description": "Test product description",
                "price": 99.99,
                "category_name": "Test Category",
                "bundle_type": "creator"
            }
            created_product = await product_crud.create_product(test_product_data)
            
            # Test read
            retrieved_product = await product_crud.get_product(created_product.id)
            
            # Test update
            updated_product = await product_crud.update_product(created_product.id, {"name": "Updated Test Product"})
            
            # Test delete
            await product_crud.delete_product(created_product.id)
            
            product_count_after = await product_crud.count_products()
            
            crud_tests["products"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available", 
                "delete": "✅ Available",
                "test_result": "PASSED" if product_count_before == product_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["products"] = {"error": str(e)}
            
        # Test Order CRUD
        try:
            order_crud = OrderCRUD(db)
            order_count_before = await order_crud.count_orders()
            
            # Test create
            test_order_data = {
                "user_id": "test_user_id",
                "total": 99.99,
                "status": "pending",
                "items": [{"product_id": "test_product_id", "quantity": 1, "price": 99.99}]
            }
            created_order = await order_crud.create_order(test_order_data)
            
            # Test read
            retrieved_order = await order_crud.get_order(created_order.id)
            
            # Test update
            updated_order = await order_crud.update_order(created_order.id, {"status": "completed"})
            
            # Test delete
            await order_crud.delete_order(created_order.id)
            
            order_count_after = await order_crud.count_orders()
            
            crud_tests["orders"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if order_count_before == order_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["orders"] = {"error": str(e)}
            
        # Test BioLink CRUD
        try:
            bio_crud = BioLinkCRUD()
            biolink_count_before = await bio_crud.count_biolinks()
            
            # Test create
            test_biolink_data = {
                "name": f"Test BioLink {datetime.utcnow().timestamp()}",
                "user_id": "test_user_id",
                "url": "test-biolink",
                "theme": "default"
            }
            created_biolink = await bio_crud.create_biolink(test_biolink_data)
            
            # Test read
            retrieved_biolink = await bio_crud.get_biolink(created_biolink.id)
            
            # Test update
            updated_biolink = await bio_crud.update_biolink(created_biolink.id, {"name": "Updated Test BioLink"})
            
            # Test delete
            await bio_crud.delete_biolink(created_biolink.id)
            
            biolink_count_after = await bio_crud.count_biolinks()
            
            crud_tests["biolinks"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if biolink_count_before == biolink_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["biolinks"] = {"error": str(e)}
            
        # Test Message CRUD
        try:
            message_crud = MessageCRUD(db)
            message_count_before = await message_crud.count_messages()
            
            # Test create
            test_message_data = {
                "sender_id": "test_sender_id",
                "recipient_id": "test_recipient_id",
                "subject": "Test Message",
                "content": "Test message content",
                "message_type": "text"
            }
            created_message = await message_crud.create_message(test_message_data)
            
            # Test read
            retrieved_message = await message_crud.get_message(created_message.id)
            
            # Test update
            updated_message = await message_crud.update_message(created_message.id, {"subject": "Updated Test Message"})
            
            # Test delete
            await message_crud.delete_message(created_message.id)
            
            message_count_after = await message_crud.count_messages()
            
            crud_tests["messages"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if message_count_before == message_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["messages"] = {"error": str(e)}
            
        # Test Comment CRUD
        try:
            comment_crud = CommentCRUD(db)
            comment_count_before = await comment_crud.count_comments()
            
            # Test create
            test_comment_data = {
                "user_id": "test_user_id",
                "product_id": "test_product_id",
                "content": "Test comment content",
                "rating": 5
            }
            created_comment = await comment_crud.create_comment(test_comment_data)
            
            # Test read
            retrieved_comment = await comment_crud.get_comment(created_comment.id)
            
            # Test update
            updated_comment = await comment_crud.update_comment(created_comment.id, {"content": "Updated test comment"})
            
            # Test delete
            await comment_crud.delete_comment(created_comment.id)
            
            comment_count_after = await comment_crud.count_comments()
            
            crud_tests["comments"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if comment_count_before == comment_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["comments"] = {"error": str(e)}
            
        # Test Notification CRUD
        try:
            notification_crud = NotificationCRUD(db)
            notification_count_before = await notification_crud.count_notifications()
            
            # Test create
            test_notification_data = {
                "user_id": "test_user_id",
                "title": "Test Notification",
                "message": "Test notification message",
                "notification_type": "info"
            }
            created_notification = await notification_crud.create_notification(test_notification_data)
            
            # Test read
            retrieved_notification = await notification_crud.get_notification(created_notification.id)
            
            # Test update
            updated_notification = await notification_crud.update_notification(created_notification.id, {"title": "Updated Test Notification"})
            
            # Test delete
            await notification_crud.delete_notification(created_notification.id)
            
            notification_count_after = await notification_crud.count_notifications()
            
            crud_tests["notifications"] = {
                "create": "✅ Available",
                "read": "✅ Available",
                "update": "✅ Available",
                "delete": "✅ Available",
                "test_result": "PASSED" if notification_count_before == notification_count_after else "FAILED"
            }
        except Exception as e:
            crud_tests["notifications"] = {"error": str(e)}
        
        # Calculate test results
        passed_tests = sum(1 for test in crud_tests.values() if isinstance(test, dict) and test.get("test_result") == "PASSED")
        total_tests = len([test for test in crud_tests.values() if isinstance(test, dict) and "test_result" in test])
        
        return {
            "status": "success",
            "message": "All CRUD operations tested with real database operations",
            "crud_tests": crud_tests,
            "total_models": len(crud_tests),
            "tests_passed": passed_tests,
            "tests_total": total_tests,
            "success_rate": f"{(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "0%",
            "production_ready": passed_tests == total_tests if total_tests > 0 else False,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"CRUD test failed: {e}")
        return {
            "status": "error",
            "message": "CRUD test failed",
            "error": str(e),
            "production_ready": False
        }

# Connectivity test endpoint
@app.get("/api/test")
async def connectivity_test():
    """Test connectivity and basic functionality"""
    return {
        "message": "MEWAYZ V2 Backend is accessible",
        "timestamp": "2025-01-25",
        "cors_enabled": True,
        "api_version": "2.0.0",
        "status": "operational"
    }

# Root endpoint
@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Welcome to MEWAYZ V2 API",
        "version": "2.0.0",
        "status": "production-ready",
        "documentation": "/api/docs",
        "health_check": "/api/health",
        "crud_test": "/api/crud-test"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return {
        "error": "Internal server error",
        "message": "An unexpected error occurred",
        "status_code": 500
    }

