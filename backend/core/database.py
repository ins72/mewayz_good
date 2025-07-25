"""
Database connection module for MEWAYZ V2
Provides database connections for services
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import logging

logger = logging.getLogger(__name__)

# Global database connections
_async_client = None
_sync_client = None
_async_db = None
_sync_db = None

def get_mongo_url():
    """Get MongoDB URL from environment"""
    return os.environ.get('MONGO_URL', 'mongodb://localhost:27017')

def get_database_name():
    """Get database name from environment"""
    return os.environ.get('DB_NAME', 'mewayz')

def get_database():
    """Get synchronous database connection"""
    global _sync_client, _sync_db
    
    try:
        if _sync_client is None:
            mongo_url = get_mongo_url()
            _sync_client = MongoClient(mongo_url)
        
        if _sync_db is None:
            db_name = get_database_name()
            _sync_db = _sync_client[db_name]
        
        return _sync_db
    except Exception as e:
        logger.error(f"Error getting sync database: {e}")
        return None

async def get_database_async():
    """Get asynchronous database connection"""
    global _async_client, _async_db
    
    try:
        if _async_client is None:
            mongo_url = get_mongo_url()
            _async_client = AsyncIOMotorClient(mongo_url)
        
        if _async_db is None:
            db_name = get_database_name()
            _async_db = _async_client[db_name]
        
        return _async_db
    except Exception as e:
        logger.error(f"Error getting async database: {e}")
        return None

async def close_database_connections():
    """Close database connections"""
    global _async_client, _sync_client, _async_db, _sync_db
    
    try:
        if _async_client:
            _async_client.close()
            _async_client = None
            _async_db = None
        
        if _sync_client:
            _sync_client.close()
            _sync_client = None
            _sync_db = None
            
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")

async def test_database_connection():
    """Test database connection"""
    try:
        db = await get_database_async()
        if db is None:
            return False
        
        # Test connection by listing collections
        collections = await db.list_collection_names()
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False