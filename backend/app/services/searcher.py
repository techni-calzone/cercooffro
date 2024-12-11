from datetime import datetime
from typing import List, Optional
from app.core.config.mongodb import db
from app.models.entities.searcher import (
    Searcher,
    SearcherType,
    SearcherStatus,
    SearchPreferences
)


class SearcherService:
    @staticmethod
    async def create_searcher(telegram_id: str, searcher_type: SearcherType) -> Searcher:
        """Create a new searcher."""
        searcher = Searcher(
            telegram_user_id=telegram_id,
            searcher_type=searcher_type
        )
        
        await db.db.searchers.insert_one(searcher.model_dump())
        return searcher

    @staticmethod
    async def get_searcher(telegram_id: str) -> Optional[Searcher]:
        """Get a searcher by Telegram ID."""
        searcher_data = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
        return Searcher(**searcher_data) if searcher_data else None

    @staticmethod
    async def update_preferences(
        telegram_id: str,
        preferences: SearchPreferences
    ) -> Optional[Searcher]:
        """Update searcher preferences."""
        result = await db.db.searchers.update_one(
            {"telegram_user_id": telegram_id},
            {
                "$set": {
                    "search_preferences": preferences.model_dump(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count:
            searcher_data = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
            return Searcher(**searcher_data) if searcher_data else None
        
        return None

    @staticmethod
    async def update_status(
        telegram_id: str,
        status: SearcherStatus
    ) -> Optional[Searcher]:
        """Update searcher status."""
        result = await db.db.searchers.update_one(
            {"telegram_user_id": telegram_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count:
            searcher_data = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
            return Searcher(**searcher_data) if searcher_data else None
        
        return None

    @staticmethod
    async def delete_searcher(telegram_id: str) -> bool:
        """Delete a searcher (soft delete by setting status to inactive)."""
        result = await db.db.searchers.update_one(
            {"telegram_user_id": telegram_id},
            {
                "$set": {
                    "status": SearcherStatus.INACTIVE,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0

    @staticmethod
    async def list_active_searchers(
        skip: int = 0,
        limit: int = 10,
        searcher_type: Optional[SearcherType] = None
    ) -> List[Searcher]:
        """List active searchers with optional filtering by type."""
        query = {"status": SearcherStatus.ACTIVE}
        if searcher_type:
            query["searcher_type"] = searcher_type
            
        cursor = db.db.searchers.find(query).skip(skip).limit(limit)
        searchers = await cursor.to_list(length=limit)
        return [Searcher(**searcher) for searcher in searchers]

    @staticmethod
    async def update_last_active(telegram_id: str) -> None:
        """Update the last_active timestamp for a searcher."""
        await db.db.searchers.update_one(
            {"telegram_user_id": telegram_id},
            {"$set": {"last_active": datetime.utcnow()}}
        )
