from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.deps import get_current_user, get_db
from app.services.recommendations import get_recommendation_engine
from app.schemas.listing import ListingResponse
from app.core.logging import logger

router = APIRouter()

@router.get("/listings", response_model=List[ListingResponse])
async def get_recommended_listings(
    limit: int = Query(10, gt=0, le=50),
    offset: int = Query(0, ge=0),
    latitude: Optional[float] = Query(None, description="User's current latitude"),
    longitude: Optional[float] = Query(None, description="User's current longitude"),
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get personalized listing recommendations"""
    try:
        recommendation_engine = get_recommendation_engine(db)
        
        # Create location dict if coordinates provided
        user_location = None
        if latitude is not None and longitude is not None:
            user_location = {
                'latitude': latitude,
                'longitude': longitude
            }
            
        recommendations = await recommendation_engine.get_recommendations(
            str(current_user['_id']),
            limit=limit,
            offset=offset,
            user_location=user_location
        )
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate recommendations"
        )

@router.post("/interactions/{listing_id}")
async def record_interaction(
    listing_id: str,
    interaction_type: str = Query(..., description="Type of interaction (view, favorite, contact)"),
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Record user interaction with a listing"""
    try:
        # Validate interaction type
        valid_types = ['view', 'favorite', 'contact']
        if interaction_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid interaction type. Must be one of: {valid_types}"
            )
            
        # Verify listing exists
        listing = await db.listings.find_one({'_id': listing_id})
        if not listing:
            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )
            
        # Record interaction
        recommendation_engine = get_recommendation_engine(db)
        await recommendation_engine.update_user_preferences(
            str(current_user['_id']),
            interaction_type,
            listing_id
        )
        
        return {"status": "success"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error recording interaction: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to record interaction"
        )

@router.get("/similar/{listing_id}", response_model=List[ListingResponse])
async def get_similar_listings(
    listing_id: str,
    limit: int = Query(5, gt=0, le=20),
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get listings similar to a given listing"""
    try:
        # Get the reference listing
        listing = await db.listings.find_one({'_id': listing_id})
        if not listing:
            raise HTTPException(
                status_code=404,
                detail="Listing not found"
            )
            
        # Create mock preferences based on the reference listing
        preferences = {
            'price_range': {
                'min': listing['price'] * 0.8,
                'max': listing['price'] * 1.2
            },
            'preferred_cities': [listing['city']],
            'amenities': listing.get('amenities', []),
            'property_types': [listing.get('property_type', '')],
            'min_rooms': listing.get('rooms', 1),
            'universities': listing.get('nearby_universities', [])
        }
        
        # Get similar listings
        recommendation_engine = get_recommendation_engine(db)
        similar_listings = []
        
        # Get active listings excluding the reference listing
        listings = await db.listings.find({
            '_id': {'$ne': listing_id},
            'active': True,
            'available': True
        }).to_list(None)
        
        # Score and sort listings
        scored_listings = []
        for lst in listings:
            score = await recommendation_engine.calculate_listing_score(
                lst,
                preferences,
                listing.get('location')
            )
            scored_listings.append((lst, score))
            
        scored_listings.sort(key=lambda x: x[1], reverse=True)
        similar_listings = [{
            **lst,
            'similarity_score': score
        } for lst, score in scored_listings[:limit]]
        
        return similar_listings
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error finding similar listings: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to find similar listings"
        )
