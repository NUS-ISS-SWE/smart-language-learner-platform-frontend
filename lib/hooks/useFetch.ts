'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchOptions {
  skip?: boolean;
  dependencies?: unknown[];
  timeout?: number;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic data fetching hook with error handling and loading states
 * Handles component unmounting and request cancellation
 *
 * @param fetcher - Async function that returns data
 * @param options - Configuration (skip, dependencies, timeout)
 * @returns Object with data, loading, error, and refetch function
 *
 * @example
 * const { data, loading, error, refetch } = useFetch(
 *   () => getCourses(),
 *   { dependencies: [userId] }
 * );
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions = {}
) {
  const { skip = false, dependencies = [], timeout = 10000 } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: !skip,
    error: null,
  });

  const isMountedRef = useRef(true);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  const execute = useCallback(async () => {
    if (skip) return;

    setState({ data: null, loading: true, error: null });
    timeoutIdRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          error: new Error('Request timeout'),
          loading: false,
        }));
      }
    }, timeout);

    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    } finally {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    }
  }, [fetcher, skip, timeout]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, refetch: execute };
}
