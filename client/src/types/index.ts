/**
 * Type definitions for the React client
 */

export type ActivityCategory = 'transportation' | 'energy' | 'diet' | 'shopping';

export interface Activity {
  id?: string;
  category: ActivityCategory;
  type: string;
  value: number;
  unit: string;
  date: string;
  description?: string;
  carbonEmissions?: number;
}

export interface FootprintData {
  total: number;
  byCategory: {
    transportation: number;
    energy: number;
    diet: number;
    shopping: number;
  };
  percentage?: {
    transportation: number;
    energy: number;
    diet: number;
    shopping: number;
  };
}

export interface Recommendation {
  category: string;
  recommendation: string;
  potentialSavings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
