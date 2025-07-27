#!/usr/bin/env python3
"""
Quick Test Script for MEWAYZ V2
Simple test to check server status
"""

import requests
import json
import time

def test_server():
    """Test if server is running"""
    print("🔍 Testing MEWAYZ V2 server...")
    
    try:
        # Test health endpoint
        response = requests.get("http://127.0.0.1:8002/api/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Server is running!")
            print(f"Status: {data.get('status')}")
            print(f"Version: {data.get('version')}")
            print(f"Environment: {data.get('environment')}")
            return True
        else:
            print(f"❌ Server returned status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    # Wait a moment for server to start
    print("⏳ Waiting for server...")
    time.sleep(3)
    
    if test_server():
        print("\n🎉 Server test successful!")
    else:
        print("\n❌ Server test failed!") 