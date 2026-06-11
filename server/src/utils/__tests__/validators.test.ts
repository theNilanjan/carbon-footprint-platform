/**
 * Tests for validators
 */

import { validateActivityInput, validateDateRange, sanitizeString } from '../validators.js';

describe('Validators', () => {
  describe('validateActivityInput', () => {
    it('should validate correct activity input', () => {
      const input = {
        category: 'transportation',
        type: 'car',
        value: 100,
        unit: 'miles',
      };

      expect(validateActivityInput(input)).toBe(true);
    });

    it('should reject invalid category', () => {
      const input = {
        category: 'invalid',
        type: 'car',
        value: 100,
        unit: 'miles',
      };

      expect(validateActivityInput(input)).toBe(false);
    });

    it('should reject negative value', () => {
      const input = {
        category: 'transportation',
        type: 'car',
        value: -100,
        unit: 'miles',
      };

      expect(validateActivityInput(input)).toBe(false);
    });

    it('should reject missing fields', () => {
      const input = {
        category: 'transportation',
        value: 100,
      };

      expect(validateActivityInput(input)).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2026-12-31');

      const result = validateDateRange(start, end);
      expect(result.valid).toBe(true);
    });

    it('should reject inverted date range', () => {
      const start = new Date('2026-12-31');
      const end = new Date('2026-01-01');

      const result = validateDateRange(start, end);
      expect(result.valid).toBe(false);
    });

    it('should reject invalid date types', () => {
      const result = validateDateRange('not a date', 'also not a date');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should limit length to 500 characters', () => {
      const long = 'a'.repeat(600);
      expect(sanitizeString(long).length).toBe(500);
    });
  });
});
