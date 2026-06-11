/**
 * Input validation utilities
 */

export function validateActivityInput(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  const validCategories = ['transportation', 'energy', 'diet', 'shopping'];

  return (
    typeof obj.category === 'string' &&
    validCategories.includes(obj.category) &&
    typeof obj.type === 'string' &&
    obj.type.trim().length > 0 &&
    typeof obj.value === 'number' &&
    obj.value > 0 &&
    typeof obj.unit === 'string' &&
    obj.unit.trim().length > 0
  );
}

export function validateDateRange(
  startDate: unknown,
  endDate: unknown
): { valid: boolean; error?: string } {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return { valid: false, error: 'Invalid date format' };
  }

  if (startDate > endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  return { valid: true };
}

export function sanitizeString(input: string): string {
  return input.trim().slice(0, 500);
}

export function validateNumberRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}
