/**
 * Main Express server setup
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import activitiesRouter from './routes/activities';
import footprintRouter from './routes/footprint';
import { errorHandler } from './middleware/errorHandler';
import type { ApiResponse } from './types';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// Allow requests from standard React (3000), Vite (5173), and fallback (3001) ports
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://your-app.vercel.app']
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'API is running' },
    statusCode: 200,
  } as ApiResponse<{ status: string }>);
});

// API routes
app.use('/api/activities', activitiesRouter);
app.use('/api/footprint', footprintRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    statusCode: 404,
  } as ApiResponse<null>);
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✓ Server is running on http://0.0.0.0:${PORT}`);
  console.log(`✓ CORS enabled for local frontend domains`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel serverless
export default app;
