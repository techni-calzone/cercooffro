from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def get_database():
    return db.db

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.db = db.client[settings.MONGODB_DB_NAME]
    
    # Create indexes
    await db.db.listings.create_index([("location.city", 1)])
    await db.db.listings.create_index([("price", 1)])
    await db.db.listings.create_index([("status", 1)])
    await db.db.users.create_index([("email", 1)], unique=True)
    await db.db.users.create_index([("username", 1)], unique=True)

async def close_mongo_connection():
    db.client.close()
