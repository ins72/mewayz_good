"""
E-commerce API Endpoints for MEWAYZ V2
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from models.ecommerce import (
    Product, ProductCreate, ProductUpdate,
    Category, Cart, CartItem, Order, OrderCreate,
    Vendor, VendorApplication
)
from crud.ecommerce import (
    product_crud, category_crud, cart_crud, 
    order_crud, vendor_crud
)
from api.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/ecommerce", tags=["E-commerce"])


# ===== PRODUCTS =====
@router.post("/products", response_model=Product)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new product"""
    # Check if user is a vendor
    vendor = await vendor_crud.get_vendor_by_user(str(current_user.id))
    vendor_id = str(vendor.id) if vendor else None
    
    return await product_crud.create_product(product, vendor_id)


@router.get("/products", response_model=List[Product])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[str] = None,
    bundle_type: Optional[str] = None,
    search: Optional[str] = None
):
    """Get products with optional filtering"""
    if search:
        return await product_crud.search_products(search, limit)
    
    return await product_crud.get_products(
        skip=skip,
        limit=limit,
        category_id=category_id,
        bundle_type=bundle_type
    )


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product by ID"""
    product = await product_crud.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update product"""
    product = await product_crud.update_product(product_id, product_update)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete product"""
    success = await product_crud.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# ===== CATEGORIES =====
@router.post("/categories", response_model=Category)
async def create_category(
    name: str,
    description: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Create a new category"""
    return await category_crud.create_category(name, description)


@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    return await category_crud.get_categories()


# ===== CART =====
@router.get("/cart", response_model=Cart)
async def get_cart(current_user: User = Depends(get_current_user)):
    """Get user's cart"""
    return await cart_crud.get_or_create_cart(str(current_user.id))


@router.post("/cart/add")
async def add_to_cart(
    product_id: str,
    quantity: int = 1,
    current_user: User = Depends(get_current_user)
):
    """Add item to cart"""
    try:
        cart = await cart_crud.add_to_cart(str(current_user.id), product_id, quantity)
        return {"message": "Item added to cart", "cart": cart}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/cart/remove/{product_id}")
async def remove_from_cart(
    product_id: str,
    current_user: User = Depends(get_current_user)
):
    """Remove item from cart"""
    cart = await cart_crud.remove_from_cart(str(current_user.id), product_id)
    return {"message": "Item removed from cart", "cart": cart}


@router.delete("/cart/clear")
async def clear_cart(current_user: User = Depends(get_current_user)):
    """Clear cart"""
    cart = await cart_crud.clear_cart(str(current_user.id))
    return {"message": "Cart cleared", "cart": cart}


# ===== ORDERS =====
@router.post("/orders", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new order"""
    order = await order_crud.create_order(str(current_user.id), order_data)
    
    # Clear cart after successful order
    await cart_crud.clear_cart(str(current_user.id))
    
    return order


@router.get("/orders", response_model=List[Order])
async def get_user_orders(current_user: User = Depends(get_current_user)):
    """Get user's orders"""
    return await order_crud.get_user_orders(str(current_user.id))


@router.get("/orders/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get order by ID"""
    order = await order_crud.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if user owns this order or is admin
    if order.user_id != str(current_user.id) and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    return order


@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    current_user: User = Depends(get_current_user)
):
    """Update order status (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    order = await order_crud.update_order_status(order_id, status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": f"Order status updated to {status}", "order": order}


# ===== VENDORS =====
@router.post("/vendors/apply", response_model=Vendor)
async def apply_as_vendor(
    application: VendorApplication,
    current_user: User = Depends(get_current_user)
):
    """Apply to become a vendor"""
    # Check if user already has vendor application
    existing_vendor = await vendor_crud.get_vendor_by_user(str(current_user.id))
    if existing_vendor:
        raise HTTPException(status_code=400, detail="Vendor application already exists")
    
    return await vendor_crud.create_vendor(str(current_user.id), application)


@router.get("/vendors/me", response_model=Vendor)
async def get_my_vendor_profile(current_user: User = Depends(get_current_user)):
    """Get current user's vendor profile"""
    vendor = await vendor_crud.get_vendor_by_user(str(current_user.id))
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return vendor


@router.get("/vendors/{vendor_id}/products", response_model=List[Product])
async def get_vendor_products(vendor_id: str):
    """Get products by vendor"""
    return await product_crud.get_products(vendor_id=vendor_id)


@router.put("/vendors/{vendor_id}/approve")
async def approve_vendor(
    vendor_id: str,
    current_user: User = Depends(get_current_user)
):
    """Approve vendor (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    vendor = await vendor_crud.approve_vendor(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return {"message": "Vendor approved successfully", "vendor": vendor}


# ===== MEWAYZ BUNDLE ENDPOINTS =====
@router.get("/bundles/{bundle_type}/products", response_model=List[Product])
async def get_bundle_products(bundle_type: str):
    """Get products for specific MEWAYZ bundle"""
    valid_bundles = ["creator", "ecommerce", "social_media", "education", "business", "operations"]
    if bundle_type not in valid_bundles:
        raise HTTPException(status_code=400, detail="Invalid bundle type")
    
    return await product_crud.get_products(bundle_type=bundle_type)


@router.get("/dashboard/vendor-stats")
async def get_vendor_dashboard(current_user: User = Depends(get_current_user)):
    """Get vendor dashboard statistics"""
    vendor = await vendor_crud.get_vendor_by_user(str(current_user.id))
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    
    # Get vendor products
    products = await product_crud.get_products(vendor_id=str(vendor.id))
    
    # Get vendor orders (would need to implement this query)
    # orders = await order_crud.get_vendor_orders(str(vendor.id))
    
    return {
        "vendor": vendor,
        "total_products": len(products),
        "active_products": len([p for p in products if p.is_active]),
        "products": products[:10]  # Recent products
        # "recent_orders": orders[:10],
        # "monthly_sales": calculate_monthly_sales(orders)
    }