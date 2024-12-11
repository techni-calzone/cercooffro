from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config.settings import settings
from app.core.config.mongodb import db
from app.api.v1.router import api_router
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.validation import ValidationMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(ValidationMiddleware)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection."""
    await db.connect_to_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection."""
    await db.close_database_connection()

# Root endpoint
@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "0.2.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}
