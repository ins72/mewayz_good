#!/usr/bin/env python3
"""
Test Deployment Script for MEWAYZ V2
Simple test to verify the platform is working
"""

import requests
import json
import time
from datetime import datetime

def test_health_endpoint():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/api/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health endpoint working")
            print(f"Status: {data.get('status')}")
            print(f"Version: {data.get('version')}")
            print(f"Environment: {data.get('environment')}")
            return True
        else:
            print(f"❌ Health endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

def test_crud_endpoint():
    """Test the CRUD endpoint"""
    print("\n🔍 Testing CRUD endpoint...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/api/crud-test", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ CRUD endpoint working")
            print(f"Status: {data.get('status')}")
            print(f"Production Ready: {data.get('production_ready')}")
            return True
        else:
            print(f"❌ CRUD endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ CRUD endpoint test failed: {e}")
        return False

def test_api_root():
    """Test the API root endpoint"""
    print("\n🔍 Testing API root endpoint...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/api/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API root endpoint working")
            print(f"Message: {data.get('message')}")
            print(f"Version: {data.get('version')}")
            return True
        else:
            print(f"❌ API root endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API root endpoint test failed: {e}")
        return False

def test_connectivity():
    """Test basic connectivity"""
    print("\n🔍 Testing connectivity...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/api/test", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connectivity test working")
            print(f"Message: {data.get('message')}")
            return True
        else:
            print(f"❌ Connectivity test returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connectivity test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 MEWAYZ V2 Deployment Test")
    print("=" * 50)
    print(f"Timestamp: {datetime.now()}")
    print(f"Server: http://127.0.0.1:8001")
    print("=" * 50)
    
    # Wait a moment for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(3)
    
    tests = [
        ("Health Endpoint", test_health_endpoint),
        ("CRUD Endpoint", test_crud_endpoint),
        ("API Root", test_api_root),
        ("Connectivity", test_connectivity)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - DEPLOYMENT SUCCESSFUL!")
        print("✅ MEWAYZ V2 is ready for production use")
    else:
        print("⚠️ Some tests failed - check server logs")
    
    print("=" * 50)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 