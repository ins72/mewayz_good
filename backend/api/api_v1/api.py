from fastapi import APIRouter

from api.api_v1.endpoints import (
    login,
    users,
    proxy,
    ecommerce,
    payments,
)

api_router = APIRouter()

# Add a root endpoint for the API
@api_router.get("/")
async def api_root():
    """API root endpoint"""
    return {
        "message": "MEWAYZ V2 API",
        "version": "2.0.0",
        "endpoints": ["/login", "/users", "/proxy", "/ecommerce", "/payments"]
    }

api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(proxy.router, prefix="/proxy", tags=["proxy"])
api_router.include_router(ecommerce.router, tags=["e-commerce"])
api_router.include_router(payments.router, tags=["payments"])
