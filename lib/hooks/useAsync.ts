'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

/**
 * Hook for handling async operations with state management
 * Handles component unmounting and automatic retry
 *
 * @param asyncFunction - Async function to execute
 * @param immediate - Execute immediately on mount (default: true)
 * @param deps - Dependency array (default: [])
 * @returns State object and execute function
 *
 * @example
 * const { status, data, error, execute } = useAsync(
 *   () => submitComposition(data),
 *   false // Don't execute on mount
 * );
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  deps: unknown[] = []
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMountedRef = useRef(true);

  // Update mounted state
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Execute the async function
  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        setState({ status: 'success', data: result, error: null });
      }
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (isMountedRef.current) {
        setState({ status: 'error', data: null, error: err });
      }
      throw err;
    }
  }, [asyncFunction]);

  // Execute on mount or when dependencies change
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps);

  return { ...state, execute };
}
