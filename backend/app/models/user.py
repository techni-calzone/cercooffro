from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"
    MODERATOR = "moderator"

class SubscriptionTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    hashed_password: str
    role: UserRole = UserRole.STUDENT
    
    # Subscription details
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    subscription_expires_at: Optional[datetime] = None
    
    # Localization preferences
    preferred_language: str = "it"
    
    # Search and recommendation preferences
    saved_searches: List[str] = []
    preferred_locations: List[str] = []
    price_range: Optional[dict] = None
    
    # Verification and activity
    is_active: bool = True
    is_verified: bool = False
    verification_token: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "student@example.com",
                "username": "studente2023",
                "role": "student",
                "subscription_tier": "free"
            }
        }

class UserPreferences(BaseModel):
    user_id: str
    university: Optional[str] = None
    max_budget: Optional[float] = None
    preferred_room_types: List[str] = []
    amenities: List[str] = []
    
    class Config:
        schema_extra = {
            "example": {
                "user_id": "user123",
                "university": "Politecnico di Milano",
                "max_budget": 1500,
                "preferred_room_types": ["shared", "studio"],
                "amenities": ["wifi", "kitchen"]
            }
        }
