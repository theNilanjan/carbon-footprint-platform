/**
 * API service for communicating with backend
 */

import axios, { AxiosInstance } from 'axios';
import type { Activity, ApiResponse, Recommendation, FootprintData } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Use relative URL to leverage Vite proxy in development
    // In production, Vercel will handle API routing
    const baseURL = '';
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    const response = await this.client.get<ApiResponse<Activity[]>>('/api/activities');
    return response.data.data || [];
  }

  async getActivity(id: string): Promise<Activity> {
    const response = await this.client.get<ApiResponse<Activity>>(
      `/api/activities/${id}`
    );
    if (!response.data.data) throw new Error('Activity not found');
    return response.data.data;
  }

  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const response = await this.client.post<ApiResponse<Activity>>(
      '/api/activities',
      activity
    );
    if (!response.data.data) throw new Error('Failed to create activity');
    return response.data.data;
  }

  async updateActivity(id: string, activity: Partial<Activity>): Promise<Activity> {
    const response = await this.client.put<ApiResponse<Activity>>(
      `/api/activities/${id}`,
      activity
    );
    if (!response.data.data) throw new Error('Failed to update activity');
    return response.data.data;
  }

  async deleteActivity(id: string): Promise<void> {
    await this.client.delete(`/api/activities/${id}`);
  }

  // Footprint
  async getFootprintTotal(): Promise<{
    totalEmissions: number;
    activitiesCount: number;
    period: { startDate: string; endDate: string };
  }> {
    const response = await this.client.get(
      '/api/footprint/total'
    );
    return response.data.data;
  }

  async getFootprintBreakdown(): Promise<FootprintData> {
    const response = await this.client.get<ApiResponse<FootprintData>>(
      '/api/footprint/breakdown'
    );
    return response.data.data || { total: 0, byCategory: { transportation: 0, energy: 0, diet: 0, shopping: 0 } };
  }

  async getMonthlyTrend(): Promise<Array<{ month: string; total: number }>> {
    const response = await this.client.get(
      '/api/footprint/monthly'
    );
    return response.data.data || [];
  }

  async getRecommendations(): Promise<Recommendation[]> {
    const response = await this.client.get<ApiResponse<{ recommendations: Recommendation[] }>>(
      '/api/footprint/recommendations'
    );
    return response.data.data?.recommendations || [];
  }

  async calculateFootprint(activityIds: string[]): Promise<{ totalEmissions: number; count: number }> {
    const response = await this.client.post(
      '/api/footprint/calculate',
      { activityIds }
    );
    return response.data.data;
  }

  async getHealth(): Promise<{ status: string }> {
    const response = await this.client.get('/health');
    return response.data.data;
  }
}

export const apiService = new ApiService();
