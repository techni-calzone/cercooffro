from fastapi import APIRouter, Depends, WebSocket, HTTPException, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.deps import get_current_user, get_db
from app.services.chat import get_chat_manager
from app.schemas.chat import ChatRoom, ChatMessage, ChatRoomCreate
from app.core.logging import logger

router = APIRouter()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    token: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        user = await get_current_user(token, db)
        chat_manager = get_chat_manager(db)
        await chat_manager.handle_websocket(websocket, room_id, str(user['_id']))
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

@router.post("/rooms", response_model=ChatRoom)
async def create_chat_room(
    room_data: ChatRoomCreate,
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new chat room or get existing one"""
    chat_manager = get_chat_manager(db)
    room_id = await chat_manager.get_or_create_room(
        room_data.listing_id,
        str(current_user['_id']),
        room_data.owner_id
    )
    return {"id": room_id}

@router.get("/rooms", response_model=List[ChatRoom])
async def get_user_chat_rooms(
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all chat rooms for current user"""
    rooms = await db.chat_rooms.find({
        'participants': str(current_user['_id'])
    }).to_list(None)
    return rooms

@router.get("/rooms/{room_id}/messages")
async def get_chat_messages(
    room_id: str,
    before_id: Optional[str] = None,
    limit: int = Query(50, gt=0, le=100),
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get chat messages for a room"""
    chat_manager = get_chat_manager(db)
    
    # Verify user is participant
    room = await db.chat_rooms.find_one({
        '_id': room_id,
        'participants': str(current_user['_id'])
    })
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
        
    messages = await chat_manager.get_chat_history(room_id, limit, before_id)
    return messages

@router.post("/rooms/{room_id}/read")
async def mark_messages_read(
    room_id: str,
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark all messages in a room as read"""
    chat_manager = get_chat_manager(db)
    await chat_manager.mark_messages_as_read(room_id, str(current_user['_id']))
    return {"status": "success"}

@router.get("/unread-counts")
async def get_unread_message_counts(
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get unread message counts for all rooms"""
    chat_manager = get_chat_manager(db)
    counts = await chat_manager.get_unread_count(str(current_user['_id']))
    return counts
