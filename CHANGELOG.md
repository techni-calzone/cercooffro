# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Telegram login integration with secure authentication
- Multi-language support with Italian and English translations
- Docker configuration for Coolify deployment
- Login button in navigation bar
- Download Telegram prompt for users without Telegram
- Created new searcher profile page with sections for:
  - Personal information display
  - Search preferences management
  - Saved searches history
  - Loading and error states
- Implemented comprehensive user hierarchy system:
  - Base user interface with common properties
  - Specific user types (Searcher, Landlord, Agency, Admin)
  - Role-based permissions and features
  - Verification system for landlords and agencies
- Enhanced authentication system:
  - Role-based redirects after login
  - Improved token management
  - Type-safe user context
  - Profile update functionality
- Added new dependencies:
  - react-dropzone for file uploads
  - @hookform/resolvers for form validation
  - zod for schema validation
  - react-hot-toast for notifications
- Backend Telegram authentication implementation:
  - Created TelegramAuth class for secure authentication handling
  - Added validation for Telegram login data
  - Implemented user info fetching functionality
- Added axios package for HTTP requests in backend

### Changed
- Moved translations from `src/translations` to `src/locales` folder
- Updated LanguageContext to use the correct path for translations
- Fixed localization issues in NavBar and HomePage components
- Updated Docker configuration to use MongoDB Atlas
- Improved login page layout and user experience
- Updated CORS configuration to include production domain
- Added missing environment variables from `backend/.env.example` to `docker-compose.yaml` for backend service configuration.
- Updated SimpleNavbar component:
  - Added profile dropdown menu
  - Integrated user authentication status
  - Removed register button (registration now handled differently)
  - Improved login button with icon
  - Added links to My Profile and My Listings
- Improved SearchBar component:
  - Fixed responsive border radius issues
  - Made dropdowns more mobile-friendly
  - Improved dropdown positioning and layout
  - Enhanced touch targets for better mobile interaction
  - Added consistent spacing and visual hierarchy
  - Fixed dropdown width constraints
  - Centralized dropdown positioning for better UX

### Fixed
- Fixed component imports in layout files
- Resolved navigation issues with proper routing
- Added proper error handling in auth context
- Improved type safety across the application
- Added missing index file for SearchDropdowns components to resolve module import issues
- Added missing academicProfile field to SearcherProfileList mock data to comply with SearcherProfile type requirements
- Resolved axios module not found error in Telegram authentication
- Added missing FaSignOutAlt icon import in SimpleNavbar component
- Fixed markdown linting issue in README.md (added proper spacing around headings)
- Fixed AdSense head tag data-nscript attribute issue in layout
- Fixed contact page localization by adding missing translation keys
- Fixed SearchBar dropdown positioning on mobile devices
- Fixed border radius consistency across different screen sizes
- Fixed various mobile responsiveness issues in dropdown components
- Fixed localization issues in the contact page

### Removed
- Removed duplicate translations folder (`src/translations`)
- Removed local MongoDB container in favor of MongoDB Atlas
- Removed Nginx configuration (using Coolify's built-in proxy)

### Security
- Added secure Telegram authentication
- Updated CORS origins for production
- Implemented proper environment variable handling
- Implemented proper token management
- Added role-based access control
- Enhanced user data protection
- Improved authentication flow
- Improved Telegram authentication validation
- Enhanced token management and security
- Added proper CORS configuration for production

### Infrastructure
- Configured Docker for Coolify deployment
- Set up MongoDB Atlas connection
- Added production-ready Dockerfiles for both frontend and backend

### Documentation
- Updated README with current tech stack and features
- Added deployment instructions for Coolify
- Updated environment variables documentation
- Added localization documentation
- Updated README with deployment instructions
- Added environment variable documentation
- Updated localization guide
- Added mobile responsiveness guidelines

## [Previous Versions]
{{ ... }}
