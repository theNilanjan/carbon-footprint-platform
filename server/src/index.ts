/**
 * Main Express server setup
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import activitiesRouter from './routes/activities.js';
import footprintRouter from './routes/footprint.js';
import { errorHandler } from './middleware/errorHandler.js';
import type { ApiResponse } from './types.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Security middleware
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));

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
const server = app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for: ${CORS_ORIGIN}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
