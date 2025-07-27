"""
Analytics API Endpoints for MEWAYZ V2
Provides real analytics data instead of mock data
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timedelta
from models.user import User
from api.deps import get_current_user
from services.analytics_service import get_analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_overview(
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard overview analytics for the current user"""
    try:
        analytics_service = get_analytics_service()
        
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)  # Default to 30 days
        
        dashboard_data = await analytics_service.get_dashboard_overview(
            user_id=str(current_user.id),
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            "success": True,
            "data": dashboard_data,
            "period": period,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard analytics: {str(e)}")


@router.get("/revenue")
async def get_revenue_analytics(
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user)
):
    """Get revenue analytics for the current user"""
    try:
        analytics_service = get_analytics_service()
        
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        revenue_data = await analytics_service.get_revenue_analytics(
            user_id=str(current_user.id),
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            "success": True,
            "data": revenue_data,
            "period": period,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get revenue analytics: {str(e)}")


@router.get("/products")
async def get_product_performance(
    product_id: Optional[str] = Query(None, description="Specific product ID"),
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user)
):
    """Get product performance analytics"""
    try:
        analytics_service = get_analytics_service()
        
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        if product_id:
            # Get specific product performance
            performance_data = await analytics_service.get_product_performance(
                user_id=str(current_user.id),
                product_id=product_id,
                start_date=start_date,
                end_date=end_date
            )
        else:
            # Get all products performance
            performance_data = await analytics_service.get_all_products_performance(
                user_id=str(current_user.id),
                start_date=start_date,
                end_date=end_date
            )
        
        return {
            "success": True,
            "data": performance_data,
            "product_id": product_id,
            "period": period,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get product performance: {str(e)}")


@router.get("/customers")
async def get_customer_analytics(
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user)
):
    """Get customer analytics for the current user"""
    try:
        analytics_service = get_analytics_service()
        
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        customer_data = await analytics_service.get_customer_analytics(
            user_id=str(current_user.id),
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            "success": True,
            "data": customer_data,
            "period": period,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get customer analytics: {str(e)}")


@router.get("/biolinks")
async def get_biolink_analytics(
    bio_link_id: Optional[str] = Query(None, description="Specific bio link ID"),
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user)
):
    """Get bio link analytics"""
    try:
        analytics_service = get_analytics_service()
        
        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        if bio_link_id:
            # Get specific bio link analytics
            analytics_data = await analytics_service.get_biolink_analytics(
                user_id=str(current_user.id),
                bio_link_id=bio_link_id,
                start_date=start_date,
                end_date=end_date
            )
        else:
            # Get all bio links analytics
            analytics_data = await analytics_service.get_all_biolinks_analytics(
                user_id=str(current_user.id),
                start_date=start_date,
                end_date=end_date
            )
        
        return {
            "success": True,
            "data": analytics_data,
            "bio_link_id": bio_link_id,
            "period": period,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get bio link analytics: {str(e)}")


@router.get("/overview")
async def get_overview_analytics(
    current_user: User = Depends(get_current_user)
):
    """Get overview analytics for the current user"""
    try:
        analytics_service = get_analytics_service()
        
        overview_data = await analytics_service.get_overview_analytics(
            user_id=str(current_user.id)
        )
        
        return {
            "success": True,
            "data": overview_data,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get overview analytics: {str(e)}") 