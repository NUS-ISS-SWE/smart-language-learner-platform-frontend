/**
 * Common type definitions shared across the application.
 * Provides base interfaces for audited, soft-deletable, and paginated entities.
 */

/**
 * Audit fields included in most entities.
 */
export interface AuditedEntity {
  createdAt: string;
  updatedAt: string;
}

/**
 * Extends AuditedEntity with soft-delete support.
 * Deleted records retain historical data but are logically removed.
 */
export interface SoftDeletableEntity extends AuditedEntity {
  deletedAt?: string | null;
}

/**
 * Base response wrapper for paginated API responses.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Standard error response from API.
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Request options for pagination.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Common defaults for API operations.
 */
export const API_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  TIMEOUT_MS: 10000,
} as const;

/**
 * HTTP status codes commonly used.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
