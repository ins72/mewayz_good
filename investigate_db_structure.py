#!/usr/bin/env python3
"""
Investigate Database Structure and Find User Data
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import json
from bson import ObjectId

# Load environment variables
load_dotenv('/app/backend/.env')

# Configure connections
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

print("🔍 DATABASE STRUCTURE INVESTIGATION")
print("=" * 50)
print(f"🗄️  Database: {MONGO_URL}")
print(f"📊 Database Name: {DB_NAME}")
print("=" * 50)

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for MongoDB ObjectIds"""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

async def investigate_database():
    """Investigate all collections and their contents"""
    
    client = AsyncIOMotorClient(MONGO_URL)
    
    try:
        # List all databases
        db_list = await client.list_database_names()
        print(f"\n📋 Available Databases:")
        for db_name in db_list:
            print(f"   - {db_name}")
        
        # Check if our target database exists
        if DB_NAME not in db_list:
            print(f"\n⚠️  Target database '{DB_NAME}' not found!")
            print("Let's check all databases for user-like collections...")
            
            for db_name in db_list:
                if db_name in ['admin', 'local', 'config']:
                    continue
                    
                print(f"\n🔍 Checking database: {db_name}")
                db = client[db_name]
                collections = await db.list_collection_names()
                
                for collection_name in collections:
                    print(f"   📁 Collection: {collection_name}")
                    collection = db[collection_name]
                    count = await collection.count_documents({})
                    print(f"      📊 Document Count: {count}")
                    
                    if count > 0:
                        # Get a sample document
                        sample = await collection.find_one({})
                        if sample:
                            print(f"      📄 Sample Fields: {list(sample.keys())}")
                            
                            # Check if this looks like user data
                            user_like_fields = ['email', 'username', 'name', 'password', 'full_name']
                            if any(field in sample.keys() for field in user_like_fields):
                                print(f"      👤 POTENTIAL USER COLLECTION FOUND!")
                                
                                # Get all documents from potential user collection
                                cursor = collection.find({})
                                docs = await cursor.to_list(length=None)
                                
                                print(f"      📋 All Documents:")
                                for i, doc in enumerate(docs, 1):
                                    email = doc.get('email', doc.get('username', 'NO_EMAIL'))
                                    name = doc.get('full_name', doc.get('name', 'NO_NAME'))
                                    print(f"         {i}. {email} ({name})")
        else:
            # Target database exists, check its collections
            db = client[DB_NAME]
            collections = await db.list_collection_names()
            
            print(f"\n📁 Collections in '{DB_NAME}':")
            for collection_name in collections:
                print(f"   - {collection_name}")
                
                collection = db[collection_name]
                count = await collection.count_documents({})
                print(f"     📊 Documents: {count}")
                
                if count > 0:
                    # Get sample document
                    sample = await collection.find_one({})
                    if sample:
                        print(f"     📄 Sample Fields: {list(sample.keys())}")
                        
                        # Show all documents for small collections
                        if count <= 10:
                            cursor = collection.find({})
                            docs = await cursor.to_list(length=None)
                            print(f"     📋 All Documents:")
                            for i, doc in enumerate(docs, 1):
                                # Try to identify key fields
                                identifier = (doc.get('email') or 
                                            doc.get('username') or 
                                            doc.get('name') or 
                                            str(doc.get('_id', i)))
                                print(f"        {i}. {identifier}")
                                # Print some key fields if they exist
                                for key in ['email', 'full_name', 'created_at', 'owner_id']:
                                    if key in doc:
                                        print(f"           {key}: {doc[key]}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(investigate_database())