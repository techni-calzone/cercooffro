from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional

from app.core.security import oauth2_scheme
from app.core.database import get_database
from app.models.user import UserPreferences

router = APIRouter()

@router.get("/preferences")
async def get_user_preferences(
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's rental preferences"""
    preferences = await db.user_preferences.find_one({"user_id": user["_id"]})
    if not preferences:
        return UserPreferences(user_id=user["_id"])
    return preferences

@router.put("/preferences")
async def update_preferences(
    preferences: UserPreferences,
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update user's rental preferences"""
    preferences.user_id = user["_id"]
    
    result = await db.user_preferences.update_one(
        {"user_id": user["_id"]},
        {"$set": preferences.dict()},
        upsert=True
    )
    
    return {"message": "Preferences updated successfully"}

@router.post("/track-interaction")
async def track_user_interaction(
    listing_id: str,
    interaction_type: str,
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Track user interactions with listings for better recommendations"""
    interaction = {
        "user_id": user["_id"],
        "listing_id": listing_id,
        "type": interaction_type,
        "timestamp": datetime.utcnow()
    }
    
    await db.user_interactions.insert_one(interaction)
    return {"message": "Interaction tracked successfully"}

@router.get("/saved-searches")
async def get_saved_searches(
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's saved searches (Premium feature)"""
    if user.get("subscription_tier") != "premium":
        raise HTTPException(
            status_code=403,
            detail="This feature is only available for premium users"
        )
    
    searches = await db.saved_searches.find(
        {"user_id": user["_id"]}
    ).to_list(None)
    
    return searches

@router.post("/saved-searches")
async def save_search(
    search_params: dict,
    name: str,
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save a search for later use (Premium feature)"""
    if user.get("subscription_tier") != "premium":
        raise HTTPException(
            status_code=403,
            detail="This feature is only available for premium users"
        )
    
    saved_search = {
        "user_id": user["_id"],
        "name": name,
        "params": search_params,
        "created_at": datetime.utcnow()
    }
    
    await db.saved_searches.insert_one(saved_search)
    return {"message": "Search saved successfully"}
