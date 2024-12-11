import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.entities.searcher import SearchPreferences

client = TestClient(app)

@pytest.fixture
def setup_searcher():
    # Setup code to create a searcher in the database (mock or real)
    pass

@pytest.mark.asyncio
async def test_search_properties(setup_searcher):
    response = client.get("/api/v1/search/properties", params={"page": 1, "limit": 10})
    assert response.status_code == 200
    assert "properties" in response.json()

@pytest.mark.asyncio
async def test_search_by_text(setup_searcher):
    response = client.get("/api/v1/search/text", params={"query": "apartment", "page": 1, "limit": 10})
    assert response.status_code == 200
    assert "properties" in response.json()

@pytest.mark.asyncio
async def test_get_recommendations(setup_searcher):
    response = client.get("/api/v1/search/recommendations")
    assert response.status_code == 200
    assert "recommendations" in response.json()
