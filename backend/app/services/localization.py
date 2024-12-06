from typing import Dict, Optional, List
from pydantic import BaseModel
from fastapi import HTTPException
from app.core.config import get_settings

settings = get_settings()

class TranslationEntry(BaseModel):
    key: str
    translations: Dict[str, str]

class LocaleData(BaseModel):
    language: str
    name: str
    native_name: str
    flag: str
    is_default: bool = False

# Available locales
SUPPORTED_LOCALES = {
    "it": LocaleData(
        language="it",
        name="Italian",
        native_name="Italiano",
        flag="🇮🇹",
        is_default=True
    ),
    "en": LocaleData(
        language="en",
        name="English",
        native_name="English",
        flag="🇬🇧"
    )
}

# Common translations
COMMON_TRANSLATIONS = {
    "listing": {
        "it": "annuncio",
        "en": "listing"
    },
    "price": {
        "it": "prezzo",
        "en": "price"
    },
    "rooms": {
        "it": "stanze",
        "en": "rooms"
    },
    "city": {
        "it": "città",
        "en": "city"
    },
    "search": {
        "it": "cerca",
        "en": "search"
    },
    "filters": {
        "it": "filtri",
        "en": "filters"
    },
    "available": {
        "it": "disponibile",
        "en": "available"
    },
    "unavailable": {
        "it": "non disponibile",
        "en": "unavailable"
    },
    "contact": {
        "it": "contatta",
        "en": "contact"
    }
}

class LocalizationService:
    def __init__(self):
        self._translations = COMMON_TRANSLATIONS
        self._supported_locales = SUPPORTED_LOCALES

    def get_supported_languages(self) -> List[LocaleData]:
        """Get list of supported languages."""
        return list(self._supported_locales.values())

    def get_default_language(self) -> str:
        """Get the default language code."""
        return settings.DEFAULT_LANGUAGE

    def get_translation(self, key: str, language: str) -> str:
        """Get translation for a specific key in the specified language."""
        if language not in self._supported_locales:
            raise HTTPException(
                status_code=400,
                detail=f"Language {language} is not supported"
            )

        if key not in self._translations:
            # Return the key itself if translation is not found
            return key

        return self._translations[key].get(language, key)

    def get_all_translations(self, language: str) -> Dict[str, str]:
        """Get all translations for a specific language."""
        if language not in self._supported_locales:
            raise HTTPException(
                status_code=400,
                detail=f"Language {language} is not supported"
            )

        return {
            key: translations.get(language, key)
            for key, translations in self._translations.items()
        }

    async def translate_listing(self, listing: dict, language: str) -> dict:
        """Translate listing fields to the specified language."""
        translatable_fields = [
            "listing_type",
            "status",
            "amenities",
            "description"
        ]
        
        translated_listing = listing.copy()
        
        for field in translatable_fields:
            if field in listing and isinstance(listing[field], str):
                translated_listing[field] = self.get_translation(
                    listing[field],
                    language
                )
            elif field in listing and isinstance(listing[field], list):
                translated_listing[field] = [
                    self.get_translation(item, language)
                    for item in listing[field]
                ]
        
        return translated_listing

    def format_currency(self, amount: float, language: str) -> str:
        """Format currency according to locale."""
        if language == "it":
            return f"€{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        return f"€{amount:,.2f}"

    def format_date(self, date: str, language: str) -> str:
        """Format date according to locale."""
        # Implementation depends on your date formatting requirements
        pass

# Create a global instance
localization_service = LocalizationService()

# Helper functions
def get_locale_from_headers(accept_language: Optional[str]) -> str:
    """
    Determine the best locale based on Accept-Language header.
    Falls back to default language if no match is found.
    """
    if not accept_language:
        return settings.DEFAULT_LANGUAGE

    # Parse Accept-Language header
    try:
        locales = accept_language.split(",")
        for locale in locales:
            lang = locale.split(";")[0].strip().lower()
            if lang in SUPPORTED_LOCALES:
                return lang
    except Exception:
        pass

    return settings.DEFAULT_LANGUAGE

def translate_error_message(error: str, language: str) -> str:
    """Translate error messages to the specified language."""
    error_translations = {
        "Listing not found": {
            "it": "Annuncio non trovato",
            "en": "Listing not found"
        },
        "Invalid search parameters": {
            "it": "Parametri di ricerca non validi",
            "en": "Invalid search parameters"
        },
        # Add more error translations as needed
    }

    if error in error_translations:
        return error_translations[error].get(language, error)
    return error
