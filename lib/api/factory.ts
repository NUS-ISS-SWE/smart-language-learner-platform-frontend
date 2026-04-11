import { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Pagination metadata returned by list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
}

/**
 * Generic API response wrapper for list operations
 */
export interface ListResponse<T> {
  [key: string]: T[] | number | undefined;
  total?: number;
  page?: number;
}

/**
 * Factory for creating type-safe API clients with common patterns
 * Reduces boilerplate for CRUD operations and common patterns
 */
export function createApiClient(endpoint: string, client: AxiosInstance) {
  return {
    /**
     * Generic GET request
     */
    get<T>(path: string = endpoint, config?: AxiosRequestConfig) {
      return client.get<T>(path, config).then((res) => res.data);
    },

    /**
     * Generic POST request
     */
    post<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
      return client.post<T>(path, data, config).then((res) => res.data);
    },

    /**
     * Generic PUT request
     */
    put<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
      return client.put<T>(path, data, config).then((res) => res.data);
    },

    /**
     * Generic PATCH request
     */
    patch<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
      return client.patch<T>(path, data, config).then((res) => res.data);
    },

    /**
     * Generic DELETE request
     */
    delete<T = void>(path: string, config?: AxiosRequestConfig) {
      return client.delete<T>(path, config).then((res) => res.data);
    },

    /**
     * GET with pagination support
     * Handles common pagination parameters and metadata
     */
    getList<T>(
      path: string = endpoint,
      page = 1,
      limit = 20,
      additionalParams?: Record<string, unknown>,
      config?: AxiosRequestConfig
    ) {
      return client
        .get<{ [key: string]: T[] | number | undefined }>(path, {
          params: { page, limit, ...additionalParams },
          ...config,
        })
        .then((res) => res.data);
    },

    /**
     * GET by ID
     */
    getById<T>(id: string) {
      return client.get<T>(`${endpoint}/${id}`).then((res) => res.data);
    },

    /**
     * CREATE new resource
     */
    create<T>(data: unknown) {
      return client.post<T>(endpoint, data).then((res) => res.data);
    },

    /**
     * UPDATE resource by ID
     */
    update<T>(id: string, data: unknown) {
      return client.put<T>(`${endpoint}/${id}`, data).then((res) => res.data);
    },

    /**
     * DELETE resource by ID
     */
    deleteById(id: string) {
      return client.delete(`${endpoint}/${id}`);
    },

    /**
     * Nested GET - useful for related resources
     * e.g., /courses/123/lessons
     */
    getNested<T>(parentId: string, resourcePath: string, page?: number, limit?: number) {
      const path = `${endpoint}/${parentId}/${resourcePath}`;
      if (page && limit) {
        return this.getList<T>(path, page, limit);
      }
      return client.get<T[]>(path).then((res) => res.data);
    },

    /**
     * Action endpoint - POST to a custom action endpoint
     * e.g., /compositions/123/submit
     */
    action<T>(id: string, actionPath: string, data?: unknown) {
      return client.post<T>(`${endpoint}/${id}/${actionPath}`, data || {}).then((res) => res.data);
    },

    /**
     * Filter/Search endpoint
     */
    search<T>(query: string, filters?: Record<string, unknown>) {
      return client
        .get<T[]>(endpoint, {
          params: { query, ...filters },
        })
        .then((res) => res.data);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
