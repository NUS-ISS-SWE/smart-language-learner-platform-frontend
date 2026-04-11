/**
 * Common API utilities and helpers
 * Reduces boilerplate across API clients
 */

import type { AxiosInstance } from 'axios';
import type { PaginatedResponse } from '@/types/common';

/**
 * Extract and normalize paginated response data
 */
export function extractPaginatedData<T>(response: unknown): PaginatedResponse<T> {
  if (!response || typeof response !== 'object') {
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      hasMore: false,
    };
  }

  const r = response as Record<string, unknown>;
  const page = typeof r.page === 'number' ? r.page : 1;
  const limit = typeof r.limit === 'number' ? r.limit : typeof r.size === 'number' ? r.size : 20;
  const total = typeof r.total === 'number' ? r.total : 0;
  
  const items = Array.isArray(r.items) 
    ? (r.items as T[]) 
    : Array.isArray(response) 
      ? (response as T[])
      : [];
  
  return {
    items,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  };
}

/**
 * Generic GET request helper with built-in type safety
 */
export async function apiGet<T>(
  client: AxiosInstance,
  endpoint: string,
  config?: Record<string, unknown>
): Promise<T> {
  const response = await client.get<T>(endpoint, config);
  return response.data;
}

/**
 * Generic POST request helper with built-in type safety
 */
export async function apiPost<T, D = Record<string, unknown>>(
  client: AxiosInstance,
  endpoint: string,
  data?: D,
  config?: Record<string, unknown>
): Promise<T> {
  const response = await client.post<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PUT request helper with built-in type safety
 */
export async function apiPut<T, D = Record<string, unknown>>(
  client: AxiosInstance,
  endpoint: string,
  data?: D,
  config?: Record<string, unknown>
): Promise<T> {
  const response = await client.put<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PATCH request helper with built-in type safety
 */
export async function apiPatch<T, D = Record<string, unknown>>(
  client: AxiosInstance,
  endpoint: string,
  data?: D,
  config?: Record<string, unknown>
): Promise<T> {
  const response = await client.patch<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic DELETE request helper
 */
export async function apiDelete<T = void>(
  client: AxiosInstance,
  endpoint: string,
  config?: Record<string, unknown>
): Promise<T> {
  const response = await client.delete<T>(endpoint, config);
  return response.data;
}
