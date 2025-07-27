"""
Products CRUD operations for MEWAYZ V2
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from models.ecommerce import Product, ProductCreate, ProductUpdate

logger = logging.getLogger(__name__)


class ProductCRUD:
    """CRUD operations for products"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.products
    
    async def create_product(self, product_data: ProductCreate, user_id: str) -> Product:
        """Create a new product"""
        try:
            product_dict = product_data.dict()
            product_dict["vendor_id"] = user_id
            product_dict["created_at"] = datetime.utcnow()
            product_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(product_dict)
            product_dict["_id"] = result.inserted_id
            
            return Product(**product_dict)
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            raise
    
    async def get_product(self, product_id: str) -> Optional[Product]:
        """Get a product by ID"""
        try:
            product_dict = await self.collection.find_one({"_id": ObjectId(product_id)})
            if product_dict:
                return Product(**product_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting product {product_id}: {e}")
            return None
    
    async def get_user_products(self, user_id: str, limit: Optional[int] = None) -> List[Product]:
        """Get all products for a user"""
        try:
            query = {"vendor_id": user_id}
            cursor = self.collection.find(query).sort("created_at", -1)
            
            if limit:
                cursor = cursor.limit(limit)
            
            products = []
            async for product_dict in cursor:
                products.append(Product(**product_dict))
            
            return products
        except Exception as e:
            logger.error(f"Error getting user products: {e}")
            return []
    
    async def get_user_products_count(self, user_id: str) -> int:
        """Get count of products for a user"""
        try:
            return await self.collection.count_documents({"vendor_id": user_id})
        except Exception as e:
            logger.error(f"Error getting user products count: {e}")
            return 0
    
    async def update_product(self, product_id: str, product_data: ProductUpdate, user_id: str) -> Optional[Product]:
        """Update a product"""
        try:
            update_data = product_data.dict(exclude_unset=True)
            update_data["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(product_id), "vendor_id": user_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_product(product_id)
            return None
        except Exception as e:
            logger.error(f"Error updating product {product_id}: {e}")
            return None
    
    async def delete_product(self, product_id: str, user_id: str) -> bool:
        """Delete a product"""
        try:
            result = await self.collection.delete_one(
                {"_id": ObjectId(product_id), "vendor_id": user_id}
            )
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting product {product_id}: {e}")
            return False
    
    async def search_products(self, query: str, user_id: Optional[str] = None, limit: int = 20) -> List[Product]:
        """Search products by name or description"""
        try:
            search_filter = {
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"description": {"$regex": query, "$options": "i"}}
                ]
            }
            
            if user_id:
                search_filter["vendor_id"] = user_id
            
            cursor = self.collection.find(search_filter).limit(limit)
            products = []
            async for product_dict in cursor:
                products.append(Product(**product_dict))
            
            return products
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            return []
    
    async def get_products_by_category(self, category_id: str, limit: int = 20) -> List[Product]:
        """Get products by category"""
        try:
            cursor = self.collection.find({"category_id": category_id, "is_active": True}).limit(limit)
            products = []
            async for product_dict in cursor:
                products.append(Product(**product_dict))
            
            return products
        except Exception as e:
            logger.error(f"Error getting products by category: {e}")
            return []


# Global instance
product_crud = None

def get_product_crud(db: AsyncIOMotorDatabase) -> ProductCRUD:
    """Get product CRUD instance"""
    global product_crud
    if product_crud is None:
        product_crud = ProductCRUD(db)
    return product_crud 