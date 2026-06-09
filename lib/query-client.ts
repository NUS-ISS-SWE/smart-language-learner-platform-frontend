import { QueryClient } from "@tanstack/react-query";
import { QUERY_STALE_TIME, QUERY_CACHE_TIME } from "@/lib/constants";

/**
 * Create and configure a React Query client with sensible defaults.
 * This client is used for managing server state across the application.
 *
 * Default behavior:
 * - Queries are considered stale after 30 seconds
 * - Cache is retained for 5 minutes (garbage collection interval)
 * - Failed queries are retried once
 * - Window focus refetches are disabled to avoid excessive requests
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME, // 30 seconds
        gcTime: QUERY_CACHE_TIME, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0, // Don't retry mutations by default
      },
    },
  });
}

// Singleton instance for server-side rendering and client-side use
let clientQueryClientInstance: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Always create a new instance for SSR
    return createQueryClient();
  }

  // Reuse the same instance in the browser
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = createQueryClient();
  }

  return clientQueryClientInstance;
}
