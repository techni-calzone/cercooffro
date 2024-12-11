# Backend Changelog 2024

## [Unreleased]

### Added
- Implemented RateLimitMiddleware for controlling request rates per user and Telegram webhook.
- Added ValidationMiddleware for validating input data in requests.
- Created SearchService with methods for searching properties based on preferences and text queries.
- Added search endpoints for properties, text search, and recommendations.
- Implemented pagination for search results.
- Created indexes in MongoDB for efficient querying.
- Swagger UI and ReDoc documentation for API endpoints.

### Changed
- Updated main application to include new middleware and search endpoints.
- Enhanced error handling and input validation across the application.
- Updated API documentation to reflect new endpoints and functionality.
- Adjusted CORS settings to allow access from multiple ports.

### Added
- Telegram bot integration for authentication
- New core entities:
  - Properties/Offers
  - Searchers (both students and workers)
  - Reports (crowdsourced verification)
- Privacy-first approach with minimal data collection
- MongoDB schema design for flexible property metadata
- Crowdsourced reporting and verification system

### Removed
- Traditional user authentication
- Personal data storage
- Unnecessary service complexity
- PostgreSQL dependency
- Cleanup script (cleanup.sh) as part of project restructuring.

### Technical Details
- Framework: FastAPI
- Database: MongoDB
- Authentication: Telegram-based
- API Documentation: OpenAPI/Swagger

### Database Schema
```javascript
// Properties Collection
{
  _id: ObjectId,
  telegram_user_id: String,
  title: String,
  description: String,
  price: {
    amount: Number,
    currency: String
  },
  location: {
    type: "Point",
    coordinates: [Number, Number], // [longitude, latitude]
    address: String,
    city: String,
    area: String
  },
  availability: {
    from: Date,
    until: Date,
    minimum_stay: Number // in months
  },
  features: {
    rooms: Number,
    bathrooms: Number,
    furnished: Boolean,
    utilities_included: Boolean,
    internet: Boolean
  },
  rules: {
    rental_type: String, // "any", "students_only", "workers_only"
    gender_preference: String,
    pets_allowed: Boolean,
    smoking_allowed: Boolean
  },
  verification: {
    status: String, // "pending", "verified", "flagged"
    last_verified: Date,
    verified_by: [String], // telegram_user_ids
    report_count: Number
  },
  status: String, // active, inactive, rented
  created_at: Date,
  updated_at: Date,
  metadata: Object // flexible field for additional properties
}

// Searchers Collection
{
  _id: ObjectId,
  telegram_user_id: String,
  searcher_type: String, // "student", "worker", "any"
  search_preferences: {
    price_range: {
      min: Number,
      max: Number
    },
    location: {
      cities: [String],
      areas: [String]
    },
    dates: {
      move_in: Date,
      duration: Number // in months
    },
    requirements: {
      furnished: Boolean,
      internet: Boolean,
      utilities_included: Boolean
    }
  },
  status: String, // active, inactive
  reputation: {
    trust_score: Number,
    verified_reports: Number,
    false_reports: Number
  },
  created_at: Date,
  updated_at: Date,
  last_active: Date
}

// Matches Collection
{
  _id: ObjectId,
  searcher_id: ObjectId,
  property_id: ObjectId,
  status: String, // pending, accepted, rejected
  created_at: Date,
  telegram_thread_id: String // for property-specific chat
}

// Reports Collection
{
  _id: ObjectId,
  property_id: ObjectId,
  reporter_id: String, // telegram_user_id
  report_type: String, // "spam", "scam", "inappropriate", "incorrect_info", "unavailable"
  description: String,
  evidence: {
    text: String,
    attachments: [String] // URLs or file IDs
  },
  status: String, // "pending", "verified", "rejected"
  moderator_notes: String,
  created_at: Date,
  resolved_at: Date,
  resolution: String // "removed", "updated", "dismissed", "warning_issued"
}

// Verifications Collection
{
  _id: ObjectId,
  property_id: ObjectId,
  verifier_id: String, // telegram_user_id
  verification_type: String, // "visited", "contacted", "document_check"
  status: String, // "valid", "invalid", "suspicious"
  notes: String,
  created_at: Date,
  metadata: Object // additional verification details
}
```

### API Endpoints Structure
```
/api/v1/
├── auth/
│   └── telegram-callback
├── properties/
│   ├── create
│   ├── update
│   ├── list
│   └── search
├── searchers/
│   ├── preferences
│   └── matches
├── reports/
│   ├── create
│   ├── list
│   └── resolve
├── verifications/
│   ├── submit
│   └── status
└── telegram/
    ├── webhook
    └── notifications
```

### Dependencies
- FastAPI
- Motor (async MongoDB driver)
- python-telegram-bot
- Pydantic

### Security & Compliance
- No personal data storage
- Telegram-based authentication
- GDPR-compliant data handling
- Minimal data collection policy
- Community-driven verification system

### Known Issues
- None currently tracked

### Upcoming Features
1. Telegram bot implementation
2. Property listing management
3. Searcher preference matching
4. Location-based search with MongoDB geospatial queries
5. Automated matching system
6. Notification system via Telegram
7. Crowdsourced verification system
8. Trust score calculation
9. Report management system
10. Property verification workflow

## [0.2.0] - 2024-12-11

### Changed
- Complete backend restructuring
- Simplified authentication using Telegram
- Removed personal data storage
- Streamlined data models to focus on core functionality
- Switched to MongoDB for flexible document storage
- Renamed "Students" to "Searchers" for broader audience support

### Added
- Telegram bot integration for authentication
- New core entities:
  - Properties/Offers
  - Searchers (both students and workers)
  - Reports (crowdsourced verification)
- Privacy-first approach with minimal data collection
- MongoDB schema design for flexible property metadata
- Crowdsourced reporting and verification system

### Removed
- Traditional user authentication
- Personal data storage
- Unnecessary service complexity
- PostgreSQL dependency

### Technical Details
- Framework: FastAPI
- Database: MongoDB
- Authentication: Telegram-based
- API Documentation: OpenAPI/Swagger

### Database Schema
```javascript
// Properties Collection
{
  _id: ObjectId,
  telegram_user_id: String,
  title: String,
  description: String,
  price: {
    amount: Number,
    currency: String
  },
  location: {
    type: "Point",
    coordinates: [Number, Number], // [longitude, latitude]
    address: String,
    city: String,
    area: String
  },
  availability: {
    from: Date,
    until: Date,
    minimum_stay: Number // in months
  },
  features: {
    rooms: Number,
    bathrooms: Number,
    furnished: Boolean,
    utilities_included: Boolean,
    internet: Boolean
  },
  rules: {
    rental_type: String, // "any", "students_only", "workers_only"
    gender_preference: String,
    pets_allowed: Boolean,
    smoking_allowed: Boolean
  },
  verification: {
    status: String, // "pending", "verified", "flagged"
    last_verified: Date,
    verified_by: [String], // telegram_user_ids
    report_count: Number
  },
  status: String, // active, inactive, rented
  created_at: Date,
  updated_at: Date,
  metadata: Object // flexible field for additional properties
}

// Searchers Collection
{
  _id: ObjectId,
  telegram_user_id: String,
  searcher_type: String, // "student", "worker", "any"
  search_preferences: {
    price_range: {
      min: Number,
      max: Number
    },
    location: {
      cities: [String],
      areas: [String]
    },
    dates: {
      move_in: Date,
      duration: Number // in months
    },
    requirements: {
      furnished: Boolean,
      internet: Boolean,
      utilities_included: Boolean
    }
  },
  status: String, // active, inactive
  reputation: {
    trust_score: Number,
    verified_reports: Number,
    false_reports: Number
  },
  created_at: Date,
  updated_at: Date,
  last_active: Date
}

// Matches Collection
{
  _id: ObjectId,
  searcher_id: ObjectId,
  property_id: ObjectId,
  status: String, // pending, accepted, rejected
  created_at: Date,
  telegram_thread_id: String // for property-specific chat
}

// Reports Collection
{
  _id: ObjectId,
  property_id: ObjectId,
  reporter_id: String, // telegram_user_id
  report_type: String, // "spam", "scam", "inappropriate", "incorrect_info", "unavailable"
  description: String,
  evidence: {
    text: String,
    attachments: [String] // URLs or file IDs
  },
  status: String, // "pending", "verified", "rejected"
  moderator_notes: String,
  created_at: Date,
  resolved_at: Date,
  resolution: String // "removed", "updated", "dismissed", "warning_issued"
}

// Verifications Collection
{
  _id: ObjectId,
  property_id: ObjectId,
  verifier_id: String, // telegram_user_id
  verification_type: String, // "visited", "contacted", "document_check"
  status: String, // "valid", "invalid", "suspicious"
  notes: String,
  created_at: Date,
  metadata: Object // additional verification details
}
```

### API Endpoints Structure
```
/api/v1/
├── auth/
│   └── telegram-callback
├── properties/
│   ├── create
│   ├── update
│   ├── list
│   └── search
├── searchers/
│   ├── preferences
│   └── matches
├── reports/
│   ├── create
│   ├── list
│   └── resolve
├── verifications/
│   ├── submit
│   └── status
└── telegram/
    ├── webhook
    └── notifications
```

### Dependencies
- FastAPI
- Motor (async MongoDB driver)
- python-telegram-bot
- Pydantic

### Security & Compliance
- No personal data storage
- Telegram-based authentication
- GDPR-compliant data handling
- Minimal data collection policy
- Community-driven verification system

### Known Issues
- None currently tracked

### Upcoming Features
1. Telegram bot implementation
2. Property listing management
3. Searcher preference matching
4. Location-based search with MongoDB geospatial queries
5. Automated matching system
6. Notification system via Telegram
7. Crowdsourced verification system
8. Trust score calculation
9. Report management system
10. Property verification workflow

## [0.1.0] - 2024-12-11

### Added
- Initial project setup
- Basic server configuration
- Database schema design
- Authentication system foundation
- API endpoints structure

### Technical Details
- Framework: FastAPI
- Database: PostgreSQL
- Authentication: JWT-based
- API Documentation: OpenAPI/Swagger

### Database Schema
```sql
-- Core tables planned
Users
Listings
Bookings
Reviews
Messages
```

### API Endpoints Structure
```
/api/v1/
├── auth/
│   ├── login
│   ├── register
│   └── refresh
├── listings/
│   ├── create
│   ├── update
│   ├── delete
│   └── search
├── users/
│   ├── profile
│   └── settings
└── bookings/
    ├── create
    └── status
```

### Dependencies
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- Python-Jose
- Passlib

### Security & Compliance
- GDPR compliance implementation
- Data encryption standards
- Rate limiting setup
- Input validation

### Known Issues
- None currently tracked

### Upcoming Features
1. Implement user authentication system
2. Set up database migrations
3. Create listing management endpoints
4. Add search functionality
5. Implement booking system
6. Add messaging system
7. Set up email notifications
