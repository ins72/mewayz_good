"""
Mock Data Migration Script for MEWAYZ V2
Converts existing mock data to real database records
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import json
import os

from db.database import get_database

logger = logging.getLogger(__name__)


class MockDataMigrator:
    """Migrator for converting mock data to real database records"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    def generate_id(self) -> str:
        """Generate a random ID"""
        return str(ObjectId())
    
    async def migrate_mock_products(self):
        """Migrate mock products to database"""
        logger.info("Migrating mock products...")
        
        # Mock products data (from frontend/mocks/products.tsx)
        mock_products = [
            {
                "id": self.generate_id(),
                "name": "Premium Digital Template",
                "description": "High-quality digital template for professional use",
                "price": 49.99,
                "category_id": None,
                "category_name": "Digital Products",
                "image_urls": ["/images/products/product-1.png"],
                "stock": 100,
                "sku": "SKU-DIG001",
                "is_active": True,
                "tags": ["digital", "premium", "template"],
                "vendor_id": None,  # Will be set when users are created
                "vendor_name": "Sample Vendor",
                "bundle_type": "creator",
                "is_digital": True,
                "created_at": datetime.utcnow() - timedelta(days=30),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "name": "Creative Design Bundle",
                "description": "Complete design bundle with templates and assets",
                "price": 99.99,
                "category_id": None,
                "category_name": "Art & Design",
                "image_urls": ["/images/products/product-2.png"],
                "stock": 50,
                "sku": "SKU-DES002",
                "is_active": True,
                "tags": ["design", "creative", "bundle"],
                "vendor_id": None,
                "vendor_name": "Design Studio",
                "bundle_type": "business",
                "is_digital": True,
                "created_at": datetime.utcnow() - timedelta(days=25),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "name": "Professional Course",
                "description": "Comprehensive online course for skill development",
                "price": 199.99,
                "category_id": None,
                "category_name": "Courses",
                "image_urls": ["/images/products/product-3.png"],
                "stock": 200,
                "sku": "SKU-COU003",
                "is_active": True,
                "tags": ["course", "professional", "education"],
                "vendor_id": None,
                "vendor_name": "Education Pro",
                "bundle_type": "enterprise",
                "is_digital": True,
                "created_at": datetime.utcnow() - timedelta(days=20),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.db.products.insert_many(mock_products)
        logger.info(f"✅ Migrated {len(mock_products)} mock products")
        
        return [p["id"] for p in mock_products]
    
    async def migrate_mock_customers(self):
        """Migrate mock customers to database"""
        logger.info("Migrating mock customers...")
        
        # Mock customers data (from frontend/mocks/customers.tsx)
        mock_customers = [
            {
                "id": self.generate_id(),
                "name": "Liam Thompson",
                "login": "starrynight",
                "email": "contact@fancymail.com",
                "avatar": "/images/avatars/1.png",
                "price": 1029.48,
                "percentage": 36.8,
                "purchased": 49,
                "comments": 389,
                "likes": 178,
                "created_at": datetime.utcnow() - timedelta(days=60),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "name": "Emma Wilson",
                "login": "emma_w",
                "email": "emma@example.com",
                "avatar": "/images/avatars/2.png",
                "price": 856.32,
                "percentage": 24.5,
                "purchased": 32,
                "comments": 245,
                "likes": 156,
                "created_at": datetime.utcnow() - timedelta(days=45),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "name": "Alex Johnson",
                "login": "alexj",
                "email": "alex@example.com",
                "avatar": "/images/avatars/3.png",
                "price": 1245.67,
                "percentage": 42.1,
                "purchased": 67,
                "comments": 512,
                "likes": 234,
                "created_at": datetime.utcnow() - timedelta(days=30),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.db.customers.insert_many(mock_customers)
        logger.info(f"✅ Migrated {len(mock_customers)} mock customers")
        
        return [c["id"] for c in mock_customers]
    
    async def migrate_mock_messages(self):
        """Migrate mock messages to database"""
        logger.info("Migrating mock messages...")
        
        # Mock messages data (from frontend/mocks/messages.tsx)
        mock_messages = [
            {
                "id": self.generate_id(),
                "sender_id": None,  # Will be set when users are created
                "recipient_id": None,
                "subject": "Project Discussion",
                "content": "Hey! I loved your latest product. Can you tell me more about it?",
                "message_type": "text",
                "is_read": False,
                "is_deleted": False,
                "created_at": datetime.utcnow() - timedelta(days=5),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "sender_id": None,
                "recipient_id": None,
                "subject": "Collaboration Opportunity",
                "content": "I'm interested in collaborating on a project. Are you available?",
                "message_type": "text",
                "is_read": True,
                "is_deleted": False,
                "created_at": datetime.utcnow() - timedelta(days=3),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "sender_id": None,
                "recipient_id": None,
                "subject": "Business Inquiry",
                "content": "Your services are exactly what I need! Let's discuss pricing.",
                "message_type": "text",
                "is_read": False,
                "is_deleted": False,
                "created_at": datetime.utcnow() - timedelta(days=1),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.db.messages.insert_many(mock_messages)
        logger.info(f"✅ Migrated {len(mock_messages)} mock messages")
        
        return [m["id"] for m in mock_messages]
    
    async def migrate_mock_notifications(self):
        """Migrate mock notifications to database"""
        logger.info("Migrating mock notifications...")
        
        # Mock notifications data (from frontend/mocks/notifications.tsx)
        mock_notifications = [
            {
                "id": self.generate_id(),
                "user_id": None,  # Will be set when users are created
                "title": "New Order",
                "message": "You have received a new order!",
                "notification_type": "order",
                "priority": "normal",
                "is_read": False,
                "is_deleted": False,
                "action_url": "/orders",
                "action_data": {"order_id": "123"},
                "created_at": datetime.utcnow() - timedelta(hours=2),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "user_id": None,
                "title": "Payment Received",
                "message": "Payment has been processed successfully.",
                "notification_type": "payment",
                "priority": "high",
                "is_read": True,
                "is_deleted": False,
                "action_url": "/payments",
                "action_data": {"payment_id": "456"},
                "created_at": datetime.utcnow() - timedelta(days=1),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "user_id": None,
                "title": "New Comment",
                "message": "Someone commented on your product.",
                "notification_type": "comment",
                "priority": "normal",
                "is_read": False,
                "is_deleted": False,
                "action_url": "/comments",
                "action_data": {"comment_id": "789"},
                "created_at": datetime.utcnow() - timedelta(hours=6),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.db.notifications.insert_many(mock_notifications)
        logger.info(f"✅ Migrated {len(mock_notifications)} mock notifications")
        
        return [n["id"] for n in mock_notifications]
    
    async def migrate_mock_comments(self):
        """Migrate mock comments to database"""
        logger.info("Migrating mock comments...")
        
        # Mock comments data (from frontend/mocks/comments.tsx)
        mock_comments = [
            {
                "id": self.generate_id(),
                "user_id": None,  # Will be set when users are created
                "product_id": None,  # Will be set when products are created
                "content": "Great product! Highly recommended.",
                "rating": 5,
                "parent_id": None,
                "is_approved": True,
                "is_deleted": False,
                "likes_count": 12,
                "replies_count": 2,
                "user_liked": [],
                "created_at": datetime.utcnow() - timedelta(days=10),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "user_id": None,
                "product_id": None,
                "content": "This is exactly what I was looking for.",
                "rating": 4,
                "parent_id": None,
                "is_approved": True,
                "is_deleted": False,
                "likes_count": 8,
                "replies_count": 1,
                "user_liked": [],
                "created_at": datetime.utcnow() - timedelta(days=7),
                "updated_at": datetime.utcnow()
            },
            {
                "id": self.generate_id(),
                "user_id": None,
                "product_id": None,
                "content": "Amazing quality and fast delivery.",
                "rating": 5,
                "parent_id": None,
                "is_approved": True,
                "is_deleted": False,
                "likes_count": 15,
                "replies_count": 0,
                "user_liked": [],
                "created_at": datetime.utcnow() - timedelta(days=5),
                "updated_at": datetime.utcnow()
            }
        ]
        
        await self.db.comments.insert_many(mock_comments)
        logger.info(f"✅ Migrated {len(mock_comments)} mock comments")
        
        return [c["id"] for c in mock_comments]
    
    async def migrate_all_mock_data(self):
        """Migrate all mock data to database"""
        logger.info("🚀 Starting mock data migration...")
        
        try:
            # Migrate products
            product_ids = await self.migrate_mock_products()
            
            # Migrate customers
            customer_ids = await self.migrate_mock_customers()
            
            # Migrate messages
            message_ids = await self.migrate_mock_messages()
            
            # Migrate notifications
            notification_ids = await self.migrate_mock_notifications()
            
            # Migrate comments
            comment_ids = await self.migrate_mock_comments()
            
            logger.info("🎉 Mock data migration completed successfully!")
            logger.info(f"📊 Migration Summary:")
            logger.info(f"   - Products: {len(product_ids)}")
            logger.info(f"   - Customers: {len(customer_ids)}")
            logger.info(f"   - Messages: {len(message_ids)}")
            logger.info(f"   - Notifications: {len(notification_ids)}")
            logger.info(f"   - Comments: {len(comment_ids)}")
            
            # Create migration report
            await self.create_migration_report({
                "products": len(product_ids),
                "customers": len(customer_ids),
                "messages": len(message_ids),
                "notifications": len(notification_ids),
                "comments": len(comment_ids)
            })
            
        except Exception as e:
            logger.error(f"❌ Error during mock data migration: {e}")
            raise
    
    async def create_migration_report(self, stats: Dict[str, int]):
        """Create a migration report"""
        report = {
            "migration_date": datetime.utcnow().isoformat(),
            "status": "completed",
            "stats": stats,
            "notes": [
                "Mock data has been successfully migrated to the database",
                "All records now have proper IDs and timestamps",
                "Data is ready for use with the new API endpoints"
            ]
        }
        
        # Save report to file
        report_path = "migration_report.json"
        with open(report_path, "w") as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📄 Migration report saved to {report_path}")


async def main():
    """Main function to run the mock data migrator"""
    db = get_database()
    migrator = MockDataMigrator(db)
    await migrator.migrate_all_mock_data()


if __name__ == "__main__":
    asyncio.run(main()) 