#!/usr/bin/env python3
"""
Simple MongoDB connection test
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongodb_connection():
    """Test MongoDB connection"""
    
    # Print environment variables
    print("Environment variables:")
    print(f"MONGO_URL: {os.environ.get('MONGO_URL', 'Not set')}")
    print(f"MONGO_DATABASE: {os.environ.get('MONGO_DATABASE', 'Not set')}")
    
    # Try different connection strings
    connection_strings = [
        "mongodb://localhost:27017",
        "mongodb://127.0.0.1:27017",
        "mongodb://localhost:5002",  # This is the problematic one
    ]
    
    for uri in connection_strings:
        print(f"\nTesting connection to: {uri}")
        try:
            client = AsyncIOMotorClient(uri)
            await client.admin.command('ping')
            print(f"✅ SUCCESS: Connected to {uri}")
            client.close()
            return uri
        except Exception as e:
            print(f"❌ FAILED: {e}")
    
    return None

if __name__ == "__main__":
    result = asyncio.run(test_mongodb_connection())
    if result:
        print(f"\n🎉 MongoDB is working! Use: {result}")
    else:
        print("\n❌ No MongoDB connection working") 