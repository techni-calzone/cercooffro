from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional

from app.services.localization import (
    localization_service,
    get_locale_from_headers,
    translate_error_message
)

class LocalizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Get the preferred language from headers
        accept_language = request.headers.get("accept-language")
        language = get_locale_from_headers(accept_language)
        
        # Add language to request state
        request.state.language = language
        
        # Process the request
        response = await call_next(request)
        
        # If there's an error, translate the error message
        if response.status_code >= 400:
            try:
                content = await response.json()
                if "detail" in content:
                    content["detail"] = translate_error_message(
                        content["detail"],
                        language
                    )
                    # Create new response with translated content
                    return JSONResponse(
                        status_code=response.status_code,
                        content=content
                    )
            except:
                pass
        
        return response

def get_current_language(request: Request) -> str:
    """Get the current language from request state."""
    return getattr(request.state, "language", localization_service.get_default_language())

async def translate_response(response_data: dict, language: str) -> dict:
    """Translate response data to the specified language."""
    if isinstance(response_data, dict):
        translated_data = {}
        for key, value in response_data.items():
            if isinstance(value, (dict, list)):
                translated_data[key] = await translate_response(value, language)
            elif isinstance(value, str):
                translated_data[key] = localization_service.get_translation(value, language)
            else:
                translated_data[key] = value
        return translated_data
    elif isinstance(response_data, list):
        return [await translate_response(item, language) for item in response_data]
    return response_data
