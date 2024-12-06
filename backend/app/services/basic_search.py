from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel
from fastapi import HTTPException

class BasicSearchFilters(BaseModel):
    city: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rooms: Optional[int] = None
    max_rooms: Optional[int] = None
    available_from: Optional[datetime] = None
    listing_type: Optional[str] = None  # apartment, room, studio
    sort_by: Optional[str] = "date"  # date, price_asc, price_desc
    page: int = 1
    page_size: int = 20

class ListingBasic(BaseModel):
    id: str
    title: str
    description: str
    price: float
    city: str
    address: str
    rooms: int
    available_from: datetime
    listing_type: str
    created_at: datetime
    updated_at: datetime
    images: List[str]
    source_url: str
    status: str = "available"  # available, unavailable, pending verification

class SearchResults(BaseModel):
    items: List[ListingBasic]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool

async def search_listings(filters: BasicSearchFilters) -> SearchResults:
    """
    Perform basic search on listings using provided filters.
    This is part of the free tier functionality.
    """
    try:
        # Build the base query
        query = {}
        
        if filters.city:
            query["city"] = {"$regex": filters.city, "$options": "i"}
        
        if filters.min_price is not None:
            query.setdefault("price", {})["$gte"] = filters.min_price
            
        if filters.max_price is not None:
            query.setdefault("price", {})["$lte"] = filters.max_price
            
        if filters.min_rooms is not None:
            query.setdefault("rooms", {})["$gte"] = filters.min_rooms
            
        if filters.max_rooms is not None:
            query.setdefault("rooms", {})["$lte"] = filters.max_rooms
            
        if filters.available_from:
            query["available_from"] = {"$lte": filters.available_from}
            
        if filters.listing_type:
            query["listing_type"] = filters.listing_type

        # Add status filter to show only available listings
        query["status"] = "available"

        # Calculate pagination
        skip = (filters.page - 1) * filters.page_size

        # Determine sort order
        sort_options = {
            "date": [("created_at", -1)],
            "price_asc": [("price", 1)],
            "price_desc": [("price", -1)]
        }
        sort_order = sort_options.get(filters.sort_by, sort_options["date"])

        # Execute query
        # Note: Implementation depends on your database setup
        # This is a placeholder for the actual database query
        results = await get_listings_from_db(
            query=query,
            sort=sort_order,
            skip=skip,
            limit=filters.page_size
        )

        # Calculate pagination info
        total = await get_total_listings_count(query)
        total_pages = (total + filters.page_size - 1) // filters.page_size

        return SearchResults(
            items=results,
            total=total,
            page=filters.page,
            pages=total_pages,
            has_next=filters.page < total_pages,
            has_prev=filters.page > 1
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

async def get_listings_from_db(
    query: Dict,
    sort: List,
    skip: int,
    limit: int
) -> List[ListingBasic]:
    """
    Retrieve listings from database based on query parameters.
    Implementation depends on your database setup.
    """
    # Placeholder for database query implementation
    pass

async def get_total_listings_count(query: Dict) -> int:
    """
    Get total count of listings matching the query.
    Implementation depends on your database setup.
    """
    # Placeholder for database count implementation
    pass

async def get_listing_details(listing_id: str) -> ListingBasic:
    """
    Get detailed information about a specific listing.
    """
    # Placeholder for database query implementation
    pass

async def get_cities_list() -> List[str]:
    """
    Get list of available cities in the database.
    This helps users with the search interface.
    """
    # Placeholder for database query implementation
    pass

async def get_listing_types() -> List[str]:
    """
    Get available listing types.
    """
    return ["apartment", "room", "studio"]

def validate_search_filters(filters: BasicSearchFilters) -> None:
    """
    Validate search filters to ensure they make sense.
    """
    if filters.min_price is not None and filters.max_price is not None:
        if filters.min_price > filters.max_price:
            raise HTTPException(
                status_code=400,
                detail="Minimum price cannot be greater than maximum price"
            )

    if filters.min_rooms is not None and filters.max_rooms is not None:
        if filters.min_rooms > filters.max_rooms:
            raise HTTPException(
                status_code=400,
                detail="Minimum rooms cannot be greater than maximum rooms"
            )

    if filters.page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page number must be greater than 0"
        )

    if filters.page_size < 1 or filters.page_size > 100:
        raise HTTPException(
            status_code=400,
            detail="Page size must be between 1 and 100"
        )
