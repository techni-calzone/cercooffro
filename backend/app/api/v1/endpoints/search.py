from fastapi import APIRouter, Query, Depends, HTTPException
from typing import Optional
from app.services.search import SearchService
from app.services.auth.telegram import TelegramAuth

router = APIRouter()

@router.get("/properties")
async def search_properties(
    telegram_id: str = Depends(TelegramAuth.verify_telegram_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Search properties based on searcher preferences."""
    try:
        results = await SearchService.search_properties(
            telegram_id=telegram_id,
            page=page,
            limit=limit
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/text")
async def search_by_text(
    query: str = Query(..., min_length=1, max_length=100),
    city: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Search properties by text query with optional filters."""
    try:
        results = await SearchService.search_by_text(
            query=query,
            city=city,
            min_price=min_price,
            max_price=max_price,
            page=page,
            limit=limit
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations")
async def get_recommendations(
    telegram_id: str = Depends(TelegramAuth.verify_telegram_user),
    limit: int = Query(5, ge=1, le=20)
):
    """Get property recommendations based on searcher preferences."""
    try:
        recommendations = await SearchService.get_property_recommendations(
            searcher_id=telegram_id,
            limit=limit
        )
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
