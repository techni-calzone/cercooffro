from prometheus_client import Counter, Histogram, Gauge
import time

# Request metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

# Scraping metrics
active_scraping_jobs = Gauge(
    'active_scraping_jobs',
    'Number of currently running scraping jobs'
)

scraping_duration_seconds = Histogram(
    'scraping_duration_seconds',
    'Duration of scraping jobs',
    ['city']
)

listings_scraped_total = Counter(
    'listings_scraped_total',
    'Total number of listings scraped',
    ['source', 'city']
)

# Database metrics
db_operation_duration_seconds = Histogram(
    'db_operation_duration_seconds',
    'Duration of database operations',
    ['operation', 'collection']
)

db_connections_current = Gauge(
    'db_connections_current',
    'Current number of database connections'
)

# User metrics
active_users = Gauge(
    'active_users',
    'Number of currently active users'
)

premium_users = Gauge(
    'premium_users',
    'Number of premium users'
)

user_searches_total = Counter(
    'user_searches_total',
    'Total number of user searches',
    ['user_type']  # free or premium
)

# Payment metrics
payment_attempts_total = Counter(
    'payment_attempts_total',
    'Total number of payment attempts',
    ['status']
)

subscription_revenue = Counter(
    'subscription_revenue_euros',
    'Total subscription revenue in euros'
)

class MetricsMiddleware:
    async def __call__(self, request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        http_requests_total.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        
        http_request_duration_seconds.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        return response

async def update_user_metrics(db):
    """Update user-related metrics periodically"""
    total_users = await db.users.count_documents({})
    active_users.set(total_users)
    
    premium_count = await db.users.count_documents(
        {"subscription_tier": "premium"}
    )
    premium_users.set(premium_count)

class DBMetricsMiddleware:
    async def __call__(self, request, call_next):
        start_time = time.time()
        
        # Track current DB connections
        db_connections_current.set(
            len(request.app.state.db.client.nodes)
        )
        
        response = await call_next(request)
        
        # Measure DB operation duration
        duration = time.time() - start_time
        if hasattr(request.state, 'db_operation'):
            db_operation_duration_seconds.labels(
                operation=request.state.db_operation,
                collection=request.state.db_collection
            ).observe(duration)
        
        return response
