# Server directory
Contains the Node.js/Express backend API for the Carbon Footprint Platform.

## Directory Structure

```
src/
├── index.ts           # Express server setup
├── types.ts          # TypeScript interfaces
├── routes/           # API endpoints
│   ├── activities.ts # Activity CRUD endpoints
│   └── footprint.ts  # Carbon calculation endpoints
├── services/         # Business logic
│   └── carbonCalculator.ts  # Carbon emission calculations
├── middleware/       # Express middleware
│   └── errorHandler.ts      # Error handling
└── utils/           # Utility functions
    └── validators.ts # Input validation
```

## API Endpoints

- `GET /health` - Health check
- `GET/POST /api/activities` - Activity management
- `GET /api/footprint/total` - Total emissions
- `GET /api/footprint/breakdown` - Emissions by category
- `GET /api/footprint/monthly` - Monthly trends
- `GET /api/footprint/recommendations` - AI recommendations
