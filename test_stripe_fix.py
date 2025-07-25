#!/usr/bin/env python3
"""
Test Stripe Subscription Creation Fix
"""

import requests
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f'{BACKEND_URL}/api'

# Test just the Stripe subscription creation
print('🧪 Testing Stripe Subscription Creation (Fixed)')

# First, create a user and get token
timestamp = str(uuid.uuid4())[:8]
test_user = {
    'email': f'stripe.test.{timestamp}@mewayz.com',
    'password': 'SecurePass123!',
    'full_name': 'Stripe Test User'
}

# Register user
reg_response = requests.post(f'{API_BASE}/v1/users/', json=test_user, timeout=10)
if reg_response.status_code != 200:
    print(f'❌ User registration failed: {reg_response.status_code}')
    exit(1)

# Login
login_data = {
    'username': test_user['email'],
    'password': test_user['password']
}
login_response = requests.post(
    f'{API_BASE}/v1/login/oauth', 
    data=login_data,
    headers={'Content-Type': 'application/x-www-form-urlencoded'},
    timeout=10
)

if login_response.status_code != 200:
    print(f'❌ Login failed: {login_response.status_code}')
    exit(1)

access_token = login_response.json().get('access_token')

# Test Stripe subscription
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

subscription_data = {
    'payment_method_id': 'pm_card_visa',
    'bundles': ['creator', 'ecommerce'],
    'payment_interval': 'monthly',
    'customer_info': {
        'email': test_user['email'],
        'name': test_user['full_name']
    }
}

response = requests.post(f'{API_BASE}/v1/payments/create-subscription', json=subscription_data, headers=headers, timeout=30)
print(f'Status Code: {response.status_code}')

if response.status_code == 200:
    data = response.json()
    print('✅ Stripe subscription created successfully')
    print(f'📝 Subscription ID: {data.get("subscription_id", "N/A")}')
    print(f'📝 Status: {data.get("status", "N/A")}')
    print(f'📝 Amount Paid: ${data.get("amount_paid", 0)/100:.2f}')
    print(f'📝 Discount Applied: {data.get("discount_applied", 0)}%')
    print(f'📝 Bundles: {data.get("bundles", [])}')
else:
    print(f'❌ Failed with status {response.status_code}')
    try:
        error_data = response.json()
        print(f'📝 Error: {error_data.get("detail", response.text)}')
    except:
        print(f'📝 Error: {response.text}')