# 🏠 CercoOffro - Student Rental Finder

An AI-powered rental aggregation platform designed specifically for students in Italy, helping them find their perfect accommodation with ease and security.

## ✨ Features

- 🔍 Advanced search with multiple filters
- 🤖 AI-powered recommendations
- 🔐 Secure Telegram authentication
- 🌍 Multilingual support (Italian/English)
- 📱 Responsive design
- 📊 Analytics and monitoring
- 🏫 University-focused listings
- 🤝 Student community features

 

## 🛠 Tech Stack

 

### Frontend
- Next.js 13+
- Tailwind CSS
- i18next for localization
- Telegram Login Widget

### Backend
- FastAPI
- MongoDB Atlas
- Python 3.11
- OpenAI integration

### Infrastructure
- Docker
- Coolify for deployment
- MongoDB Atlas
- Telegram Bot API

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   pip install -r requirements.txt
   ```
3. Set up environment variables (copy .env.example to .env)
4. Run the development servers:
   ```bash
   # Frontend
   npm run dev

   # Backend
   uvicorn app.main:app --reload
   ```

## 🌍 Environment Variables

### Required Environment Variables:
- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: Database name
- `TELEGRAM_BOT_TOKEN`: Telegram Bot API token
- `TELEGRAM_BOT_NAME`: Your Telegram bot's username
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_BOT_NAME`: Telegram bot name for frontend

## 📦 Deployment

The application is deployed using Coolify with Docker containers:

```bash
docker-compose up --build
```

Key deployment features:
- Automatic container orchestration via Coolify
- MongoDB Atlas for database
- Secure Telegram authentication
- Multi-language support (IT/EN)

## 🌐 Localization

The application supports both Italian and English languages:
- Frontend translations in `src/locales/{it,en}.json`
- Dynamic language switching
- SEO-friendly content in both languages

## 🔐 Security

- Authentication via Telegram
- No storage of sensitive user data
- Secure API endpoints
- CORS protection with specific origins

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
