from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import json
from typing import Dict, Any

class ValidationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            # Only validate POST and PUT requests
            if request.method in ["POST", "PUT"]:
                body = await self._get_request_body(request)
                if body:
                    await self._validate_request_body(body)
            
            response = await call_next(request)
            return response
            
        except HTTPException as e:
            return JSONResponse(
                status_code=e.status_code,
                content={"detail": str(e.detail)}
            )
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"detail": str(e)}
            )
    
    async def _get_request_body(self, request: Request) -> Dict[str, Any]:
        """Get and parse request body."""
        try:
            body = await request.body()
            if body:
                return json.loads(body)
            return {}
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid JSON format in request body"
            )
    
    async def _validate_request_body(self, body: Dict[str, Any]):
        """Validate request body content."""
        # Validate maximum depth
        if self._get_json_depth(body) > 10:
            raise HTTPException(
                status_code=400,
                detail="Request body nested too deeply"
            )
        
        # Validate maximum length
        if len(str(body)) > 1000000:  # 1MB limit
            raise HTTPException(
                status_code=400,
                detail="Request body too large"
            )
        
        # Validate field types and values
        self._validate_field_types(body)
    
    def _get_json_depth(self, obj: Any, current_depth: int = 0) -> int:
        """Calculate the maximum depth of a JSON object."""
        if current_depth > 10:  # Early exit for efficiency
            return current_depth
        
        if isinstance(obj, dict):
            if not obj:
                return current_depth
            return max(
                self._get_json_depth(v, current_depth + 1)
                for v in obj.values()
            )
        elif isinstance(obj, list):
            if not obj:
                return current_depth
            return max(
                self._get_json_depth(item, current_depth + 1)
                for item in obj
            )
        return current_depth
    
    def _validate_field_types(self, body: Dict[str, Any]):
        """Validate field types and values."""
        for key, value in body.items():
            # Validate field names
            if not isinstance(key, str):
                raise HTTPException(
                    status_code=400,
                    detail=f"Field name must be string, got {type(key)}"
                )
            
            if len(key) > 100:
                raise HTTPException(
                    status_code=400,
                    detail=f"Field name too long: {key}"
                )
            
            # Validate string values
            if isinstance(value, str):
                if len(value) > 10000:  # 10KB limit for string values
                    raise HTTPException(
                        status_code=400,
                        detail=f"Field value too long: {key}"
                    )
            
            # Validate arrays
            elif isinstance(value, list):
                if len(value) > 1000:  # 1000 items limit
                    raise HTTPException(
                        status_code=400,
                        detail=f"Too many items in array: {key}"
                    )
            
            # Validate nested objects
            elif isinstance(value, dict):
                self._validate_field_types(value)
