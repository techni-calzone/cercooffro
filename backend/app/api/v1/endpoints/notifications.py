from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.deps import get_current_user, get_db
from app.services.notifications import get_notification_manager, NotificationType
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.core.logging import logger

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    limit: int = Query(50, gt=0, le=100),
    skip: int = Query(0, ge=0),
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user notifications"""
    notification_manager = get_notification_manager(db)
    notifications = await notification_manager.get_user_notifications(
        str(current_user['_id']),
        limit=limit,
        skip=skip,
        unread_only=unread_only
    )
    return notifications

@router.get("/unread-count")
async def get_unread_count(
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get count of unread notifications"""
    notification_manager = get_notification_manager(db)
    count = await notification_manager.get_unread_count(str(current_user['_id']))
    return {"count": count}

@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark a notification as read"""
    notification_manager = get_notification_manager(db)
    await notification_manager.mark_as_read(notification_id, str(current_user['_id']))
    return {"status": "success"}

@router.post("/read-all")
async def mark_all_notifications_read(
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark all notifications as read"""
    notification_manager = get_notification_manager(db)
    await notification_manager.mark_all_as_read(str(current_user['_id']))
    return {"status": "success"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a notification"""
    notification_manager = get_notification_manager(db)
    await notification_manager.delete_notification(notification_id, str(current_user['_id']))
    return {"status": "success"}

# Admin endpoints for system-wide notifications
@router.post("/system")
async def create_system_notification(
    notification: NotificationCreate,
    current_user = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create system-wide notification (admin only)"""
    if not current_user.get('is_admin'):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    notification_manager = get_notification_manager(db)
    
    # Get all active users
    users = await db.users.find({'is_active': True}).to_list(None)
    
    for user in users:
        try:
            await notification_manager.create_notification(
                user_id=str(user['_id']),
                type=NotificationType.SYSTEM_ANNOUNCEMENT,
                title=notification.title,
                message=notification.message,
                data=notification.data,
                send_email=notification.send_email
            )
        except Exception as e:
            logger.error(f"Failed to create system notification for user {user['_id']}: {e}")
            
    return {"status": "success"}
