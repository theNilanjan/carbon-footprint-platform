/**
 * Error handling middleware
 */

import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response<ApiResponse<null>> {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    statusCode: 500,
  });
}
