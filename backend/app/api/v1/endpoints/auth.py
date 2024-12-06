from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import (
    create_access_token,
    authenticate_user,
    get_password_hash
)
from app.core.database import get_database
from app.models.user import User, UserRole
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
async def register(
    email: str,
    password: str,
    username: str,
    full_name: str = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    # Check if user exists
    if await db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if await db.users.find_one({"username": username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user = {
        "email": email,
        "username": username,
        "full_name": full_name,
        "hashed_password": get_password_hash(password),
        "role": UserRole.STUDENT,
        "is_active": True
    }
    
    result = await db.users.insert_one(user)
    user["_id"] = str(result.inserted_id)
    
    return {
        "access_token": create_access_token(
            data={"sub": email}
        ),
        "token_type": "bearer"
    }

@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/premium-upgrade")
async def upgrade_to_premium(
    user: User = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    # TODO: Implement Stripe payment integration
    await db.users.update_one(
        {"email": user["email"]},
        {"$set": {"subscription_tier": "premium"}}
    )
    return {"message": "Successfully upgraded to premium"}
