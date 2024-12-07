# 🏠 CercoOffro - Student Rental Aggregator

An AI-powered rental aggregation platform designed specifically for students in Italy, focusing on comprehensive housing search and recommendation features.

## ✨ Features

- 🔍 Advanced search with multiple filters
- 🤖 AI-powered recommendations
- 💬 Real-time chat with landlords
- 🔔 Smart notifications
- 🌍 Multilingual support (Italian/English)
- 📱 Responsive design
- 🔐 Secure authentication
- 📊 Analytics and monitoring

## 📚 Documentation

- [Project Status](docs/PROJECT_STATUS.md)
- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the application

Detailed instructions in the [Development Guide](docs/DEVELOPMENT.md).

## 🛠 Tech Stack

### Backend
- FastAPI
- MongoDB
- Redis
- WebSockets
- Prometheus

### Frontend
- React
- Material-UI
- React Query
- i18next
- WebSocket client

### Infrastructure
- Docker
- MongoDB (via MONGODB_URI env variable)
- S3 (via S3_BUCKET env variable)
- Prometheus

## 📦 Deployment

To deploy the application, ensure the following environment variables are set:

- `MONGODB_URI`: Connection string for MongoDB
- `S3_BUCKET`: S3 bucket name for storage

Use Docker Compose to start the services:

```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

See [Development Guide](docs/DEVELOPMENT.md) for detailed instructions.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The project follows an open-core model:
- Core functionality (search, crowdsourcing, localization) is open source under MIT License
- Premium features (AI recommendations, advanced filters) are proprietary
- Mock data and development tools are open source

## ❤️ Sponsorship

Your support helps us maintain and improve the open-source core of Student Rental Aggregator! You can support us through:

- [GitHub Sponsors](https://github.com/sponsors/student-rental-aggregator)
- [Open Collective](https://opencollective.com/student-rental-aggregator)
- [Ko-fi](https://ko-fi.com/studentrentalaggregator)
- [Buy Me a Coffee](https://www.buymeacoffee.com/studentrental)

### Sponsorship Tiers

#### 🌱 Supporter (€5/month)
- Name in our GitHub README
- Access to supporter-only Discord channel

#### 🌟 Bronze Sponsor (€20/month)
- Everything in Supporter tier
- Early access to new features
- Priority issue support

#### 💫 Silver Sponsor (€50/month)
- Everything in Bronze tier
- Logo in our README
- Monthly consultation call

#### 🎯 Gold Sponsor (€200/month)
- Everything in Silver tier
- Featured sponsor status
- Custom feature prioritization
- Direct development support

#### 🚀 Platinum Sponsor (€500/month)
- Everything in Gold tier
- Logo on landing page
- Dedicated support channel
- Influence on roadmap

## 💝 Our Sponsors

### 🎯 Gold Sponsors
<!-- gold-sponsors --><!-- gold-sponsors -->

### 💫 Silver Sponsors
<!-- silver-sponsors --><!-- silver-sponsors -->

### 🌟 Bronze Sponsors
<!-- bronze-sponsors --><!-- bronze-sponsors -->

### 🌱 Supporters
<!-- supporters --><!-- supporters -->

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 👥 Team

- Backend Developers
- Frontend Developers
- UI/UX Designers
- DevOps Engineers

## 📞 Support

For support, please:
1. Check the documentation
2. Open an issue
3. Contact the development team

## 🌟 Acknowledgments

- FastAPI team
- React team
- Material-UI team
- MongoDB team
- All contributors
