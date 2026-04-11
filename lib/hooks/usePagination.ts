'use client';

import { useState, useCallback } from 'react';

interface UsePaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Hook for managing paginated data fetching
 * Handles page navigation and result caching
 *
 * @param fetchFunction - Async function that fetches paginated data
 * @param initialPage - Starting page number (default: 1)
 * @param initialLimit - Items per page (default: 20)
 * @returns Pagination state and control methods
 *
 * @example
 * const { data, page, goToPage, nextPage, prevPage, isLoading } = usePagination(
 *   (page, limit) => getCompositions({ page, limit }),
 *   1,
 *   20
 * );
 */
export function usePagination<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ items: T[]; total: number }>,
  initialPage = 1,
  initialLimit = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [state, setState] = useState<UsePaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(pageNum, state.limit);
        setData(result.items);
        setState((prev) => ({
          ...prev,
          page: pageNum,
          total: result.total,
          hasMore: pageNum * state.limit < result.total,
        }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, state.limit]
  );

  const goToPage = useCallback(
    (pageNum: number) => {
      if (pageNum > 0) {
        fetchPage(pageNum);
      }
    },
    [fetchPage]
  );

  const nextPage = useCallback(() => {
    if (state.hasMore) {
      fetchPage(state.page + 1);
    }
  }, [state.page, state.hasMore, fetchPage]);

  const prevPage = useCallback(() => {
    if (state.page > 1) {
      fetchPage(state.page - 1);
    }
  }, [state.page, fetchPage]);

  return {
    data,
    ...state,
    isLoading,
    error,
    goToPage,
    nextPage,
    prevPage,
  };
}
