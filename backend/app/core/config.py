from pydantic import BaseSettings
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Core Settings
    PROJECT_NAME: str = "Student Rental Aggregator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # For development only
    ENVIRONMENT: str = "development"
    
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "student_rental"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Feature Flags
    ENABLE_PREMIUM_FEATURES: bool = False
    
    # Donation Settings
    STRIPE_PUBLIC_KEY: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    DONATION_ENABLED: bool = True
    
    # Premium Features (Only loaded if ENABLE_PREMIUM_FEATURES is True)
    OPENAI_API_KEY: Optional[str] = None
    PREMIUM_SUBSCRIPTION_PRICE: float = 10.0
    PREMIUM_SUBSCRIPTION_CURRENCY: str = "EUR"
    
    # Scraping Settings
    SCRAPING_INTERVAL_HOURS: int = 6
    MAX_LISTINGS_PER_SOURCE: int = 1000
    
    # Crowdsourcing Settings
    MIN_VOTES_FOR_STATUS_CHANGE: int = 3
    TRUST_SCORE_THRESHOLD: float = 0.7
    
    # Localization
    SUPPORTED_LANGUAGES: List[str] = ["en", "it"]
    DEFAULT_LANGUAGE: str = "it"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

def is_premium_feature_enabled() -> bool:
    return settings.ENABLE_PREMIUM_FEATURES

def is_donation_enabled() -> bool:
    return settings.DONATION_ENABLED

def check_premium_requirements() -> bool:
    """Check if all required settings for premium features are configured."""
    if not settings.ENABLE_PREMIUM_FEATURES:
        return False
    return bool(settings.OPENAI_API_KEY)
