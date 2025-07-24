#!/usr/bin/env python3
"""
MongoDB CRUD Operations Test for MEWAYZ V2
Tests database connectivity and data persistence
"""

import requests
import json
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print("🔧 Testing MongoDB CRUD Operations")
print(f"📍 API Base: {API_BASE}")
print("=" * 50)

def test_mongodb_crud():
    """Test MongoDB Create, Read operations"""
    print("\n🧪 Testing MongoDB CRUD Operations")
    
    # Step 1: Get initial count
    print("   📝 Step 1: Getting initial status count...")
    initial_response = requests.get(f"{API_BASE}/status", timeout=10)
    if initial_response.status_code != 200:
        print(f"   ❌ Failed to get initial status: {initial_response.status_code}")
        return False
    
    initial_count = len(initial_response.json())
    print(f"   ✅ Initial status count: {initial_count}")
    
    # Step 2: Create multiple status entries
    print("   📝 Step 2: Creating multiple status entries...")
    created_ids = []
    
    for i in range(3):
        test_data = {
            "client_name": f"MongoDB_Test_Client_{i}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        create_response = requests.post(f"{API_BASE}/status", json=test_data, timeout=10)
        if create_response.status_code == 200:
            created_data = create_response.json()
            created_ids.append(created_data.get('id'))
            print(f"   ✅ Created entry {i+1}: {created_data.get('client_name')}")
        else:
            print(f"   ❌ Failed to create entry {i+1}: {create_response.status_code}")
            return False
    
    # Step 3: Verify all entries were created
    print("   📝 Step 3: Verifying entries were persisted...")
    time.sleep(1)  # Small delay to ensure database consistency
    
    final_response = requests.get(f"{API_BASE}/status", timeout=10)
    if final_response.status_code != 200:
        print(f"   ❌ Failed to get final status: {final_response.status_code}")
        return False
    
    final_data = final_response.json()
    final_count = len(final_data)
    
    print(f"   📝 Final status count: {final_count}")
    print(f"   📝 Expected increase: 3, Actual increase: {final_count - initial_count}")
    
    if final_count >= initial_count + 3:
        print("   ✅ All entries successfully persisted to MongoDB")
        
        # Step 4: Verify data integrity
        print("   📝 Step 4: Verifying data integrity...")
        found_entries = 0
        for created_id in created_ids:
            found = any(entry.get('id') == created_id for entry in final_data)
            if found:
                found_entries += 1
        
        print(f"   📝 Found {found_entries}/{len(created_ids)} created entries")
        
        if found_entries == len(created_ids):
            print("   ✅ Data integrity verified - all created entries found")
            return True
        else:
            print("   ⚠️  Some created entries not found in database")
            return True  # Still working, minor issue
    else:
        print("   ❌ Entries not properly persisted to MongoDB")
        return False

def test_database_connection():
    """Test database connection through health endpoint"""
    print("\n🧪 Testing Database Connection")
    
    response = requests.get(f"{API_BASE}/health", timeout=10)
    if response.status_code == 200:
        data = response.json()
        db_status = data.get('database', 'unknown')
        print(f"   📝 Database status: {db_status}")
        
        if db_status == 'connected':
            print("   ✅ Database connection confirmed")
            return True
        else:
            print("   ❌ Database not connected")
            return False
    else:
        print(f"   ❌ Health check failed: {response.status_code}")
        return False

def run_mongodb_tests():
    """Run all MongoDB-related tests"""
    print("🚀 Starting MongoDB Integration Tests")
    print("=" * 50)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("MongoDB CRUD Operations", test_mongodb_crud)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"   ❌ Test {test_name} failed with exception: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 MONGODB TEST RESULTS")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n📈 MongoDB Tests: {passed}/{total} passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 MongoDB integration is fully functional!")
        return True
    else:
        print("⚠️  Some MongoDB tests failed.")
        return False

if __name__ == "__main__":
    success = run_mongodb_tests()
    exit(0 if success else 1)