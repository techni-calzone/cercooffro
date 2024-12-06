from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import router as api_router
from app.api.v1.endpoints import (
    users,
    listings,
    auth,
    chat,
    notifications,
    recommendations,
    search,
    crowdsource,
    localization,
    features,
    donation
)
from app.core.config import settings, get_settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.logging import setup_logging
from app.core.monitoring import MetricsMiddleware, DBMetricsMiddleware
from prometheus_client import make_asgi_app
import openai
import logging
from app.middleware.localization import LocalizationMiddleware
from app.middleware.feature_access import check_premium_access

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Student Rental Aggregator",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

# Add Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Add middleware
app.add_middleware(MetricsMiddleware)
app.add_middleware(DBMetricsMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LocalizationMiddleware)

# Include API routes
app.include_router(api_router, prefix="/api/v1")
app.include_router(
    chat.router,
    prefix="/api/v1/chat",
    tags=["chat"]
)
app.include_router(
    notifications.router,
    prefix="/api/v1/notifications",
    tags=["notifications"]
)
app.include_router(
    recommendations.router,
    prefix="/api/v1/recommendations",
    tags=["recommendations"]
)
app.include_router(
    search.router,
    prefix=f"{get_settings().API_V1_STR}/search",
    tags=["search"]
)
app.include_router(
    crowdsource.router,
    prefix=f"{get_settings().API_V1_STR}/crowdsource",
    tags=["crowdsource"]
)
app.include_router(
    localization.router,
    prefix=f"{get_settings().API_V1_STR}/localization",
    tags=["localization"]
)
app.include_router(
    features.router,
    prefix=f"{get_settings().API_V1_STR}/features",
    tags=["features"]
)
app.include_router(
    donation.router,
    prefix=f"{get_settings().API_V1_STR}/donation",
    tags=["donation"]
)

# Localization Middleware
@app.middleware("http")
async def add_language_header(request, call_next):
    language = request.headers.get('Accept-Language', 'it')
    request.state.language = language
    response = await call_next(request)
    return response

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up application")
    try:
        await connect_to_mongo()
        logger.info("Successfully connected to database")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down application")
    try:
        await close_mongo_connection()
        logger.info("Successfully closed database connection")
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": get_settings().PROJECT_NAME,
        "version": get_settings().VERSION,
        "description": "Student Rental Aggregator API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
