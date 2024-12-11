from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
import asyncio

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        requests_per_minute: int = 60,
        telegram_requests_per_minute: int = 120
    ):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.telegram_requests_per_minute = telegram_requests_per_minute
        self.request_counts = defaultdict(list)
        
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host
        
        # Check if it's a Telegram webhook request
        is_telegram = request.url.path.startswith("/api/v1/telegram")
        rate_limit = (
            self.telegram_requests_per_minute if is_telegram
            else self.requests_per_minute
        )
        
        # Clean old requests
        current_time = time.time()
        self.request_counts[client_ip] = [
            req_time for req_time in self.request_counts[client_ip]
            if current_time - req_time < 60
        ]
        
        # Check rate limit
        if len(self.request_counts[client_ip]) >= rate_limit:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Please try again later."
                }
            )
        
        # Add current request
        self.request_counts[client_ip].append(current_time)
        
        # Process request
        response = await call_next(request)
        return response
