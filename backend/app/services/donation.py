from typing import Optional
from datetime import datetime
from pydantic import BaseModel
import stripe
from app.core.config import get_settings

settings = get_settings()
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

class DonationTier(BaseModel):
    name: str
    amount: float
    description: str
    benefits: list[str]

class Donation(BaseModel):
    id: str
    amount: float
    donor_name: Optional[str]
    donor_email: Optional[str]
    message: Optional[str]
    created_at: datetime
    is_anonymous: bool = False

DONATION_TIERS = [
    DonationTier(
        name="Supporter",
        amount=5.0,
        description="Support the development of the platform",
        benefits=[
            "Name on supporters page",
            "Early access to beta features"
        ]
    ),
    DonationTier(
        name="Contributor",
        amount=20.0,
        description="Contribute to new feature development",
        benefits=[
            "Name on supporters page",
            "Early access to beta features",
            "Vote on feature prioritization"
        ]
    ),
    DonationTier(
        name="Sponsor",
        amount=50.0,
        description="Sponsor major platform improvements",
        benefits=[
            "Name on supporters page",
            "Early access to beta features",
            "Vote on feature prioritization",
            "Direct contact with development team"
        ]
    )
]

async def create_donation_session(
    amount: float,
    donor_name: Optional[str] = None,
    donor_email: Optional[str] = None,
    message: Optional[str] = None,
    is_anonymous: bool = False
) -> str:
    """Create a Stripe checkout session for donation."""
    if not settings.STRIPE_SECRET_KEY:
        raise ValueError("Stripe is not configured")

    metadata = {
        "donation": "true",
        "is_anonymous": str(is_anonymous),
    }
    if donor_name:
        metadata["donor_name"] = donor_name
    if message:
        metadata["message"] = message

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "eur",
                "unit_amount": int(amount * 100),  # Convert to cents
                "product_data": {
                    "name": "Donation to Student Rental Aggregator",
                    "description": "Thank you for supporting our open-source project!"
                },
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{settings.FRONTEND_URL}/donation/success",
        cancel_url=f"{settings.FRONTEND_URL}/donation/cancel",
        metadata=metadata,
        customer_email=donor_email
    )
    
    return session.id

async def process_donation_webhook(event_data: dict) -> None:
    """Process Stripe webhook for successful donation."""
    if event_data["type"] != "checkout.session.completed":
        return

    session = event_data["data"]["object"]
    if not session.get("metadata", {}).get("donation"):
        return

    # Create donation record
    donation = Donation(
        id=session["id"],
        amount=session["amount_total"] / 100,  # Convert from cents
        donor_name=session["metadata"].get("donor_name"),
        donor_email=session["customer_email"],
        message=session["metadata"].get("message"),
        created_at=datetime.fromtimestamp(session["created"]),
        is_anonymous=session["metadata"].get("is_anonymous", "false").lower() == "true"
    )

    # Store donation in database
    await store_donation(donation)

async def store_donation(donation: Donation) -> None:
    """Store donation in database and update supporter page."""
    # Implementation depends on your database setup
    pass

async def get_top_supporters(limit: int = 10) -> list[dict]:
    """Get list of top supporters for the supporters page."""
    # Implementation depends on your database setup
    pass

def get_donation_tiers() -> list[DonationTier]:
    """Get available donation tiers."""
    return DONATION_TIERS
