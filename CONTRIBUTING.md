# Contributing to CercoOffro - Student Rental Aggregator

## 🎯 Overview

Thank you for considering contributing to the CercoOffro project! This document provides guidelines and instructions for contributing to the open-source core of our platform.

## 🌟 Core Values

1. **Community First**: Focus on features that benefit the student community
2. **Data Privacy**: Never expose or compromise user data
3. **Code Quality**: Maintain high standards through tests and documentation
4. **Accessibility**: Ensure features are accessible to all users

## 🔍 What's Open Source?

### Open Source Components
- Basic search functionality
- Crowdsourced voting system
- Localization framework
- Core listing aggregation
- Development tools and utilities

### Closed Source Components
- AI-powered recommendations
- Premium filters
- Subscription management
- Production data handling

## 🚀 Getting Started

1. **Setup Development Environment**
```bash
# Clone the repository
git clone https://github.com/your-username/student-rental-aggregator.git

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt

# Generate mock data
python app/core/mock_data.py

# Run tests
pytest
```

2. **Frontend Setup**
```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

3. **Environment Variables**
Ensure the following environment variables are set for local development:

- `MONGODB_URI`: Connection string for MongoDB
- `S3_BUCKET`: S3 bucket name for storage

## 🔧 Development Workflow

1. **Create a New Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write code following our style guide
- Add tests for new functionality
- Update documentation as needed

3. **Test Your Changes**
```bash
# Run unit tests
pytest

# Run linting
flake8
black .
isort .
```

4. **Submit Pull Request**
- Create a descriptive PR title
- Fill out the PR template
- Link related issues

## 📝 Code Style Guidelines

1. **Python Code**
- Follow PEP 8
- Use type hints
- Write docstrings for functions and classes
- Maximum line length: 88 characters (Black formatter)

2. **JavaScript/TypeScript**
- Follow ESLint configuration
- Use functional components for React
- Write JSDoc comments for functions

## 🧪 Testing Guidelines

1. **Required Tests**
- Unit tests for new functions
- Integration tests for API endpoints
- UI component tests
- Localization tests

2. **Test Data**
- Use mock data generator
- Never include production data
- Create minimal test cases

## 📚 Documentation Requirements

1. **Code Documentation**
- Clear function/class docstrings
- Inline comments for complex logic
- Type hints and return types

2. **API Documentation**
- OpenAPI/Swagger specs
- Request/response examples
- Error scenarios

3. **Feature Documentation**
- User-facing documentation
- Technical implementation details
- Configuration requirements

## 🐛 Bug Reports

1. **Required Information**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details

2. **Template**
```markdown
### Description
[Describe the bug]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [And so on...]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- OS: [e.g., Ubuntu 20.04]
- Browser: [e.g., Chrome 90]
- Version: [e.g., 1.0.0]
```

## 🎯 Feature Requests

1. **Proposal Format**
```markdown
### Feature Description
[Detailed description]

### Use Case
[Who needs this and why]

### Proposed Implementation
[Technical approach]

### Alternatives Considered
[Other approaches]
```

2. **Evaluation Criteria**
- Alignment with project goals
- Impact on existing features
- Implementation complexity
- Maintenance requirements

## 🚫 Out of Scope

1. **Not Accepted**
- Production database access
- Premium feature implementations
- Personal user data handling
- Payment processing logic

2. **Alternative Approaches**
- Use mock data generator
- Focus on core functionality
- Implement feature flags
- Use public APIs

## 📊 Review Process

1. **Pull Request Reviews**
- Code quality check
- Test coverage verification
- Documentation review
- Security assessment

2. **Merge Requirements**
- Passing CI/CD pipeline
- Approved code review
- Updated documentation
- No merge conflicts

## 🔐 Security Guidelines

1. **Data Handling**
- Use mock data for development
- Never commit sensitive information
- Follow security best practices

2. **Authentication**
- Use test accounts
- Never handle real credentials
- Implement proper validation

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
