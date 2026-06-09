import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/lib/constants";
import {
  getStoredAccessToken,
  setStoredAccessToken,
  clearStoredAccessToken,
} from "@/lib/auth-storage";
import { isUnauthorizedError, getApiErrorMessage } from "@/lib/api/errors";

/**
 * Single global API client for all backend communication.
 * All requests go through the API Gateway at the configured base URL.
 * Includes JWT authentication and error handling interceptors.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Attach JWT token to all outgoing requests.
 * The token is read from localStorage and added as Bearer token.
 */
apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response interceptor: Handle 401 errors by clearing token and redirecting to login.
 * This ensures users are logged out if their session expires or becomes invalid.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (isUnauthorizedError(error)) {
      clearStoredAccessToken();
      // Redirect to login on 401 Unauthorized
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Legacy token management functions for backward compatibility.
 * Prefer using the auth-storage module directly for new code.
 *
 * @deprecated Use getStoredAccessToken, setStoredAccessToken, clearStoredAccessToken instead
 */
export function getToken(): string | null {
  return getStoredAccessToken();
}

/**
 * @deprecated Use setStoredAccessToken instead
 */
export function setToken(token: string): void {
  setStoredAccessToken(token);
}

/**
 * @deprecated Use clearStoredAccessToken instead
 */
export function removeToken(): void {
  clearStoredAccessToken();
}

/**
 * Helper functions for backward compatibility with existing API files.
 * These wrap any axios client (typically apiClient) for a consistent interface.
 * @deprecated - Refactor to use apiClient directly in Phase 5
 */

export async function apiGet<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.get<T>(url, config);
  return res.data;
}

export async function apiPost<T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.post<T>(url, data, config);
  return res.data;
}

export async function apiPut<T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.put<T>(url, data, config);
  return res.data;
}

export async function apiDelete<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await client.delete<T>(url, config);
  return res.data;
}

/**
 * Service client aliases - All point to the same apiClient.
 * Kept for backward compatibility with existing API files.
 * @deprecated - Use apiClient directly
 */
export { apiClient as authClient };
export { apiClient as courseClient };
export { apiClient as compositionClient };
export { apiClient as evaluationClient };
export { apiClient as rubricClient };
export { apiClient as vocabularyClient };
export { apiClient as userClient };
export { apiClient as analyticsClient };
