# Client directory
Contains the React frontend for the Carbon Footprint Platform.

## Directory Structure

```
src/
├── components/      # React components
│   ├── ActivityForm.tsx
│   ├── Dashboard.tsx
│   ├── ActivitiesList.tsx
│   └── Recommendations.tsx
├── pages/          # Page components
├── services/       # API communication
│   └── api.ts
├── hooks/          # Custom React hooks
│   └── useAsync.ts
├── types/          # TypeScript definitions
│   └── index.ts
├── utils/          # Helper functions
│   └── helpers.ts
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Features

- **Activity Logging**: Log transportation, energy, diet, and shopping activities
- **Carbon Calculation**: Real-time emission calculations
- **Dashboard**: Visual breakdown of carbon footprint
- **Recommendations**: AI-powered personalized tips
- **Activity History**: View and manage all logged activities
- **Accessible UI**: WCAG 2.1 AA compliant design
