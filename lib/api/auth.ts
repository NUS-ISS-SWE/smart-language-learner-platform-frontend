import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";
import { apiClient } from "@/lib/api/client";
import { setStoredAccessToken, clearStoredAccessToken } from "@/lib/auth-storage";

/**
 * Login with email and password credentials.
 * On success, stores the access token and returns user data.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/auth/login",
    credentials
  );
  setStoredAccessToken(data.accessToken);
  return data;
}

/**
 * Register a new user account.
 * On success, stores the access token and returns user data.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/auth/register",
    payload
  );
  setStoredAccessToken(data.accessToken);
  return data;
}

/**
 * Logout the current user.
 * Clears the access token from storage even if the logout request fails.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } finally {
    clearStoredAccessToken();
  }
}

/**
 * Fetch the current authenticated user's profile.
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/api/users/me");
  return data;
}
