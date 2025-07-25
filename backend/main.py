"""
MEWAYZ V2 - Complete Business Platform
Built with FastAPI + MongoDB + React stack
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

# Import our basic server functionality
from server import api_router as basic_router

# Import MongoDB Labs authentication system
from api.api_v1.api import api_router as auth_router
from api.bundle_management import router as bundle_router
from api.bundle_services import router as bundle_services_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("MEWAYZ V2 starting up...")
    yield
    # Shutdown
    print("MEWAYZ V2 shutting down...")


app = FastAPI(
    title="MEWAYZ V2 - Business Platform",
    description="Complete Creator Economy Platform with all business tools",
    version="2.0.0",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the basic API router
app.include_router(basic_router)

# Include the authentication and user management router
app.include_router(auth_router, prefix="/api/v1")
app.include_router(bundle_router)  # Bundle management routes

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": "MEWAYZ V2",
        "version": "2.0.0",
        "environment": "production" if os.getenv("MONGO_URL", "").startswith("mongodb+srv://") else "development",
        "database_configured": bool(os.getenv("MONGO_URL")),
        "cors_origins": ["http://localhost:3000", "https://test.mewayz.com", "https://preview-launch-1.emergent.host"]
    }

# Connectivity test endpoint
@app.get("/api/test")
async def connectivity_test():
    """Simple connectivity test"""
    return {
        "message": "Backend is accessible",
        "timestamp": "2025-01-25",
        "cors_enabled": True
    }

# Root endpoint
@app.get("/api/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to MEWAYZ V2 - Complete Business Platform",
        "version": "2.0.0",
        "docs_url": "/docs",
        "features": [
            "E-commerce Platform",
            "Stripe Payments", 
            "Multi-vendor Marketplace",
            "Creator Tools",
            "Business Management"
        ]
    }

