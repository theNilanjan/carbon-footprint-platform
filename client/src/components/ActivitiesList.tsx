/**
 * Activities List Component
 */

import { formatEmissions, formatDate, getCategoryIcon } from '../utils/helpers';
import type { Activity } from '../types';

interface ActivitiesListProps {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  onDelete?: (id: string) => Promise<void>;
}

export function ActivitiesList({ activities, loading, error, onDelete }: ActivitiesListProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Failed to load activities: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        <p className="text-lg">No activities logged yet</p>
        <p className="text-sm mt-2">Start logging activities to track your carbon footprint</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-eco-700 mb-4">Recent Activities</h2>
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {activities.slice().reverse().map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl" aria-hidden="true">
                {getCategoryIcon(activity.category)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {activity.type}
                </h3>
                <div className="text-sm text-gray-500 flex gap-4 mt-1">
                  <span>
                    {activity.value} {activity.unit}
                  </span>
                  <span>{formatDate(activity.date)}</span>
                </div>
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-eco-600">
                  {formatEmissions(activity.carbonEmissions || 0)}
                </div>
                <div className="text-xs text-gray-500">CO₂</div>
              </div>
              {onDelete && (
                <button
                  onClick={() => activity.id && onDelete(activity.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                  aria-label="Delete activity"
                  title="Delete this activity"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
