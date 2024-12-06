# Student Rental Aggregator - Testing Guide

## 🧪 Testing Overview

### Test Categories
1. **Unit Tests**
   - Individual component testing
   - Service function testing
   - Utility function testing
   - Model validation testing

2. **Integration Tests**
   - API endpoint testing
   - Database operations testing
   - Service interaction testing
   - WebSocket functionality testing

3. **End-to-End Tests**
   - User workflow testing
   - Frontend-backend integration
   - Real-time feature testing
   - Cross-browser testing

4. **Performance Tests**
   - Load testing
   - Stress testing
   - Scalability testing
   - Response time testing

## 🔧 Testing Setup

### Backend Testing

1. Install testing dependencies:
```bash
pip install pytest pytest-asyncio pytest-cov httpx pytest-mock
```

2. Run tests:
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_recommendations.py

# Run tests matching pattern
pytest -k "test_chat"
```

### Frontend Testing

1. Install testing dependencies:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

2. Run tests:
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- SearchFilters.test.js

# Run in watch mode
npm test -- --watch
```

## 📝 Writing Tests

### Backend Test Examples

1. API Endpoint Test:
```python
async def test_get_recommendations():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/recommendations/listings")
        assert response.status_code == 200
        assert "items" in response.json()
```

2. Service Function Test:
```python
@pytest.mark.asyncio
async def test_calculate_listing_score():
    recommendation_engine = get_recommendation_engine(db)
    score = await recommendation_engine.calculate_listing_score(
        listing=mock_listing,
        preferences=mock_preferences
    )
    assert 0 <= score <= 1
```

3. Database Operation Test:
```python
@pytest.mark.asyncio
async def test_create_chat_room():
    chat_manager = get_chat_manager(db)
    room_id = await chat_manager.create_chat_room(
        listing_id="test_listing",
        user_id="test_user",
        owner_id="test_owner"
    )
    assert room_id is not None
```

### Frontend Test Examples

1. Component Rendering Test:
```javascript
import { render, screen } from '@testing-library/react';
import ListingCard from './ListingCard';

test('renders listing details', () => {
    const listing = {
        title: 'Test Listing',
        price: 1000,
        city: 'Rome'
    };
    render(<ListingCard listing={listing} />);
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
});
```

2. User Interaction Test:
```javascript
import { render, fireEvent } from '@testing-library/react';
import SearchFilters from './SearchFilters';

test('updates price range filter', () => {
    const onFilterChange = jest.fn();
    render(<SearchFilters onChange={onFilterChange} />);
    
    fireEvent.change(screen.getByLabelText('Min Price'), {
        target: { value: '500' }
    });
    
    expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
            price: { min: 500 }
        })
    );
});
```

3. API Integration Test:
```javascript
import { renderHook } from '@testing-library/react-hooks';
import { useRecommendations } from './hooks/useRecommendations';

test('fetches recommendations', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
        useRecommendations()
    );
    
    await waitForNextUpdate();
    
    expect(result.current.data).toBeDefined();
    expect(result.current.isLoading).toBe(false);
});
```

## 🎯 Test Coverage Goals

### Backend Coverage Targets
- Services: 90%
- API Endpoints: 85%
- Models: 80%
- Utils: 85%
- Overall: 85%

### Frontend Coverage Targets
- Components: 80%
- Hooks: 85%
- Utils: 85%
- Overall: 80%

## 🔍 Testing Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests independent

2. **Mock External Services**
   - Database calls
   - API requests
   - File system operations
   - Time-dependent operations

3. **Test Edge Cases**
   - Empty inputs
   - Invalid data
   - Boundary conditions
   - Error scenarios

4. **Performance Testing**
   - Response time limits
   - Memory usage
   - Connection limits
   - Concurrent users

## 🚨 Common Testing Scenarios

### Authentication Testing
```python
async def test_protected_endpoint_unauthorized():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/protected")
        assert response.status_code == 401
```

### WebSocket Testing
```python
async def test_websocket_connection():
    async with AsyncClient(app=app, base_url="http://test") as client:
        async with client.websocket_connect("/ws/test") as websocket:
            data = await websocket.receive_json()
            assert data["type"] == "connection_established"
```

### Form Validation Testing
```javascript
test('validates required fields', () => {
    render(<RegistrationForm />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
});
```

## 📊 Test Reporting

### Generate Coverage Report
```bash
# Backend
pytest --cov=app --cov-report=html

# Frontend
npm test -- --coverage --coverageReporters="html"
```

### Continuous Integration
- Run tests on every pull request
- Maintain minimum coverage thresholds
- Generate test reports
- Block merges on test failures

## 🐛 Debug Testing

### Backend Debugging
```python
import pytest
import logging

@pytest.mark.asyncio
async def test_debug():
    logging.debug("Debug information")
    # Add breakpoints using pdb
    # import pdb; pdb.set_trace()
```

### Frontend Debugging
```javascript
test('debug component', () => {
    const { debug } = render(<Component />);
    debug(); // Prints DOM structure
    // Use browser debugger
    // debugger;
});
```
