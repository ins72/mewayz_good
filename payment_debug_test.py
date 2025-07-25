#!/usr/bin/env python3
"""
URGENT PAYMENT SYSTEM BUG INVESTIGATION
Testing POST /api/v1/payments/create-subscription with new Stripe keys
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"🚨 URGENT PAYMENT SYSTEM BUG INVESTIGATION")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"📍 API Base: {API_BASE}")
print("=" * 80)

def test_stripe_configuration():
    """Test if new Stripe keys are properly configured"""
    print("\n🔧 Testing Stripe Configuration")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            integrations = data.get('integrations', {})
            stripe_status = integrations.get('stripe', 'not configured')
            print(f"   📝 Stripe Status: {stripe_status}")
            
            if stripe_status == 'configured':
                print(f"   ✅ New Stripe keys are loaded")
                return True
            else:
                print(f"   ❌ Stripe keys not properly configured")
                return False
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def create_test_user_and_login():
    """Create test user and get authentication token"""
    print("\n👤 Creating Test User and Getting Auth Token")
    try:
        # Create test user
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        test_user = {
            "email": f"payment.test.{timestamp}@mewayz.com",
            "password": "SecurePaymentTest123!",
            "full_name": "Payment Test User"
        }
        
        response = requests.post(f"{API_BASE}/v1/users/", json=test_user, timeout=10)
        if response.status_code != 200:
            print(f"   ❌ User creation failed: {response.status_code}")
            return None, None
        
        user_data = response.json()
        print(f"   ✅ User created: {user_data.get('email')}")
        
        # Login to get token
        login_data = {
            "username": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(
            f"{API_BASE}/v1/login/oauth", 
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10
        )
        
        if response.status_code != 200:
            print(f"   ❌ Login failed: {response.status_code}")
            return None, None
        
        token_data = response.json()
        access_token = token_data.get('access_token')
        print(f"   ✅ Login successful, token obtained")
        
        return test_user, access_token
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return None, None

def test_payment_creation_with_valid_test_card(test_user, access_token):
    """Test payment creation with valid Stripe test card"""
    print("\n💳 Testing Payment Creation with Valid Test Card")
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Use Stripe's standard test card data
        subscription_data = {
            "payment_method_id": "pm_card_visa",  # Stripe's test payment method
            "bundles": ["creator", "ecommerce"],
            "payment_interval": "monthly",
            "customer_info": {
                "email": test_user["email"],
                "name": test_user["full_name"]
            }
        }
        
        print(f"   📝 Testing with bundles: {subscription_data['bundles']}")
        print(f"   📝 Expected pricing: Creator $19 + E-commerce $24 = $43")
        print(f"   📝 Expected discount: 20% for 2 bundles = $34.40 final")
        
        response = requests.post(
            f"{API_BASE}/v1/payments/create-subscription", 
            json=subscription_data, 
            headers=headers, 
            timeout=30
        )
        
        print(f"   📝 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   🎉 PAYMENT CREATION SUCCESSFUL!")
            print(f"   📝 Subscription ID: {data.get('subscription_id', 'N/A')}")
            print(f"   📝 Status: {data.get('status', 'N/A')}")
            print(f"   📝 Customer ID: {data.get('customer_id', 'N/A')}")
            print(f"   📝 Amount Paid: ${data.get('amount_paid', 0)/100:.2f}")
            print(f"   📝 Discount Applied: {data.get('discount_applied', 0)}%")
            print(f"   📝 Bundles: {data.get('bundles', [])}")
            print(f"   📝 Requires Action: {data.get('requires_action', False)}")
            
            # Verify pricing calculation
            expected_amount = 3440  # $34.40 in cents
            actual_amount = data.get('amount_paid', 0)
            expected_discount = 20.0
            actual_discount = data.get('discount_applied', 0)
            
            if actual_amount == expected_amount and actual_discount == expected_discount:
                print(f"   ✅ Pricing calculation is CORRECT")
            else:
                print(f"   ⚠️  Pricing mismatch - Expected: ${expected_amount/100:.2f} with {expected_discount}% discount")
                print(f"   ⚠️  Got: ${actual_amount/100:.2f} with {actual_discount}% discount")
            
            return True
            
        elif response.status_code == 500:
            print(f"   🚨 500 INTERNAL SERVER ERROR - PAYMENT SYSTEM FAILURE!")
            try:
                error_data = response.json()
                error_detail = error_data.get('detail', 'Unknown error')
                print(f"   📝 Error Details: {error_detail}")
                
                # Check for specific Stripe errors
                if "payment method" in error_detail.lower():
                    print(f"   🔍 DIAGNOSIS: Payment method attachment issue")
                elif "customer" in error_detail.lower():
                    print(f"   🔍 DIAGNOSIS: Customer creation/retrieval issue")
                elif "stripe" in error_detail.lower():
                    print(f"   🔍 DIAGNOSIS: Stripe API configuration issue")
                else:
                    print(f"   🔍 DIAGNOSIS: Unknown payment processing error")
                    
            except:
                print(f"   📝 Raw Error Response: {response.text}")
            
            return False
            
        else:
            print(f"   ❌ Payment creation failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"   📝 Error: {error_data.get('detail', response.text)}")
            except:
                print(f"   📝 Raw Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Exception during payment test: {str(e)}")
        return False

def test_saved_card_endpoint(test_user, access_token):
    """Test the saved card payment endpoint that was reported as working"""
    print("\n💾 Testing Saved Card Payment Endpoint")
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # First, check if user has any saved payment methods
        response = requests.get(
            f"{API_BASE}/v1/payments/customer-payment-methods",
            headers=headers,
            timeout=10
        )
        
        print(f"   📝 Customer Payment Methods Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            payment_methods = data.get('payment_methods', [])
            print(f"   📝 Saved Payment Methods: {len(payment_methods)}")
            
            if payment_methods:
                print(f"   ✅ User has saved payment methods")
                for i, pm in enumerate(payment_methods):
                    card = pm.get('card', {})
                    print(f"      - Method {i+1}: {card.get('brand', 'N/A')} ending in {card.get('last4', 'N/A')}")
            else:
                print(f"   📝 No saved payment methods (expected for new user)")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve payment methods: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing saved card endpoint: {str(e)}")
        return False

def test_authentication_on_payment_endpoints(access_token):
    """Test that payment endpoints properly require authentication"""
    print("\n🔐 Testing Authentication on Payment Endpoints")
    try:
        # Test without authentication - should return 401
        response = requests.post(
            f"{API_BASE}/v1/payments/create-subscription",
            json={"test": "data"},
            timeout=10
        )
        
        if response.status_code in [401, 403]:
            print(f"   ✅ Unauthenticated request properly rejected ({response.status_code})")
        else:
            print(f"   ⚠️  Unexpected response for unauthenticated request: {response.status_code}")
        
        # Test with authentication - should not return auth error
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(
            f"{API_BASE}/v1/payments/customer-payment-methods",
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 401 and response.status_code != 403:
            print(f"   ✅ Authenticated request accepted ({response.status_code})")
            return True
        else:
            print(f"   ❌ Authenticated request rejected: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing authentication: {str(e)}")
        return False

def run_payment_investigation():
    """Run complete payment system investigation"""
    print("🚀 Starting Payment System Investigation")
    print("=" * 80)
    
    results = {}
    
    # Test 1: Stripe Configuration
    results['stripe_config'] = test_stripe_configuration()
    
    # Test 2: User Authentication
    test_user, access_token = create_test_user_and_login()
    results['user_auth'] = test_user is not None and access_token is not None
    
    if not results['user_auth']:
        print("\n❌ Cannot proceed without authentication")
        return False
    
    # Test 3: Authentication on Payment Endpoints
    results['payment_auth'] = test_authentication_on_payment_endpoints(access_token)
    
    # Test 4: Saved Card Endpoint (reported as working)
    results['saved_card_endpoint'] = test_saved_card_endpoint(test_user, access_token)
    
    # Test 5: CRITICAL - Payment Creation (reported as failing)
    results['payment_creation'] = test_payment_creation_with_valid_test_card(test_user, access_token)
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 PAYMENT SYSTEM INVESTIGATION RESULTS")
    print("=" * 80)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name.replace('_', ' ').title()}")
        if result:
            passed += 1
    
    print(f"\n📈 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    # Critical Analysis
    print(f"\n🔍 CRITICAL ANALYSIS:")
    
    if results['payment_creation']:
        print(f"   🎉 PAYMENT SYSTEM IS NOW WORKING!")
        print(f"   📝 The new Stripe keys have resolved the 500 error issue")
        print(f"   📝 Users can now successfully create subscriptions")
    else:
        print(f"   🚨 PAYMENT SYSTEM STILL FAILING!")
        print(f"   📝 The 500 error persists even with new Stripe keys")
        print(f"   📝 Further investigation needed into payment method handling")
    
    if results['stripe_config'] and results['user_auth'] and results['payment_auth'] and results['saved_card_endpoint']:
        print(f"   ✅ All supporting systems are functional")
    else:
        print(f"   ⚠️  Some supporting systems have issues")
    
    return results['payment_creation']

if __name__ == "__main__":
    success = run_payment_investigation()
    sys.exit(0 if success else 1)