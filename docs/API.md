# Student Rental Aggregator - API Documentation

## 🔑 Authentication

### POST /api/v1/auth/login
Login with email and password.
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /api/v1/auth/register
Register new user.
```json
{
  "email": "string",
  "password": "string",
  "full_name": "string",
  "university": "string"
}
```

## 🏠 Listings

### GET /api/v1/listings
Get listings with filters.
```
Query Parameters:
- city: string
- min_price: float
- max_price: float
- property_type: string
- rooms: int
- page: int
- limit: int
```

### GET /api/v1/listings/{listing_id}
Get listing details.

### POST /api/v1/listings/{listing_id}/favorite
Add/remove listing from favorites.

## 💬 Chat

### WebSocket /api/v1/chat/ws/{room_id}
Real-time chat connection.

### POST /api/v1/chat/rooms
Create new chat room.
```json
{
  "listing_id": "string",
  "owner_id": "string"
}
```

### GET /api/v1/chat/rooms
Get user's chat rooms.

### GET /api/v1/chat/rooms/{room_id}/messages
Get chat messages.
```
Query Parameters:
- before_id: string
- limit: int
```

## 🔔 Notifications

### GET /api/v1/notifications
Get user notifications.
```
Query Parameters:
- unread_only: boolean
- limit: int
- skip: int
```

### POST /api/v1/notifications/{notification_id}/read
Mark notification as read.

### POST /api/v1/notifications/read-all
Mark all notifications as read.

## 🎯 Recommendations

### GET /api/v1/recommendations/listings
Get personalized listing recommendations.
```
Query Parameters:
- limit: int
- offset: int
- latitude: float
- longitude: float
```

### POST /api/v1/recommendations/interactions/{listing_id}
Record user interaction with listing.
```
Query Parameters:
- interaction_type: string (view, favorite, contact)
```

### GET /api/v1/recommendations/similar/{listing_id}
Get similar listings.
```
Query Parameters:
- limit: int
```

## 👤 User Profile

### GET /api/v1/users/me
Get current user profile.

### PUT /api/v1/users/me
Update user profile.
```json
{
  "full_name": "string",
  "university": "string",
  "preferences": {
    "max_budget": float,
    "preferred_cities": ["string"],
    "preferred_amenities": ["string"]
  }
}
```

## 🔍 Search

### GET /api/v1/search/universities
Get universities by city.
```
Query Parameters:
- city: string
```

### GET /api/v1/search/cities
Get available cities.

## Response Formats

### Listing Object
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": float,
  "city": "string",
  "address": "string",
  "property_type": "string",
  "rooms": int,
  "amenities": ["string"],
  "images": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime",
  "owner": {
    "id": "string",
    "name": "string"
  },
  "location": {
    "latitude": float,
    "longitude": float
  },
  "verified": boolean,
  "available": boolean
}
```

### Chat Message Object
```json
{
  "id": "string",
  "room_id": "string",
  "sender_id": "string",
  "content": "string",
  "type": "string",
  "timestamp": "datetime",
  "read_by": ["string"]
}
```

### Notification Object
```json
{
  "id": "string",
  "type": "string",
  "title": "string",
  "message": "string",
  "data": {},
  "created_at": "datetime",
  "read": boolean
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Error message"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough privileges"
}
```

### 404 Not Found
```json
{
  "detail": "Item not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- WebSocket connections limited to 5 per user

## Authentication
All endpoints except login and register require JWT authentication.
Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
