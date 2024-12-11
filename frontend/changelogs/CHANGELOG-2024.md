# Frontend Changelog 2024

## [Unreleased]

## [0.1.0] - 2024-12-11

### Added
- Next.js 13+ App Router implementation
- Bilingual support (English/Italian)
- Two navbar variants:
  - Main NavBar (with search functionality)
  - SimpleNavbar (for content pages)
- Responsive design for mobile and desktop
- Language toggle with flag emojis
- Route groups organization
- Translation system with key-based approach

### Changed
- Migrated pages from `/pages` to `/app` directory
- Updated import paths to use `@` alias
- Removed legacy page components

### Technical Details
- Framework: Next.js 13+ (App Router)
- Styling: Tailwind CSS
- State Management: Custom language context
- Image Handling: Next.js Image component
- Flag Display: Unicode emojis

### File Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── about/
│   │   ├── contact/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── NavBar.tsx
│   │   └── SimpleNavbar.tsx
│   ├── translations/
│   │   ├── en.json
│   │   └── it.json
│   └── context/
│       └── LanguageContext.tsx
```

### Dependencies
- Next.js
- React
- Tailwind CSS
- react-icons

### Security & Compliance
- GDPR compliance considerations
- User privacy protection measures

### Known Issues
- None currently tracked

### Upcoming Features
1. Complete full translation coverage
2. Implement additional language support
3. Comprehensive testing of localization features
4. Refine responsive design for various devices
