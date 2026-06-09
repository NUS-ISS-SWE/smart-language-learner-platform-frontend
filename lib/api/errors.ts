import { AxiosError } from "axios";

/**
 * Structured error object returned by the API.
 */
export interface ApiError {
  message?: string;
  error?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Extract a user-friendly error message from various error types.
 * Handles AxiosError responses with different error formats.
 *
 * @param error - The error object (typically AxiosError)
 * @returns A user-friendly error message string
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | string | undefined;

    // Handle plain string responses
    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }

    // Handle structured error objects with various formats
    if (typeof data === "object" && data) {
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
    }

    // Fall back to Axios error message if available
    if (error.message) {
      return error.message;
    }
  }

  // Default generic message
  return "Something went wrong. Please try again.";
}

/**
 * Create a structured error object from various error types.
 * Useful for logging and standardized error handling.
 *
 * @param error - The error object
 * @returns Structured ApiError object
 */
export function createApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      code: error.code,
      statusCode: error.response?.status,
      message: getApiErrorMessage(error),
    };
  }

  return {
    message: error instanceof Error ? error.message : "Unknown error",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Check if an error is a 401 Unauthorized error.
 */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401;
}

/**
 * Check if an error is a 404 Not Found error.
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404;
}

/**
 * Check if an error is a 500 Server Error or similar.
 */
export function isServerError(error: unknown): boolean {
  return error instanceof AxiosError && (error.response?.status ?? 0) >= 500;
}
