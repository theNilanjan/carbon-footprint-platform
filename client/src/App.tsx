import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { ActivityForm } from './components/ActivityForm';
import { Dashboard } from './components/Dashboard';
import { ActivitiesList } from './components/ActivitiesList';
import { Recommendations } from './components/Recommendations';
import type { Activity, FootprintData, Recommendation } from './types';
import { LayoutDashboard, PlusCircle, List, Lightbulb, Leaf, RefreshCw, AlertCircle } from 'lucide-react';
import './index.css';

type Tab = 'dashboard' | 'log' | 'activities' | 'recommendations';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [footprint, setFootprint] = useState<FootprintData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData(refresh = false) {
    if (refresh) setIsRefreshing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const [activitiesData, footprintData, recommendationsData] = await Promise.all([
        apiService.getActivities(),
        apiService.getFootprintBreakdown(),
        apiService.getRecommendations().catch(() => null),
      ]);

      setActivities(activitiesData);
      setFootprint(footprintData);
      if (recommendationsData) {
        setRecommendations(recommendationsData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleAddActivity(activity: Omit<Activity, 'id'>) {
    try {
      const newActivity = await apiService.createActivity(activity);
      setActivities((prev) => (prev ? [...prev, newActivity] : [newActivity]));
      await loadAllData(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create activity';
      alert(`Error: ${message}`);
      console.error('Error creating activity:', err);
      throw err;
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await apiService.deleteActivity(id);
      setActivities((prev) => (prev ? prev.filter((a) => a.id !== id) : null));
      await loadAllData(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete activity';
      alert(`Error: ${message}`);
      console.error('Error deleting activity:', err);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'log', label: 'Log Activity', icon: <PlusCircle size={18} /> },
    { id: 'activities', label: 'Activities', icon: <List size={18} /> },
    { id: 'recommendations', label: 'Tips', icon: <Lightbulb size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-eco-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-eco-400 to-eco-600 rounded-xl flex items-center justify-center shadow-lg shadow-eco-500/30 text-white">
                <Leaf size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-eco-800 to-slate-800 tracking-tight">
                  EcoTracker
                </h1>
                <p className="text-xs text-slate-500 font-medium">Monitor & reduce your impact</p>
              </div>
            </div>
            <button
              onClick={() => loadAllData(true)}
              disabled={isRefreshing || loading}
              className="p-2.5 text-slate-500 hover:text-eco-600 hover:bg-eco-50 rounded-xl transition-all duration-200 disabled:opacity-50 group border border-transparent hover:border-eco-100"
              aria-label="Refresh data"
            >
              <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin text-eco-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 z-10 relative w-full">
        <nav className="flex space-x-1 bg-white/60 p-1.5 rounded-2xl backdrop-blur-md shadow-sm border border-slate-200/60 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 min-w-[120px] ${
                activeTab === tab.id
                  ? 'bg-white text-eco-700 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-eco-600' : 'text-slate-400'}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow z-10 relative animate-fade-in">
        {error && (
           <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 animate-slide-up shadow-sm">
             <AlertCircle className="shrink-0 mt-0.5 text-red-500" size={20} />
             <div>
               <h3 className="font-semibold">Unable to load data</h3>
               <p className="text-sm mt-1 text-red-700">{error}</p>
             </div>
           </div>
        )}

        <div className="relative">
          {activeTab === 'dashboard' && (
            <div className="animate-slide-up">
              <Dashboard data={footprint} loading={loading} error={error} />
            </div>
          )}

          {activeTab === 'log' && (
            <div className="max-w-2xl mx-auto animate-slide-up">
              <ActivityForm onSubmit={handleAddActivity} loading={loading || isRefreshing} onSuccess={() => setActiveTab('activities')} />
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="animate-slide-up">
              <ActivitiesList
                activities={activities}
                loading={loading}
                error={error}
                onDelete={handleDeleteActivity}
              />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="animate-slide-up">
              <Recommendations
                recommendations={recommendations}
                loading={loading}
                error={error}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/40 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-eco-500" />
              <span className="font-medium">EcoTracker &copy; 2026</span>
            </div>
            <p>Built for a sustainable world</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
