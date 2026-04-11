import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";
import { apiGet, apiPost, authClient, setToken, removeToken, userClient } from "./client";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiPost<AuthResponse>(authClient, "/api/auth/login", credentials);
  setToken(data.accessToken);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const data = await apiPost<AuthResponse>(authClient, "/api/auth/register", payload);
  setToken(data.accessToken);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiPost(authClient, "/api/auth/logout");
  } finally {
    removeToken();
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiGet<User>(userClient, "/api/users/me");
}
