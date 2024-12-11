from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel, Field


class SearcherType(str, Enum):
    STUDENT = "student"
    WORKER = "worker"
    ANY = "any"


class SearcherStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class PriceRange(BaseModel):
    min: float = Field(..., ge=0)
    max: float = Field(..., ge=0)


class LocationPreference(BaseModel):
    cities: List[str] = Field(default_factory=list)
    areas: List[str] = Field(default_factory=list)


class DatePreference(BaseModel):
    move_in: datetime
    duration: int = Field(..., ge=1, description="Duration in months")


class Requirements(BaseModel):
    furnished: bool = False
    internet: bool = False
    utilities_included: bool = False


class SearchPreferences(BaseModel):
    price_range: PriceRange
    location: LocationPreference
    dates: DatePreference
    requirements: Requirements


class Searcher(BaseModel):
    telegram_user_id: str = Field(..., description="Telegram user ID for authentication")
    searcher_type: SearcherType
    search_preferences: Optional[SearchPreferences] = None
    status: SearcherStatus = SearcherStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "telegram_user_id": "123456789",
                "searcher_type": "student",
                "search_preferences": {
                    "price_range": {
                        "min": 300,
                        "max": 800
                    },
                    "location": {
                        "cities": ["Milan"],
                        "areas": ["Città Studi", "Lambrate"]
                    },
                    "dates": {
                        "move_in": "2024-02-01T00:00:00Z",
                        "duration": 6
                    },
                    "requirements": {
                        "furnished": True,
                        "internet": True,
                        "utilities_included": False
                    }
                },
                "status": "active"
            }
        }
