from typing import List, Dict, Optional
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from app.core.logging import logger

class RecommendationEngine:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.scaler = MinMaxScaler()
        
    async def get_user_preferences(self, user_id: str) -> Dict:
        """Extract user preferences from search history and interactions"""
        # Get recent searches
        searches = await self.db.search_history.find({
            'user_id': user_id,
            'timestamp': {'$gte': datetime.utcnow() - timedelta(days=30)}
        }).to_list(None)
        
        # Get favorited listings
        favorites = await self.db.favorites.find({
            'user_id': user_id
        }).to_list(None)
        
        # Get clicked listings
        interactions = await self.db.user_interactions.find({
            'user_id': user_id,
            'type': 'view',
            'timestamp': {'$gte': datetime.utcnow() - timedelta(days=30)}
        }).to_list(None)
        
        # Aggregate preferences
        preferences = {
            'price_range': self._extract_price_range(searches, favorites),
            'preferred_cities': self._extract_cities(searches, favorites),
            'amenities': self._extract_amenities(favorites),
            'property_types': self._extract_property_types(searches, favorites),
            'min_rooms': self._extract_min_rooms(favorites),
            'universities': self._extract_universities(searches)
        }
        
        return preferences
        
    def _extract_price_range(self, searches: List[Dict], favorites: List[Dict]) -> Dict:
        """Extract preferred price range from user behavior"""
        prices = []
        for search in searches:
            if 'filters' in search and 'price' in search['filters']:
                prices.extend([search['filters']['price']['min'], search['filters']['price']['max']])
        for favorite in favorites:
            if 'price' in favorite:
                prices.append(favorite['price'])
                
        if not prices:
            return {'min': 0, 'max': 5000}  # Default range
            
        return {
            'min': max(0, np.percentile(prices, 25)),
            'max': np.percentile(prices, 75)
        }
        
    def _extract_cities(self, searches: List[Dict], favorites: List[Dict]) -> List[str]:
        """Extract preferred cities from user behavior"""
        cities = {}
        for search in searches:
            if 'city' in search:
                cities[search['city']] = cities.get(search['city'], 0) + 1
        for favorite in favorites:
            if 'city' in favorite:
                cities[favorite['city']] = cities.get(favorite['city'], 0) + 2
                
        return sorted(cities.keys(), key=lambda x: cities[x], reverse=True)
        
    def _extract_amenities(self, favorites: List[Dict]) -> List[str]:
        """Extract preferred amenities from favorited listings"""
        amenities_count = {}
        for favorite in favorites:
            if 'amenities' in favorite:
                for amenity in favorite['amenities']:
                    amenities_count[amenity] = amenities_count.get(amenity, 0) + 1
                    
        return sorted(amenities_count.keys(), key=lambda x: amenities_count[x], reverse=True)
        
    def _extract_property_types(self, searches: List[Dict], favorites: List[Dict]) -> List[str]:
        """Extract preferred property types from user behavior"""
        types = {}
        for search in searches:
            if 'filters' in search and 'property_type' in search['filters']:
                type_ = search['filters']['property_type']
                types[type_] = types.get(type_, 0) + 1
        for favorite in favorites:
            if 'property_type' in favorite:
                types[favorite['property_type']] = types.get(favorite['property_type'], 0) + 2
                
        return sorted(types.keys(), key=lambda x: types[x], reverse=True)
        
    def _extract_min_rooms(self, favorites: List[Dict]) -> int:
        """Extract preferred minimum number of rooms"""
        rooms = [f.get('rooms', 1) for f in favorites if 'rooms' in f]
        return int(np.median(rooms)) if rooms else 1
        
    def _extract_universities(self, searches: List[Dict]) -> List[str]:
        """Extract preferred universities from search history"""
        unis = {}
        for search in searches:
            if 'university' in search:
                unis[search['university']] = unis.get(search['university'], 0) + 1
                
        return sorted(unis.keys(), key=lambda x: unis[x], reverse=True)
        
    async def calculate_listing_score(
        self,
        listing: Dict,
        preferences: Dict,
        user_location: Optional[Dict] = None
    ) -> float:
        """Calculate a relevance score for a listing based on user preferences"""
        scores = []
        
        # Price match score
        if 'price' in listing and 'price_range' in preferences:
            price = listing['price']
            price_range = preferences['price_range']
            if price_range['min'] <= price <= price_range['max']:
                scores.append(1.0)
            else:
                distance = min(abs(price - price_range['min']), abs(price - price_range['max']))
                scores.append(max(0, 1 - (distance / price_range['max'])))
                
        # City preference score
        if 'city' in listing and 'preferred_cities' in preferences:
            try:
                city_index = preferences['preferred_cities'].index(listing['city'])
                scores.append(1 - (city_index * 0.2))
            except ValueError:
                scores.append(0.1)
                
        # Amenities match score
        if 'amenities' in listing and 'amenities' in preferences:
            matches = set(listing['amenities']).intersection(set(preferences['amenities']))
            scores.append(len(matches) / max(len(preferences['amenities']), 1))
            
        # Property type match score
        if 'property_type' in listing and 'property_types' in preferences:
            try:
                type_index = preferences['property_types'].index(listing['property_type'])
                scores.append(1 - (type_index * 0.2))
            except ValueError:
                scores.append(0.1)
                
        # Room count score
        if 'rooms' in listing and 'min_rooms' in preferences:
            if listing['rooms'] >= preferences['min_rooms']:
                scores.append(1.0)
            else:
                scores.append(0.5)
                
        # University proximity score
        if 'nearby_universities' in listing and 'universities' in preferences:
            matches = set(listing['nearby_universities']).intersection(set(preferences['universities']))
            scores.append(len(matches) / max(len(preferences['universities']), 1))
            
        # Location score (if user location available)
        if user_location and 'location' in listing:
            distance = self._calculate_distance(
                user_location,
                listing['location']
            )
            scores.append(max(0, 1 - (distance / 10)))  # Normalize by 10km
            
        # Verification score
        if 'verified' in listing:
            scores.append(1.0 if listing['verified'] else 0.5)
            
        # Recent listing bonus
        if 'created_at' in listing:
            days_old = (datetime.utcnow() - listing['created_at']).days
            scores.append(max(0, 1 - (days_old / 30)))  # Decay over 30 days
            
        return np.mean(scores) if scores else 0.0
        
    def _calculate_distance(self, point1: Dict, point2: Dict) -> float:
        """Calculate distance between two points in kilometers"""
        from math import sin, cos, sqrt, atan2, radians
        
        R = 6371  # Earth's radius in kilometers
        
        lat1 = radians(point1['latitude'])
        lon1 = radians(point1['longitude'])
        lat2 = radians(point2['latitude'])
        lon2 = radians(point2['longitude'])
        
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c
        
        return distance
        
    async def get_recommendations(
        self,
        user_id: str,
        limit: int = 10,
        offset: int = 0,
        user_location: Optional[Dict] = None
    ) -> List[Dict]:
        """Get personalized listing recommendations for a user"""
        try:
            # Get user preferences
            preferences = await self.get_user_preferences(user_id)
            
            # Get active listings
            listings = await self.db.listings.find({
                'active': True,
                'available': True
            }).to_list(None)
            
            # Calculate scores for each listing
            scored_listings = []
            for listing in listings:
                score = await self.calculate_listing_score(listing, preferences, user_location)
                scored_listings.append((listing, score))
                
            # Sort by score and apply pagination
            scored_listings.sort(key=lambda x: x[1], reverse=True)
            paginated_listings = scored_listings[offset:offset + limit]
            
            # Return listings with scores
            return [{
                **listing,
                'recommendation_score': score
            } for listing, score in paginated_listings]
            
        except Exception as e:
            logger.error(f"Error generating recommendations for user {user_id}: {e}")
            return []
            
    async def update_user_preferences(self, user_id: str, interaction_type: str, listing_id: str):
        """Update user preferences based on interactions"""
        try:
            await self.db.user_interactions.insert_one({
                'user_id': user_id,
                'listing_id': listing_id,
                'type': interaction_type,
                'timestamp': datetime.utcnow()
            })
        except Exception as e:
            logger.error(f"Error updating user preferences: {e}")

recommendation_engine: Optional[RecommendationEngine] = None

def get_recommendation_engine(db: AsyncIOMotorDatabase) -> RecommendationEngine:
    global recommendation_engine
    if recommendation_engine is None:
        recommendation_engine = RecommendationEngine(db)
    return recommendation_engine
