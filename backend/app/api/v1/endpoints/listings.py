from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import openai
from datetime import datetime

from app.core.database import get_database
from app.models.listing import Listing, ListingStatus, ListingVote
from app.core.config import settings
from app.core.security import oauth2_scheme

router = APIRouter()

@router.get("/search", response_model=List[Listing])
async def search_listings(
    query: str = None,
    city: str = None,
    min_price: float = None,
    max_price: float = None,
    university: str = None,
    status: ListingStatus = ListingStatus.AVAILABLE,
    limit: int = Query(default=20, le=100),
    skip: int = 0,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> List[Listing]:
    filter_query = {}
    
    if status:
        filter_query["status"] = status
    if city:
        filter_query["location.city"] = city
    if min_price is not None:
        filter_query["price"] = {"$gte": min_price}
    if max_price is not None:
        filter_query.setdefault("price", {}).update({"$lte": max_price})
    if university:
        filter_query["location.university"] = university
    
    # AI-powered search if query is provided
    if query and settings.OPENAI_API_KEY:
        try:
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Convert this rental search query to keywords: {query}",
                max_tokens=50
            )
            keywords = response.choices[0].text.strip().split(",")
            filter_query["$text"] = {"$search": " ".join(keywords)}
        except Exception as e:
            # Fallback to simple text search
            filter_query["$text"] = {"$search": query}
    
    cursor = db.listings.find(filter_query)
    cursor.skip(skip).limit(limit)
    
    return [Listing(**listing) async for listing in cursor]

@router.post("/{listing_id}/vote")
async def vote_listing(
    listing_id: str,
    status: ListingStatus,
    user = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user has already voted
    existing_vote = await db.votes.find_one({
        "listing_id": listing_id,
        "user_id": user["_id"]
    })
    
    if existing_vote:
        # Update existing vote
        await db.votes.update_one(
            {"_id": existing_vote["_id"]},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    else:
        # Create new vote
        vote = ListingVote(
            listing_id=listing_id,
            user_id=user["_id"],
            status=status
        )
        await db.votes.insert_one(vote.dict())
    
    # Update listing status based on votes
    votes = await db.votes.find({"listing_id": listing_id}).to_list(None)
    vote_counts = {status: 0 for status in ListingStatus}
    for vote in votes:
        vote_counts[vote["status"]] += 1
    
    # Update listing with new status and vote counts
    majority_status = max(vote_counts.items(), key=lambda x: x[1])[0]
    await db.listings.update_one(
        {"_id": listing_id},
        {
            "$set": {
                "status": majority_status,
                "votes": vote_counts,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Vote recorded successfully"}

@router.get("/recommendations")
async def get_recommendations(
    user = Depends(oauth2_scheme),
    limit: int = Query(default=10, le=50),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Get user preferences
    user_prefs = await db.user_preferences.find_one({"user_id": user["_id"]})
    if not user_prefs:
        raise HTTPException(status_code=404, detail="User preferences not found")
    
    # Build recommendation query based on user preferences
    query = {
        "status": ListingStatus.AVAILABLE,
        "price": {"$lte": user_prefs.get("max_budget", float("inf"))}
    }
    
    if user_prefs.get("university"):
        query["location.university"] = user_prefs["university"]
    
    # Sort by relevance score
    cursor = db.listings.find(query).sort([
        ("university_proximity", 1),
        ("price", 1)
    ]).limit(limit)
    
    return [Listing(**listing) async for listing in cursor]
