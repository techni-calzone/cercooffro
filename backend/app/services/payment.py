import stripe
from fastapi import HTTPException
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

PREMIUM_PRICE_ID = "price_premium_monthly"  # Replace with actual Stripe Price ID

async def create_checkout_session(user_id: str, success_url: str, cancel_url: str):
    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=user_id,  # Pass user's email
            payment_method_types=['card'],
            line_items=[{
                'price': PREMIUM_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user_id
            }
        )
        return checkout_session
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

async def handle_webhook(payload: dict, signature: str):
    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            settings.STRIPE_WEBHOOK_SECRET
        )
        
        if event.type == 'checkout.session.completed':
            session = event.data.object
            user_id = session.metadata.get('user_id')
            # Update user subscription status in database
            # This should be implemented based on your database structure
            
        elif event.type == 'customer.subscription.deleted':
            subscription = event.data.object
            user_id = subscription.metadata.get('user_id')
            # Handle subscription cancellation
            
        return {'status': 'success'}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

async def cancel_subscription(subscription_id: str):
    try:
        stripe.Subscription.delete(subscription_id)
        return {'status': 'subscription cancelled'}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_subscription_status(subscription_id: str):
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return {
            'status': subscription.status,
            'current_period_end': subscription.current_period_end,
            'cancel_at_period_end': subscription.cancel_at_period_end
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
