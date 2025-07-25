"""
Bundle Management API Endpoints
FastAPI routes for bundle subscription, activation, and management
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

from core.bundle_manager import BundleManager, BundleType, get_bundle_manager
from core.auth import get_current_user

router = APIRouter(prefix="/api/bundles", tags=["Bundle Management"])

# Pydantic Models
class BundleActivationRequest(BaseModel):
    bundle_type: BundleType
    billing_cycle: str = Field(default="monthly", regex="^(monthly|yearly)$")

class MultiBundleRequest(BaseModel):
    bundles: List[BundleType]
    billing_cycle: str = Field(default="monthly", regex="^(monthly|yearly)$")

class BundlePricingResponse(BaseModel):
    success: bool
    bundle_count: int
    base_cost: float
    discount_rate: float
    discount_amount: float
    final_cost: float
    billing_cycle: str
    bundle_details: List[Dict[str, Any]]
    savings: float

# Bundle Manager dependency
def get_bundle_service() -> BundleManager:
    return get_bundle_manager()

@router.get("/", summary="Get All Available Bundles")
async def get_all_bundles(
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Get all available bundle configurations with pricing and features
    """
    try:
        bundles = bundle_service.get_all_bundles()
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Bundle configurations retrieved successfully",
                "data": {
                    "bundles": bundles,
                    "bundle_count": len(bundles),
                    "multi_bundle_discounts": bundle_service.MULTI_BUNDLE_DISCOUNTS
                }
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve bundles: {str(e)}"
        )

@router.get("/{bundle_type}", summary="Get Specific Bundle Configuration")
async def get_bundle_configuration(
    bundle_type: BundleType,
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Get configuration for a specific bundle type
    """
    try:
        config = bundle_service.get_bundle_configuration(bundle_type)
        
        if not config:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Bundle type {bundle_type} not found"
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": f"Configuration for {bundle_type} retrieved successfully",
                "data": {
                    "bundle_type": bundle_type,
                    "configuration": config
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve bundle configuration: {str(e)}"
        )

@router.post("/pricing", response_model=BundlePricingResponse, summary="Calculate Bundle Pricing")
async def calculate_bundle_pricing(
    request: MultiBundleRequest,
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Calculate pricing for multiple bundles with multi-bundle discounts
    """
    try:
        pricing = bundle_service.calculate_bundle_pricing(
            bundles=request.bundles,
            billing_cycle=request.billing_cycle
        )
        
        if not pricing.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=pricing.get("error", "Pricing calculation failed")
            )
        
        return BundlePricingResponse(**pricing)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate pricing: {str(e)}"
        )

@router.post("/activate", summary="Activate Bundle for User")
async def activate_bundle(
    request: BundleActivationRequest,
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Activate a specific bundle for the current user
    """
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        
        result = await bundle_service.activate_bundle(
            user_id=str(user_id),
            bundle_type=request.bundle_type
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Bundle activation failed")
            )
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "success": True,
                "message": result.get("message"),
                "data": {
                    "bundle_id": result.get("bundle_id"),
                    "bundle_type": request.bundle_type,
                    "activated_services": result.get("activated_services"),
                    "activated_features": result.get("activated_features"),
                    "activated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to activate bundle: {str(e)}"
        )

@router.delete("/{bundle_type}", summary="Deactivate Bundle")
async def deactivate_bundle(
    bundle_type: BundleType,
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Deactivate a specific bundle for the current user
    """
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        
        result = await bundle_service.deactivate_bundle(
            user_id=str(user_id),
            bundle_type=bundle_type
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Bundle deactivation failed")
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": result.get("message"),
                "data": {
                    "bundle_type": bundle_type,
                    "deactivated_at": datetime.utcnow().isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to deactivate bundle: {str(e)}"
        )

@router.get("/user/active", summary="Get User's Active Bundles")
async def get_user_active_bundles(
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Get all active bundles for the current user
    """
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        
        result = await bundle_service.get_user_bundles(str(user_id))
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to retrieve user bundles")
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "User bundles retrieved successfully",
                "data": {
                    "user_id": user_id,
                    "active_bundles": result.get("active_bundles", []),
                    "bundle_count": result.get("bundle_count", 0),
                    "retrieved_at": datetime.utcnow().isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user bundles: {str(e)}"
        )

@router.get("/user/access/feature/{feature}", summary="Check Feature Access")
async def check_feature_access(
    feature: str,
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Check if the current user has access to a specific feature
    """
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        
        has_access = await bundle_service.check_feature_access(str(user_id), feature)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": {
                    "user_id": user_id,
                    "feature": feature,
                    "has_access": has_access,
                    "checked_at": datetime.utcnow().isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check feature access: {str(e)}"
        )

@router.get("/user/access/service/{service}", summary="Check Service Access")
async def check_service_access(
    service: str,
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Check if the current user has access to a specific service
    """
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        
        has_access = await bundle_service.check_service_access(str(user_id), service)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": {
                    "user_id": user_id,
                    "service": service,
                    "has_access": has_access,
                    "checked_at": datetime.utcnow().isoformat()
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check service access: {str(e)}"
        )

@router.get("/analytics", summary="Get Bundle Analytics")
async def get_bundle_analytics(
    bundle_type: Optional[BundleType] = None,
    current_user: dict = Depends(get_current_user),
    bundle_service: BundleManager = Depends(get_bundle_service)
):
    """
    Get analytics for bundle usage (admin only)
    """
    try:
        # Check if user is admin (simplified check)
        user_role = current_user.get("role", "user")
        if user_role not in ["admin", "super_admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        result = await bundle_service.get_bundle_analytics(bundle_type)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to retrieve analytics")
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Bundle analytics retrieved successfully",
                "data": result
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve bundle analytics: {str(e)}"
        )

@router.get("/health", summary="Bundle System Health Check")
async def bundle_health_check():
    """
    Health check endpoint for bundle management system
    """
    try:
        bundle_service = get_bundle_service()
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "healthy": True,
                "service": "bundle_management",
                "timestamp": datetime.utcnow().isoformat(),
                "total_bundle_types": len(BundleType),
                "available_bundles": [bundle.value for bundle in BundleType]
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bundle system health check failed: {str(e)}"
        )