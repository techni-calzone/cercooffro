from fastapi import APIRouter, Depends, Request
from typing import Dict

from app.core.security import get_current_user
from app.models.user import User
from app.middleware.feature_access import get_feature_flags
from app.services.donation import get_donation_tiers, DonationTier

router = APIRouter()

@router.get("/features", response_model=Dict[str, bool])
async def get_available_features(
    request: Request,
    current_user: User = Depends(get_current_user)
) -> Dict[str, bool]:
    """Get available features for the current user."""
    return get_feature_flags(current_user)

@router.get("/donation-tiers", response_model=list[DonationTier])
async def get_available_donation_tiers() -> list[DonationTier]:
    """Get available donation tiers."""
    return get_donation_tiers()

@router.get("/subscription-info")
async def get_subscription_info(
    current_user: User = Depends(get_current_user)
) -> dict:
    """Get subscription information for the current user."""
    return {
        "is_premium": current_user.is_premium,
        "subscription_end_date": current_user.subscription_end_date,
        "premium_features": [
            {
                "name": "AI-powered insights",
                "description": "Get AI analysis of listings and personalized recommendations"
            },
            {
                "name": "Priority notifications",
                "description": "Receive instant notifications for new listings matching your criteria"
            },
            {
                "name": "Advanced filters",
                "description": "Access additional search filters like proximity to universities"
            },
            {
                "name": "Ad-free experience",
                "description": "Browse listings without any advertisements"
            },
            {
                "name": "Saved searches",
                "description": "Save and manage your search criteria"
            }
        ]
    }
