"""
Bundle Services API - Integrated Bundle-Specific Endpoints
Routes that integrate with bundle management for feature access control
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from api.deps import get_current_user
from core.bundle_manager import get_bundle_manager
from services.complete_link_in_bio_service import get_complete_link_in_bio_service
from services.complete_ecommerce_service import get_complete_ecommerce_service
from services.crm_service import get_crm_service
from services.form_service import get_form_service
from services.template_service import get_template_service
from services.marketing_service import get_marketing_service

router = APIRouter(prefix="/api/bundle-services", tags=["Bundle Services"])

# Get service dependencies
def get_bio_link_service():
    return get_complete_link_in_bio_service()

def get_ecommerce_service():
    return get_complete_ecommerce_service()

def get_crm_service_dep():
    return get_crm_service()

def get_form_service_dep():
    return get_form_service()

def get_template_service_dep():
    return get_template_service()

def get_marketing_service_dep():
    return get_marketing_service()

def get_bundle_manager_dep():
    return get_bundle_manager()

# Helper function to check bundle access
async def check_bundle_access(user_id: str, service_name: str, bundle_manager):
    """Check if user has access to a specific service through their bundles"""
    try:
        has_access = await bundle_manager.check_service_access(user_id, service_name)
        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Service '{service_name}' requires an active bundle subscription."
            )
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Access check failed: {str(e)}"
        )

# Pydantic Models
class CreateBioLinkRequest(BaseModel):
    name: str
    description: Optional[str] = None
    custom_url: Optional[str] = None
    theme: Optional[str] = "default"
    links: List[Dict[str, Any]] = []

class CreateEcommerceRequest(BaseModel):
    store_name: str
    description: Optional[str] = None
    category: Optional[str] = None
    products: List[Dict[str, Any]] = []

class CreateCRMContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    tags: List[str] = []

# =============================================================================
# CREATOR BUNDLE SERVICES
# =============================================================================

@router.post("/creator/bio-links", summary="Create Bio Link Page")
async def create_bio_link_page(
    request: CreateBioLinkRequest,
    current_user: dict = Depends(get_current_user),
    bio_service = Depends(get_bio_link_service),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Create a new bio link page (Creator Bundle required)"""
    try:
        user_id = str(current_user.id)
        await check_bundle_access(user_id, "complete_link_in_bio_service", bundle_manager)
        
        # Prepare bio link data
        bio_data = {
            "user_id": str(user_id),
            "name": request.name,
            "description": request.description,
            "custom_url": request.custom_url,
            "theme": request.theme,
            "links": request.links,
            "is_active": True
        }
        
        result = await bio_service.create_complete_link_in_bio(bio_data)
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "success": True,
                    "message": "Bio link page created successfully",
                    "data": result.get("data"),
                    "bio_link_id": result.get("id")
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Creation failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bio link creation failed: {str(e)}"
        )

@router.get("/creator/bio-links", summary="Get User's Bio Links")
async def get_user_bio_links(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user),
    bio_service = Depends(get_bio_link_service),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Get user's bio link pages (Creator Bundle required)"""
    try:
        user_id = str(current_user.id)
        await check_bundle_access(user_id, "complete_link_in_bio_service", bundle_manager)
        
        result = await bio_service.list_complete_link_in_bios(
            user_id=str(user_id), 
            limit=limit, 
            offset=offset
        )
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "data": result.get("data", []),
                    "total": result.get("total", 0),
                    "limit": limit,
                    "offset": offset
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Retrieval failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bio links retrieval failed: {str(e)}"
        )

@router.get("/creator/bio-links/{bio_link_id}", summary="Get Specific Bio Link")
async def get_bio_link(
    bio_link_id: str,
    current_user: dict = Depends(get_current_user),
    bio_service = Depends(get_bio_link_service),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Get specific bio link page (Creator Bundle required)"""
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        await check_bundle_access(user_id, "complete_link_in_bio_service", bundle_manager)
        
        result = await bio_service.get_complete_link_in_bio(bio_link_id)
        
        if result.get("success"):
            # Verify ownership
            bio_data = result.get("data", {})
            if bio_data.get("user_id") != str(user_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied. Not your bio link page."
                )
            
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "data": bio_data
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bio link page not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bio link retrieval failed: {str(e)}"
        )

# =============================================================================
# E-COMMERCE BUNDLE SERVICES  
# =============================================================================

@router.post("/ecommerce/stores", summary="Create E-commerce Store")
async def create_ecommerce_store(
    request: CreateEcommerceRequest,
    current_user: dict = Depends(get_current_user),
    ecommerce_service = Depends(get_ecommerce_service),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Create a new e-commerce store (E-commerce Bundle required)"""
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        await check_bundle_access(user_id, "complete_ecommerce_service", bundle_manager)
        
        # Prepare store data
        store_data = {
            "user_id": str(user_id),
            "store_name": request.store_name,
            "description": request.description,
            "category": request.category,
            "products": request.products,
            "is_active": True,
            "store_status": "active"
        }
        
        result = await ecommerce_service.create_complete_ecommerce(store_data)
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "success": True,
                    "message": "E-commerce store created successfully",
                    "data": result.get("data"),
                    "store_id": result.get("id")
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Store creation failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Store creation failed: {str(e)}"
        )

@router.get("/ecommerce/stores", summary="Get User's E-commerce Stores")
async def get_user_stores(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user),
    ecommerce_service = Depends(get_ecommerce_service),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Get user's e-commerce stores (E-commerce Bundle required)"""
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        await check_bundle_access(user_id, "complete_ecommerce_service", bundle_manager)
        
        result = await ecommerce_service.list_complete_ecommerces(
            user_id=str(user_id),
            limit=limit,
            offset=offset
        )
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "data": result.get("data", []),
                    "total": result.get("total", 0),
                    "limit": limit,
                    "offset": offset
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Stores retrieval failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stores retrieval failed: {str(e)}"
        )

# =============================================================================
# BUSINESS BUNDLE SERVICES
# =============================================================================

@router.post("/business/crm/contacts", summary="Create CRM Contact")
async def create_crm_contact(
    request: CreateCRMContactRequest,
    current_user: dict = Depends(get_current_user),
    crm_service = Depends(get_crm_service_dep),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Create a new CRM contact (Business Bundle required)"""
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        await check_bundle_access(user_id, "crm_service", bundle_manager)
        
        # Prepare contact data
        contact_data = {
            "user_id": str(user_id),
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "company": request.company,
            "tags": request.tags,
            "contact_status": "active",
            "lead_score": 0
        }
        
        result = await crm_service.create_crm(contact_data)
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={
                    "success": True,
                    "message": "CRM contact created successfully",
                    "data": result.get("data"),
                    "contact_id": result.get("id")
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Contact creation failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Contact creation failed: {str(e)}"
        )

@router.get("/business/crm/contacts", summary="Get CRM Contacts")
async def get_crm_contacts(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user),
    crm_service = Depends(get_crm_service_dep),
    bundle_manager = Depends(get_bundle_manager_dep)
):
    """Get user's CRM contacts (Business Bundle required)"""
    try:
        user_id = current_user.get("id") or current_user.get("user_id")
        await check_bundle_access(user_id, "crm_service", bundle_manager)
        
        result = await crm_service.list_crms(
            user_id=str(user_id),
            limit=limit,
            offset=offset
        )
        
        if result.get("success"):
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "data": result.get("data", []),
                    "total": result.get("total", 0),
                    "limit": limit,
                    "offset": offset
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Contacts retrieval failed")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Contacts retrieval failed: {str(e)}"
        )

# =============================================================================
# BUNDLE SERVICE HEALTH CHECKS
# =============================================================================

@router.get("/health", summary="Bundle Services Health Check")
async def bundle_services_health():
    """Health check for all integrated bundle services"""
    try:
        services_status = {}
        
        # Check each service
        services = [
            ("bio_link", get_complete_link_in_bio_service()),
            ("ecommerce", get_complete_ecommerce_service()),
            ("crm", get_crm_service()),
        ]
        
        for service_name, service in services:
            try:
                health = await service.health_check()
                services_status[service_name] = {
                    "healthy": health.get("healthy", False),
                    "service": health.get("service", service_name)
                }
            except Exception as e:
                services_status[service_name] = {
                    "healthy": False,
                    "error": str(e)
                }
        
        overall_healthy = all(status.get("healthy", False) for status in services_status.values())
        
        return JSONResponse(
            status_code=status.HTTP_200_OK if overall_healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": overall_healthy,
                "healthy": overall_healthy,
                "services": services_status,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "healthy": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )