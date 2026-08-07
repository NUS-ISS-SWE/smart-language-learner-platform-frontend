/**
 * Application constants for Smart Language Learner Platform.
 * These values are used throughout the application.
 */

export const APP_NAME = "Smart Language Learner Platform";

/**
 * API base URL for communicating with backend services.
 * Uses NEXT_PUBLIC_ prefix to expose to browser at build time.
 * Defaults to API Gateway at localhost:8080 for local development.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/**
 * Key used for storing the JWT access token in localStorage.
 */
export const TOKEN_KEY = "sllp.accessToken";

/**
 * Key used for storing the autosave preference in localStorage.
 * Absence or any value other than "false" means autosave is enabled.
 */
export const AUTOSAVE_STORAGE_KEY = "sllp.autosave.enabled";

/**
 * Default timeout for API requests in milliseconds.
 */
export const API_TIMEOUT = 10000;

/**
 * Maximum retry attempts for failed requests.
 */
export const MAX_RETRIES = 1;

/**
 * Stale time for React Query cache in milliseconds (30 seconds).
 * Data older than this is considered stale and will be refetched.
 */
export const QUERY_STALE_TIME = 30000;

/**
 * Cache time for React Query in milliseconds (5 minutes).
 * Data will be garbage collected after this duration.
 */
export const QUERY_CACHE_TIME = 5 * 60 * 1000;
