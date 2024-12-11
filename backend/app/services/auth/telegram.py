from datetime import datetime
from typing import Optional
from telegram import Update
from telegram.ext import ContextTypes
from app.core.config.settings import settings
from app.core.config.mongodb import db
from app.models.entities.searcher import Searcher, SearcherType


class TelegramAuth:
    @staticmethod
    async def get_or_create_searcher(telegram_id: str, searcher_type: SearcherType = SearcherType.ANY) -> Searcher:
        """Get existing searcher or create a new one."""
        searcher_data = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
        
        if searcher_data:
            # Update last_active
            await db.db.searchers.update_one(
                {"telegram_user_id": telegram_id},
                {"$set": {"last_active": datetime.utcnow()}}
            )
            return Searcher(**searcher_data)
        
        # Create new searcher
        new_searcher = Searcher(
            telegram_user_id=telegram_id,
            searcher_type=searcher_type
        )
        
        await db.db.searchers.insert_one(new_searcher.model_dump())
        return new_searcher

    @staticmethod
    async def handle_telegram_login(update: Update, context: ContextTypes.DEFAULT_TYPE) -> Optional[Searcher]:
        """Handle Telegram login command."""
        if not update.effective_user:
            return None
            
        telegram_id = str(update.effective_user.id)
        return await TelegramAuth.get_or_create_searcher(telegram_id)

    @staticmethod
    async def verify_telegram_user(telegram_id: str) -> bool:
        """Verify if a Telegram user exists and is active."""
        searcher = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
        return searcher is not None and searcher.get("status") == "active"
        
    @staticmethod
    async def update_searcher_type(telegram_id: str, searcher_type: SearcherType) -> Optional[Searcher]:
        """Update searcher type."""
        result = await db.db.searchers.update_one(
            {"telegram_user_id": telegram_id},
            {
                "$set": {
                    "searcher_type": searcher_type,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count:
            searcher_data = await db.db.searchers.find_one({"telegram_user_id": telegram_id})
            return Searcher(**searcher_data) if searcher_data else None
            
        return None
