/**
 * Custom hook for API calls with loading and error states
 */

import { useState, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: message });
      throw error;
    }
  }, [asyncFunction]);

  // Execute immediately if flag is set
  if (immediate && state.loading) {
    execute();
  }

  return { ...state, execute };
}
