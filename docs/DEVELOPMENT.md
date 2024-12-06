# Student Rental Aggregator - Development Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB 5.0+
- Redis 6.0+
- Docker and Docker Compose

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd student-rental-aggregator
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

#### Development Mode
1. Start backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start frontend development server:
```bash
cd frontend
npm start
```

#### Docker Mode
```bash
docker-compose up -d
```

## 🏗 Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       └── routes.py
│   ├── core/
│   │   ├── config.py
│   │   ├── deps.py
│   │   └── security.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── tests/
└── requirements.txt
```

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── i18n/
│   └── App.js
└── package.json
```

## 💻 Development Workflow

### 1. Feature Development
1. Create a new branch:
```bash
git checkout -b feature/feature-name
```

2. Implement the feature following our coding standards
3. Write tests for your changes
4. Update documentation if necessary
5. Create a pull request

### 2. Code Style
- Backend: Follow PEP 8 guidelines
- Frontend: Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### 3. Testing
- Write unit tests for new features
- Ensure all tests pass before committing
- Run tests:
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🔧 Common Development Tasks

### Adding New API Endpoints
1. Create new endpoint file in `backend/app/api/v1/endpoints/`
2. Define schemas in `backend/app/schemas/`
3. Implement business logic in `backend/app/services/`
4. Add routes to `backend/app/api/v1/routes.py`

### Adding New Frontend Components
1. Create component in `frontend/src/components/`
2. Add styles using Material-UI
3. Add translations in `frontend/src/i18n/`
4. Implement tests in `frontend/src/components/__tests__/`

### Database Operations
1. Define models in `backend/app/models/`
2. Use Motor for async MongoDB operations
3. Add indexes for performance
4. Follow schema validation rules

## 🔍 Debugging

### Backend Debugging
1. Use logging:
```python
from app.core.logging import logger

logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message")
```

2. Use FastAPI's automatic docs:
- OpenAPI documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Debugging
1. Use React Developer Tools
2. Use console logging:
```javascript
console.log('Debug info:', data);
```

3. Use React Query DevTools for API debugging

## 🌐 Internationalization

### Adding New Languages
1. Add language file in `frontend/src/i18n/locales/`
2. Update language selector component
3. Add translations for all strings

### Translation Guidelines
- Use translation keys that describe the content
- Keep translations organized by feature
- Use variables for dynamic content

## 📊 Monitoring and Metrics

### Prometheus Metrics
- Endpoint: `/metrics`
- Custom metrics in `backend/app/core/monitoring.py`
- Dashboard templates in `monitoring/dashboards/`

### Logging
- Log files in `backend/logs/`
- Structured logging format
- Different log levels for different environments

## 🔐 Security Best Practices

1. Authentication
- Use JWT tokens
- Implement refresh tokens
- Secure password storage

2. Authorization
- Role-based access control
- Resource-level permissions
- Input validation

3. Data Protection
- HTTPS only
- API rate limiting
- Input sanitization

## 📦 Deployment

### Production Deployment
1. Build frontend:
```bash
cd frontend
npm run build
```

2. Build and push Docker images:
```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
```

3. Deploy using Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration
- Use environment variables for configuration
- Different configs for dev/staging/prod
- Secure sensitive information

## 🐛 Troubleshooting

### Common Issues

1. MongoDB Connection Issues
```python
# Check connection string
print(settings.MONGODB_URI)
# Verify network connectivity
```

2. WebSocket Connection Issues
```javascript
// Check WebSocket URL
console.log(websocket.url);
// Verify token authentication
```

3. Redis Connection Issues
```python
# Check Redis connection
await redis.ping()
```

### Performance Issues
1. Check database indexes
2. Monitor API response times
3. Profile slow endpoints
4. Optimize frontend bundles

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
