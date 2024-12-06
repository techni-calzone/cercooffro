from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set, Optional
from datetime import datetime
import json
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.core.logging import logger

class ChatManager:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.db = db
        
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        
    def disconnect(self, websocket: WebSocket, user_id: str):
        self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]
            
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message: str, room_id: str, sender_id: str):
        """Broadcast message to all participants in a chat room except sender"""
        participants = await self.get_room_participants(room_id)
        for participant_id in participants:
            if participant_id != sender_id and participant_id in self.active_connections:
                for connection in self.active_connections[participant_id]:
                    await connection.send_text(message)

    async def create_chat_room(self, listing_id: str, user_id: str, owner_id: str) -> str:
        """Create a new chat room between user and listing owner"""
        room = {
            'listing_id': listing_id,
            'participants': [user_id, owner_id],
            'created_at': datetime.utcnow(),
            'last_message_at': datetime.utcnow(),
            'messages': []
        }
        result = await self.db.chat_rooms.insert_one(room)
        return str(result.inserted_id)

    async def get_or_create_room(self, listing_id: str, user_id: str, owner_id: str) -> str:
        """Get existing chat room or create new one"""
        room = await self.db.chat_rooms.find_one({
            'listing_id': listing_id,
            'participants': {'$all': [user_id, owner_id]}
        })
        if room:
            return str(room['_id'])
        return await self.create_chat_room(listing_id, user_id, owner_id)

    async def get_room_participants(self, room_id: str) -> list:
        """Get all participants in a chat room"""
        room = await self.db.chat_rooms.find_one({'_id': ObjectId(room_id)})
        return room['participants'] if room else []

    async def store_message(self, room_id: str, sender_id: str, content: str, message_type: str = 'text'):
        """Store chat message in database"""
        message = {
            'sender_id': sender_id,
            'content': content,
            'type': message_type,
            'timestamp': datetime.utcnow(),
            'read_by': [sender_id]
        }
        
        await self.db.chat_rooms.update_one(
            {'_id': ObjectId(room_id)},
            {
                '$push': {'messages': message},
                '$set': {'last_message_at': datetime.utcnow()}
            }
        )
        return message

    async def get_chat_history(self, room_id: str, limit: int = 50, before_id: Optional[str] = None):
        """Get chat history for a room with pagination"""
        query = {'_id': ObjectId(room_id)}
        if before_id:
            query['messages._id'] = {'$lt': ObjectId(before_id)}
            
        room = await self.db.chat_rooms.find_one(query)
        if not room:
            return []
            
        messages = room.get('messages', [])
        messages.sort(key=lambda x: x['timestamp'], reverse=True)
        return messages[:limit]

    async def mark_messages_as_read(self, room_id: str, user_id: str):
        """Mark all messages in a room as read for a user"""
        await self.db.chat_rooms.update_one(
            {'_id': ObjectId(room_id)},
            {'$addToSet': {'messages.$[].read_by': user_id}}
        )

    async def get_unread_count(self, user_id: str) -> Dict[str, int]:
        """Get number of unread messages per chat room for a user"""
        rooms = self.db.chat_rooms.find({'participants': user_id})
        unread_counts = {}
        
        async for room in rooms:
            count = sum(1 for msg in room.get('messages', [])
                       if user_id not in msg.get('read_by', []))
            if count > 0:
                unread_counts[str(room['_id'])] = count
                
        return unread_counts

    async def handle_websocket(self, websocket: WebSocket, room_id: str, user_id: str):
        """Handle WebSocket connection for chat"""
        try:
            await self.connect(websocket, user_id)
            
            # Mark previous messages as read
            await self.mark_messages_as_read(room_id, user_id)
            
            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Store and broadcast message
                stored_message = await self.store_message(
                    room_id,
                    user_id,
                    message_data['content'],
                    message_data.get('type', 'text')
                )
                
                # Prepare message for broadcast
                broadcast_data = {
                    'type': 'message',
                    'room_id': room_id,
                    'sender_id': user_id,
                    'message': stored_message
                }
                
                await self.broadcast(
                    json.dumps(broadcast_data),
                    room_id,
                    user_id
                )
                
        except WebSocketDisconnect:
            self.disconnect(websocket, user_id)
            
        except Exception as e:
            logger.error(f"Error in chat websocket: {e}")
            await websocket.close()
            self.disconnect(websocket, user_id)

chat_manager: Optional[ChatManager] = None

def get_chat_manager(db: AsyncIOMotorDatabase) -> ChatManager:
    global chat_manager
    if chat_manager is None:
        chat_manager = ChatManager(db)
    return chat_manager
