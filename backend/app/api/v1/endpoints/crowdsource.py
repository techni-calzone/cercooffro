from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Optional

from app.core.security import get_current_user
from app.models.user import User
from app.services.crowdsource import (
    submit_vote,
    get_listing_status,
    get_user_contribution_stats,
    VoteType,
    ListingStatus
)

router = APIRouter()

@router.post("/listings/{listing_id}/vote", response_model=Dict)
async def vote_on_listing(
    listing_id: str,
    vote_type: VoteType,
    comment: Optional[str] = None,
    current_user: User = Depends(get_current_user)
) -> Dict:
    """Submit a vote for a listing's status."""
    try:
        vote = await submit_vote(
            listing_id=listing_id,
            user=current_user,
            vote_type=vote_type,
            comment=comment
        )
        return {
            "success": True,
            "message": "Vote submitted successfully",
            "vote": vote
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/listings/{listing_id}/status", response_model=ListingStatus)
async def get_listing_vote_status(listing_id: str) -> ListingStatus:
    """Get the current status of a listing based on community votes."""
    try:
        return await get_listing_status(listing_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/users/me/contributions", response_model=Dict)
async def get_my_contributions(
    current_user: User = Depends(get_current_user)
) -> Dict:
    """Get statistics about the current user's contributions to crowdsourcing."""
    try:
        return await get_user_contribution_stats(current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vote-types")
async def get_available_vote_types() -> Dict:
    """Get all available vote types and their descriptions."""
    return {
        "vote_types": {
            VoteType.AVAILABLE: "The listing is currently available",
            VoteType.UNAVAILABLE: "The listing is no longer available",
            VoteType.INCORRECT: "The listing information is incorrect",
            VoteType.SPAM: "The listing is spam or fraudulent"
        }
    }
