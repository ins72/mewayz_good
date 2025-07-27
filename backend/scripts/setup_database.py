"""
Database Setup Script for MEWAYZ V2
Initializes database collections and indexes
"""

import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, TEXT

from db.database import get_database

logger = logging.getLogger(__name__)


class DatabaseSetup:
    """Database setup and initialization"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_indexes(self):
        """Create database indexes for optimal performance"""
        logger.info("Creating database indexes...")
        
        try:
            # Users collection indexes
            await self.db.users.create_index([("email", ASCENDING)], unique=True)
            await self.db.users.create_index([("is_active", ASCENDING)])
            await self.db.users.create_index([("created", DESCENDING)])
            logger.info("✅ Users indexes created")
            
            # Products collection indexes
            await self.db.products.create_index([("vendor_id", ASCENDING)])
            await self.db.products.create_index([("category_id", ASCENDING)])
            await self.db.products.create_index([("is_active", ASCENDING)])
            await self.db.products.create_index([("created_at", DESCENDING)])
            await self.db.products.create_index([("price", ASCENDING)])
            await self.db.products.create_index([("tags", ASCENDING)])
            await self.db.products.create_index([("name", TEXT), ("description", TEXT)])
            logger.info("✅ Products indexes created")
            
            # Orders collection indexes
            await self.db.orders.create_index([("customer_id", ASCENDING)])
            await self.db.orders.create_index([("vendor_id", ASCENDING)])
            await self.db.orders.create_index([("product_id", ASCENDING)])
            await self.db.orders.create_index([("status", ASCENDING)])
            await self.db.orders.create_index([("created_at", DESCENDING)])
            logger.info("✅ Orders indexes created")
            
            # Bio links collection indexes
            await self.db.bio_links.create_index([("user_id", ASCENDING)])
            await self.db.bio_links.create_index([("slug", ASCENDING)], unique=True)
            await self.db.bio_links.create_index([("is_published", ASCENDING)])
            await self.db.bio_links.create_index([("created_at", DESCENDING)])
            logger.info("✅ Bio links indexes created")
            
            # Messages collection indexes
            await self.db.messages.create_index([("sender_id", ASCENDING)])
            await self.db.messages.create_index([("recipient_id", ASCENDING)])
            await self.db.messages.create_index([("is_read", ASCENDING)])
            await self.db.messages.create_index([("is_deleted", ASCENDING)])
            await self.db.messages.create_index([("created_at", DESCENDING)])
            logger.info("✅ Messages indexes created")
            
            # Comments collection indexes
            await self.db.comments.create_index([("user_id", ASCENDING)])
            await self.db.comments.create_index([("product_id", ASCENDING)])
            await self.db.comments.create_index([("parent_id", ASCENDING)])
            await self.db.comments.create_index([("is_approved", ASCENDING)])
            await self.db.comments.create_index([("is_deleted", ASCENDING)])
            await self.db.comments.create_index([("created_at", DESCENDING)])
            logger.info("✅ Comments indexes created")
            
            # Notifications collection indexes
            await self.db.notifications.create_index([("user_id", ASCENDING)])
            await self.db.notifications.create_index([("notification_type", ASCENDING)])
            await self.db.notifications.create_index([("is_read", ASCENDING)])
            await self.db.notifications.create_index([("is_deleted", ASCENDING)])
            await self.db.notifications.create_index([("created_at", DESCENDING)])
            logger.info("✅ Notifications indexes created")
            
            # Categories collection indexes
            await self.db.categories.create_index([("name", ASCENDING)], unique=True)
            await self.db.categories.create_index([("created_at", DESCENDING)])
            logger.info("✅ Categories indexes created")
            
            # Customers collection indexes
            await self.db.customers.create_index([("email", ASCENDING)])
            await self.db.customers.create_index([("created_at", DESCENDING)])
            logger.info("✅ Customers indexes created")
            
            logger.info("🎉 All database indexes created successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error creating indexes: {e}")
            raise
    
    async def create_collections(self):
        """Ensure all required collections exist"""
        logger.info("Creating database collections...")
        
        collections = [
            "users", "products", "orders", "bio_links", "messages", 
            "comments", "notifications", "categories", "customers"
        ]
        
        for collection_name in collections:
            try:
                # Create collection if it doesn't exist
                await self.db.create_collection(collection_name)
                logger.info(f"✅ Collection '{collection_name}' created")
            except Exception as e:
                # Collection might already exist
                logger.info(f"ℹ️ Collection '{collection_name}' already exists")
        
        logger.info("🎉 All collections are ready!")
    
    async def setup_database(self):
        """Complete database setup"""
        logger.info("🚀 Starting database setup...")
        
        try:
            # Create collections first
            await self.create_collections()
            
            # Create indexes
            await self.create_indexes()
            
            logger.info("🎉 Database setup completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error during database setup: {e}")
            raise


async def main():
    """Main function to run the database setup"""
    db = get_database()
    setup = DatabaseSetup(db)
    await setup.setup_database()


if __name__ == "__main__":
    asyncio.run(main()) 