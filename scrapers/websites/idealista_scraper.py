import scrapy
from scrapy.crawler import CrawlerProcess
from typing import Dict, List
import logging
from urllib.parse import urljoin

class IdealistaSpider(scrapy.Spider):
    name = 'idealista_spider'
    allowed_domains = ['idealista.it']
    
    def __init__(self, cities: List[str] = None, *args, **kwargs):
        super(IdealistaSpider, self).__init__(*args, **kwargs)
        self.cities = cities or ['Milano', 'Roma', 'Torino']
        self.start_urls = [
            f'https://www.idealista.it/affitto-case/{city.lower()}/' for city in self.cities
        ]

    def parse(self, response):
        # Extract listing cards
        listings = response.css('.item-container')
        
        for listing in listings:
            yield self.parse_listing(listing)
        
        # Follow pagination
        next_page = response.css('.next-page-link::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_listing(self, listing):
        try:
            return {
                'title': listing.css('.item-title::text').get().strip(),
                'price': self.extract_price(listing),
                'location': self.extract_location(listing),
                'description': listing.css('.item-description::text').get().strip(),
                'images': self.extract_images(listing),
                'source_url': urljoin('https://www.idealista.it', 
                    listing.css('.item-link::attr(href)').get()),
                'source': 'idealista'
            }
        except Exception as e:
            logging.error(f"Error parsing listing: {e}")
            return None

    def extract_price(self, listing):
        price_text = listing.css('.price-value::text').get()
        return float(price_text.replace('€', '').replace('.', '').strip()) if price_text else None

    def extract_location(self, listing):
        location_text = listing.css('.item-location::text').get()
        parts = location_text.split(',') if location_text else []
        return {
            'neighborhood': parts[0].strip() if parts else None,
            'city': parts[1].strip() if len(parts) > 1 else None
        }

    def extract_images(self, listing):
        return listing.css('.gallery-image::attr(src)').getall()

def run_idealista_scraper(cities: List[str] = None):
    process = CrawlerProcess(settings={
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'ROBOTSTXT_OBEY': True,
        'DOWNLOAD_DELAY': 1.5,  # Respect website's crawling policy
        'CONCURRENT_REQUESTS': 2
    })
    
    process.crawl(IdealistaSpider, cities=cities)
    process.start()

if __name__ == "__main__":
    run_idealista_scraper()
