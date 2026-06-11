/**
 * Utility functions for the frontend
 */

export function formatEmissions(value: number): string {
  if (value < 1) {
    return `${(value * 1000).toFixed(0)} g`;
  }
  return `${value.toFixed(2)} kg`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    transportation: 'bg-blue-500',
    energy: 'bg-yellow-500',
    diet: 'bg-orange-500',
    shopping: 'bg-red-500',
  };
  return colors[category] || 'bg-gray-500';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    transportation: '🚗',
    energy: '⚡',
    diet: '🍔',
    shopping: '🛍️',
  };
  return icons[category] || '📊';
}

export function getRecommendationIcon(category: string): string {
  const icons: Record<string, string> = {
    transportation: '🚌',
    energy: '💡',
    diet: '🥗',
    shopping: '♻️',
  };
  return icons[category] || '💚';
}
