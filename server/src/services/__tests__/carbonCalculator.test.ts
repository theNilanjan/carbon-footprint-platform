/**
 * Carbon calculator tests
 */

import { CarbonCalculator } from '../carbonCalculator.js';
import type { Activity } from '../../types.js';

describe('CarbonCalculator', () => {
  describe('calculateActivityEmissions', () => {
    it('should calculate car emissions correctly', () => {
      const activity: Activity = {
        category: 'transportation',
        type: 'car',
        value: 100,
        unit: 'miles',
        date: new Date(),
      };

      const result = CarbonCalculator.calculateActivityEmissions(activity);

      expect(result.carbonEmissions).toBe(21); // 100 miles * 0.21 kg CO2/mile
      expect(result.emissionFactor).toBe(0.21);
    });

    it('should calculate electricity emissions correctly', () => {
      const activity: Activity = {
        category: 'energy',
        type: 'electricity',
        value: 100,
        unit: 'kWh',
        date: new Date(),
      };

      const result = CarbonCalculator.calculateActivityEmissions(activity);

      const expected = (100 * 0.92) / 2.20462; // Convert lbs to kg
      expect(result.carbonEmissions).toBeCloseTo(expected, 1);
    });

    it('should calculate diet emissions correctly', () => {
      const activity: Activity = {
        category: 'diet',
        type: 'beef',
        value: 1,
        unit: 'kg',
        date: new Date(),
      };

      const result = CarbonCalculator.calculateActivityEmissions(activity);

      expect(result.carbonEmissions).toBe(27);
    });

    it('should calculate shopping emissions correctly', () => {
      const activity: Activity = {
        category: 'shopping',
        type: 'groceries',
        value: 100,
        unit: 'dollars',
        date: new Date(),
      };

      const result = CarbonCalculator.calculateActivityEmissions(activity);

      expect(result.carbonEmissions).toBe(10); // 100 * 0.1
    });
  });

  describe('getEmissionFactor', () => {
    it('should return correct factor for known activity type', () => {
      const factor = CarbonCalculator.getEmissionFactor('transportation', 'car');
      expect(factor).toBe(0.21);
    });

    it('should return 0 for unknown category', () => {
      const factor = CarbonCalculator.getEmissionFactor('unknown', 'car');
      expect(factor).toBe(0);
    });

    it('should return 0 for unknown type', () => {
      const factor = CarbonCalculator.getEmissionFactor('transportation', 'unknown');
      expect(factor).toBe(0);
    });
  });

  describe('calculateTotalEmissions', () => {
    it('should sum emissions from multiple activities', () => {
      const activities: Activity[] = [
        {
          category: 'transportation',
          type: 'car',
          value: 100,
          unit: 'miles',
          date: new Date(),
        },
        {
          category: 'diet',
          type: 'beef',
          value: 1,
          unit: 'kg',
          date: new Date(),
        },
      ];

      const total = CarbonCalculator.calculateTotalEmissions(activities);

      expect(total).toBe(48); // 21 + 27
    });
  });

  describe('groupByCategory', () => {
    it('should group emissions correctly', () => {
      const activities: Activity[] = [
        {
          category: 'transportation',
          type: 'car',
          value: 50,
          unit: 'miles',
          date: new Date(),
        },
        {
          category: 'transportation',
          type: 'bus',
          value: 100,
          unit: 'miles',
          date: new Date(),
        },
        {
          category: 'diet',
          type: 'beef',
          value: 1,
          unit: 'kg',
          date: new Date(),
        },
      ];

      const grouped = CarbonCalculator.groupByCategory(activities);

      expect(grouped.transportation).toBeCloseTo(10.5 + 8.9, 1); // (50*0.21) + (100*0.089)
      expect(grouped.diet).toBe(27);
      expect(grouped.energy).toBe(0);
      expect(grouped.shopping).toBe(0);
    });
  });

  describe('getRecommendations', () => {
    it('should provide recommendations for high transportation emissions', () => {
      const emissions = { transportation: 150, energy: 10, diet: 10, shopping: 10 };
      const recommendations = CarbonCalculator.getRecommendations(emissions);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].category).toBe('transportation');
    });

    it('should prioritize recommendations by potential savings', () => {
      const emissions = { transportation: 50, energy: 100, diet: 100, shopping: 100 };
      const recommendations = CarbonCalculator.getRecommendations(emissions);

      const savings = recommendations.map((r) => r.potentialSavings);
      for (let i = 0; i < savings.length - 1; i++) {
        expect(savings[i]).toBeGreaterThanOrEqual(savings[i + 1]);
      }
    });
  });
});
