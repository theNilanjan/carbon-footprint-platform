import { formatEmissions, formatDate, getCategoryLightColor, getCategoryIcon } from '../utils/helpers';
import type { Activity } from '../types';
import { Trash2, Calendar, FileText } from 'lucide-react';

interface ActivitiesListProps {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  onDelete?: (id: string) => Promise<void>;
}

export function ActivitiesList({ activities, loading, error, onDelete }: ActivitiesListProps) {
  if (error) return null; // Error handled in App

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/60 border border-slate-100 rounded-2xl shadow-sm h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 shadow-sm animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
          <FileText size={32} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-800 mb-2">No activities yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Start logging your daily activities to build your carbon footprint profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-display font-bold text-slate-800">Recent Activities</h2>
        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">{activities.length} total</span>
      </div>
      
      <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
        {activities.slice().reverse().map((activity) => {
          const lightColorClass = getCategoryLightColor(activity.category);
          
          return (
          <div
            key={activity.id}
            className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-5 flex flex-col sm:flex-row sm:items-center justify-between group border border-slate-100 hover:border-eco-200 transition-all duration-300 animate-slide-up"
          >
            <div className="flex items-start sm:items-center gap-4 flex-1 mb-4 sm:mb-0">
              <div className={`p-3 rounded-2xl ${lightColorClass} shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                {getCategoryIcon(activity.category, 20)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 capitalize text-lg">
                    {activity.type}
                  </h3>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-lg uppercase tracking-wide">
                    {activity.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-700 font-bold">{activity.value}</span> {activity.unit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    {formatDate(activity.date)}
                  </span>
                </div>
                
                {activity.description && (
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg inline-block w-full">{activity.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-l sm:pl-6">
              <div className="text-left sm:text-right">
                <div className="text-sm font-semibold text-slate-500 mb-0.5">Emissions</div>
                <div className="font-black text-lg text-eco-600 tracking-tight">
                  {formatEmissions(activity.carbonEmissions || 0)}
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => activity.id && onDelete(activity.id)}
                  className="text-slate-400 hover:text-red-500 p-2.5 hover:bg-red-50 rounded-xl transition-all duration-200"
                  aria-label="Delete activity"
                  title="Delete this activity"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
