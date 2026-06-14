/**
 * Footprint routes
 * Handles carbon footprint calculations and analytics
 */

import { Router, Request, Response, NextFunction } from 'express';
import { CarbonCalculator } from '../services/carbonCalculator';
import { ApiError } from '../middleware/errorHandler';
import { activities } from './activities';
import type { ApiResponse } from '../types';

const router = Router();

/**
 * GET /api/footprint/total
 * Get total carbon footprint
 */
router.get('/total', (_req: Request, res: Response): void => {
  const allActivities = Array.from(activities.values());
  const totalEmissions = CarbonCalculator.calculateTotalEmissions(allActivities);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  res.json({
    success: true,
    data: {
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      activitiesCount: allActivities.length,
      period: {
        startDate: startOfMonth,
        endDate: now,
      },
    },
    statusCode: 200,
  } as ApiResponse<{
    totalEmissions: number;
    activitiesCount: number;
    period: { startDate: Date; endDate: Date };
  }>);
});

/**
 * GET /api/footprint/breakdown
 * Get emissions breakdown by category
 */
router.get('/breakdown', (_req: Request, res: Response): void => {
  const allActivities = Array.from(activities.values());
  const byCategory = CarbonCalculator.groupByCategory(allActivities);
  const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);

  // Fallback to 0 if category hasn't been logged yet to prevent NaN issues
  const transportation = byCategory.transportation || 0;
  const energy = byCategory.energy || 0;
  const diet = byCategory.diet || 0;
  const shopping = byCategory.shopping || 0;

  const breakdown = {
    total: Math.round(total * 100) / 100,
    byCategory: {
      transportation: Math.round(transportation * 100) / 100,
      energy: Math.round(energy * 100) / 100,
      diet: Math.round(diet * 100) / 100,
      shopping: Math.round(shopping * 100) / 100,
    },
    percentage: {
      transportation: total > 0 ? Math.round((transportation / total) * 100) : 0,
      energy: total > 0 ? Math.round((energy / total) * 100) : 0,
      diet: total > 0 ? Math.round((diet / total) * 100) : 0,
      shopping: total > 0 ? Math.round((shopping / total) * 100) : 0,
    },
  };

  res.json({
    success: true,
    data: breakdown,
    statusCode: 200,
  } as ApiResponse<typeof breakdown>);
});

/**
 * GET /api/footprint/monthly
 * Get monthly emissions trend
 */
router.get('/monthly', (_req: Request, res: Response): void => {
  const allActivities = Array.from(activities.values());
  const monthlyTrend = CarbonCalculator.calculateMonthlyEmissions(allActivities);

  res.json({
    success: true,
    data: monthlyTrend,
    statusCode: 200,
  } as ApiResponse<Array<{ month: string; total: number }>>);
});

/**
 * GET /api/footprint/recommendations
 * Get AI-powered recommendations
 */
router.get('/recommendations', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const allActivities = Array.from(activities.values());

    if (allActivities.length === 0) {
      throw new ApiError(400, 'No activities recorded yet. Please add some activities first.');
    }

    const byCategory = CarbonCalculator.groupByCategory(allActivities);
    const recommendations = CarbonCalculator.getRecommendations(byCategory);

    res.json({
      success: true,
      data: {
        recommendations,
        generatedAt: new Date(),
      },
      statusCode: 200,
    } as ApiResponse<{
      recommendations: Array<{
        category: string;
        recommendation: string;
        potentialSavings: number;
      }>;
      generatedAt: Date;
    }>);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/footprint/calculate
 * Calculate emissions for specific activities
 */
router.post('/calculate', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { activityIds } = req.body;

    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      throw new ApiError(400, 'Please provide an array of activity IDs');
    }

    const selectedActivities = activityIds
      .map((id: string) => activities.get(id))
      .filter((activity) => activity !== undefined);

    if (selectedActivities.length === 0) {
      throw new ApiError(404, 'No valid activities found for the given IDs');
    }

    const totalEmissions = CarbonCalculator.calculateTotalEmissions(selectedActivities);

    res.json({
      success: true,
      data: {
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        count: selectedActivities.length,
      },
      statusCode: 200,
    } as ApiResponse<{ totalEmissions: number; count: number }>);
  } catch (err) {
    next(err);
  }
});

export default router;
