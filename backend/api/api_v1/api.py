from fastapi import APIRouter

from api.api_v1.endpoints import (
    login,
    users,
    proxy,
    stripe_payments,
    workspaces,
    # ecommerce,  # Temporarily disabled due to Pydantic v2 compatibility
    # payments,   # Temporarily disabled due to Pydantic v2 compatibility
)

api_router = APIRouter()

# Add a root endpoint for the API
@api_router.get("/")
async def api_root():
    """API root endpoint"""
    return {
        "message": "MEWAYZ V2 API",
        "version": "2.0.0",
        "endpoints": ["/login", "/users", "/proxy", "/payments", "/workspaces"]
    }

api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(stripe_payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
# api_router.include_router(ecommerce.router, tags=["e-commerce"])  # Temporarily disabled
# api_router.include_router(payments.router, tags=["payments"])  # Temporarily disabled
