import { TOKEN_KEY } from "@/lib/constants";

const COOKIE_NAME = "sllp_auth";

/**
 * Retrieve the stored JWT access token from localStorage.
 * Returns null if no token is stored or in SSR context.
 */
export function getStoredAccessToken(): string | null {
  // Safely handle SSR context where localStorage is not available
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store a JWT access token in localStorage and as a cookie so the
 * Next.js middleware (server-side) can detect the authenticated state.
 */
export function setStoredAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  // Set a non-HttpOnly cookie so Next.js middleware can read it.
  // SameSite=Strict prevents CSRF; Secure is omitted for localhost dev.
  document.cookie = `${COOKIE_NAME}=1; path=/; SameSite=Strict`;
}

/**
 * Remove the stored JWT access token from localStorage and clear the cookie.
 */
export function clearStoredAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}
