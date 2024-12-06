from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime

class UserPreferences(BaseModel):
    price_range: Dict[str, float] = Field(
        default_factory=lambda: {"min": 0, "max": 5000}
    )
    preferred_cities: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    property_types: List[str] = Field(default_factory=list)
    min_rooms: int = 1
    universities: List[str] = Field(default_factory=list)

class RecommendationScore(BaseModel):
    listing_id: str
    score: float
    score_components: Dict[str, float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class UserInteraction(BaseModel):
    user_id: str
    listing_id: str
    interaction_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict] = None

class SimilarityResponse(BaseModel):
    listing_id: str
    similarity_score: float
    common_features: List[str]
    distance_km: Optional[float] = None
