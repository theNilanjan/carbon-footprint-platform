import { formatEmissions, getCategoryColor, getCategoryLightColor, getCategoryIcon } from '../utils/helpers';
import type { FootprintData } from '../types';
import { ArrowUpRight, TrendingDown } from 'lucide-react';

interface DashboardProps {
  data: FootprintData | null;
  loading: boolean;
  error: string | null;
}

export function Dashboard({ data, loading, error }: DashboardProps) {
  if (error) return null; // Error is handled in App.tsx

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 glass-card h-48 animate-pulse bg-white/40" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card h-40 animate-pulse bg-white/40" />
        ))}
      </div>
    );
  }

  const categories = ['transportation', 'energy', 'diet', 'shopping'] as const;

  return (
    <div className="space-y-6">
      {/* Total Emissions Card */}
      <div className="glass-card bg-gradient-to-br from-eco-600 to-eco-800 p-8 text-white relative overflow-hidden shadow-eco-600/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <h2 className="text-eco-100 font-medium mb-2 flex items-center gap-2 text-lg">
              Total Carbon Footprint
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold tracking-tight">{formatEmissions(data.total).split(' ')[0]}</span>
              <span className="text-2xl text-eco-200 font-medium">{formatEmissions(data.total).split(' ')[1]}</span>
            </div>
            <p className="text-eco-100/80 mt-2 font-medium">This month's estimated emissions</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-sm flex items-center gap-3">
             <div className="bg-eco-500/30 p-2 rounded-full">
               <TrendingDown size={24} className="text-white" />
             </div>
             <div>
               <p className="text-eco-100 font-medium">On track</p>
               <p className="text-white font-bold">Keep it up!</p>
             </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const percentage = data.percentage ? data.percentage[category] : 0;
          const bgClass = getCategoryLightColor(category);
          const accentColorClass = getCategoryColor(category);
          
          return (
          <div key={category} className={`glass-card p-6 border-b-4 hover:-translate-y-1 transition-transform duration-300 ${accentColorClass.replace('bg-', 'border-')}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${bgClass}`}>
                 {getCategoryIcon(category, 24)}
              </div>
              <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                {percentage}% <ArrowUpRight size={14} />
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 capitalize mb-1">{category}</h3>
            <div className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
              {formatEmissions(data.byCategory[category])}
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${accentColorClass}`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
