from fastapi import APIRouter, Depends, Request, Header
from typing import Optional
from app.core.security import oauth2_scheme
from app.services.payment import (
    create_checkout_session,
    handle_webhook,
    cancel_subscription,
    get_subscription_status
)
from app.core.database import get_database

router = APIRouter()

@router.post("/create-checkout-session")
async def create_payment_session(
    success_url: str,
    cancel_url: str,
    user = Depends(oauth2_scheme),
    db = Depends(get_database)
):
    """Create a Stripe Checkout Session for premium subscription"""
    session = await create_checkout_session(
        user_id=user["_id"],
        success_url=success_url,
        cancel_url=cancel_url
    )
    return {"sessionId": session.id}

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None),
    db = Depends(get_database)
):
    """Handle Stripe webhooks"""
    payload = await request.body()
    return await handle_webhook(payload, stripe_signature)

@router.post("/cancel-subscription")
async def cancel_user_subscription(
    subscription_id: str,
    user = Depends(oauth2_scheme),
    db = Depends(get_database)
):
    """Cancel a user's premium subscription"""
    result = await cancel_subscription(subscription_id)
    # Update user's subscription status in database
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"subscription_tier": "free"}}
    )
    return result

@router.get("/subscription-status")
async def get_user_subscription_status(
    subscription_id: str,
    user = Depends(oauth2_scheme)
):
    """Get the status of a user's subscription"""
    return await get_subscription_status(subscription_id)
