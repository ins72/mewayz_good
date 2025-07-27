#!/usr/bin/env python3
"""
Production Data Seeding Script for MEWAYZ V2
Populates the database with real sample data for production testing
"""

import asyncio
import logging
import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from db.session import MongoDatabase
from crud.users import UserCRUD
from crud.products import ProductCRUD
from crud.orders import OrderCRUD
from crud.biolinks import BioLinkCRUD
from crud.messages import MessageCRUD
from crud.comments import CommentCRUD
from crud.notifications import NotificationCRUD
from models.user import User
from models.ecommerce import Product, Order
from models.biolinks import BioLinkPage
from models.messages import Message
from models.comments import Comment
from models.notifications import Notification

logger = logging.getLogger(__name__)


class ProductionDataSeeder:
    """Production data seeder for MEWAYZ V2"""
    
    def __init__(self):
        self.db = MongoDatabase()
        self.user_crud = UserCRUD(self.db)
        self.product_crud = ProductCRUD(self.db)
        self.order_crud = OrderCRUD(self.db)
        self.biolink_crud = BioLinkCRUD()
        self.message_crud = MessageCRUD(self.db)
        self.comment_crud = CommentCRUD(self.db)
        self.notification_crud = NotificationCRUD(self.db)
        
        # Store created IDs for relationships
        self.created_users = []
        self.created_products = []
        self.created_orders = []
        self.created_biolinks = []
    
    async def seed_all_data(self):
        """Seed all production data"""
        logger.info("🚀 Starting production data seeding...")
        
        try:
            # Seed users first (needed for relationships)
            await self.seed_users()
            
            # Seed products (depends on users)
            await self.seed_products()
            
            # Seed orders (depends on users and products)
            await self.seed_orders()
            
            # Seed biolinks (depends on users)
            await self.seed_biolinks()
            
            # Seed messages (depends on users)
            await self.seed_messages()
            
            # Seed comments (depends on users and products)
            await self.seed_comments()
            
            # Seed notifications (depends on users)
            await self.seed_notifications()
            
            logger.info("✅ Production data seeding completed successfully!")
            
            # Print summary
            await self.print_seeding_summary()
            
        except Exception as e:
            logger.error(f"❌ Error during data seeding: {e}")
            raise
    
    async def seed_users(self):
        """Seed real user data"""
        logger.info("👥 Seeding users...")
        
        users_data = [
            {
                "email": "john.creator@example.com",
                "password": "hashed_password_123",
                "full_name": "John Creator",
                "role": "creator",
                "bio": "Digital content creator and influencer",
                "avatar": "/images/avatars/creator-1.png",
                "social_links": {
                    "instagram": "https://instagram.com/johncreator",
                    "youtube": "https://youtube.com/johncreator",
                    "tiktok": "https://tiktok.com/@johncreator"
                }
            },
            {
                "email": "sarah.business@example.com",
                "password": "hashed_password_123",
                "full_name": "Sarah Business",
                "role": "business",
                "bio": "E-commerce entrepreneur and business consultant",
                "avatar": "/images/avatars/business-1.png",
                "company": "Sarah's Business Solutions"
            },
            {
                "email": "mike.developer@example.com",
                "password": "hashed_password_123",
                "full_name": "Mike Developer",
                "role": "creator",
                "bio": "Software developer and tech educator",
                "avatar": "/images/avatars/developer-1.png",
                "social_links": {
                    "github": "https://github.com/mikedeveloper",
                    "linkedin": "https://linkedin.com/in/mikedeveloper"
                }
            },
            {
                "email": "emily.designer@example.com",
                "password": "hashed_password_123",
                "full_name": "Emily Designer",
                "role": "creator",
                "bio": "UI/UX designer and creative professional",
                "avatar": "/images/avatars/designer-1.png",
                "social_links": {
                    "behance": "https://behance.net/emilydesigner",
                    "dribbble": "https://dribbble.com/emilydesigner"
                }
            },
            {
                "email": "david.entrepreneur@example.com",
                "password": "hashed_password_123",
                "full_name": "David Entrepreneur",
                "role": "business",
                "bio": "Serial entrepreneur and startup advisor",
                "avatar": "/images/avatars/entrepreneur-1.png",
                "company": "David's Ventures"
            }
        ]
        
        for user_data in users_data:
            try:
                user = await self.user_crud.create_user(user_data)
                self.created_users.append(user)
                logger.info(f"✅ Created user: {user.full_name}")
            except Exception as e:
                logger.error(f"❌ Error creating user {user_data['email']}: {e}")
        
        logger.info(f"✅ Seeded {len(self.created_users)} users")
    
    async def seed_products(self):
        """Seed real product data"""
        logger.info("🛍️ Seeding products...")
        
        products_data = [
            {
                "name": "Premium Bio Link Template",
                "description": "Professional bio link page with advanced analytics and custom themes",
                "price": 29.99,
                "category_name": "Digital Products",
                "bundle_type": "creator",
                "is_digital": True,
                "vendor_id": self.created_users[0].id if self.created_users else None,
                "vendor_name": "John Creator",
                "image_urls": ["/images/products/bio-link-template.png"],
                "stock": 100,
                "sku": "SKU-BIO-001",
                "tags": ["bio-link", "template", "creator", "analytics"],
                "features": [
                    "Custom themes",
                    "Analytics dashboard",
                    "Social media integration",
                    "Mobile responsive"
                ]
            },
            {
                "name": "E-commerce Store Builder",
                "description": "Complete e-commerce solution with payment processing and inventory management",
                "price": 199.99,
                "category_name": "Digital Products",
                "bundle_type": "ecommerce",
                "is_digital": True,
                "vendor_id": self.created_users[1].id if len(self.created_users) > 1 else None,
                "vendor_name": "Sarah Business",
                "image_urls": ["/images/products/ecommerce-builder.png"],
                "stock": 50,
                "sku": "SKU-ECO-001",
                "tags": ["ecommerce", "store", "payment", "inventory"],
                "features": [
                    "Payment processing",
                    "Inventory management",
                    "Order tracking",
                    "Multi-vendor support"
                ]
            },
            {
                "name": "Digital Marketing Course",
                "description": "Comprehensive digital marketing course with certification",
                "price": 149.99,
                "category_name": "Education",
                "bundle_type": "education",
                "is_digital": True,
                "vendor_id": self.created_users[2].id if len(self.created_users) > 2 else None,
                "vendor_name": "Mike Developer",
                "image_urls": ["/images/products/marketing-course.png"],
                "stock": 200,
                "sku": "SKU-EDU-001",
                "tags": ["course", "marketing", "education", "certification"],
                "features": [
                    "12 modules",
                    "Video lessons",
                    "Certification",
                    "Lifetime access"
                ]
            },
            {
                "name": "UI Design System",
                "description": "Complete UI design system with components and documentation",
                "price": 89.99,
                "category_name": "Digital Products",
                "bundle_type": "creator",
                "is_digital": True,
                "vendor_id": self.created_users[3].id if len(self.created_users) > 3 else None,
                "vendor_name": "Emily Designer",
                "image_urls": ["/images/products/ui-design-system.png"],
                "stock": 75,
                "sku": "SKU-DES-001",
                "tags": ["design", "ui", "components", "system"],
                "features": [
                    "100+ components",
                    "Design tokens",
                    "Documentation",
                    "Figma files"
                ]
            },
            {
                "name": "Business Strategy Template",
                "description": "Comprehensive business strategy and planning template",
                "price": 79.99,
                "category_name": "Services",
                "bundle_type": "business",
                "is_digital": True,
                "vendor_id": self.created_users[4].id if len(self.created_users) > 4 else None,
                "vendor_name": "David Entrepreneur",
                "image_urls": ["/images/products/business-strategy.png"],
                "stock": 100,
                "sku": "SKU-BUS-001",
                "tags": ["business", "strategy", "planning", "template"],
                "features": [
                    "Business plan template",
                    "Financial projections",
                    "Market analysis",
                    "Strategy framework"
                ]
            }
        ]
        
        for product_data in products_data:
            try:
                product = await self.product_crud.create_product(product_data)
                self.created_products.append(product)
                logger.info(f"✅ Created product: {product.name}")
            except Exception as e:
                logger.error(f"❌ Error creating product {product_data['name']}: {e}")
        
        logger.info(f"✅ Seeded {len(self.created_products)} products")
    
    async def seed_orders(self):
        """Seed real order data"""
        logger.info("📦 Seeding orders...")
        
        if not self.created_users or not self.created_products:
            logger.warning("⚠️ No users or products available for orders")
            return
        
        orders_data = [
            {
                "user_id": self.created_users[0].id,
                "total": 29.99,
                "status": "completed",
                "items": [
                    {
                        "product_id": self.created_products[0].id,
                        "quantity": 1,
                        "price": 29.99,
                        "product_name": "Premium Bio Link Template"
                    }
                ],
                "payment_method": "stripe",
                "shipping_address": {
                    "name": "John Creator",
                    "email": "john.creator@example.com"
                }
            },
            {
                "user_id": self.created_users[1].id,
                "total": 199.99,
                "status": "completed",
                "items": [
                    {
                        "product_id": self.created_products[1].id,
                        "quantity": 1,
                        "price": 199.99,
                        "product_name": "E-commerce Store Builder"
                    }
                ],
                "payment_method": "stripe",
                "shipping_address": {
                    "name": "Sarah Business",
                    "email": "sarah.business@example.com"
                }
            },
            {
                "user_id": self.created_users[2].id,
                "total": 149.99,
                "status": "pending",
                "items": [
                    {
                        "product_id": self.created_products[2].id,
                        "quantity": 1,
                        "price": 149.99,
                        "product_name": "Digital Marketing Course"
                    }
                ],
                "payment_method": "stripe",
                "shipping_address": {
                    "name": "Mike Developer",
                    "email": "mike.developer@example.com"
                }
            }
        ]
        
        for order_data in orders_data:
            try:
                order = await self.order_crud.create_order(order_data)
                self.created_orders.append(order)
                logger.info(f"✅ Created order: {order.id} - ${order.total}")
            except Exception as e:
                logger.error(f"❌ Error creating order: {e}")
        
        logger.info(f"✅ Seeded {len(self.created_orders)} orders")
    
    async def seed_biolinks(self):
        """Seed real biolink data"""
        logger.info("🔗 Seeding biolinks...")
        
        if not self.created_users:
            logger.warning("⚠️ No users available for biolinks")
            return
        
        biolinks_data = [
            {
                "name": "John's Creator Hub",
                "user_id": self.created_users[0].id,
                "url": "john-creator",
                "theme": "modern",
                "description": "Connect with John Creator across all platforms",
                "social_links": [
                    {"platform": "instagram", "url": "https://instagram.com/johncreator"},
                    {"platform": "youtube", "url": "https://youtube.com/johncreator"},
                    {"platform": "tiktok", "url": "https://tiktok.com/@johncreator"}
                ],
                "buttons": [
                    {"text": "Latest Video", "url": "https://youtube.com/johncreator/latest"},
                    {"text": "Shop Products", "url": "https://shop.johncreator.com"}
                ]
            },
            {
                "name": "Sarah's Business Solutions",
                "user_id": self.created_users[1].id,
                "url": "sarah-business",
                "theme": "professional",
                "description": "Professional business consulting and e-commerce solutions",
                "social_links": [
                    {"platform": "linkedin", "url": "https://linkedin.com/in/sarahbusiness"},
                    {"platform": "twitter", "url": "https://twitter.com/sarahbusiness"}
                ],
                "buttons": [
                    {"text": "Book Consultation", "url": "https://calendly.com/sarahbusiness"},
                    {"text": "View Services", "url": "https://services.sarahbusiness.com"}
                ]
            }
        ]
        
        for biolink_data in biolinks_data:
            try:
                biolink = await self.biolink_crud.create_biolink(biolink_data)
                self.created_biolinks.append(biolink)
                logger.info(f"✅ Created biolink: {biolink.name}")
            except Exception as e:
                logger.error(f"❌ Error creating biolink {biolink_data['name']}: {e}")
        
        logger.info(f"✅ Seeded {len(self.created_biolinks)} biolinks")
    
    async def seed_messages(self):
        """Seed real message data"""
        logger.info("💬 Seeding messages...")
        
        if len(self.created_users) < 2:
            logger.warning("⚠️ Need at least 2 users for messages")
            return
        
        messages_data = [
            {
                "sender_id": self.created_users[0].id,
                "recipient_id": self.created_users[1].id,
                "subject": "Collaboration Opportunity",
                "content": "Hi Sarah! I loved your e-commerce solution. Would you be interested in collaborating on a project?",
                "message_type": "text",
                "is_read": False
            },
            {
                "sender_id": self.created_users[1].id,
                "recipient_id": self.created_users[0].id,
                "subject": "Re: Collaboration Opportunity",
                "content": "Hi John! That sounds great! Let's schedule a call to discuss the details.",
                "message_type": "text",
                "is_read": True
            },
            {
                "sender_id": self.created_users[2].id,
                "recipient_id": self.created_users[3].id,
                "subject": "Design Consultation",
                "content": "Hi Emily! I'm working on a new app and would love to get your input on the UI design.",
                "message_type": "text",
                "is_read": False
            }
        ]
        
        for message_data in messages_data:
            try:
                message = await self.message_crud.create_message(message_data)
                logger.info(f"✅ Created message: {message.subject}")
            except Exception as e:
                logger.error(f"❌ Error creating message: {e}")
        
        logger.info(f"✅ Seeded {len(messages_data)} messages")
    
    async def seed_comments(self):
        """Seed real comment data"""
        logger.info("💭 Seeding comments...")
        
        if not self.created_users or not self.created_products:
            logger.warning("⚠️ No users or products available for comments")
            return
        
        comments_data = [
            {
                "user_id": self.created_users[1].id,
                "product_id": self.created_products[0].id,
                "content": "Amazing bio link template! The analytics feature is exactly what I needed.",
                "rating": 5,
                "is_approved": True
            },
            {
                "user_id": self.created_users[2].id,
                "product_id": self.created_products[1].id,
                "content": "Great e-commerce solution. Easy to set up and very comprehensive.",
                "rating": 4,
                "is_approved": True
            },
            {
                "user_id": self.created_users[3].id,
                "product_id": self.created_products[2].id,
                "content": "Excellent course! The content is well-structured and very informative.",
                "rating": 5,
                "is_approved": True
            }
        ]
        
        for comment_data in comments_data:
            try:
                comment = await self.comment_crud.create_comment(comment_data)
                logger.info(f"✅ Created comment: {comment.content[:50]}...")
            except Exception as e:
                logger.error(f"❌ Error creating comment: {e}")
        
        logger.info(f"✅ Seeded {len(comments_data)} comments")
    
    async def seed_notifications(self):
        """Seed real notification data"""
        logger.info("🔔 Seeding notifications...")
        
        if not self.created_users:
            logger.warning("⚠️ No users available for notifications")
            return
        
        notifications_data = [
            {
                "user_id": self.created_users[0].id,
                "title": "New Order Received",
                "message": "You received a new order for Premium Bio Link Template",
                "notification_type": "order",
                "is_read": False
            },
            {
                "user_id": self.created_users[1].id,
                "title": "Payment Successful",
                "message": "Payment of $199.99 has been processed successfully",
                "notification_type": "payment",
                "is_read": True
            },
            {
                "user_id": self.created_users[2].id,
                "title": "New Comment",
                "message": "Someone commented on your Digital Marketing Course",
                "notification_type": "comment",
                "is_read": False
            }
        ]
        
        for notification_data in notifications_data:
            try:
                notification = await self.notification_crud.create_notification(notification_data)
                logger.info(f"✅ Created notification: {notification.title}")
            except Exception as e:
                logger.error(f"❌ Error creating notification: {e}")
        
        logger.info(f"✅ Seeded {len(notifications_data)} notifications")
    
    async def print_seeding_summary(self):
        """Print a summary of seeded data"""
        logger.info("\n" + "="*50)
        logger.info("📊 PRODUCTION DATA SEEDING SUMMARY")
        logger.info("="*50)
        logger.info(f"👥 Users: {len(self.created_users)}")
        logger.info(f"🛍️ Products: {len(self.created_products)}")
        logger.info(f"📦 Orders: {len(self.created_orders)}")
        logger.info(f"🔗 BioLinks: {len(self.created_biolinks)}")
        logger.info(f"💬 Messages: {len(self.created_users) * 2}")  # Approximate
        logger.info(f"💭 Comments: {len(self.created_products)}")  # Approximate
        logger.info(f"🔔 Notifications: {len(self.created_users)}")  # Approximate
        logger.info("="*50)
        logger.info("✅ Production data seeding completed!")
        logger.info("🎯 The platform is now ready for real data testing!")


async def main():
    """Main function to run the data seeder"""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Check environment variables
    if not os.getenv("MONGO_URL"):
        logger.error("❌ MONGO_URL environment variable not set")
        return
    
    # Create seeder and run
    seeder = ProductionDataSeeder()
    await seeder.seed_all_data()


if __name__ == "__main__":
    asyncio.run(main()) 