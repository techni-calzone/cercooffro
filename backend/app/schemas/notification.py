from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from app.services.notifications import NotificationType, NotificationPriority

class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType
    priority: NotificationPriority = NotificationPriority.MEDIUM
    data: Optional[Dict] = None

class NotificationCreate(NotificationBase):
    send_email: bool = False

class NotificationResponse(NotificationBase):
    id: str
    user_id: str
    created_at: datetime
    read: bool
    email_sent: bool

    class Config:
        from_attributes = True
