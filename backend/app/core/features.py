"""Feature management for open-source and premium features."""
from enum import Enum
from typing import Dict, List, Optional

class FeatureType(Enum):
    OPEN_SOURCE = "open_source"
    PREMIUM = "premium"

class Feature:
    def __init__(
        self,
        name: str,
        feature_type: FeatureType,
        description: str,
        enabled: bool = True,
        dependencies: Optional[List[str]] = None
    ):
        self.name = name
        self.feature_type = feature_type
        self.description = description
        self.enabled = enabled
        self.dependencies = dependencies or []

# Open Source Features
OPEN_SOURCE_FEATURES: Dict[str, Feature] = {
    "basic_search": Feature(
        name="basic_search",
        feature_type=FeatureType.OPEN_SOURCE,
        description="Basic location and price-based search"
    ),
    "crowdsource_voting": Feature(
        name="crowdsource_voting",
        feature_type=FeatureType.OPEN_SOURCE,
        description="Community-driven listing verification"
    ),
    "localization": Feature(
        name="localization",
        feature_type=FeatureType.OPEN_SOURCE,
        description="Multi-language support (Italian/English)"
    ),
    "basic_filters": Feature(
        name="basic_filters",
        feature_type=FeatureType.OPEN_SOURCE,
        description="Basic filtering options (price, rooms, location)"
    )
}

# Premium Feature Stubs (implementations in private repo)
PREMIUM_FEATURES: Dict[str, Feature] = {
    "ai_recommendations": Feature(
        name="ai_recommendations",
        feature_type=FeatureType.PREMIUM,
        description="AI-powered listing recommendations"
    ),
    "advanced_filters": Feature(
        name="advanced_filters",
        feature_type=FeatureType.PREMIUM,
        description="Advanced search and filtering options"
    ),
    "priority_notifications": Feature(
        name="priority_notifications",
        feature_type=FeatureType.PREMIUM,
        description="Real-time listing notifications"
    ),
    "saved_searches": Feature(
        name="saved_searches",
        feature_type=FeatureType.PREMIUM,
        description="Save and monitor search criteria"
    )
}

def is_premium_feature(feature_name: str) -> bool:
    """Check if a feature is premium."""
    return feature_name in PREMIUM_FEATURES

def get_feature_type(feature_name: str) -> Optional[FeatureType]:
    """Get the type of a feature."""
    if feature_name in OPEN_SOURCE_FEATURES:
        return FeatureType.OPEN_SOURCE
    elif feature_name in PREMIUM_FEATURES:
        return FeatureType.PREMIUM
    return None

def is_feature_enabled(feature_name: str) -> bool:
    """Check if a feature is enabled."""
    if feature_name in OPEN_SOURCE_FEATURES:
        return OPEN_SOURCE_FEATURES[feature_name].enabled
    elif feature_name in PREMIUM_FEATURES:
        return PREMIUM_FEATURES[feature_name].enabled
    return False
