import { useState } from 'react';
import type { Activity, ActivityCategory } from '../types';
import { Calendar, Tag, Activity as ActivityIcon, Sparkles } from 'lucide-react';

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, 'id'>) => Promise<void>;
  loading?: boolean;
  onSuccess?: () => void;
}

const ACTIVITY_TYPES: Record<ActivityCategory, string[]> = {
  transportation: ['car', 'flight', 'bus', 'train', 'motorcycle'],
  energy: ['electricity', 'naturalGas', 'heating'],
  diet: ['beef', 'pork', 'chicken', 'fish', 'dairy', 'vegetables', 'grains', 'vegan'],
  shopping: ['clothing', 'electronics', 'furniture', 'groceries', 'general'],
};

const UNITS: Record<ActivityCategory, string> = {
  transportation: 'miles',
  energy: 'kWh',
  diet: 'kg',
  shopping: 'dollars',
};

const CATEGORY_EMOJIS: Record<ActivityCategory, string> = {
  transportation: '🚗',
  energy: '⚡',
  diet: '🥗',
  shopping: '🛍️',
};

export function ActivityForm({ onSubmit, loading = false, onSuccess }: ActivityFormProps) {
  const [category, setCategory] = useState<ActivityCategory>('transportation');
  const [type, setType] = useState('car');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || parseFloat(value) <= 0) {
      alert('Please enter a valid value');
      return;
    }

    try {
      await onSubmit({
        category,
        type,
        value: parseFloat(value),
        unit: UNITS[category],
        date: new Date(date).toISOString(),
        description: description.trim() || undefined,
      });

      // Reset form
      setValue('');
      setDescription('');
      setType(ACTIVITY_TYPES[category][0]);
      setDate(new Date().toISOString().split('T')[0]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card p-8 border border-slate-100 animate-slide-up transition-all">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
         <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-3 rounded-2xl shadow-lg shadow-green-500/30">
           <ActivityIcon size={24} />
         </div>
         <div>
           <h2 className="text-2xl font-display font-bold text-slate-800">Log New Activity</h2>
           <p className="text-sm text-slate-500 font-medium">Record your actions to calculate impact</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Tag size={16} className="text-slate-400" /> Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-lg">
              {CATEGORY_EMOJIS[category]}
            </div>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                const newCategory = e.target.value as ActivityCategory;
                setCategory(newCategory);
                setType(ACTIVITY_TYPES[newCategory][0]);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 appearance-none font-medium text-slate-700 shadow-sm cursor-pointer"
              required
            >
              <option value="transportation">🚗 Transportation</option>
              <option value="energy">⚡ Energy</option>
              <option value="diet">🥗 Diet</option>
              <option value="shopping">🛍️ Shopping</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            Specific Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 appearance-none font-medium text-slate-700 capitalize shadow-sm cursor-pointer"
            required
          >
            {ACTIVITY_TYPES[category].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="value" className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Amount</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{UNITS[category]}</span>
          </label>
          <input
            id="value"
            type="number"
            min="0"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar size={16} className="text-slate-400" /> Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 font-medium text-slate-700 shadow-sm cursor-pointer"
            required
          />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          Notes (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any extra details..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all duration-200 font-medium text-slate-700 resize-none placeholder:text-slate-400 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
      >
        {loading ? (
           <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
           <>
             <Sparkles size={18} />
             <span>Log Activity</span>
           </>
        )}
        {loading ? 'Saving Activity...' : ''}
      </button>
    </form>
  );
}
