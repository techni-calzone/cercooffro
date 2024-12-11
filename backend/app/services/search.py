from typing import List, Optional
from datetime import datetime
from app.models.entities.searcher import SearchPreferences
from app.core.config.mongodb import db
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

class SearchService:
    @staticmethod
    async def search_properties(preferences: SearchPreferences, page: int = 1, limit: int = 10):
        """Search for properties based on searcher preferences."""
        # Build the search query
        query = {
            "status": "active",
            "price": {
                "$gte": preferences.price_range.min,
                "$lte": preferences.price_range.max
            },
            "city": {"$in": preferences.location.cities},
            "available_from": {"$lte": preferences.dates.move_in},
            "minimum_stay": {"$lte": preferences.dates.duration}
        }
        
        # Add area filter if specified
        if preferences.location.areas:
            query["area"] = {"$in": preferences.location.areas}
        
        # Add requirements filters
        if preferences.requirements.furnished:
            query["furnished"] = True
        if preferences.requirements.internet:
            query["internet"] = True
        if preferences.requirements.utilities_included:
            query["utilities_included"] = True
        
        # Calculate skip for pagination
        skip = (page - 1) * limit
        
        # Execute search
        cursor = db.properties.find(query)
        
        # Get total count
        total = await cursor.count()
        
        # Apply pagination
        cursor = cursor.skip(skip).limit(limit)
        
        # Convert cursor to list
        properties = await cursor.to_list(length=limit)
        
        return {
            "properties": properties,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
        }
    
    @staticmethod
    async def search_by_text(
        query: str,
        city: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        page: int = 1,
        limit: int = 10
    ):
        """Search properties by text query with optional filters."""
        # Create text index if it doesn't exist
        await db.properties.create_index([
            ("description", "text"),
            ("title", "text")
        ])
        
        # Build search query
        search_query = {
            "$text": {"$search": query},
            "status": "active"
        }
        
        # Add filters
        if city:
            search_query["city"] = city
        if min_price is not None:
            search_query.setdefault("price", {})["$gte"] = min_price
        if max_price is not None:
            search_query.setdefault("price", {})["$lte"] = max_price
        
        # Calculate skip for pagination
        skip = (page - 1) * limit
        
        # Execute search with text score sorting
        cursor = db.properties.find(
            search_query,
            {"score": {"$meta": "textScore"}}
        ).sort([
            ("score", {"$meta": "textScore"}),
            ("created_at", -1)
        ])
        
        # Get total count
        total = await cursor.count()
        
        # Apply pagination
        cursor = cursor.skip(skip).limit(limit)
        
        # Convert cursor to list
        properties = await cursor.to_list(length=limit)
        
        return {
            "properties": properties,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
        }
    
    @staticmethod
    async def get_property_recommendations(searcher_id: str, limit: int = 5):
        """Get property recommendations based on searcher preferences."""
        # Get searcher preferences
        searcher = await db.searchers.find_one({"telegram_id": searcher_id})
        if not searcher or not searcher.get("preferences"):
            return []
        
        preferences = SearchPreferences(**searcher["preferences"])
        
        # Search for properties with a bit more relaxed criteria
        query = {
            "status": "active",
            "price": {
                "$gte": preferences.price_range.min * 0.9,  # 10% below min
                "$lte": preferences.price_range.max * 1.1   # 10% above max
            },
            "city": {"$in": preferences.location.cities},
            "available_from": {"$lte": preferences.dates.move_in}
        }
        
        # Execute search
        properties = await db.properties.find(query).limit(limit).to_list(length=limit)
        
        return properties
