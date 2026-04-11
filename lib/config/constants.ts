/**
 * Application-wide constants and configuration values
 * Centralized to avoid hardcoded values scattered throughout codebase
 */

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sllp_access_token',
  REFRESH_TOKEN: 'sllp_refresh_token',
  USER_PREFERENCES: 'sllp_user_preferences',
  SELECTED_LANGUAGE: 'sllp_language',
  DRAFT_COMPOSITIONS: 'sllp_draft_compositions',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  TIMEOUT_MS: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  TOKEN_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes after failed attempts
  MAX_LOGIN_ATTEMPTS: 5,
} as const;

/**
 * Route paths and role-based access
 */
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected learner routes
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COMPOSITIONS: '/compositions',
  EVALUATIONS: '/evaluations',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PROGRESS: '/progress',
  VOCABULARY: '/vocabulary',
  KNOWLEDGE: '/knowledge',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_RUBRICS: '/admin/rubrics',
  ADMIN_ANALYTICS: '/admin/analytics',

  // Evaluation routes
  EVALUATION: '/evaluation',
  EVALUATION_SUBMISSIONS: '/evaluation/submissions',

  // Home
  HOME: '/',
  NOT_FOUND: '/_not-found',
} as const;

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.COURSES,
  ROUTES.COMPOSITIONS,
  ROUTES.EVALUATIONS,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.PROGRESS,
  ROUTES.VOCABULARY,
  ROUTES.KNOWLEDGE,
  ROUTES.ADMIN,
  ROUTES.EVALUATION,
] as const;

/**
 * Routes requiring specific roles
 */
export const ROLE_BASED_ROUTES = {
  ADMIN: [ROUTES.ADMIN, ROUTES.ADMIN_DASHBOARD, ROUTES.ADMIN_USERS, ROUTES.ADMIN_CONTENT, ROUTES.ADMIN_RUBRICS, ROUTES.ADMIN_ANALYTICS],
  INSTRUCTOR: [ROUTES.EVALUATION, ROUTES.EVALUATION_SUBMISSIONS],
  LEARNER: [ROUTES.DASHBOARD, ROUTES.COURSES, ROUTES.COMPOSITIONS, ROUTES.EVALUATIONS, ROUTES.VOCABULARY, ROUTES.KNOWLEDGE],
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  SMALL_PAGE_SIZE: 10,
  DEFAULT_PAGE_SIZE: 20,
  LARGE_PAGE_SIZE: 50,
} as const;

/**
 * UI/UX timeouts in milliseconds
 */
export const UI_TIMEOUTS = {
  TOAST_DURATION: 3000,
  LOADING_DEBOUNCE: 200,
  SEARCH_DEBOUNCE: 300,
  MODAL_ANIMATION: 300,
} as const;

/**
 * Feature flags for gradual rollout
 */
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_ADVANCED_RUBRICS: false,
  ENABLE_PEER_REVIEW: false,
  ENABLE_AI_FEEDBACK: false,
} as const;

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRES_UPPERCASE: true,
  PASSWORD_REQUIRES_NUMBER: true,
  PASSWORD_REQUIRES_SPECIAL: false,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`,
  INVALID_PASSWORD: 'Password must contain uppercase letters and numbers',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  TIMEOUT: 'Request timed out. Please try again.',
} as const;
