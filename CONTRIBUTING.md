# Contributing to Carbon Footprint Platform

## Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint and Prettier rules
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Running the Project Locally

### Prerequisites
- Node.js 18+ and npm 9+
- Git installed
- A code editor (VS Code recommended)

### Setup
```bash
npm run install-all
```

### Development
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Testing
```bash
npm test
```

### Building
```bash
npm run build
```

## Code Quality

All code must pass:
- ✅ ESLint checks
- ✅ TypeScript compilation
- ✅ Unit tests (>80% coverage)
- ✅ Type checking

Before pushing:
```bash
npm run lint
npm run type-check
npm test
```

## Commit Messages

Use clear, descriptive commit messages:
```
feat: Add activity deletion feature
fix: Correct carbon calculation for flights
docs: Update API documentation
test: Add tests for carbon calculator
```

## Pull Requests

1. Create a feature branch
2. Make your changes
3. Run all checks: `npm run lint && npm test`
4. Create a clear PR description
5. Request review

## Security

- Never commit `.env` files
- Always validate user input
- Use HTTPS for API calls
- Keep dependencies updated
- Report security issues privately

## Questions?

Check the README.md for architecture and design decisions.
