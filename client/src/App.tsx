/**
 * Main App Component
 */

import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { ActivityForm } from './components/ActivityForm';
import { Dashboard } from './components/Dashboard';
import { ActivitiesList } from './components/ActivitiesList';
import { Recommendations } from './components/Recommendations';
import type { Activity, FootprintData, Recommendation } from './types';
import './index.css';

type Tab = 'dashboard' | 'log' | 'activities' | 'recommendations';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [footprint, setFootprint] = useState<FootprintData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
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
    }
  }

  async function handleAddActivity(activity: Omit<Activity, 'id'>) {
    try {
      const newActivity = await apiService.createActivity(activity);
      setActivities((prev) => (prev ? [...prev, newActivity] : [newActivity]));
      await loadAllData();
      alert('Activity logged successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create activity';
      alert(`Error: ${message}`);
      console.error('Error creating activity:', err);
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await apiService.deleteActivity(id);
      setActivities((prev) => (prev ? prev.filter((a) => a.id !== id) : null));
      await loadAllData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete activity';
      alert(`Error: ${message}`);
      console.error('Error deleting activity:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌍</span>
              <div>
                <h1 className="text-2xl font-bold text-eco-700">Carbon Footprint Tracker</h1>
                <p className="text-sm text-gray-600">Track and reduce your environmental impact</p>
              </div>
            </div>
            <button
              onClick={loadAllData}
              className="px-4 py-2 bg-eco-600 hover:bg-eco-700 text-white rounded-md transition text-sm font-medium"
              aria-label="Refresh data"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1" role="tablist">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'log', label: '➕ Log Activity', icon: '➕' },
              { id: 'activities', label: '📋 Activities', icon: '📋' },
              { id: 'recommendations', label: '💡 Tips', icon: '💡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-eco-600 text-eco-700 bg-eco-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        <section
          id="dashboard-panel"
          role="tabpanel"
          hidden={activeTab !== 'dashboard'}
          className={activeTab === 'dashboard' ? '' : 'hidden'}
        >
          <Dashboard data={footprint} loading={loading} error={error} />
        </section>

        {/* Activity Form Tab */}
        <section
          id="log-panel"
          role="tabpanel"
          hidden={activeTab !== 'log'}
          className={activeTab === 'log' ? 'max-w-2xl' : 'hidden'}
        >
          <ActivityForm onSubmit={handleAddActivity} />
        </section>

        {/* Activities List Tab */}
        <section
          id="activities-panel"
          role="tabpanel"
          hidden={activeTab !== 'activities'}
          className={activeTab === 'activities' ? '' : 'hidden'}
        >
          <ActivitiesList
            activities={activities}
            loading={loading}
            error={error}
            onDelete={handleDeleteActivity}
          />
        </section>

        {/* Recommendations Tab */}
        <section
          id="recommendations-panel"
          role="tabpanel"
          hidden={activeTab !== 'recommendations'}
          className={activeTab === 'recommendations' ? '' : 'hidden'}
        >
          <Recommendations
            recommendations={recommendations}
            loading={loading}
            error={error}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-3">About</h3>
              <p className="text-sm">
                Carbon Footprint Tracker helps you understand and reduce your environmental impact
                through smart tracking and personalized insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">How It Works</h3>
              <ul className="text-sm space-y-2">
                <li>📝 Log your daily activities</li>
                <li>📊 See your carbon footprint breakdown</li>
                <li>💡 Get personalized recommendations</li>
                <li>🌱 Track your progress over time</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Impact</h3>
              <p className="text-sm">
                Every action counts. By tracking and reducing your footprint, you contribute to a
                sustainable future for our planet.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; 2026 Carbon Footprint Platform. Built with ❤️ for a sustainable world.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
