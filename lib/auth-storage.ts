import { TOKEN_KEY } from "@/lib/constants";

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
 * Store a JWT access token in localStorage.
 */
export function setStoredAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the stored JWT access token from localStorage.
 */
export function clearStoredAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
}
