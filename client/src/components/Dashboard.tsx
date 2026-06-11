/**
 * Dashboard Component showing footprint summary
 */

import { formatEmissions, getCategoryColor, getCategoryIcon } from '../utils/helpers';
import type { FootprintData } from '../types';

interface DashboardProps {
  data: FootprintData | null;
  loading: boolean;
  error: string | null;
}

export function Dashboard({ data, loading, error }: DashboardProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Failed to load dashboard: {error}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const categories = ['transportation', 'energy', 'diet', 'shopping'] as const;

  return (
    <div className="space-y-6">
      {/* Total Emissions Card */}
      <div className="bg-gradient-to-br from-eco-600 to-eco-700 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-lg font-medium opacity-90 mb-2">Total Carbon Footprint</h2>
        <div className="text-5xl font-bold mb-2">{formatEmissions(data.total)}</div>
        <p className="text-eco-100">This month's total emissions</p>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category} className={`${getCategoryColor(category)} bg-opacity-10 rounded-lg p-6 border-l-4 ${getCategoryColor(category).replace('bg-', 'border-')}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
              <span className="text-3xl">{getCategoryIcon(category)}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatEmissions(data.byCategory[category])}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${getCategoryColor(category)} h-2 rounded-full transition-all`}
                style={{
                  width: `${data.percentage ? data.percentage[category] : 0}%`,
                }}
                role="progressbar"
                aria-valuenow={data.percentage ? data.percentage[category] : 0}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {data.percentage ? data.percentage[category] : 0}% of total
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
