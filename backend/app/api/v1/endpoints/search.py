from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime

from app.services.basic_search import (
    BasicSearchFilters,
    SearchResults,
    ListingBasic,
    search_listings,
    get_listing_details,
    get_cities_list,
    get_listing_types,
    validate_search_filters
)

router = APIRouter()

@router.get("/search", response_model=SearchResults)
async def search(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rooms: Optional[int] = None,
    max_rooms: Optional[int] = None,
    available_from: Optional[datetime] = None,
    listing_type: Optional[str] = None,
    sort_by: str = "date",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
) -> SearchResults:
    """
    Search for listings using basic filters.
    This endpoint is part of the free tier functionality.
    """
    filters = BasicSearchFilters(
        city=city,
        min_price=min_price,
        max_price=max_price,
        min_rooms=min_rooms,
        max_rooms=max_rooms,
        available_from=available_from,
        listing_type=listing_type,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )
    
    # Validate filters
    validate_search_filters(filters)
    
    # Perform search
    return await search_listings(filters)

@router.get("/listings/{listing_id}", response_model=ListingBasic)
async def get_listing(listing_id: str) -> ListingBasic:
    """
    Get detailed information about a specific listing.
    """
    listing = await get_listing_details(listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.get("/cities", response_model=List[str])
async def list_cities() -> List[str]:
    """
    Get list of available cities.
    Helps users with the search interface.
    """
    return await get_cities_list()

@router.get("/listing-types", response_model=List[str])
async def list_listing_types() -> List[str]:
    """
    Get available listing types.
    """
    return await get_listing_types()

@router.get("/search/help")
async def search_help() -> dict:
    """
    Get information about search capabilities and filters.
    """
    return {
        "filters": {
            "city": "Filter by city name",
            "price": "Filter by price range (min_price, max_price)",
            "rooms": "Filter by number of rooms (min_rooms, max_rooms)",
            "available_from": "Filter by availability date",
            "listing_type": "Filter by type (apartment, room, studio)"
        },
        "sorting": {
            "date": "Sort by listing date (newest first)",
            "price_asc": "Sort by price (lowest first)",
            "price_desc": "Sort by price (highest first)"
        },
        "pagination": {
            "page": "Page number (starts from 1)",
            "page_size": "Number of results per page (1-100)"
        }
    }
