import { Car, Zap, Utensils, ShoppingBag, Leaf, Bus, Lightbulb, Salad, Recycle, Plane, Bike, Home } from 'lucide-react';
import React from 'react';

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
    energy: 'bg-amber-500',
    diet: 'bg-emerald-500',
    shopping: 'bg-purple-500',
  };
  return colors[category] || 'bg-slate-500';
}

export function getCategoryLightColor(category: string): string {
  const colors: Record<string, string> = {
    transportation: 'bg-blue-50 text-blue-600 border-blue-200',
    energy: 'bg-amber-50 text-amber-600 border-amber-200',
    diet: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    shopping: 'bg-purple-50 text-purple-600 border-purple-200',
  };
  return colors[category] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function getCategoryIcon(category: string, size = 24): React.ReactNode {
  const props = { size, className: "shrink-0" };
  switch (category.toLowerCase()) {
    case 'transportation': return <Car {...props} />;
    case 'energy': return <Zap {...props} />;
    case 'diet': return <Utensils {...props} />;
    case 'shopping': return <ShoppingBag {...props} />;
    default: return <Leaf {...props} />;
  }
}

export function getRecommendationIcon(category: string, size = 24): React.ReactNode {
  const props = { size, className: "shrink-0" };
  switch (category.toLowerCase()) {
    case 'transportation': return <Bus {...props} />;
    case 'energy': return <Lightbulb {...props} />;
    case 'diet': return <Salad {...props} />;
    case 'shopping': return <Recycle {...props} />;
    default: return <Leaf {...props} />;
  }
}
