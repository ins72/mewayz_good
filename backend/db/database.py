"""
Database connection module for MEWAYZ V2
Provides database connection for setup scripts and other modules
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'mewayz')

# Create client
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db


def get_client() -> AsyncIOMotorClient:
    """Get MongoDB client"""
    return client 