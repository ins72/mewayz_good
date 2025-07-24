"""
E-commerce CRUD Operations for MEWAYZ V2
"""

from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from models.ecommerce import (
    Product, ProductCreate, ProductUpdate,
    Category, Cart, CartItem, Order, OrderCreate,
    Vendor, VendorApplication
)
from db.session import get_engine
from datetime import datetime


class ProductCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def create_product(self, product: ProductCreate, vendor_id: Optional[str] = None) -> Product:
        """Create a new product"""
        product_data = product.dict()
        if vendor_id:
            product_data["vendor_id"] = vendor_id
            
        product_obj = Product(**product_data)
        await self.engine.save(product_obj)
        return product_obj
    
    async def get_product(self, product_id: str) -> Optional[Product]:
        """Get product by ID"""
        return await self.engine.find_one(Product, Product.id == ObjectId(product_id))
    
    async def get_products(
        self, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[str] = None,
        bundle_type: Optional[str] = None,
        vendor_id: Optional[str] = None,
        is_active: bool = True
    ) -> List[Product]:
        """Get products with filtering"""
        filters = {"is_active": is_active}
        
        if category_id:
            filters["category_id"] = category_id
        if bundle_type:
            filters["bundle_type"] = bundle_type
        if vendor_id:
            filters["vendor_id"] = vendor_id
            
        return await self.engine.find(Product, filters, skip=skip, limit=limit)
    
    async def update_product(self, product_id: str, product_update: ProductUpdate) -> Optional[Product]:
        """Update product"""
        product = await self.get_product(product_id)
        if not product:
            return None
            
        update_data = product_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        for field, value in update_data.items():
            setattr(product, field, value)
            
        await self.engine.save(product)
        return product
    
    async def delete_product(self, product_id: str) -> bool:
        """Delete product"""
        product = await self.get_product(product_id)
        if not product:
            return False
            
        await self.engine.delete(product)
        return True
    
    async def search_products(self, query: str, limit: int = 50) -> List[Product]:
        """Search products by name, description, tags"""
        # This would use MongoDB text search in production
        # For now, simple regex search
        products = await self.engine.find(
            Product, 
            {
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"description": {"$regex": query, "$options": "i"}},
                    {"tags": {"$in": [query]}}
                ]
            },
            limit=limit
        )
        return products


class CategoryCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def create_category(self, name: str, description: Optional[str] = None) -> Category:
        """Create a new category"""
        category = Category(name=name, description=description)
        await self.engine.save(category)
        return category
    
    async def get_categories(self) -> List[Category]:
        """Get all active categories"""
        return await self.engine.find(Category, {"is_active": True})
    
    async def get_category(self, category_id: str) -> Optional[Category]:
        """Get category by ID"""
        return await self.engine.find_one(Category, Category.id == ObjectId(category_id))


class CartCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def get_or_create_cart(self, user_id: str) -> Cart:
        """Get user's cart or create new one"""
        cart = await self.engine.find_one(Cart, Cart.user_id == user_id)
        if not cart:
            cart = Cart(user_id=user_id)
            await self.engine.save(cart)
        return cart
    
    async def add_to_cart(self, user_id: str, product_id: str, quantity: int = 1) -> Cart:
        """Add item to cart"""
        cart = await self.get_or_create_cart(user_id)
        
        # Get product details
        product_crud = ProductCRUD()
        product = await product_crud.get_product(product_id)
        if not product:
            raise ValueError("Product not found")
            
        # Check if item already in cart
        existing_item = None
        for item in cart.items:
            if item.product_id == product_id:
                existing_item = item
                break
                
        if existing_item:
            existing_item.quantity += quantity
            existing_item.total = existing_item.quantity * existing_item.price
        else:
            cart_item = CartItem(
                product_id=product_id,
                product_name=product.name,
                quantity=quantity,
                price=product.price
            )
            cart.items.append(cart_item)
            
        cart.calculate_totals()
        cart.updated_at = datetime.utcnow()
        await self.engine.save(cart)
        return cart
    
    async def remove_from_cart(self, user_id: str, product_id: str) -> Cart:
        """Remove item from cart"""
        cart = await self.get_or_create_cart(user_id)
        cart.items = [item for item in cart.items if item.product_id != product_id]
        cart.calculate_totals()
        cart.updated_at = datetime.utcnow()
        await self.engine.save(cart)
        return cart
    
    async def clear_cart(self, user_id: str) -> Cart:
        """Clear all items from cart"""
        cart = await self.get_or_create_cart(user_id)
        cart.items = []
        cart.calculate_totals()
        cart.updated_at = datetime.utcnow()
        await self.engine.save(cart)
        return cart


class OrderCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def create_order(self, user_id: str, order_data: OrderCreate) -> Order:
        """Create new order from cart"""
        # Calculate totals
        subtotal = sum(item.total for item in order_data.items)
        tax = subtotal * 0.08  # 8% tax
        total = subtotal + tax
        
        order = Order(
            user_id=user_id,
            items=order_data.items,
            subtotal=subtotal,
            tax=tax,
            total=total,
            shipping_address=order_data.shipping_address,
            billing_address=order_data.billing_address or order_data.shipping_address,
            payment_method=order_data.payment_method
        )
        
        await self.engine.save(order)
        return order
    
    async def get_order(self, order_id: str) -> Optional[Order]:
        """Get order by ID"""
        return await self.engine.find_one(Order, Order.id == ObjectId(order_id))
    
    async def get_user_orders(self, user_id: str) -> List[Order]:
        """Get all orders for a user"""
        return await self.engine.find(Order, {"user_id": user_id})
    
    async def update_order_status(self, order_id: str, status: str) -> Optional[Order]:
        """Update order status"""
        order = await self.get_order(order_id)
        if not order:
            return None
            
        order.status = status
        order.updated_at = datetime.utcnow()
        
        if status == "shipped":
            order.shipped_at = datetime.utcnow()
        elif status == "delivered":
            order.delivered_at = datetime.utcnow()
            
        await self.engine.save(order)
        return order


class VendorCRUD:
    def __init__(self):
        self.engine = get_engine()
        
    async def create_vendor(self, user_id: str, application: VendorApplication) -> Vendor:
        """Create vendor from application"""
        vendor = Vendor(
            user_id=user_id,
            business_name=application.business_name,
            business_email=application.business_email,
            business_phone=application.business_phone,
            is_approved=False  # Requires manual approval
        )
        await self.engine.save(vendor)
        return vendor
    
    async def get_vendor(self, vendor_id: str) -> Optional[Vendor]:
        """Get vendor by ID"""
        return await self.engine.find_one(Vendor, Vendor.id == ObjectId(vendor_id))
    
    async def get_vendor_by_user(self, user_id: str) -> Optional[Vendor]:
        """Get vendor by user ID"""
        return await self.engine.find_one(Vendor, Vendor.user_id == user_id)
    
    async def approve_vendor(self, vendor_id: str) -> Optional[Vendor]:
        """Approve vendor application"""
        vendor = await self.get_vendor(vendor_id)
        if not vendor:
            return None
            
        vendor.is_approved = True
        vendor.updated_at = datetime.utcnow()
        await self.engine.save(vendor)
        return vendor


# Initialize CRUD instances
product_crud = ProductCRUD()
category_crud = CategoryCRUD()
cart_crud = CartCRUD()
order_crud = OrderCRUD()
vendor_crud = VendorCRUD()