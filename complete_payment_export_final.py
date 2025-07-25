#!/usr/bin/env python3
"""
COMPLETE PAYMENT & USER DATA EXPORT - FINAL
All users, payments, subscriptions with proper error handling
"""

import stripe
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from bson import ObjectId

# Load environment variables
load_dotenv('/app/backend/.env')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')

print("🔍 COMPLETE PAYMENT & USER DATA EXPORT")
print("=" * 70)
print(f"📅 Export Time: {datetime.now().isoformat()}")
print(f"💳 Stripe API: {'Configured' if stripe.api_key else 'Not Configured'}")
print("=" * 70)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

async def get_mongodb_users():
    """Get all users from MongoDB"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client['mewayz']
    users_collection = db['user']
    
    try:
        cursor = users_collection.find({})
        users = await cursor.to_list(length=None)
        return users
    finally:
        client.close()

def get_stripe_customers():
    """Get all Stripe customers with proper error handling"""
    try:
        customers = stripe.Customer.list(limit=100)
        customer_data = []
        
        for customer in customers.data:
            # Get payment methods
            payment_methods = []
            try:
                pm_list = stripe.PaymentMethod.list(customer=customer.id, type="card")
                for pm in pm_list.data:
                    payment_methods.append({
                        'id': pm.id,
                        'card': {
                            'brand': pm.card.brand,
                            'last4': pm.card.last4,
                            'exp_month': pm.card.exp_month,
                            'exp_year': pm.card.exp_year,
                            'funding': pm.card.funding
                        },
                        'created': datetime.fromtimestamp(pm.created).isoformat(),
                        'billing_details': {
                            'name': pm.billing_details.name,
                            'email': pm.billing_details.email,
                            'phone': pm.billing_details.phone
                        } if pm.billing_details else {}
                    })
            except Exception as e:
                print(f"   ⚠️  Error getting payment methods for {customer.id}: {str(e)}")
            
            # Get subscriptions
            subscriptions = []
            try:
                sub_list = stripe.Subscription.list(customer=customer.id, status='all')
                for sub in sub_list.data:
                    # Get pricing info
                    amount = 0
                    interval = 'month'
                    if sub.items and sub.items.data:
                        item = sub.items.data[0]
                        if hasattr(item, 'price') and item.price:
                            amount = item.price.unit_amount or 0
                            if hasattr(item.price, 'recurring') and item.price.recurring:
                                interval = item.price.recurring.interval
                    
                    subscriptions.append({
                        'id': sub.id,
                        'status': sub.status,
                        'amount_cents': amount,
                        'amount_dollars': amount / 100 if amount else 0,
                        'currency': 'usd',
                        'interval': interval,
                        'created': datetime.fromtimestamp(sub.created).isoformat(),
                        'current_period_start': datetime.fromtimestamp(sub.current_period_start).isoformat() if sub.current_period_start else None,
                        'current_period_end': datetime.fromtimestamp(sub.current_period_end).isoformat() if sub.current_period_end else None,
                        'cancel_at_period_end': sub.cancel_at_period_end,
                        'metadata': dict(sub.metadata) if sub.metadata else {},
                        'latest_invoice': sub.latest_invoice
                    })
            except Exception as e:
                print(f"   ⚠️  Error getting subscriptions for {customer.id}: {str(e)}")
            
            customer_data.append({
                'id': customer.id,
                'email': customer.email,
                'name': customer.name,
                'created': datetime.fromtimestamp(customer.created).isoformat(),
                'metadata': dict(customer.metadata) if customer.metadata else {},
                'payment_methods': payment_methods,
                'subscriptions': subscriptions
            })
        
        return customer_data
    except Exception as e:
        print(f"❌ Error fetching Stripe customers: {str(e)}")
        return []

async def main():
    """Main export function"""
    
    print("\n📊 FETCHING MONGODB USERS...")
    users = await get_mongodb_users()
    print(f"   👥 Found {len(users)} users in MongoDB")
    
    print("\n💳 FETCHING STRIPE CUSTOMERS...")
    customers = get_stripe_customers()
    print(f"   💰 Found {len(customers)} customers in Stripe")
    
    # Create email to user mapping
    user_by_email = {user['email']: user for user in users}
    
    # Create comprehensive export data
    export_data = {
        'export_metadata': {
            'timestamp': datetime.now().isoformat(),
            'total_mongodb_users': len(users),
            'total_stripe_customers': len(customers),
            'users_with_payments': 0,
            'total_payment_methods': sum(len(c['payment_methods']) for c in customers),
            'total_subscriptions': sum(len(c['subscriptions']) for c in customers),
            'active_subscriptions': 0,
            'total_revenue': 0
        },
        'user_payment_data': []
    }
    
    print(f"\n📋 DETAILED USER & PAYMENT DATA:")
    print("=" * 70)
    
    # Process each MongoDB user and match with Stripe data
    users_with_payments = 0
    for i, user in enumerate(users, 1):
        email = user.get('email', '')
        user_id = str(user.get('_id'))
        name = user.get('full_name', 'Unknown')
        created = user.get('created', 'Unknown')
        
        # Find matching Stripe customer
        stripe_customer = None
        for customer in customers:
            if customer['email'] == email:
                stripe_customer = customer
                users_with_payments += 1
                break
        
        print(f"\n{i}. 👤 {email}")
        print(f"   📛 Name: {name}")
        print(f"   🆔 MongoDB ID: {user_id}")
        print(f"   📅 Created: {created}")
        
        if stripe_customer:
            print(f"   💳 Stripe Customer: ✅ {stripe_customer['id']}")
            print(f"   💰 Payment Methods: {len(stripe_customer['payment_methods'])}")
            print(f"   📊 Subscriptions: {len(stripe_customer['subscriptions'])}")
            
            # Show payment method details
            for pm in stripe_customer['payment_methods']:
                card = pm['card']
                print(f"      💳 {card['brand'].upper()} ****{card['last4']} ({card['exp_month']:02d}/{card['exp_year']})")
            
            # Show subscription details
            for sub in stripe_customer['subscriptions']:
                status_emoji = "✅" if sub['status'] == 'active' else "❌" if sub['status'] in ['canceled', 'incomplete'] else "⚠️"
                bundles = sub['metadata'].get('bundles', 'N/A')
                print(f"      📊 {status_emoji} {sub['status'].upper()} - ${sub['amount_dollars']:.2f}/{sub['interval']}")
                print(f"         🎯 Bundles: {bundles}")
                print(f"         📅 Created: {sub['created']}")
                if sub['status'] == 'active':
                    print(f"         🔄 Next billing: {sub['current_period_end']}")
                    export_data['export_metadata']['active_subscriptions'] += 1
                    export_data['export_metadata']['total_revenue'] += sub['amount_dollars']
            
            # Show metadata
            if stripe_customer['metadata']:
                print(f"   📝 Metadata: {stripe_customer['metadata']}")
        else:
            print(f"   💳 Stripe Customer: ❌ Not found")
        
        # Add to export data
        user_data = {
            'mongodb_user': user,
            'stripe_customer': stripe_customer,
            'has_payment': stripe_customer is not None,
            'email': email,
            'name': name,
            'user_id': user_id
        }
        export_data['user_payment_data'].append(user_data)
    
    # Update metadata
    export_data['export_metadata']['users_with_payments'] = users_with_payments
    
    # Process Stripe-only customers (customers without MongoDB users)
    print(f"\n💳 STRIPE-ONLY CUSTOMERS (no MongoDB user):")
    stripe_only_count = 0
    for customer in customers:
        if customer['email'] not in user_by_email:
            stripe_only_count += 1
            print(f"\n{stripe_only_count}. 👤 {customer['email']} (Stripe only)")
            print(f"   💳 Customer ID: {customer['id']}")
            print(f"   📛 Name: {customer['name']}")
            print(f"   📅 Created: {customer['created']}")
            print(f"   💰 Payment Methods: {len(customer['payment_methods'])}")
            print(f"   📊 Subscriptions: {len(customer['subscriptions'])}")
            
            # Add to export data as Stripe-only
            export_data['user_payment_data'].append({
                'mongodb_user': None,
                'stripe_customer': customer,
                'has_payment': True,
                'email': customer['email'],
                'name': customer['name'],
                'user_id': None,
                'stripe_only': True
            })
    
    # Export to JSON file
    export_filename = f"/app/complete_payment_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(export_filename, 'w') as f:
        json.dump(export_data, f, indent=2, cls=JSONEncoder)
    
    # Summary
    print(f"\n📈 FINAL SUMMARY:")
    print("=" * 50)
    print(f"📁 Export File: {export_filename}")
    print(f"👥 MongoDB Users: {export_data['export_metadata']['total_mongodb_users']}")
    print(f"💳 Stripe Customers: {export_data['export_metadata']['total_stripe_customers']}")
    print(f"🔗 Users with Payments: {export_data['export_metadata']['users_with_payments']}")
    print(f"💰 Total Payment Methods: {export_data['export_metadata']['total_payment_methods']}")
    print(f"📊 Total Subscriptions: {export_data['export_metadata']['total_subscriptions']}")
    print(f"✅ Active Subscriptions: {export_data['export_metadata']['active_subscriptions']}")
    print(f"💵 Monthly Recurring Revenue: ${export_data['export_metadata']['total_revenue']:.2f}")
    print(f"👻 Stripe-Only Customers: {stripe_only_count}")
    
    return export_filename

if __name__ == "__main__":
    asyncio.run(main())