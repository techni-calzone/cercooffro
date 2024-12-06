from typing import List, Dict
import random
from datetime import datetime, timedelta
from faker import Faker
from app.core.config import get_settings

settings = get_settings()
fake = Faker(['it_IT', 'en_GB'])  # Initialize with Italian and English locales

ITALIAN_CITIES = [
    "Roma", "Milano", "Napoli", "Torino", "Bologna", "Firenze", 
    "Venezia", "Pisa", "Padova", "Siena"
]

LISTING_TYPES = ["apartment", "room", "studio"]

AMENITIES = [
    "wifi", "heating", "air_conditioning", "washing_machine", 
    "dishwasher", "elevator", "furnished", "balcony", "parking"
]

def generate_mock_listings(count: int = 100) -> List[Dict]:
    """Generate mock listing data for development purposes."""
    listings = []
    
    for _ in range(count):
        listing_type = random.choice(LISTING_TYPES)
        rooms = random.randint(1, 5) if listing_type != "room" else 1
        price = random.randint(300, 1500)
        
        created_date = datetime.now() - timedelta(days=random.randint(0, 30))
        available_from = created_date + timedelta(days=random.randint(15, 60))
        
        listing = {
            "id": fake.uuid4(),
            "title": f"{rooms} room {listing_type} in {random.choice(ITALIAN_CITIES)}",
            "description": fake.text(max_nb_chars=500),
            "price": price,
            "city": random.choice(ITALIAN_CITIES),
            "address": fake.street_address(),
            "rooms": rooms,
            "size": random.randint(20, 120),
            "floor": random.randint(0, 10),
            "listing_type": listing_type,
            "available_from": available_from.isoformat(),
            "created_at": created_date.isoformat(),
            "updated_at": created_date.isoformat(),
            "amenities": random.sample(AMENITIES, random.randint(3, 7)),
            "images": [fake.image_url() for _ in range(random.randint(3, 6))],
            "source_url": fake.url(),
            "status": random.choices(
                ["available", "unavailable", "pending"],
                weights=[0.7, 0.2, 0.1]
            )[0]
        }
        listings.append(listing)
    
    return listings

def generate_mock_users(count: int = 20) -> List[Dict]:
    """Generate mock user data for development purposes."""
    users = []
    
    for _ in range(count):
        user = {
            "id": fake.uuid4(),
            "email": fake.email(),
            "username": fake.user_name(),
            "full_name": fake.name(),
            "created_at": (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat(),
            "is_active": True,
            "is_premium": random.choice([True, False]),
            "preferred_language": random.choice(["it", "en"]),
            "trust_score": round(random.uniform(0.1, 1.0), 2)
        }
        users.append(user)
    
    return users

def generate_mock_votes(listings: List[Dict], users: List[Dict], count: int = 200) -> List[Dict]:
    """Generate mock voting data for development purposes."""
    votes = []
    
    for _ in range(count):
        listing = random.choice(listings)
        user = random.choice(users)
        
        vote = {
            "id": fake.uuid4(),
            "listing_id": listing["id"],
            "user_id": user["id"],
            "vote_type": random.choice(["available", "unavailable", "incorrect", "spam"]),
            "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            "comment": fake.text(max_nb_chars=200) if random.random() > 0.7 else None,
            "trust_score": user["trust_score"]
        }
        votes.append(vote)
    
    return votes

def generate_all_mock_data() -> Dict:
    """Generate all mock data for development environment."""
    listings = generate_mock_listings()
    users = generate_mock_users()
    votes = generate_mock_votes(listings, users)
    
    return {
        "listings": listings,
        "users": users,
        "votes": votes
    }

def save_mock_data_to_file(data: Dict, filename: str = "mock_data.json"):
    """Save mock data to a JSON file."""
    import json
    import os
    
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    with open(f"data/{filename}", "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    # Generate and save mock data when run directly
    mock_data = generate_all_mock_data()
    save_mock_data_to_file(mock_data)
