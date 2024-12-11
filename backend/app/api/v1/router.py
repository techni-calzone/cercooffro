from fastapi import APIRouter
from app.api.v1.endpoints import searchers, search

api_router = APIRouter()

# Include searcher routes
api_router.include_router(
    searchers.router,
    prefix="/searchers",
    tags=["searchers"]
)

# Include search routes
api_router.include_router(
    search.router,
    prefix="/search",
    tags=["search"]
)
