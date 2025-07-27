from fastapi import APIRouter

from api.api_v1.endpoints import (
    login,
    users,
    proxy,
    stripe_payments,
    stripe_webhooks,
    workspaces,
    invitations,
    ecommerce,
    payments,
    analytics,
    messages,
    comments,
    notifications,
    creator,
)

api_router = APIRouter()

# Add a root endpoint for the API
@api_router.get("/")
async def api_root():
    """API root endpoint"""
    return {
        "message": "MEWAYZ V2 API",
        "version": "2.0.0",
        "status": "production-ready",
        "endpoints": [
            "/login", 
            "/users", 
            "/proxy", 
            "/payments", 
            "/workspaces", 
            "/invitations",
            "/ecommerce",
            "/analytics",
            "/messages",
            "/comments",
            "/notifications",
            "/creator"
        ]
    }

# Core endpoints
api_router.include_router(login.router, prefix="/login", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])

# Payment and commerce endpoints
api_router.include_router(stripe_payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(stripe_webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(ecommerce.router, tags=["e-commerce"])
api_router.include_router(payments.router, tags=["payments"])

# Workspace and collaboration endpoints
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(invitations.router, prefix="/invitations", tags=["invitations"])

# Communication endpoints
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

# Analytics and insights
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

# Creator tools
api_router.include_router(creator.router, prefix="/creator", tags=["creator"])
