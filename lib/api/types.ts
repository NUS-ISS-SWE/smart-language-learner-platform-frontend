/**
 * Common API response type definitions shared across all microservices
 */

/**
 * Paginated list response wrapper
 * Most list endpoints return this structure
 */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit?: number;
  hasMore?: boolean;
}

/**
 * Error response structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Success response wrapper (for endpoints that include metadata)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Item with audit timestamps
 */
export interface AuditedItem {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Item with soft delete tracking
 */
export interface SoftDeletableItem extends AuditedItem {
  deletedAt?: string;
  isDeleted?: boolean;
}

/**
 * Versioned item for tracking changes
 */
export interface VersionedItem extends AuditedItem {
  version: number;
}

/**
 * State machine item with workflow status
 */
export interface StatefulItem {
  status: string;
  statusChangedAt?: string;
  statusChangedBy?: string;
}

/**
 * Owned resource (belongs to a user)
 */
export interface OwnedItem extends AuditedItem {
  userId: string;
  ownerName?: string;
}

/**
 * Strongly owned resource (only owner can access)
 */
export interface PrivateItem extends OwnedItem {
  isPublic?: boolean;
  accessLevel?: 'private' | 'shared' | 'public';
}
