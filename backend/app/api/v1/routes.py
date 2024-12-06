from fastapi import APIRouter
from app.api.v1.endpoints import auth, listings

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["authentication"])
router.include_router(listings.router, prefix="/listings", tags=["listings"])
