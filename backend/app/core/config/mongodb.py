from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, GEOSPHERE
from .settings import settings

class MongoDB:
    def __init__(self, db_name: str):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[db_name]
        self.properties = self.db['properties']
        self.searchers = self.db['searchers']
        self.reports = self.db['reports']
        self.matches = self.db['matches']
        self.verifications = self.db['verifications']

    async def connect_to_database(self):
        """Create database connection."""
        # Create indexes
        await self._create_indexes()

    async def close_database_connection(self):
        """Close database connection."""
        self.client.close()

    async def _create_indexes(self):
        """Create database indexes."""
        # Properties collection indexes
        await self.properties.create_index([("location", GEOSPHERE)])
        await self.properties.create_index([("telegram_user_id", ASCENDING)])
        await self.properties.create_index([("status", ASCENDING)])
        await self.properties.create_index([("created_at", DESCENDING)])
        await self.properties.create_index([("price.amount", ASCENDING)])
        await self.properties.create_index([("rules.rental_type", ASCENDING)])
        await self.properties.create_index([("verification.status", ASCENDING)])
        await self.properties.create_index([("verification.report_count", DESCENDING)])
        
        # Searchers collection indexes
        await self.searchers.create_index([("telegram_user_id", ASCENDING)], unique=True)
        await self.searchers.create_index([("status", ASCENDING)])
        await self.searchers.create_index([("last_active", DESCENDING)])
        await self.searchers.create_index([("searcher_type", ASCENDING)])
        await self.searchers.create_index([("reputation.trust_score", DESCENDING)])
        
        # Matches collection indexes
        await self.matches.create_index([("searcher_id", ASCENDING)])
        await self.matches.create_index([("property_id", ASCENDING)])
        await self.matches.create_index([("status", ASCENDING)])
        await self.matches.create_index([("created_at", DESCENDING)])
        
        # Reports collection indexes
        await self.reports.create_index([("property_id", ASCENDING)])
        await self.reports.create_index([("reporter_id", ASCENDING)])
        await self.reports.create_index([("status", ASCENDING)])
        await self.reports.create_index([("created_at", DESCENDING)])
        await self.reports.create_index([("report_type", ASCENDING)])
        
        # Verifications collection indexes
        await self.verifications.create_index([("property_id", ASCENDING)])
        await self.verifications.create_index([("verifier_id", ASCENDING)])
        await self.verifications.create_index([("status", ASCENDING)])
        await self.verifications.create_index([("created_at", DESCENDING)])
        await self.verifications.create_index([("verification_type", ASCENDING)])


# Global instance
db = MongoDB(settings.MONGODB_DB_NAME)
