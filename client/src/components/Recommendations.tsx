/**
 * Recommendations Component
 */

import { getRecommendationIcon, formatEmissions } from '../utils/helpers';
import type { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[] | null;
  loading: boolean;
  error: string | null;
}

export function Recommendations({ recommendations, loading, error }: RecommendationsProps) {
  if (error) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-800 font-medium">💡 No recommendations yet</p>
        <p className="text-blue-700 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>No recommendations available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-eco-700 mb-6">Personalized Recommendations</h2>
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-eco-500 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">
                {getRecommendationIcon(rec.category)}
              </span>
              <div>
                <h3 className="font-semibold capitalize text-gray-900">{rec.category}</h3>
                <p className="text-gray-700 mt-2 leading-relaxed">{rec.recommendation}</p>
              </div>
            </div>
            <span
              className="text-sm font-bold text-eco-600 bg-eco-50 px-3 py-1 rounded-full whitespace-nowrap"
              aria-label={`Potential savings: ${formatEmissions(rec.potentialSavings)}`}
            >
              Save {formatEmissions(rec.potentialSavings)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
