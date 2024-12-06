from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from bson import ObjectId
from app.core.config import settings
from app.core.logging import logger

class NotificationType(str, Enum):
    NEW_MESSAGE = "new_message"
    LISTING_UPDATE = "listing_update"
    LISTING_VERIFICATION = "listing_verification"
    SUBSCRIPTION_UPDATE = "subscription_update"
    SYSTEM_ANNOUNCEMENT = "system_announcement"
    BOOKING_REQUEST = "booking_request"
    BOOKING_STATUS = "booking_status"

class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class NotificationManager:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.mail_config = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_TLS=True,
            MAIL_SSL=False,
            USE_CREDENTIALS=True
        )
        self.fastmail = FastMail(self.mail_config)

    async def create_notification(
        self,
        user_id: str,
        type: NotificationType,
        title: str,
        message: str,
        priority: NotificationPriority = NotificationPriority.MEDIUM,
        data: Optional[Dict] = None,
        send_email: bool = False
    ):
        """Create a new notification"""
        notification = {
            'user_id': user_id,
            'type': type,
            'title': title,
            'message': message,
            'priority': priority,
            'data': data or {},
            'created_at': datetime.utcnow(),
            'read': False,
            'email_sent': False
        }
        
        # Store notification in database
        result = await self.db.notifications.insert_one(notification)
        notification['_id'] = result.inserted_id
        
        # Send email if requested
        if send_email:
            await self.send_email_notification(user_id, title, message)
            await self.db.notifications.update_one(
                {'_id': result.inserted_id},
                {'$set': {'email_sent': True}}
            )
        
        return notification

    async def send_email_notification(self, user_id: str, title: str, message: str):
        """Send email notification to user"""
        try:
            user = await self.db.users.find_one({'_id': ObjectId(user_id)})
            if not user or not user.get('email'):
                return
            
            message = MessageSchema(
                subject=title,
                recipients=[user['email']],
                body=message,
                subtype="html"
            )
            
            await self.fastmail.send_message(message)
            
        except Exception as e:
            logger.error(f"Failed to send email notification: {e}")

    async def get_user_notifications(
        self,
        user_id: str,
        limit: int = 50,
        skip: int = 0,
        unread_only: bool = False
    ) -> List[Dict]:
        """Get notifications for a user"""
        query = {'user_id': user_id}
        if unread_only:
            query['read'] = False
            
        cursor = self.db.notifications.find(query)\
            .sort('created_at', -1)\
            .skip(skip)\
            .limit(limit)
            
        return await cursor.to_list(length=limit)

    async def mark_as_read(self, notification_id: str, user_id: str):
        """Mark a notification as read"""
        await self.db.notifications.update_one(
            {'_id': ObjectId(notification_id), 'user_id': user_id},
            {'$set': {'read': True}}
        )

    async def mark_all_as_read(self, user_id: str):
        """Mark all notifications as read for a user"""
        await self.db.notifications.update_many(
            {'user_id': user_id, 'read': False},
            {'$set': {'read': True}}
        )

    async def delete_notification(self, notification_id: str, user_id: str):
        """Delete a notification"""
        await self.db.notifications.delete_one(
            {'_id': ObjectId(notification_id), 'user_id': user_id}
        )

    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications for a user"""
        return await self.db.notifications.count_documents({
            'user_id': user_id,
            'read': False
        })

    async def create_listing_update_notification(
        self,
        user_id: str,
        listing_id: str,
        update_type: str,
        send_email: bool = False
    ):
        """Create notification for listing updates"""
        title = f"Listing Update: {update_type}"
        message = f"There has been an update to a listing you're following"
        await self.create_notification(
            user_id=user_id,
            type=NotificationType.LISTING_UPDATE,
            title=title,
            message=message,
            data={'listing_id': listing_id, 'update_type': update_type},
            send_email=send_email
        )

    async def create_message_notification(
        self,
        user_id: str,
        sender_name: str,
        room_id: str,
        send_email: bool = True
    ):
        """Create notification for new messages"""
        title = f"New message from {sender_name}"
        message = f"You have received a new message from {sender_name}"
        await self.create_notification(
            user_id=user_id,
            type=NotificationType.NEW_MESSAGE,
            title=title,
            message=message,
            data={'room_id': room_id, 'sender_name': sender_name},
            priority=NotificationPriority.HIGH,
            send_email=send_email
        )

    async def create_booking_notification(
        self,
        user_id: str,
        booking_id: str,
        status: str,
        send_email: bool = True
    ):
        """Create notification for booking updates"""
        title = f"Booking {status}"
        message = f"Your booking status has been updated to: {status}"
        await self.create_notification(
            user_id=user_id,
            type=NotificationType.BOOKING_STATUS,
            title=title,
            message=message,
            data={'booking_id': booking_id, 'status': status},
            priority=NotificationPriority.HIGH,
            send_email=send_email
        )

notification_manager: Optional[NotificationManager] = None

def get_notification_manager(db: AsyncIOMotorDatabase) -> NotificationManager:
    global notification_manager
    if notification_manager is None:
        notification_manager = NotificationManager(db)
    return notification_manager
