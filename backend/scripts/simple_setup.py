"""
Simplified Database Setup Script for MEWAYZ V2
Sets up database collections and indexes without importing models
"""

import asyncio
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, TEXT
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def setup_database():
    """Setup database collections and indexes"""
    try:
        # MongoDB connection
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'mewayz')
        
        logger.info(f"Connecting to MongoDB: {mongo_url}")
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection
        await client.admin.command('ping')
        logger.info("✅ MongoDB connection successful")
        
        # Create collections
        collections = [
            "users", "products", "orders", "bio_links", "messages", 
            "comments", "notifications", "categories", "customers"
        ]
        
        for collection_name in collections:
            try:
                await db.create_collection(collection_name)
                logger.info(f"✅ Collection '{collection_name}' created")
            except Exception as e:
                logger.info(f"ℹ️ Collection '{collection_name}' already exists")
        
        # Create indexes
        logger.info("Creating database indexes...")
        
        # Users collection indexes
        await db.users.create_index([("email", ASCENDING)], unique=True)
        await db.users.create_index([("is_active", ASCENDING)])
        await db.users.create_index([("created", DESCENDING)])
        logger.info("✅ Users indexes created")
        
        # Products collection indexes
        await db.products.create_index([("vendor_id", ASCENDING)])
        await db.products.create_index([("category_id", ASCENDING)])
        await db.products.create_index([("is_active", ASCENDING)])
        await db.products.create_index([("created_at", DESCENDING)])
        await db.products.create_index([("price", ASCENDING)])
        await db.products.create_index([("tags", ASCENDING)])
        await db.products.create_index([("name", TEXT), ("description", TEXT)])
        logger.info("✅ Products indexes created")
        
        # Orders collection indexes
        await db.orders.create_index([("customer_id", ASCENDING)])
        await db.orders.create_index([("vendor_id", ASCENDING)])
        await db.orders.create_index([("product_id", ASCENDING)])
        await db.orders.create_index([("status", ASCENDING)])
        await db.orders.create_index([("created_at", DESCENDING)])
        logger.info("✅ Orders indexes created")
        
        # Bio links collection indexes
        await db.bio_links.create_index([("user_id", ASCENDING)])
        await db.bio_links.create_index([("slug", ASCENDING)], unique=True)
        await db.bio_links.create_index([("is_published", ASCENDING)])
        await db.bio_links.create_index([("created_at", DESCENDING)])
        logger.info("✅ Bio links indexes created")
        
        # Messages collection indexes
        await db.messages.create_index([("sender_id", ASCENDING)])
        await db.messages.create_index([("recipient_id", ASCENDING)])
        await db.messages.create_index([("is_read", ASCENDING)])
        await db.messages.create_index([("is_deleted", ASCENDING)])
        await db.messages.create_index([("created_at", DESCENDING)])
        logger.info("✅ Messages indexes created")
        
        # Comments collection indexes
        await db.comments.create_index([("user_id", ASCENDING)])
        await db.comments.create_index([("product_id", ASCENDING)])
        await db.comments.create_index([("parent_id", ASCENDING)])
        await db.comments.create_index([("is_approved", ASCENDING)])
        await db.comments.create_index([("is_deleted", ASCENDING)])
        await db.comments.create_index([("created_at", DESCENDING)])
        logger.info("✅ Comments indexes created")
        
        # Notifications collection indexes
        await db.notifications.create_index([("user_id", ASCENDING)])
        await db.notifications.create_index([("notification_type", ASCENDING)])
        await db.notifications.create_index([("is_read", ASCENDING)])
        await db.notifications.create_index([("is_deleted", ASCENDING)])
        await db.notifications.create_index([("created_at", DESCENDING)])
        logger.info("✅ Notifications indexes created")
        
        # Categories collection indexes
        await db.categories.create_index([("name", ASCENDING)], unique=True)
        await db.categories.create_index([("created_at", DESCENDING)])
        logger.info("✅ Categories indexes created")
        
        # Customers collection indexes
        await db.customers.create_index([("email", ASCENDING)])
        await db.customers.create_index([("created_at", DESCENDING)])
        logger.info("✅ Customers indexes created")
        
        logger.info("🎉 Database setup completed successfully!")
        
        # Close connection
        client.close()
        
    except Exception as e:
        logger.error(f"❌ Error during database setup: {e}")
        raise


async def seed_sample_data():
    """Seed sample data for development"""
    try:
        # MongoDB connection
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'mewayz')
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        logger.info("🌱 Seeding sample data...")
        
        # Seed categories
        categories = [
            {"name": "Digital Products", "description": "Digital downloads and content"},
            {"name": "Physical Products", "description": "Physical goods and merchandise"},
            {"name": "Services", "description": "Professional services and consulting"},
            {"name": "Courses", "description": "Educational courses and training"},
            {"name": "Software", "description": "Software and applications"},
            {"name": "Art & Design", "description": "Creative works and designs"},
        ]
        
        for category in categories:
            category["created_at"] = asyncio.get_event_loop().time()
            category["updated_at"] = asyncio.get_event_loop().time()
        
        await db.categories.insert_many(categories)
        logger.info(f"✅ Seeded {len(categories)} categories")
        
        # Seed sample products
        products = [
            {
                "name": "Premium Digital Template",
                "description": "High-quality digital template for professional use",
                "price": 49.99,
                "category_name": "Digital Products",
                "image_urls": ["/images/products/product-1.png"],
                "stock": 100,
                "sku": "SKU-DIG001",
                "is_active": True,
                "tags": ["digital", "premium", "template"],
                "bundle_type": "creator",
                "is_digital": True,
                "created_at": asyncio.get_event_loop().time(),
                "updated_at": asyncio.get_event_loop().time()
            },
            {
                "name": "Creative Design Bundle",
                "description": "Complete design bundle with templates and assets",
                "price": 99.99,
                "category_name": "Art & Design",
                "image_urls": ["/images/products/product-2.png"],
                "stock": 50,
                "sku": "SKU-DES002",
                "is_active": True,
                "tags": ["design", "creative", "bundle"],
                "bundle_type": "business",
                "is_digital": True,
                "created_at": asyncio.get_event_loop().time(),
                "updated_at": asyncio.get_event_loop().time()
            }
        ]
        
        await db.products.insert_many(products)
        logger.info(f"✅ Seeded {len(products)} products")
        
        logger.info("🎉 Sample data seeding completed!")
        
        # Close connection
        client.close()
        
    except Exception as e:
        logger.error(f"❌ Error during data seeding: {e}")
        raise


async def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='MEWAYZ V2 Simple Setup')
    parser.add_argument('--mode', choices=['database', 'seed', 'full'], 
                       default='full', help='Setup mode')
    
    args = parser.parse_args()
    
    if args.mode == 'database':
        await setup_database()
    elif args.mode == 'seed':
        await seed_sample_data()
    elif args.mode == 'full':
        await setup_database()
        await seed_sample_data()
    
    logger.info("📋 Next Steps:")
    logger.info("   1. Start the backend server: python -m uvicorn main:app --reload")
    logger.info("   2. Start the frontend: npm run dev")
    logger.info("   3. Access the application at http://localhost:3000")


if __name__ == "__main__":
    asyncio.run(main()) 