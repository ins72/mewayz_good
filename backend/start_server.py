#!/usr/bin/env python3
"""
Server Startup Script for MEWAYZ V2
"""

import subprocess
import sys
import time
import requests

def start_server():
    """Start the MEWAYZ V2 server"""
    print("🚀 Starting MEWAYZ V2 server...")
    
    try:
        # Start server in background
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "main:app", 
            "--host", "127.0.0.1", "--port", "8002"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        print(f"✅ Server started with PID: {process.pid}")
        
        # Wait for server to start
        print("⏳ Waiting for server to be ready...")
        time.sleep(5)
        
        # Test if server is running
        try:
            response = requests.get("http://127.0.0.1:8002/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print("✅ Server is running and healthy!")
                print(f"Status: {data.get('status')}")
                print(f"Version: {data.get('version')}")
                return process
            else:
                print(f"❌ Server returned status {response.status_code}")
                process.terminate()
                return None
        except Exception as e:
            print(f"❌ Server test failed: {e}")
            process.terminate()
            return None
            
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return None

def test_endpoints():
    """Test all endpoints"""
    print("\n🔍 Testing endpoints...")
    
    endpoints = [
        ("/api/health", "Health Check"),
        ("/api/crud-test", "CRUD Test"),
        ("/api/", "API Root"),
        ("/api/test", "Connectivity Test")
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"http://127.0.0.1:8002{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"✅ {name}: Working")
            else:
                print(f"❌ {name}: Status {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: Error - {e}")

if __name__ == "__main__":
    server_process = start_server()
    
    if server_process:
        print("\n🎉 Server started successfully!")
        test_endpoints()
        
        print("\nPress Enter to stop the server...")
        input()
        
        print("🛑 Stopping server...")
        server_process.terminate()
        print("✅ Server stopped")
    else:
        print("❌ Failed to start server")
        sys.exit(1) 