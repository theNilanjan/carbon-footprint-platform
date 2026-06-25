# Carbon Footprint Awareness Platform

An intelligent, AI-powered platform designed to help individuals understand, track, and reduce their carbon footprint through personalized insights and actionable recommendations.

## Overview

This platform addresses the challenge of helping users make environmentally conscious decisions by providing:

- **Comprehensive Carbon Tracking**: Calculate footprint across multiple lifestyle categories (energy, transportation, diet, shopping)
- **Personalized Insights**: AI-powered analysis of user behavior with tailored recommendations
- **Action-Based Improvements**: Simple, trackable actions to reduce environmental impact
- **Progress Monitoring**: Visual tracking of carbon footprint reduction over time

## Challenge Vertical

**Chosen Vertical**: Carbon Footprint Awareness Assistant

This solution is built as an intelligent assistant that helps users:
1. Calculate their personal carbon footprint
2. Understand which activities have the highest environmental impact
3. Receive AI-generated personalized recommendations
4. Track progress toward sustainability goals
```

## Key Features

### 1. Carbon Footprint Calculator
- **Transportation**: Track miles driven, flights taken, public transport usage
- **Energy**: Monitor electricity and gas consumption
- **Diet**: Calculate emissions from food choices
- **Shopping**: Estimate carbon from purchases
- Real-time calculation with accurate emission factors


### 3. User Dashboard
- Visual carbon footprint breakdown (pie charts)
- Historical tracking and trends
- Comparison to user baseline
- Achievement badges and milestones

### 4. Action Plans
- Suggested reduction strategies
- Progress tracking for each action
- Impact estimation for completed actions
- Community benchmarking

## How It Works

### User Journey

1. **Onboarding**: User creates account and provides baseline lifestyle information
2. **Data Entry**: User logs activities across different categories
3. **Analysis**: System calculates carbon emissions using standard conversion factors
4. **AI Insights**: Claude/OpenAI analyzes patterns and generates personalized recommendations
5. **Action Planning**: User selects improvement actions and tracks progress
6. **Feedback Loop**: Regular updates on progress and new recommendations

### Carbon Calculation Logic

The platform uses scientifically-backed emission factors:

```
Transportation:
- Car: 0.21 kg CO₂ per mile
- Flight: 0.90 kg CO₂ per mile (per person)
- Bus: 0.089 kg CO₂ per mile

Energy:
- Electricity: 0.92 lbs CO₂ per kWh (US average)
- Natural Gas: 5.3 kg CO₂ per 100 cubic feet

Diet:
- Beef: 27 kg CO₂ per kg
- Chicken: 6.9 kg CO₂ per kg
- Vegetables: 2 kg CO₂ per kg

Shopping:
- Average: 0.1 kg CO₂ per dollar spent
```

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- Git installed
- API key for Claude/OpenAI (optional, for AI features)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/carbon-footprint-platform.git
   cd carbon-footprint-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Server
   cd server
   cp .env.example .env
   # Edit .env and add your AI API key if desired
   
   # Client
   cd ../client
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

5. **Run tests**
   ```bash
   npm test
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Assumptions & Design Decisions

### Key Assumptions

1. **User Authentication**: Not implemented in MVP; can be added with Auth0/Firebase
2. **Database**: API ready for MongoDB/PostgreSQL integration
3. **AI Integration**: Optional feature; works with or without external AI API
4. **Emission Factors**: Based on US environmental data; adaptable by region
5. **Single User Focus**: No multi-user household logic in MVP

### Design Decisions

1. **Monorepo Structure**: Easier to manage related frontend and backend code
2. **TypeScript**: Ensures type safety and better developer experience
3. **REST API**: Simple, stateless architecture for scalability
4. **Component-Based React**: Reusable, testable UI components
5. **Standard Emission Factors**: Easy to understand and reproducible calculations

## Code Quality & Best Practices

### Security
- Input validation on all endpoints
- CORS properly configured
- Environment variables for sensitive data
- SQL injection prevention (if using database)
- XSS protection with React's built-in escaping

### Efficiency
- Optimized API calls with request batching
- Component memoization to prevent unnecessary re-renders
- Lazy loading for carbon data and user lists
- Efficient state management with React hooks
- Server-side caching for calculation results

### Testing
- Unit tests for all utility functions (>80% coverage)
- Component tests for React components
- Integration tests for API endpoints
- E2E test scenarios for critical user paths

### Accessibility (WCAG 2.1 AA)
- Semantic HTML throughout
- ARIA labels for form inputs and regions
- Keyboard navigation support
- Color contrast ratios ≥4.5:1
- Focus management for interactive elements
- Alt text for all images

```

## Testing Coverage

### Backend Tests
- Carbon calculation accuracy (±2% tolerance)
- API endpoint validation
- Error handling
- Input sanitization

### Frontend Tests
- Component rendering
- User interactions
- Form validation
- API integration
- Accessibility compliance

## Performance Metrics

- **Page Load**: <2s (with optimization)
- **API Response**: <200ms for calculations
- **Bundle Size**: <100KB (gzipped client)
- **Lighthouse Score**: >90 for accessibility

## Deployment Ready

The project is structured for easy deployment:

1. **Vercel**: Frontend deployment ready
2. **Heroku/Railway**: Backend deployment configured
3. **Docker**: Can be containerized (Dockerfile included)
4. **Environment Management**: .env templates for different stages

## Future Enhancements

- User authentication and profiles
- Community leaderboards
- Mobile app version
- Integration with smart home devices
- Real-time emissions data from IoT sensors
- Advanced AI models for better predictions
- Blockchain for carbon credit tracking

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in .env files
SERVER_PORT=5001
```

**Dependencies installation fails**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**AI features not working**
```bash
# Ensure API key is set in .env
OPENAI_API_KEY=your_key_here
```

## Contact & Support

For questions about this project, please refer to the GitHub Issues section.

---

## 👨‍💻 Developer

**Developed by**: **Nilanjan Ghosh**

This Carbon Footprint Awareness Platform was designed and built with a focus on sustainability, accessibility, and user experience.

---


---


