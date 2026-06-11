/**
 * Activity Form Component
 */

import { useState } from 'react';
import type { Activity, ActivityCategory } from '../types';

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, 'id'>) => Promise<void>;
  loading?: boolean;
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

export function ActivityForm({ onSubmit, loading = false }: ActivityFormProps) {
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
    } catch (error) {
      console.error('Error submitting activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-eco-700">Log Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              const newCategory = e.target.value as ActivityCategory;
              setCategory(newCategory);
              setType(ACTIVITY_TYPES[newCategory][0]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            required
          >
            <option value="transportation">🚗 Transportation</option>
            <option value="energy">⚡ Energy</option>
            <option value="diet">🍔 Diet</option>
            <option value="shopping">🛍️ Shopping</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            required
          >
            {ACTIVITY_TYPES[category].map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium mb-2">
            Value ({UNITS[category]}) <span className="text-red-500">*</span>
          </label>
          <input
            id="value"
            type="number"
            min="0"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            required
            aria-describedby="value-help"
          />
          <p id="value-help" className="text-xs text-gray-500 mt-1">
            Enter the quantity in {UNITS[category]}
          </p>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any notes about this activity"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none h-24 resize-none"
          maxLength={500}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-eco-600 hover:bg-eco-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading}
      >
        {loading ? 'Saving...' : 'Log Activity'}
      </button>
    </form>
  );
}
