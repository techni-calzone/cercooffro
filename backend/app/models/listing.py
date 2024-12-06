from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime

class ListingStatus(str, Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    PENDING = "pending"

class ListingSource(str, Enum):
    IDEALISTA = "idealista"
    IMMOBILIARE = "immobiliare"
    DIRECT_UPLOAD = "direct_upload"

class Listing(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    description: str
    price: float
    location: Dict[str, str]
    images: List[HttpUrl] = []
    source_url: HttpUrl
    source: ListingSource
    status: ListingStatus = ListingStatus.AVAILABLE
    
    # Crowdsourced verification
    votes: Dict[ListingStatus, int] = {
        ListingStatus.AVAILABLE: 0,
        ListingStatus.SOLD: 0,
        ListingStatus.PENDING: 0
    }
    
    # Localization support
    language: str = "it"
    translations: Optional[Dict[str, Dict[str, str]]] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # AI-powered metadata
    tags: List[str] = []
    university_proximity: Optional[float] = None
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "title": "Spacious Student Apartment near University",
                "description": "Modern 2-bedroom apartment close to Politecnico di Milano",
                "price": 1200.00,
                "location": {
                    "city": "Milano",
                    "neighborhood": "Città Studi",
                    "university": "Politecnico di Milano"
                },
                "source": "idealista",
                "status": "available"
            }
        }

class ListingVote(BaseModel):
    listing_id: str
    user_id: str
    status: ListingStatus
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        schema_extra = {
            "example": {
                "listing_id": "unique_listing_id",
                "user_id": "user123",
                "status": "sold"
            }
        }
