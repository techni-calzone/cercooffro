from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ChatMessage(BaseModel):
    sender_id: str
    content: str
    type: str = 'text'
    timestamp: datetime
    read_by: List[str] = Field(default_factory=list)

class ChatRoom(BaseModel):
    id: str
    listing_id: str
    participants: List[str]
    created_at: datetime
    last_message_at: datetime
    messages: List[ChatMessage] = Field(default_factory=list)

class ChatRoomCreate(BaseModel):
    listing_id: str
    owner_id: str

class ChatMessageCreate(BaseModel):
    content: str
    type: str = 'text'
    data: Optional[Dict] = None
