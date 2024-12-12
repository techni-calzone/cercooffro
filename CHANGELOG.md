# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Telegram login integration with secure authentication
- Multi-language support with Italian and English translations
- Docker configuration for Coolify deployment
- Login button in navigation bar
- Download Telegram prompt for users without Telegram

### Changed
- Moved translations from `src/translations` to `src/locales` folder
- Updated LanguageContext to use the correct path for translations
- Fixed localization issues in NavBar and HomePage components
- Updated Docker configuration to use MongoDB Atlas
- Improved login page layout and user experience
- Updated CORS configuration to include production domain

### Removed
- Removed duplicate translations folder (`src/translations`)
- Removed local MongoDB container in favor of MongoDB Atlas
- Removed Nginx configuration (using Coolify's built-in proxy)

### Security
- Added secure Telegram authentication
- Updated CORS origins for production
- Implemented proper environment variable handling

### Infrastructure
- Configured Docker for Coolify deployment
- Set up MongoDB Atlas connection
- Added production-ready Dockerfiles for both frontend and backend

### Documentation
- Updated README with current tech stack and features
- Added deployment instructions for Coolify
- Updated environment variables documentation
- Added localization documentation
