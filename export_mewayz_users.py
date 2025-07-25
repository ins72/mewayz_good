#!/usr/bin/env python3
"""
Export Users from MEWAYZ Database
"""

import asyncio
import json
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import stripe
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

# Configure connections
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Use the MEWAYZ database instead of test_database
DB_NAME = 'mewayz'

print("🔍 MEWAYZ DATABASE - Users and Payment Methods Export")
print("=" * 70)
print(f"📅 Export Time: {datetime.now().isoformat()}")
print(f"🗄️  Database: {MONGO_URL}")
print(f"📊 Database Name: {DB_NAME}")
print(f"💳 Stripe API: {'Configured' if stripe.api_key else 'Not Configured'}")
print("=" * 70)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

async def export_mewayz_users():
    """Export all users from mewayz database with payment info"""
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # List all collections in mewayz database
        collections = await db.list_collection_names()
        print(f"\n📁 Collections in '{DB_NAME}':")
        
        export_data = {
            "export_metadata": {
                "timestamp": datetime.now().isoformat(),
                "database": DB_NAME,
                "collections": collections,
                "stripe_configured": bool(stripe.api_key)
            },
            "collections_data": {}
        }
        
        # Check each collection
        for collection_name in collections:
            collection = db[collection_name]
            count = await collection.count_documents({})
            print(f"   - {collection_name}: {count} documents")
            
            if count > 0:
                # Get all documents from this collection
                cursor = collection.find({})
                docs = await cursor.to_list(length=None)
                
                export_data["collections_data"][collection_name] = {
                    "count": count,
                    "documents": docs
                }
                
                # Display document details
                print(f"\n📋 {collection_name.upper()} COLLECTION:")
                print("-" * 50)
                
                for i, doc in enumerate(docs, 1):
                    print(f"\n{i}. Document ID: {doc.get('_id')}")
                    
                    # Display all fields for each document
                    for key, value in doc.items():
                        if key == '_id':
                            continue
                        if isinstance(value, str) and len(value) > 100:
                            print(f"   {key}: {value[:100]}...")
                        else:
                            print(f"   {key}: {value}")
                    
                    # If this looks like a user document, get Stripe info
                    email = doc.get('email')
                    if email and '@' in email:
                        print(f"\n   🔍 Checking Stripe data for: {email}")
                        stripe_info = await get_stripe_customer_info(email)
                        if stripe_info:
                            print(f"   💳 Stripe Customer: ✅ {stripe_info['customer_id']}")
                            print(f"   💰 Payment Methods: {len(stripe_info['payment_methods'])}")
                            print(f"   📊 Subscriptions: {len(stripe_info['subscriptions'])}")
                            
                            # Add to export data
                            if 'stripe_data' not in export_data["collections_data"][collection_name]:
                                export_data["collections_data"][collection_name]['stripe_data'] = {}
                            export_data["collections_data"][collection_name]['stripe_data'][email] = stripe_info
                        else:
                            print(f"   💳 Stripe Customer: ❌ Not found")
        
        # Export to JSON file
        export_filename = f"/app/mewayz_users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(export_filename, 'w') as f:
            json.dump(export_data, f, indent=2, cls=JSONEncoder)
        
        print(f"\n💾 EXPORT COMPLETED:")
        print(f"   📁 File: {export_filename}")
        print(f"   📊 Collections: {len(export_data['collections_data'])}")
        
        # Summary of users with email addresses
        total_emails = 0
        total_stripe_customers = 0
        for collection_name, collection_data in export_data["collections_data"].items():
            for doc in collection_data.get("documents", []):
                if doc.get('email') and '@' in doc.get('email'):
                    total_emails += 1
            if 'stripe_data' in collection_data:
                total_stripe_customers += len(collection_data['stripe_data'])
        
        print(f"   👥 Email Addresses Found: {total_emails}")
        print(f"   💳 Stripe Customers Found: {total_stripe_customers}")
        
        return export_filename
        
    finally:
        client.close()

async def get_stripe_customer_info(email):
    """Get Stripe customer information by email"""
    try:
        if not stripe.api_key:
            return None
            
        customers = stripe.Customer.list(email=email, limit=1)
        if not customers.data:
            return None
        
        customer = customers.data[0]
        
        # Get payment methods
        payment_methods = stripe.PaymentMethod.list(customer=customer.id, type="card")
        
        # Get subscriptions
        subscriptions = stripe.Subscription.list(customer=customer.id, status='all')
        
        return {
            "customer_id": customer.id,
            "email": customer.email,
            "name": customer.name,
            "created": customer.created,
            "metadata": dict(customer.metadata) if customer.metadata else {},
            "payment_methods": [
                {
                    "id": pm.id,
                    "card": {
                        "brand": pm.card.brand,
                        "last4": pm.card.last4,
                        "exp_month": pm.card.exp_month,
                        "exp_year": pm.card.exp_year,
                        "funding": pm.card.funding
                    },
                    "created": pm.created
                }
                for pm in payment_methods.data
            ],
            "subscriptions": [
                {
                    "id": sub.id,
                    "status": sub.status,
                    "current_period_end": sub.current_period_end,
                    "cancel_at_period_end": sub.cancel_at_period_end,
                    "amount": sub.items.data[0].price.unit_amount if sub.items.data else 0,
                    "interval": sub.items.data[0].price.recurring.interval if sub.items.data and sub.items.data[0].price.recurring else 'month',
                    "metadata": dict(sub.metadata) if sub.metadata else {},
                    "created": sub.created
                }
                for sub in subscriptions.data
            ]
        }
        
    except Exception as e:
        print(f"   ⚠️  Error getting Stripe data for {email}: {str(e)}")
        return None

if __name__ == "__main__":
    asyncio.run(export_mewayz_users())