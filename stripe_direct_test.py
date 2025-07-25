#!/usr/bin/env python3
"""
Direct Stripe API Test to identify the exact error mentioned in review request
"""

import stripe
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

print("🔧 Direct Stripe API Test")
print(f"📍 Stripe API Key: {'Configured' if stripe.api_key else 'Missing'}")
print("=" * 60)

def test_price_creation_with_product_data():
    """Test if the product_data[description] error still exists"""
    print("\n🧪 Testing Price Creation with product_data")
    
    try:
        # This is the exact code from stripe_payments.py that might be causing the error
        price = stripe.Price.create(
            currency='usd',
            unit_amount=3440,  # $34.40
            recurring={
                'interval': 'month'
            },
            product_data={
                'name': "MEWAYZ V2 - Creator, Ecommerce Bundle(s)",
                # The error mentioned 'product_data[description]' - let's test if this causes issues
                # 'description': "Test description"  # This might be the problematic line
            },
            metadata={
                'bundles': 'creator,ecommerce',
                'original_amount': '4300',
                'discount_rate': '0.2',
                'bundle_count': '2'
            }
        )
        
        print(f"   ✅ Price created successfully")
        print(f"   📝 Price ID: {price.id}")
        print(f"   📝 Unit Amount: ${price.unit_amount/100:.2f}")
        print(f"   📝 Product Name: {price.product}")
        
        return True
        
    except stripe.error.InvalidRequestError as e:
        print(f"   ❌ Stripe InvalidRequestError: {str(e)}")
        if 'product_data[description]' in str(e):
            print(f"   🔍 CONFIRMED: This is the exact error mentioned in review request!")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_customer_creation():
    """Test customer creation"""
    print("\n🧪 Testing Customer Creation")
    
    try:
        customer = stripe.Customer.create(
            email="test@mewayz.com",
            name="Test Customer",
            metadata={
                'user_id': 'test_user_123',
                'bundles': 'creator,ecommerce'
            }
        )
        
        print(f"   ✅ Customer created successfully")
        print(f"   📝 Customer ID: {customer.id}")
        print(f"   📝 Email: {customer.email}")
        
        return customer.id
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return None

def test_payment_method_attachment(customer_id):
    """Test payment method attachment with test cards"""
    print("\n🧪 Testing Payment Method Attachment")
    
    if not customer_id:
        print("   ⚠️  No customer ID available, skipping test")
        return False
    
    # Test different approaches
    test_payment_methods = [
        "pm_card_visa",
        "pm_card_mastercard", 
        "pm_card_amex"
    ]
    
    for pm_id in test_payment_methods:
        print(f"   Testing payment method: {pm_id}")
        try:
            # Try to attach the payment method
            stripe.PaymentMethod.attach(
                pm_id,
                customer=customer_id,
            )
            print(f"      ✅ Successfully attached {pm_id}")
            return True
            
        except stripe.error.InvalidRequestError as e:
            print(f"      ❌ Failed to attach {pm_id}: {str(e)}")
            if "does not have a payment method" in str(e):
                print(f"      🔍 This is the exact error we're seeing in tests!")
        except Exception as e:
            print(f"      ❌ Error with {pm_id}: {str(e)}")
    
    return False

def test_subscription_creation_without_attachment():
    """Test subscription creation without payment method attachment"""
    print("\n🧪 Testing Subscription Creation Without Payment Method Attachment")
    
    try:
        # Create customer
        customer = stripe.Customer.create(
            email="test2@mewayz.com",
            name="Test Customer 2"
        )
        
        # Create price
        price = stripe.Price.create(
            currency='usd',
            unit_amount=3440,  # $34.40
            recurring={'interval': 'month'},
            product_data={
                'name': "MEWAYZ V2 - Creator, Ecommerce Bundle(s)"
            }
        )
        
        # Try to create subscription with test payment method directly
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{'price': price.id}],
            default_payment_method="pm_card_visa",  # Use test card directly
            expand=['latest_invoice.payment_intent']
        )
        
        print(f"   ✅ Subscription created successfully")
        print(f"   📝 Subscription ID: {subscription.id}")
        print(f"   📝 Status: {subscription.status}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def run_direct_stripe_tests():
    """Run direct Stripe API tests"""
    print("🚀 Starting Direct Stripe API Tests")
    print("=" * 60)
    
    results = {}
    
    # Test 1: Price creation (check for product_data[description] error)
    results["Price Creation"] = test_price_creation_with_product_data()
    
    # Test 2: Customer creation
    customer_id = test_customer_creation()
    results["Customer Creation"] = customer_id is not None
    
    # Test 3: Payment method attachment
    results["Payment Method Attachment"] = test_payment_method_attachment(customer_id)
    
    # Test 4: Subscription without attachment
    results["Subscription Without Attachment"] = test_subscription_creation_without_attachment()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DIRECT STRIPE API TEST RESULTS")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n📈 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    return passed == total

if __name__ == "__main__":
    success = run_direct_stripe_tests()