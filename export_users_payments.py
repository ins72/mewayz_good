#!/usr/bin/env python3
"""
Export Database Users and Linked Payment Methods
Comprehensive analysis of users, workspaces, and Stripe payment data
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
DB_NAME = os.getenv('DB_NAME', 'test_database')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

print("🔍 MEWAYZ V2 - Database Users and Payment Methods Export")
print("=" * 70)
print(f"📅 Export Time: {datetime.now().isoformat()}")
print(f"🗄️  Database: {MONGO_URL}")
print(f"💳 Stripe API: {'Configured' if stripe.api_key else 'Not Configured'}")
print("=" * 70)

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for MongoDB ObjectIds and datetime objects"""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

async def export_users_and_payments():
    """Export all users with their payment information"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Get all users
        users_collection = db.users
        workspaces_collection = db.workspaces if 'workspaces' in await db.list_collection_names() else None
        
        users_cursor = users_collection.find({})
        users = await users_cursor.to_list(length=None)
        
        print(f"\n📊 SUMMARY:")
        print(f"   👥 Total Users in Database: {len(users)}")
        
        if workspaces_collection:
            workspace_count = await workspaces_collection.count_documents({})
            print(f"   🏢 Total Workspaces: {workspace_count}")
        
        export_data = {
            "export_metadata": {
                "timestamp": datetime.now().isoformat(),
                "total_users": len(users),
                "database": DB_NAME,
                "stripe_configured": bool(stripe.api_key)
            },
            "users": []
        }
        
        print(f"\n📋 DETAILED USER EXPORT:")
        print("-" * 70)
        
        for i, user in enumerate(users, 1):
            user_id = str(user.get('_id'))
            email = user.get('email', 'NO_EMAIL')
            full_name = user.get('full_name', 'NO_NAME')
            created_at = user.get('created_at', 'UNKNOWN')
            
            print(f"\n{i}. 👤 USER: {email}")
            print(f"   📧 Email: {email}")
            print(f"   📛 Name: {full_name}")
            print(f"   🆔 User ID: {user_id}")
            print(f"   📅 Created: {created_at}")
            
            # Get workspace info
            workspace_info = None
            if workspaces_collection:
                workspace = await workspaces_collection.find_one({"owner_id": user_id})
                if workspace:
                    workspace_info = {
                        "workspace_id": str(workspace.get('_id')),
                        "name": workspace.get('name', 'UNNAMED'),
                        "created_at": workspace.get('created_at', 'UNKNOWN')
                    }
                    print(f"   🏢 Workspace: {workspace_info['name']} (ID: {workspace_info['workspace_id']})")
                else:
                    print(f"   🏢 Workspace: ❌ No workspace found")
            
            # Get Stripe customer information
            stripe_info = await get_stripe_customer_info(email)
            
            if stripe_info:
                print(f"   💳 Stripe Customer: ✅ {stripe_info['customer_id']}")
                print(f"   💰 Payment Methods: {len(stripe_info['payment_methods'])}")
                print(f"   📊 Subscriptions: {len(stripe_info['subscriptions'])}")
                
                # Show payment method details
                for pm in stripe_info['payment_methods']:
                    card = pm.get('card', {})
                    print(f"      💳 Card: {card.get('brand', 'unknown')} ****{card.get('last4', '0000')} ({card.get('exp_month', 'XX')}/{card.get('exp_year', 'XXXX')})")
                
                # Show subscription details
                for sub in stripe_info['subscriptions']:
                    status_emoji = "✅" if sub['status'] == 'active' else "❌" if sub['status'] in ['canceled', 'incomplete'] else "⚠️"
                    amount = sub.get('amount', 0) / 100 if sub.get('amount') else 0
                    print(f"      📊 Subscription: {status_emoji} {sub['status']} - ${amount:.2f} (ID: {sub['id'][:20]}...)")
            else:
                print(f"   💳 Stripe Customer: ❌ Not found")
            
            # Build export data
            user_export = {
                "user_id": user_id,
                "email": email,
                "full_name": full_name,
                "created_at": created_at,
                "workspace": workspace_info,
                "stripe_customer": stripe_info,
                "raw_user_data": user
            }
            
            export_data["users"].append(user_export)
        
        # Export to JSON file
        export_filename = f"/app/users_payments_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(export_filename, 'w') as f:
            json.dump(export_data, f, indent=2, cls=JSONEncoder)
        
        print(f"\n💾 EXPORT COMPLETED:")
        print(f"   📁 File: {export_filename}")
        print(f"   📊 Users Exported: {len(export_data['users'])}")
        print(f"   💳 Users with Stripe Data: {sum(1 for u in export_data['users'] if u['stripe_customer'])}")
        
        # Summary statistics
        total_payment_methods = sum(len(u['stripe_customer']['payment_methods']) if u['stripe_customer'] else 0 for u in export_data['users'])
        total_subscriptions = sum(len(u['stripe_customer']['subscriptions']) if u['stripe_customer'] else 0 for u in export_data['users'])
        active_subscriptions = sum(sum(1 for s in u['stripe_customer']['subscriptions'] if s['status'] == 'active') if u['stripe_customer'] else 0 for u in export_data['users'])
        
        print(f"\n📈 STATISTICS:")
        print(f"   💳 Total Payment Methods: {total_payment_methods}")
        print(f"   📊 Total Subscriptions: {total_subscriptions}")
        print(f"   ✅ Active Subscriptions: {active_subscriptions}")
        
        return export_filename
        
    finally:
        client.close()

async def get_stripe_customer_info(email):
    """Get Stripe customer information by email"""
    try:
        if not stripe.api_key:
            return None
            
        # Find customer by email
        customers = stripe.Customer.list(email=email, limit=1)
        if not customers.data:
            return None
        
        customer = customers.data[0]
        
        # Get payment methods
        payment_methods = stripe.PaymentMethod.list(
            customer=customer.id,
            type="card"
        )
        
        # Get subscriptions
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status='all'
        )
        
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
                        "country": pm.card.country,
                        "funding": pm.card.funding
                    },
                    "billing_details": dict(pm.billing_details) if pm.billing_details else {},
                    "created": pm.created
                }
                for pm in payment_methods.data
            ],
            "subscriptions": [
                {
                    "id": sub.id,
                    "status": sub.status,
                    "current_period_end": sub.current_period_end,
                    "current_period_start": sub.current_period_start,
                    "cancel_at_period_end": sub.cancel_at_period_end,
                    "amount": sub.items.data[0].price.unit_amount if sub.items.data else 0,
                    "currency": sub.items.data[0].price.currency if sub.items.data else 'usd',
                    "interval": sub.items.data[0].price.recurring.interval if sub.items.data and sub.items.data[0].price.recurring else 'month',
                    "metadata": dict(sub.metadata) if sub.metadata else {},
                    "created": sub.created,
                    "latest_invoice": sub.latest_invoice
                }
                for sub in subscriptions.data
            ]
        }
        
    except Exception as e:
        print(f"   ⚠️  Error getting Stripe data for {email}: {str(e)}")
        return None

if __name__ == "__main__":
    asyncio.run(export_users_and_payments())