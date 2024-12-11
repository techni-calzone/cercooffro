from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from app.models.entities.searcher import (
    Searcher,
    SearcherType,
    SearcherStatus,
    SearchPreferences
)
from app.services.searcher import SearcherService
from app.services.auth.telegram import TelegramAuth

router = APIRouter()


async def verify_telegram_user(telegram_id: str):
    """Dependency to verify Telegram user."""
    if not await TelegramAuth.verify_telegram_user(telegram_id):
        raise HTTPException(
            status_code=401,
            detail="Invalid or inactive Telegram user"
        )
    return telegram_id


@router.post("/", response_model=Searcher)
async def create_searcher(
    telegram_id: str,
    searcher_type: SearcherType = SearcherType.ANY
) -> Searcher:
    """Create a new searcher."""
    existing = await SearcherService.get_searcher(telegram_id)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Searcher already exists"
        )
    return await SearcherService.create_searcher(telegram_id, searcher_type)


@router.get("/me", response_model=Searcher)
async def get_current_searcher(
    telegram_id: str = Depends(verify_telegram_user)
) -> Searcher:
    """Get current searcher profile."""
    searcher = await SearcherService.get_searcher(telegram_id)
    if not searcher:
        raise HTTPException(
            status_code=404,
            detail="Searcher not found"
        )
    return searcher


@router.put("/me/preferences", response_model=Searcher)
async def update_preferences(
    preferences: SearchPreferences,
    telegram_id: str = Depends(verify_telegram_user)
) -> Searcher:
    """Update searcher preferences."""
    searcher = await SearcherService.update_preferences(telegram_id, preferences)
    if not searcher:
        raise HTTPException(
            status_code=404,
            detail="Searcher not found"
        )
    return searcher


@router.put("/me/type", response_model=Searcher)
async def update_searcher_type(
    searcher_type: SearcherType,
    telegram_id: str = Depends(verify_telegram_user)
) -> Searcher:
    """Update searcher type."""
    searcher = await TelegramAuth.update_searcher_type(telegram_id, searcher_type)
    if not searcher:
        raise HTTPException(
            status_code=404,
            detail="Searcher not found"
        )
    return searcher


@router.put("/me/status", response_model=Searcher)
async def update_searcher_status(
    status: SearcherStatus,
    telegram_id: str = Depends(verify_telegram_user)
) -> Searcher:
    """Update searcher status."""
    searcher = await SearcherService.update_status(telegram_id, status)
    if not searcher:
        raise HTTPException(
            status_code=404,
            detail="Searcher not found"
        )
    return searcher


@router.delete("/me")
async def delete_searcher(
    telegram_id: str = Depends(verify_telegram_user)
) -> dict:
    """Delete (deactivate) current searcher."""
    success = await SearcherService.delete_searcher(telegram_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Searcher not found"
        )
    return {"status": "success", "message": "Searcher deactivated"}
