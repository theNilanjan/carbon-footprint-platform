/**
 * Type definitions for Carbon Footprint Platform
 */

export type ActivityCategory = 'transportation' | 'energy' | 'diet' | 'shopping';

export interface Activity {
  id?: string;
  category: ActivityCategory;
  type: string;
  value: number;
  unit: string;
  date: Date;
  description?: string;
  carbonEmissions?: number;
}

export interface FootprintCalculation {
  activityId: string;
  category: ActivityCategory;
  value: number;
  unit: string;
  carbonEmissions: number;
  emissionFactor: number;
}

export interface FootprintSummary {
  totalEmissions: number;
  byCategory: {
    transportation: number;
    energy: number;
    diet: number;
    shopping: number;
  };
  period: {
    startDate: Date;
    endDate: Date;
  };
  activitiesCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface MonthlyTrend {
  month: string;
  emissions: number;
  category: ActivityCategory;
}

export interface Recommendation {
  category: string;
  recommendation: string;
  potentialSavings: number;
}
