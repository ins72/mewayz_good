#!/usr/bin/env python3
"""
Direct Stripe Customer Export
Check all customers in Stripe account directly
"""

import stripe
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

print("🔍 DIRECT STRIPE CUSTOMERS EXPORT")
print("=" * 50)
print(f"📅 Export Time: {datetime.now().isoformat()}")
print(f"💳 Stripe API: {'Configured' if stripe.api_key else 'Not Configured'}")
print("=" * 50)

def export_all_stripe_customers():
    """Export all customers directly from Stripe"""
    try:
        print("\n📋 FETCHING ALL STRIPE CUSTOMERS...")
        
        # Get all customers
        customers = stripe.Customer.list(limit=100)
        
        print(f"💰 Total Customers Found: {len(customers.data)}")
        print("\n" + "="*70)
        
        for i, customer in enumerate(customers.data, 1):
            print(f"\n{i}. 👤 CUSTOMER: {customer.id}")
            print(f"   📧 Email: {customer.email}")
            print(f"   📛 Name: {customer.name}")
            print(f"   📅 Created: {datetime.fromtimestamp(customer.created).isoformat()}")
            
            # Get payment methods
            try:
                payment_methods = stripe.PaymentMethod.list(customer=customer.id, type="card")
                print(f"   💳 Payment Methods: {len(payment_methods.data)}")
                
                for pm in payment_methods.data:
                    card = pm.card
                    print(f"      💳 {card.brand.upper()} ****{card.last4} ({card.exp_month:02d}/{card.exp_year}) - {pm.id}")
            except Exception as e:
                print(f"      ⚠️  Error getting payment methods: {str(e)}")
            
            # Get subscriptions
            try:
                subscriptions = stripe.Subscription.list(customer=customer.id, status='all')
                print(f"   📊 Subscriptions: {len(subscriptions.data)}")
                
                for sub in subscriptions.data:
                    status_emoji = "✅" if sub.status == 'active' else "❌" if sub.status in ['canceled', 'incomplete'] else "⚠️"
                    amount = sub.items.data[0].price.unit_amount if sub.items.data else 0
                    interval = sub.items.data[0].price.recurring.interval if sub.items.data and sub.items.data[0].price.recurring else 'month'
                    bundles = sub.metadata.get('bundles', 'N/A')
                    
                    print(f"      📊 {status_emoji} {sub.status.upper()} - ${amount/100:.2f}/{interval} - Bundles: {bundles}")
                    print(f"         ID: {sub.id}")
                    print(f"         Created: {datetime.fromtimestamp(sub.created).isoformat()}")
                    
                    if sub.status == 'active':
                        period_end = datetime.fromtimestamp(sub.current_period_end).isoformat()
                        print(f"         Next Billing: {period_end}")
            except Exception as e:
                print(f"      ⚠️  Error getting subscriptions: {str(e)}")
            
            # Show metadata
            if customer.metadata:
                print(f"   📝 Metadata: {dict(customer.metadata)}")
        
        # Summary statistics
        total_payment_methods = sum(len(stripe.PaymentMethod.list(customer=c.id, type="card").data) for c in customers.data)
        total_subscriptions = sum(len(stripe.Subscription.list(customer=c.id, status='all').data) for c in customers.data)
        active_subscriptions = 0
        total_revenue = 0
        
        for customer in customers.data:
            subs = stripe.Subscription.list(customer=customer.id, status='all').data
            for sub in subs:
                if sub.status == 'active':
                    active_subscriptions += 1
                    if sub.items.data:
                        total_revenue += sub.items.data[0].price.unit_amount
        
        print(f"\n📈 STRIPE ACCOUNT SUMMARY:")
        print(f"   👥 Total Customers: {len(customers.data)}")
        print(f"   💳 Total Payment Methods: {total_payment_methods}")
        print(f"   📊 Total Subscriptions: {total_subscriptions}")
        print(f"   ✅ Active Subscriptions: {active_subscriptions}")
        print(f"   💰 Monthly Recurring Revenue: ${total_revenue/100:.2f}")
        
        return customers.data
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return []

if __name__ == "__main__":
    export_all_stripe_customers()