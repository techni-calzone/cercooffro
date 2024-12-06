from fastapi import APIRouter, Header, Depends
from typing import Dict, List, Optional

from app.services.localization import (
    localization_service,
    get_locale_from_headers,
    LocaleData
)

router = APIRouter()

async def get_language(
    accept_language: Optional[str] = Header(None)
) -> str:
    """Dependency to get the user's preferred language."""
    return get_locale_from_headers(accept_language)

@router.get("/languages", response_model=List[LocaleData])
async def get_supported_languages() -> List[LocaleData]:
    """Get list of all supported languages."""
    return localization_service.get_supported_languages()

@router.get("/translations/{language}", response_model=Dict[str, str])
async def get_translations(language: str) -> Dict[str, str]:
    """Get all translations for a specific language."""
    return localization_service.get_all_translations(language)

@router.get("/translations/current", response_model=Dict[str, str])
async def get_current_translations(
    language: str = Depends(get_language)
) -> Dict[str, str]:
    """Get translations for the user's current language."""
    return localization_service.get_all_translations(language)

@router.get("/language/detect")
async def detect_language(
    accept_language: Optional[str] = Header(None)
) -> Dict[str, str]:
    """Detect the user's preferred language based on their browser settings."""
    detected_language = get_locale_from_headers(accept_language)
    locale_data = localization_service._supported_locales[detected_language]
    
    return {
        "detected_language": detected_language,
        "name": locale_data.name,
        "native_name": locale_data.native_name,
        "flag": locale_data.flag
    }
