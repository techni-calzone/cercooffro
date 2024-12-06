from fastapi import Request, HTTPException, status
from typing import Optional, Callable
from functools import wraps

from app.core.config import get_settings, is_premium_feature_enabled
from app.models.user import User
from app.core.security import get_current_user

settings = get_settings()

def check_premium_access(request: Request) -> bool:
    """Check if the user has access to premium features."""
    try:
        user: Optional[User] = get_current_user(request)
        return user is not None and user.is_premium
    except:
        return False

def require_premium():
    """Decorator to restrict access to premium features."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, request: Request, **kwargs):
            if not is_premium_feature_enabled():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Premium features are not enabled on this server"
                )
            
            if not check_premium_access(request):
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="This feature requires a premium subscription"
                )
            
            return await func(*args, request=request, **kwargs)
        return wrapper
    return decorator

def get_feature_flags(user: Optional[User] = None) -> dict:
    """Get available features for the current user."""
    base_features = {
        "basic_search": True,
        "crowdsourced_voting": True,
        "localization": True,
        "listing_aggregation": True,
    }
    
    if user and user.is_premium:
        premium_features = {
            "ai_insights": True,
            "priority_notifications": True,
            "advanced_filters": True,
            "ad_free": True,
            "saved_searches": True,
        }
        base_features.update(premium_features)
    else:
        premium_features = {
            "ai_insights": False,
            "priority_notifications": False,
            "advanced_filters": False,
            "ad_free": False,
            "saved_searches": False,
        }
        base_features.update(premium_features)
    
    return base_features
