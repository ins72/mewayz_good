"""
Data Seeding Script for MEWAYZ V2
Populates the database with real sample data for development and testing
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import random
import string

from db.database import get_database
from models.user import User
from models.ecommerce import Product, Category, Order
from models.biolinks import BioLinkPage
from models.messages import Message
from models.comments import Comment
from models.notifications import Notification

logger = logging.getLogger(__name__)


class DataSeeder:
    """Data seeder for populating database with sample data"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    def generate_id(self) -> str:
        """Generate a random ID"""
        return str(ObjectId())
    
    def generate_random_string(self, length: int = 8) -> str:
        """Generate a random string"""
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
    
    def generate_random_email(self) -> str:
        """Generate a random email"""
        domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com']
        username = self.generate_random_string(8)
        domain = random.choice(domains)
        return f"{username}@{domain}"
    
    def generate_random_name(self) -> str:
        """Generate a random name"""
        first_names = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Alex', 'Maria']
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
        return f"{random.choice(first_names)} {random.choice(last_names)}"
    
    async def seed_users(self, count: int = 50) -> List[str]:
        """Seed users with sample data"""
        logger.info(f"Seeding {count} users...")
        
        users = []
        user_ids = []
        
        for i in range(count):
            user = {
                "id": self.generate_id(),
                "email": self.generate_random_email(),
                "full_name": self.generate_random_name(),
                "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i",  # "password123"
                "is_active": True,
                "email_validated": True,
                "created": datetime.utcnow() - timedelta(days=random.randint(1, 365)),
                "modified": datetime.utcnow(),
                "is_superuser": i == 0,  # First user is superuser
                "refresh_tokens": []
            }
            users.append(user)
            user_ids.append(user["id"])
        
        if users:
            await self.db.users.insert_many(users)
            logger.info(f"✅ Seeded {len(users)} users")
        
        return user_ids
    
    async def seed_categories(self) -> List[str]:
        """Seed product categories"""
        logger.info("Seeding product categories...")
        
        categories = [
            {"id": self.generate_id(), "name": "Digital Products", "description": "Digital downloads and content"},
            {"id": self.generate_id(), "name": "Physical Products", "description": "Physical goods and merchandise"},
            {"id": self.generate_id(), "name": "Services", "description": "Professional services and consulting"},
            {"id": self.generate_id(), "name": "Courses", "description": "Educational courses and training"},
            {"id": self.generate_id(), "name": "Software", "description": "Software and applications"},
            {"id": self.generate_id(), "name": "Art & Design", "description": "Creative works and designs"},
        ]
        
        for category in categories:
            category.update({
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        await self.db.categories.insert_many(categories)
        logger.info(f"✅ Seeded {len(categories)} categories")
        
        return [cat["id"] for cat in categories]
    
    async def seed_products(self, user_ids: List[str], category_ids: List[str], count: int = 100) -> List[str]:
        """Seed products with sample data"""
        logger.info(f"Seeding {count} products...")
        
        products = []
        product_ids = []
        
        product_names = [
            "Premium Digital Template", "Creative Design Bundle", "Professional Course",
            "Custom Software Solution", "Art Collection", "Business Toolkit",
            "Marketing Masterclass", "Design System", "Content Creator Kit",
            "E-commerce Template", "Mobile App Template", "Website Theme"
        ]
        
        for i in range(count):
            product = {
                "id": self.generate_id(),
                "name": f"{random.choice(product_names)} {i+1}",
                "description": f"This is a sample product description for product {i+1}. It includes detailed information about the features and benefits.",
                "price": round(random.uniform(9.99, 299.99), 2),
                "category_id": random.choice(category_ids),
                "category_name": random.choice(["Digital Products", "Physical Products", "Services", "Courses"]),
                "image_urls": [f"/images/products/product-{random.randint(1, 20)}.png"],
                "stock": random.randint(0, 100),
                "sku": f"SKU-{self.generate_random_string(6).upper()}",
                "is_active": random.choice([True, True, True, False]),  # 75% active
                "tags": random.sample(["digital", "premium", "template", "design", "creative", "professional"], 3),
                "vendor_id": random.choice(user_ids),
                "vendor_name": self.generate_random_name(),
                "bundle_type": random.choice(["creator", "business", "enterprise", None]),
                "is_digital": random.choice([True, False]),
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 180)),
                "updated_at": datetime.utcnow()
            }
            products.append(product)
            product_ids.append(product["id"])
        
        if products:
            await self.db.products.insert_many(products)
            logger.info(f"✅ Seeded {len(products)} products")
        
        return product_ids
    
    async def seed_orders(self, user_ids: List[str], product_ids: List[str], count: int = 200) -> List[str]:
        """Seed orders with sample data"""
        logger.info(f"Seeding {count} orders...")
        
        orders = []
        order_ids = []
        
        statuses = ["pending", "processing", "completed", "cancelled", "refunded"]
        status_weights = [0.1, 0.2, 0.6, 0.05, 0.05]  # 60% completed
        
        for i in range(count):
            product_id = random.choice(product_ids)
            status = random.choices(statuses, weights=status_weights)[0]
            
            order = {
                "id": self.generate_id(),
                "customer_id": random.choice(user_ids),
                "vendor_id": random.choice(user_ids),
                "product_id": product_id,
                "quantity": random.randint(1, 5),
                "unit_price": round(random.uniform(9.99, 299.99), 2),
                "total_amount": round(random.uniform(19.99, 599.99), 2),
                "status": status,
                "payment_method": random.choice(["stripe", "paypal", "bank_transfer"]),
                "shipping_address": {
                    "street": f"{random.randint(100, 9999)} Main St",
                    "city": random.choice(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]),
                    "state": random.choice(["NY", "CA", "IL", "TX", "AZ"]),
                    "zip_code": f"{random.randint(10000, 99999)}",
                    "country": "US"
                },
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 90)),
                "updated_at": datetime.utcnow()
            }
            orders.append(order)
            order_ids.append(order["id"])
        
        if orders:
            await self.db.orders.insert_many(orders)
            logger.info(f"✅ Seeded {len(orders)} orders")
        
        return order_ids
    
    async def seed_bio_links(self, user_ids: List[str], count: int = 30) -> List[str]:
        """Seed bio links with sample data"""
        logger.info(f"Seeding {count} bio links...")
        
        bio_links = []
        bio_link_ids = []
        
        for i in range(count):
            bio_link = {
                "id": self.generate_id(),
                "user_id": random.choice(user_ids),
                "slug": f"bio-{self.generate_random_string(8)}",
                "title": f"Bio Link {i+1}",
                "description": f"Personal bio link for user {i+1}",
                "avatar_url": f"/images/avatars/avatar-{random.randint(1, 10)}.png",
                "buttons": [],
                "social_links": [],
                "theme": {
                    "background_color": "#ffffff",
                    "text_color": "#000000",
                    "accent_color": "#3b82f6"
                },
                "view_count": random.randint(0, 10000),
                "total_clicks": random.randint(0, 5000),
                "is_published": random.choice([True, True, False]),  # 67% published
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 365)),
                "updated_at": datetime.utcnow()
            }
            bio_links.append(bio_link)
            bio_link_ids.append(bio_link["id"])
        
        if bio_links:
            await self.db.bio_links.insert_many(bio_links)
            logger.info(f"✅ Seeded {len(bio_links)} bio links")
        
        return bio_link_ids
    
    async def seed_messages(self, user_ids: List[str], count: int = 150) -> List[str]:
        """Seed messages with sample data"""
        logger.info(f"Seeding {count} messages...")
        
        messages = []
        message_ids = []
        
        message_contents = [
            "Hey! I loved your latest product. Can you tell me more about it?",
            "Thanks for the quick response!",
            "I'm interested in collaborating on a project.",
            "Your bio link looks amazing!",
            "Do you have any upcoming courses?",
            "I'd like to discuss a business opportunity.",
            "Great work on the new template!",
            "Can you help me with a custom design?",
            "I'm looking for someone to create content for my brand.",
            "Your services are exactly what I need!"
        ]
        
        for i in range(count):
            sender_id = random.choice(user_ids)
            recipient_id = random.choice([uid for uid in user_ids if uid != sender_id])
            
            message = {
                "id": self.generate_id(),
                "sender_id": sender_id,
                "recipient_id": recipient_id,
                "subject": f"Message {i+1}",
                "content": random.choice(message_contents),
                "message_type": "text",
                "is_read": random.choice([True, False]),
                "is_deleted": False,
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                "updated_at": datetime.utcnow()
            }
            messages.append(message)
            message_ids.append(message["id"])
        
        if messages:
            await self.db.messages.insert_many(messages)
            logger.info(f"✅ Seeded {len(messages)} messages")
        
        return message_ids
    
    async def seed_comments(self, user_ids: List[str], product_ids: List[str], count: int = 300) -> List[str]:
        """Seed comments with sample data"""
        logger.info(f"Seeding {count} comments...")
        
        comments = []
        comment_ids = []
        
        comment_contents = [
            "Great product! Highly recommended.",
            "This is exactly what I was looking for.",
            "Amazing quality and fast delivery.",
            "Could be better, but overall good.",
            "Love the design and functionality!",
            "Worth every penny!",
            "Good product, but needs some improvements.",
            "Excellent service and support.",
            "Perfect for my needs.",
            "Really happy with this purchase!"
        ]
        
        for i in range(count):
            comment = {
                "id": self.generate_id(),
                "user_id": random.choice(user_ids),
                "product_id": random.choice(product_ids),
                "content": random.choice(comment_contents),
                "rating": random.randint(1, 5),
                "parent_id": None,
                "is_approved": random.choice([True, True, True, False]),  # 75% approved
                "is_deleted": False,
                "likes_count": random.randint(0, 50),
                "replies_count": random.randint(0, 10),
                "user_liked": random.sample(user_ids, random.randint(0, 5)),
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 60)),
                "updated_at": datetime.utcnow()
            }
            comments.append(comment)
            comment_ids.append(comment["id"])
        
        if comments:
            await self.db.comments.insert_many(comments)
            logger.info(f"✅ Seeded {len(comments)} comments")
        
        return comment_ids
    
    async def seed_notifications(self, user_ids: List[str], count: int = 200) -> List[str]:
        """Seed notifications with sample data"""
        logger.info(f"Seeding {count} notifications...")
        
        notifications = []
        notification_ids = []
        
        notification_templates = [
            {"title": "New Order", "message": "You have received a new order!", "type": "order"},
            {"title": "Product Update", "message": "Your product has been updated successfully.", "type": "product"},
            {"title": "New Message", "message": "You have received a new message.", "type": "message"},
            {"title": "Payment Received", "message": "Payment has been processed successfully.", "type": "payment"},
            {"title": "System Update", "message": "System maintenance completed.", "type": "system"},
            {"title": "New Comment", "message": "Someone commented on your product.", "type": "comment"},
            {"title": "Bio Link View", "message": "Your bio link received a new view.", "type": "biolink"},
        ]
        
        for i in range(count):
            template = random.choice(notification_templates)
            
            notification = {
                "id": self.generate_id(),
                "user_id": random.choice(user_ids),
                "title": template["title"],
                "message": template["message"],
                "notification_type": template["type"],
                "priority": random.choice(["low", "normal", "high"]),
                "is_read": random.choice([True, False]),
                "is_deleted": False,
                "action_url": None,
                "action_data": {},
                "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                "updated_at": datetime.utcnow()
            }
            notifications.append(notification)
            notification_ids.append(notification["id"])
        
        if notifications:
            await self.db.notifications.insert_many(notifications)
            logger.info(f"✅ Seeded {len(notifications)} notifications")
        
        return notification_ids
    
    async def seed_all_data(self):
        """Seed all data types"""
        logger.info("🚀 Starting data seeding process...")
        
        try:
            # Seed users first (required for other entities)
            user_ids = await self.seed_users(50)
            
            # Seed categories
            category_ids = await self.seed_categories()
            
            # Seed products
            product_ids = await self.seed_products(user_ids, category_ids, 100)
            
            # Seed orders
            order_ids = await self.seed_orders(user_ids, product_ids, 200)
            
            # Seed bio links
            bio_link_ids = await self.seed_bio_links(user_ids, 30)
            
            # Seed messages
            message_ids = await self.seed_messages(user_ids, 150)
            
            # Seed comments
            comment_ids = await self.seed_comments(user_ids, product_ids, 300)
            
            # Seed notifications
            notification_ids = await self.seed_notifications(user_ids, 200)
            
            logger.info("🎉 Data seeding completed successfully!")
            logger.info(f"📊 Summary:")
            logger.info(f"   - Users: {len(user_ids)}")
            logger.info(f"   - Categories: {len(category_ids)}")
            logger.info(f"   - Products: {len(product_ids)}")
            logger.info(f"   - Orders: {len(order_ids)}")
            logger.info(f"   - Bio Links: {len(bio_link_ids)}")
            logger.info(f"   - Messages: {len(message_ids)}")
            logger.info(f"   - Comments: {len(comment_ids)}")
            logger.info(f"   - Notifications: {len(notification_ids)}")
            
        except Exception as e:
            logger.error(f"❌ Error during data seeding: {e}")
            raise


async def main():
    """Main function to run the data seeder"""
    db = get_database()
    seeder = DataSeeder(db)
    await seeder.seed_all_data()


if __name__ == "__main__":
    asyncio.run(main()) 