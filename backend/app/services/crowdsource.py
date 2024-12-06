from datetime import datetime
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel

from app.core.config import get_settings
from app.models.user import User

settings = get_settings()

class VoteType(str, Enum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    INCORRECT = "incorrect"
    SPAM = "spam"

class Vote(BaseModel):
    user_id: str
    listing_id: str
    vote_type: VoteType
    timestamp: datetime
    comment: Optional[str] = None
    trust_score: float = 1.0

class ListingStatus(BaseModel):
    listing_id: str
    status: str
    confidence: float
    last_updated: datetime
    total_votes: int
    available_votes: int
    unavailable_votes: int
    incorrect_votes: int
    spam_votes: int

async def submit_vote(
    listing_id: str,
    user: User,
    vote_type: VoteType,
    comment: Optional[str] = None
) -> Vote:
    """Submit a vote for a listing's status."""
    # Calculate user's trust score based on their history
    trust_score = await calculate_user_trust_score(user.id)
    
    vote = Vote(
        user_id=user.id,
        listing_id=listing_id,
        vote_type=vote_type,
        timestamp=datetime.utcnow(),
        comment=comment,
        trust_score=trust_score
    )
    
    # Store vote in database
    await store_vote(vote)
    
    # Update listing status based on accumulated votes
    await update_listing_status(listing_id)
    
    return vote

async def calculate_user_trust_score(user_id: str) -> float:
    """Calculate a user's trust score based on their voting history."""
    # Get user's past votes and their accuracy
    past_votes = await get_user_past_votes(user_id)
    if not past_votes:
        return 1.0
    
    # Calculate score based on:
    # 1. Agreement with majority votes
    # 2. Account age
    # 3. Total number of votes
    # 4. Previous accuracy
    
    base_score = 1.0
    agreement_bonus = 0.1
    account_age_bonus = 0.1
    volume_bonus = 0.1
    
    return min(base_score + agreement_bonus + account_age_bonus + volume_bonus, 2.0)

async def get_listing_status(listing_id: str) -> ListingStatus:
    """Get the current status of a listing based on votes."""
    votes = await get_listing_votes(listing_id)
    
    if not votes:
        return ListingStatus(
            listing_id=listing_id,
            status="unknown",
            confidence=0.0,
            last_updated=datetime.utcnow(),
            total_votes=0,
            available_votes=0,
            unavailable_votes=0,
            incorrect_votes=0,
            spam_votes=0
        )
    
    # Count weighted votes
    vote_counts = {
        VoteType.AVAILABLE: 0.0,
        VoteType.UNAVAILABLE: 0.0,
        VoteType.INCORRECT: 0.0,
        VoteType.SPAM: 0.0
    }
    
    for vote in votes:
        vote_counts[vote.vote_type] += vote.trust_score
    
    total_weighted_votes = sum(vote_counts.values())
    
    # Calculate confidence based on vote distribution
    max_votes = max(vote_counts.values())
    confidence = max_votes / total_weighted_votes if total_weighted_votes > 0 else 0.0
    
    # Determine status
    if confidence >= settings.TRUST_SCORE_THRESHOLD:
        status = max(vote_counts.items(), key=lambda x: x[1])[0]
    else:
        status = "uncertain"
    
    return ListingStatus(
        listing_id=listing_id,
        status=status,
        confidence=confidence,
        last_updated=datetime.utcnow(),
        total_votes=len(votes),
        available_votes=sum(1 for v in votes if v.vote_type == VoteType.AVAILABLE),
        unavailable_votes=sum(1 for v in votes if v.vote_type == VoteType.UNAVAILABLE),
        incorrect_votes=sum(1 for v in votes if v.vote_type == VoteType.INCORRECT),
        spam_votes=sum(1 for v in votes if v.vote_type == VoteType.SPAM)
    )

async def get_user_past_votes(user_id: str) -> List[Vote]:
    """Get a user's voting history."""
    # Implementation depends on your database setup
    pass

async def get_listing_votes(listing_id: str) -> List[Vote]:
    """Get all votes for a listing."""
    # Implementation depends on your database setup
    pass

async def store_vote(vote: Vote) -> None:
    """Store a vote in the database."""
    # Implementation depends on your database setup
    pass

async def update_listing_status(listing_id: str) -> None:
    """Update a listing's status based on accumulated votes."""
    # Implementation depends on your database setup
    pass

async def get_user_contribution_stats(user_id: str) -> dict:
    """Get statistics about a user's contributions to crowdsourcing."""
    votes = await get_user_past_votes(user_id)
    
    return {
        "total_votes": len(votes),
        "trust_score": await calculate_user_trust_score(user_id),
        "vote_distribution": {
            "available": sum(1 for v in votes if v.vote_type == VoteType.AVAILABLE),
            "unavailable": sum(1 for v in votes if v.vote_type == VoteType.UNAVAILABLE),
            "incorrect": sum(1 for v in votes if v.vote_type == VoteType.INCORRECT),
            "spam": sum(1 for v in votes if v.vote_type == VoteType.SPAM)
        }
    }
