# 🏠 CercoOffro - Student Rental Finder

An AI-powered rental aggregation platform designed specifically for students in Italy, helping them find their perfect accommodation with ease and security.

## ✨ Features

- 🔍 Advanced search with multiple filters and responsive dropdowns
- 🤖 AI-powered recommendations
- 🔐 Secure Telegram authentication
- 🌍 Multilingual support (Italian/English)
- 📱 Responsive design for all devices
- 📊 Analytics and monitoring
- 🏫 University-focused listings
- 🤝 Student community features
- 🎯 Intuitive mobile-first interface
- 🔄 Real-time search updates

## 🛠 Tech Stack

### Frontend
- Next.js 13+
- Tailwind CSS
- i18next for localization
- Telegram Login Widget
- React Hook Form with Zod validation
- Responsive UI components
- Mobile-optimized dropdowns and filters

### Backend
- FastAPI
- MongoDB Atlas
- Python 3.11
- OpenAI integration
- Secure authentication flow
- Role-based access control

### Infrastructure
- Docker
- Coolify for deployment
- MongoDB Atlas
- Telegram Bot API
- CORS security configuration

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

## 📱 Mobile Responsiveness

The application is designed with a mobile-first approach:

- Adaptive search interface with optimized dropdowns
- Touch-friendly UI elements with proper spacing
- Responsive layouts that adjust to screen size
- Improved touch targets for better mobile interaction
- Smart positioning of UI elements on small screens

## 🌐 Localization

The application supports multiple languages:
- English (default)
- Italian
- Easy addition of new languages through i18n
- Consistent translations across all components

## 🔒 Security

- Secure Telegram authentication
- Protected API endpoints
- Role-based access control
- Environment variable management
- CORS configuration for production

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

## 📖 Documentation

For detailed documentation on:
- API endpoints
- Component usage
- Deployment process
- Environment setup
- Localization guide
- Mobile responsiveness guidelines

Please refer to the `/docs` directory.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
