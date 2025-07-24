"""
MEWAYZ V2 - Complete Business Platform
Built with FastAPI + MongoDB + React stack
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from api.api_v1.api import api_router
from core.config import settings
from db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown


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

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app_name": "MEWAYZ V2",
        "version": "2.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to MEWAYZ V2 - Complete Business Platform",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

