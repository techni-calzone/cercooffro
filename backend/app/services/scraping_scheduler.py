from datetime import datetime, timedelta
import asyncio
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.scrapers.websites.idealista_scraper import run_idealista_scraper
import logging

logger = logging.getLogger(__name__)

class ScrapingScheduler:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.running = False
        self.scraping_interval = timedelta(hours=6)  # Scrape every 6 hours
        self.cities = [
            "Milano", "Roma", "Torino", "Bologna", "Firenze", "Napoli"
        ]

    async def start(self):
        """Start the scraping scheduler"""
        self.running = True
        while self.running:
            try:
                await self.run_scraping_cycle()
                await asyncio.sleep(self.scraping_interval.total_seconds())
            except Exception as e:
                logger.error(f"Error in scraping cycle: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes before retrying

    async def stop(self):
        """Stop the scraping scheduler"""
        self.running = False

    async def run_scraping_cycle(self):
        """Run a complete scraping cycle"""
        logger.info("Starting scraping cycle")
        
        # Record scraping start
        cycle_id = await self.db.scraping_cycles.insert_one({
            "start_time": datetime.utcnow(),
            "status": "running"
        })

        try:
            # Run scrapers for each website
            for city in self.cities:
                await self.scrape_city(city)

            # Update cycle status
            await self.db.scraping_cycles.update_one(
                {"_id": cycle_id.inserted_id},
                {
                    "$set": {
                        "status": "completed",
                        "end_time": datetime.utcnow()
                    }
                }
            )
        except Exception as e:
            logger.error(f"Error in scraping cycle: {e}")
            await self.db.scraping_cycles.update_one(
                {"_id": cycle_id.inserted_id},
                {
                    "$set": {
                        "status": "failed",
                        "error": str(e),
                        "end_time": datetime.utcnow()
                    }
                }
            )

    async def scrape_city(self, city: str):
        """Scrape listings for a specific city"""
        logger.info(f"Scraping listings for {city}")
        
        try:
            # Run the Idealista scraper
            new_listings = await run_idealista_scraper([city])
            
            # Process and store new listings
            for listing in new_listings:
                existing = await self.db.listings.find_one({
                    "source_url": listing["source_url"]
                })
                
                if existing:
                    # Update existing listing
                    await self.db.listings.update_one(
                        {"_id": existing["_id"]},
                        {
                            "$set": {
                                **listing,
                                "updated_at": datetime.utcnow()
                            }
                        }
                    )
                else:
                    # Insert new listing
                    listing["created_at"] = datetime.utcnow()
                    listing["updated_at"] = datetime.utcnow()
                    await self.db.listings.insert_one(listing)
            
            logger.info(f"Successfully scraped {len(new_listings)} listings for {city}")
            
        except Exception as e:
            logger.error(f"Error scraping {city}: {e}")
            raise

    async def clean_old_listings(self, days: int = 30):
        """Remove listings older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        result = await self.db.listings.delete_many({
            "updated_at": {"$lt": cutoff_date}
        })
        
        logger.info(f"Removed {result.deleted_count} old listings")

# Singleton instance
scheduler = None

async def get_scheduler(db: AsyncIOMotorDatabase) -> ScrapingScheduler:
    global scheduler
    if scheduler is None:
        scheduler = ScrapingScheduler(db)
    return scheduler
