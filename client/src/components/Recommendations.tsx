import { getRecommendationIcon, formatEmissions, getCategoryLightColor } from '../utils/helpers';
import type { Recommendation } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[] | null;
  loading: boolean;
  error: string | null;
}

export function Recommendations({ recommendations, loading, error }: RecommendationsProps) {
  if (error) return null; // Error handled in App

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/60 border border-slate-100 rounded-2xl shadow-sm h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 shadow-sm animate-fade-in">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-500">
          <Sparkles size={32} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-800 mb-2">No recommendations yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Log more activities across different categories to get personalized tips for reducing your footprint.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 px-2">
         <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl shadow-sm">
           <Sparkles size={20} />
         </div>
         <div>
           <h2 className="text-2xl font-display font-bold text-slate-800">AI-Powered Insights</h2>
           <p className="text-sm font-medium text-slate-500">Personalized tips based on your activity patterns</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, idx) => {
          const lightColorClass = getCategoryLightColor(rec.category);
          
          return (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 flex flex-col group border border-slate-100 hover:border-eco-200 transition-all duration-300 animate-slide-up hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${lightColorClass} transition-transform duration-300 group-hover:scale-105`}>
                {getRecommendationIcon(rec.category, 24)}
              </div>
              <span
                className="text-xs font-bold text-eco-700 bg-eco-100 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
              >
                Save {formatEmissions(rec.potentialSavings)}
              </span>
            </div>
            
            <h3 className="font-display font-bold capitalize text-slate-800 text-xl mb-2">{rec.category} Impact</h3>
            <p className="text-slate-600 font-medium leading-relaxed flex-grow text-sm">{rec.recommendation}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-eco-600 text-sm font-bold group-hover:gap-2 transition-all cursor-pointer w-max">
              <span>Take Action</span>
              <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
