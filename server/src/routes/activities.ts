/**
 * Activities routes
 * Handles CRUD operations for user activities
 */

import { Router, Request, Response, NextFunction } from 'express';
import { CarbonCalculator } from '../services/carbonCalculator.js';
import { validateActivityInput } from '../utils/validators.js';
import { ApiError } from '../middleware/errorHandler.js';
import type { Activity, ApiResponse } from '../types.js';

const router = Router();

// In-memory storage (replace with database in production)
const activities: Map<string, Activity> = new Map();
let nextId = 1;

/**
 * GET /api/activities
 * Get all activities
 */
router.get('/', (_req: Request, res: Response): void => {
  const allActivities = Array.from(activities.values());

  res.json({
    success: true,
    data: allActivities,
    statusCode: 200,
  } as ApiResponse<Activity[]>);
});

/**
 * GET /api/activities/:id
 * Get activity by ID
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const activity = activities.get(id);

  if (!activity) {
    next(new ApiError(404, `Activity with ID ${id} not found`));
    return;
  }

  res.json({
    success: true,
    data: activity,
    statusCode: 200,
  } as ApiResponse<Activity>);
});

/**
 * POST /api/activities
 * Create new activity
 */
router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!validateActivityInput(req.body)) {
      throw new ApiError(400, 'Invalid activity data');
    }

    const id = String(nextId++);
    const activity: Activity = {
      id,
      ...req.body,
      date: new Date(req.body.date || new Date()),
    };

    // Calculate emissions for the activity
    const calculation = CarbonCalculator.calculateActivityEmissions(activity);
    activity.carbonEmissions = calculation.carbonEmissions;

    activities.set(id, activity);

    res.status(201).json({
      success: true,
      data: activity,
      statusCode: 201,
    } as ApiResponse<Activity>);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/activities/:id
 * Update activity
 */
router.put('/:id', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const activity = activities.get(id);

    if (!activity) {
      throw new ApiError(404, `Activity with ID ${id} not found`);
    }

    if (!validateActivityInput(req.body)) {
      throw new ApiError(400, 'Invalid activity data');
    }

    const updatedActivity: Activity = {
      id,
      ...req.body,
      date: new Date(req.body.date || activity.date),
    };

    const calculation = CarbonCalculator.calculateActivityEmissions(updatedActivity);
    updatedActivity.carbonEmissions = calculation.carbonEmissions;

    activities.set(id, updatedActivity);

    res.json({
      success: true,
      data: updatedActivity,
      statusCode: 200,
    } as ApiResponse<Activity>);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/activities/:id
 * Delete activity
 */
router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!activities.has(id)) {
    next(new ApiError(404, `Activity with ID ${id} not found`));
    return;
  }

  activities.delete(id);

  res.json({
    success: true,
    data: { message: 'Activity deleted successfully' },
    statusCode: 200,
  } as ApiResponse<{ message: string }>);
});

export default router;
export { activities };
