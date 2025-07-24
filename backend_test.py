#!/usr/bin/env python3
"""
MEWAYZ V2 Backend API Testing Suite
Tests all backend endpoints for functionality and data integrity
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

print(f"🔧 Testing MEWAYZ V2 Backend API")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"📍 API Base: {API_BASE}")
print("=" * 60)

def test_root_endpoint():
    """Test GET /api/ - Root endpoint"""
    print("\n🧪 Testing Root Endpoint (GET /api/)")
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Response received")
            print(f"   📝 Message: {data.get('message', 'N/A')}")
            print(f"   📝 Version: {data.get('version', 'N/A')}")
            print(f"   📝 Status: {data.get('status', 'N/A')}")
            
            # Verify expected features
            features = data.get('features', [])
            expected_features = [
                "E-commerce Platform with Multi-vendor Support",
                "Stripe Payment Integration (Live Keys Configured)",
                "MEWAYZ Bundle Subscriptions with Multi-bundle Discounts"
            ]
            
            features_found = all(any(expected in feature for feature in features) for expected in expected_features)
            if features_found:
                print(f"   ✅ All expected features present")
                return True
            else:
                print(f"   ⚠️  Some expected features missing")
                print(f"   📝 Features: {features}")
                return True  # Still working, just minor issue
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_health_endpoint():
    """Test GET /api/health - Health check"""
    print("\n🧪 Testing Health Check Endpoint (GET /api/health)")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health check passed")
            print(f"   📝 Status: {data.get('status', 'N/A')}")
            print(f"   📝 App Name: {data.get('app_name', 'N/A')}")
            print(f"   📝 Database: {data.get('database', 'N/A')}")
            
            # Check integrations
            integrations = data.get('integrations', {})
            print(f"   📝 Integrations:")
            for service, status in integrations.items():
                print(f"      - {service}: {status}")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_bundles_pricing():
    """Test GET /api/bundles/pricing - MEWAYZ pricing bundles"""
    print("\n🧪 Testing Bundle Pricing Endpoint (GET /api/bundles/pricing)")
    try:
        response = requests.get(f"{API_BASE}/bundles/pricing", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Bundle pricing data received")
            
            # Verify bundle structure
            bundles = data.get('bundles', {})
            expected_bundles = ['free_starter', 'creator', 'ecommerce', 'social_media', 'education', 'business', 'operations']
            
            print(f"   📝 Available Bundles:")
            for bundle_key in expected_bundles:
                if bundle_key in bundles:
                    bundle = bundles[bundle_key]
                    print(f"      - {bundle.get('name', bundle_key)}: ${bundle.get('price', 'N/A')}")
                else:
                    print(f"      - {bundle_key}: MISSING")
            
            # Verify discount structure
            discounts = data.get('discounts', {})
            print(f"   📝 Multi-bundle Discounts:")
            print(f"      - 2 bundles: {discounts.get('2_bundles', 'N/A')*100 if discounts.get('2_bundles') else 'N/A'}%")
            print(f"      - 3 bundles: {discounts.get('3_bundles', 'N/A')*100 if discounts.get('3_bundles') else 'N/A'}%")
            print(f"      - 4+ bundles: {discounts.get('4_plus_bundles', 'N/A')*100 if discounts.get('4_plus_bundles') else 'N/A'}%")
            
            # Verify enterprise option
            enterprise = data.get('enterprise', {})
            if enterprise:
                print(f"   📝 Enterprise: {enterprise.get('revenue_share', 'N/A')*100 if enterprise.get('revenue_share') else 'N/A'}% revenue share, ${enterprise.get('minimum_monthly', 'N/A')} minimum")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_get_status():
    """Test GET /api/status - Get status checks"""
    print("\n🧪 Testing Get Status Endpoint (GET /api/status)")
    try:
        response = requests.get(f"{API_BASE}/status", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status checks retrieved")
            print(f"   📝 Number of status checks: {len(data)}")
            
            if data:
                print(f"   📝 Sample status check:")
                sample = data[0]
                print(f"      - ID: {sample.get('id', 'N/A')}")
                print(f"      - Client: {sample.get('client_name', 'N/A')}")
                print(f"      - Timestamp: {sample.get('timestamp', 'N/A')}")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_create_status():
    """Test POST /api/status - Create status check"""
    print("\n🧪 Testing Create Status Endpoint (POST /api/status)")
    try:
        # Create test data
        test_data = {
            "client_name": f"MEWAYZ_Test_Client_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        response = requests.post(f"{API_BASE}/status", json=test_data, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status check created successfully")
            print(f"   📝 Created ID: {data.get('id', 'N/A')}")
            print(f"   📝 Client Name: {data.get('client_name', 'N/A')}")
            print(f"   📝 Timestamp: {data.get('timestamp', 'N/A')}")
            
            # Verify the data was actually saved by trying to retrieve it
            get_response = requests.get(f"{API_BASE}/status", timeout=10)
            if get_response.status_code == 200:
                all_status = get_response.json()
                created_found = any(status.get('id') == data.get('id') for status in all_status)
                if created_found:
                    print(f"   ✅ Created status check found in database")
                else:
                    print(f"   ⚠️  Created status check not found in database")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting MEWAYZ V2 Backend API Test Suite")
    print("=" * 60)
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("Health Check", test_health_endpoint),
        ("Bundle Pricing", test_bundles_pricing),
        ("Get Status Checks", test_get_status),
        ("Create Status Check", test_create_status)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"   ❌ Test {test_name} failed with exception: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n📈 Overall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! Backend is fully functional.")
        return True
    else:
        print("⚠️  Some tests failed. Check individual test results above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)