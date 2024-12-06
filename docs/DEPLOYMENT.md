# Student Rental Aggregator - Deployment Guide

## 🚀 Deployment Overview

### Deployment Options
1. **Docker Deployment**
   - Production-ready containers
   - Easy scaling
   - Consistent environments

2. **Cloud Deployment**
   - AWS/GCP/Azure support
   - Managed services
   - Auto-scaling

3. **Traditional Deployment**
   - Direct server installation
   - Manual configuration
   - Custom setup

## 🐳 Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Domain name
- SSL certificate

### Production Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - SECRET_KEY=${SECRET_KEY}
      - ENVIRONMENT=production
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend

  mongodb:
    image: mongo:5.0
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  redis:
    image: redis:6.2
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

volumes:
  mongodb_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

### Deployment Steps

1. **Prepare Environment**
```bash
# Create production environment file
cp .env.example .env.prod
# Edit .env.prod with production values
```

2. **Build Images**
```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Start Services**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Initialize Database**
```bash
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

5. **Monitor Deployment**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## ☁️ Cloud Deployment

### AWS Deployment

1. **Setup AWS Resources**
   - EC2 instances
   - MongoDB Atlas
   - ElastiCache (Redis)
   - Route 53 (DNS)
   - CloudFront (CDN)

2. **Configure Security Groups**
```bash
# Allow necessary ports
- 80/443 (HTTP/HTTPS)
- 27017 (MongoDB)
- 6379 (Redis)
- 9090 (Prometheus)
- 3000 (Grafana)
```

3. **Deploy Application**
```bash
# Install Docker on EC2
ssh ec2-user@your-instance
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start

# Deploy using Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### GCP Deployment

1. **Setup GCP Resources**
   - Compute Engine
   - Cloud SQL
   - Memorystore (Redis)
   - Cloud DNS
   - Cloud CDN

2. **Deploy Using Cloud Run**
```bash
# Build and push images
gcloud builds submit --tag gcr.io/project-id/backend
gcloud builds submit --tag gcr.io/project-id/frontend

# Deploy services
gcloud run deploy backend --image gcr.io/project-id/backend
gcloud run deploy frontend --image gcr.io/project-id/frontend
```

## 📊 Monitoring Setup

### Prometheus Configuration
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'student-rental-backend'
    static_configs:
      - targets: ['backend:8000']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Grafana Dashboards
1. Import dashboard templates
2. Configure data sources
3. Set up alerts

## 🔐 SSL Configuration

### Generate SSL Certificate
```bash
# Using Let's Encrypt
certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker images
        run: |
          docker-compose -f docker-compose.prod.yml build
          docker push your-registry/backend
          docker push your-registry/frontend
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Post-Deployment Tasks

1. **Verify Services**
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f service_name
```

2. **Database Backup**
```bash
# MongoDB backup
docker-compose -f docker-compose.prod.yml exec mongodb mongodump

# Copy backup files
docker cp container_id:/dump ./backup
```

3. **Monitor Performance**
- Check Prometheus metrics
- Review Grafana dashboards
- Monitor error logs
- Check resource usage

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Check MongoDB connection
docker-compose -f docker-compose.prod.yml exec backend python
>>> from motor.motor_asyncio import AsyncIOMotorClient
>>> client = AsyncIOMotorClient('mongodb://mongodb:27017')
>>> client.server_info()
```

2. **Redis Connection**
```bash
# Check Redis connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

3. **WebSocket Issues**
```bash
# Check WebSocket logs
docker-compose -f docker-compose.prod.yml logs -f backend | grep websocket
```

## 🔒 Security Checklist

1. **SSL/TLS**
- [ ] Valid SSL certificate
- [ ] Modern SSL configuration
- [ ] HTTP to HTTPS redirect

2. **Authentication**
- [ ] JWT secret key set
- [ ] Token expiration configured
- [ ] Refresh token rotation

3. **Database**
- [ ] Strong passwords
- [ ] Network security
- [ ] Regular backups

4. **Monitoring**
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Security alerts

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [GCP Documentation](https://cloud.google.com/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
