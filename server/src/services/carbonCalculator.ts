/**
 * Carbon emissions calculation service
 * Uses standard EPA/IPCC emission factors
 */

import type { Activity, FootprintCalculation } from '../types.js';

// Standardized emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  transportation: {
    car: { factor: 0.21, unit: 'kg CO2/mile' },
    flight: { factor: 0.90, unit: 'kg CO2/mile' },
    bus: { factor: 0.089, unit: 'kg CO2/mile' },
    train: { factor: 0.041, unit: 'kg CO2/mile' },
    motorcycle: { factor: 0.135, unit: 'kg CO2/mile' },
  },
  energy: {
    electricity: { factor: 0.92, unit: 'lbs CO2/kWh' },
    naturalGas: { factor: 5.3, unit: 'kg CO2/100 cubic feet' },
    heating: { factor: 10.15, unit: 'kg CO2/gallon' },
  },
  diet: {
    beef: { factor: 27, unit: 'kg CO2/kg' },
    pork: { factor: 12, unit: 'kg CO2/kg' },
    chicken: { factor: 6.9, unit: 'kg CO2/kg' },
    fish: { factor: 12.96, unit: 'kg CO2/kg' },
    dairy: { factor: 3.2, unit: 'kg CO2/kg' },
    vegetables: { factor: 2, unit: 'kg CO2/kg' },
    grains: { factor: 1.5, unit: 'kg CO2/kg' },
    vegan: { factor: 1.2, unit: 'kg CO2/meal' },
  },
  shopping: {
    clothing: { factor: 5.5, unit: 'kg CO2/item' },
    electronics: { factor: 20, unit: 'kg CO2/item' },
    furniture: { factor: 15, unit: 'kg CO2/item' },
    groceries: { factor: 0.1, unit: 'kg CO2/dollar' },
    general: { factor: 0.1, unit: 'kg CO2/dollar' },
  },
};

export class CarbonCalculator {
  /**
   * Calculate carbon emissions for a single activity
   */
  static calculateActivityEmissions(activity: Activity): FootprintCalculation {
    const factor = this.getEmissionFactor(activity.category, activity.type);

    let emissions: number;

    // Convert to standard unit (kg CO2)
    if (activity.category === 'energy' && activity.type === 'electricity') {
      // Convert lbs to kg
      emissions = (activity.value * factor) / 2.20462;
    } else if (activity.category === 'energy' && activity.type === 'naturalGas') {
      // Already in kg
      emissions = activity.value * factor;
    } else if (activity.category === 'diet' && activity.type === 'vegan') {
      // Per meal
      emissions = activity.value * factor;
    } else if (activity.category === 'shopping') {
      // Per dollar spent
      emissions = activity.value * factor;
    } else {
      // Transportation and other diet items
      emissions = activity.value * factor;
    }

    return {
      activityId: activity.id || 'unknown',
      category: activity.category,
      value: activity.value,
      unit: activity.unit,
      carbonEmissions: Math.round(emissions * 100) / 100, // Round to 2 decimals
      emissionFactor: factor,
    };
  }

  /**
   * Get emission factor for activity type
   */
  static getEmissionFactor(category: string, type: string): number {
    const factors = EMISSION_FACTORS[category as keyof typeof EMISSION_FACTORS];
    if (!factors) {
      return 0;
    }

    const factor = factors[type as keyof typeof factors];
    return factor ? factor.factor : 0;
  }

  /**
   * Calculate total emissions for multiple activities
   */
  static calculateTotalEmissions(activities: Activity[]): number {
    return activities.reduce((total, activity) => {
      const calculation = this.calculateActivityEmissions(activity);
      return total + calculation.carbonEmissions;
    }, 0);
  }

  /**
   * Group emissions by category
   */
  static groupByCategory(activities: Activity[]): Record<string, number> {
    const grouped: Record<string, number> = {
      transportation: 0,
      energy: 0,
      diet: 0,
      shopping: 0,
    };

    activities.forEach((activity) => {
      const calculation = this.calculateActivityEmissions(activity);
      grouped[activity.category] += calculation.carbonEmissions;
    });

    return grouped;
  }

  /**
   * Calculate monthly trends
   */
  static calculateMonthlyEmissions(
    activities: Activity[]
  ): Array<{ month: string; total: number }> {
    const monthlyData: Record<string, number> = {};

    activities.forEach((activity) => {
      const date = new Date(activity.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const calculation = this.calculateActivityEmissions(activity);

      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + calculation.carbonEmissions;
    });

    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Get recommendations based on emissions
   */
  static getRecommendations(
    emissions: Record<string, number>
  ): Array<{ category: string; recommendation: string; potentialSavings: number }> {
    const recommendations = [];

    if (emissions.transportation > 100) {
      recommendations.push({
        category: 'transportation',
        recommendation: 'Consider carpooling or using public transit to reduce vehicle emissions',
        potentialSavings: Math.round(emissions.transportation * 0.3),
      });
    }

    if (emissions.energy > 50) {
      recommendations.push({
        category: 'energy',
        recommendation: 'Switch to renewable energy sources or improve home insulation',
        potentialSavings: Math.round(emissions.energy * 0.4),
      });
    }

    if (emissions.diet > 30) {
      recommendations.push({
        category: 'diet',
        recommendation: 'Reduce meat consumption, especially beef, or explore plant-based alternatives',
        potentialSavings: Math.round(emissions.diet * 0.5),
      });
    }

    if (emissions.shopping > 20) {
      recommendations.push({
        category: 'shopping',
        recommendation: 'Buy secondhand, choose local brands, and reduce overall consumption',
        potentialSavings: Math.round(emissions.shopping * 0.25),
      });
    }

    return recommendations.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }
}
