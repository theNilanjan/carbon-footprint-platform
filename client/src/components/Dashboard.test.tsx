/**
 * Frontend component tests
 */

import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import type { FootprintData } from '../../types';

describe('Dashboard Component', () => {
  const mockData: FootprintData = {
    total: 100,
    byCategory: {
      transportation: 50,
      energy: 20,
      diet: 20,
      shopping: 10,
    },
    percentage: {
      transportation: 50,
      energy: 20,
      diet: 20,
      shopping: 10,
    },
  };

  it('should render loading state', () => {
    render(<Dashboard data={null} loading={true} error={null} />);
    expect(document.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
  });

  it('should render error state', () => {
    render(<Dashboard data={null} loading={false} error="Test error" />);
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('should render dashboard with data', () => {
    render(<Dashboard data={mockData} loading={false} error={null} />);
    expect(screen.getByText(/Total Carbon Footprint/)).toBeInTheDocument();
    expect(screen.getByText(/transportation/i)).toBeInTheDocument();
    expect(screen.getByText(/energy/i)).toBeInTheDocument();
  });

  it('should display correct percentages', () => {
    render(<Dashboard data={mockData} loading={false} error={null} />);
    expect(screen.getByText('50% of total')).toBeInTheDocument();
    expect(screen.getByText('20% of total')).toBeInTheDocument();
  });
});
