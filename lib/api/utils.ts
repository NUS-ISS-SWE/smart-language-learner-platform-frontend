/**
 * Common API utilities and helpers
 * Reduces boilerplate across API clients
 */

import type { AxiosInstance } from 'axios';
import type { PaginatedResponse } from '@/types/common';

/**
 * Extract and normalize paginated response data
 */
export function extractPaginatedData<T>(response: any): PaginatedResponse<T> {
  return {
    items: Array.isArray(response) ? response : response.items || response.data || [],
    total: response.total ?? 0,
    page: response.page ?? 1,
    limit: response.limit ?? response.size ?? 20,
    hasMore: (response.page ?? 1) * (response.limit ?? response.size ?? 20) < (response.total ?? 0),
  };
}

/**
 * Generic GET request helper with built-in type safety
 */
export async function apiGet<T>(
  client: AxiosInstance,
  endpoint: string,
  config?: any
): Promise<T> {
  const response = await client.get<T>(endpoint, config);
  return response.data;
}

/**
 * Generic POST request helper with built-in type safety
 */
export async function apiPost<T>(
  client: AxiosInstance,
  endpoint: string,
  data?: any,
  config?: any
): Promise<T> {
  const response = await client.post<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PUT request helper with built-in type safety
 */
export async function apiPut<T>(
  client: AxiosInstance,
  endpoint: string,
  data?: any,
  config?: any
): Promise<T> {
  const response = await client.put<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PATCH request helper with built-in type safety
 */
export async function apiPatch<T>(
  client: AxiosInstance,
  endpoint: string,
  data?: any,
  config?: any
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
  config?: any
): Promise<T> {
  const response = await client.delete<T>(endpoint, config);
  return response.data;
}
