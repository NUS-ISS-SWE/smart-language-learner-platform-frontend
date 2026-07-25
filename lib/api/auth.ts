import { apiClient } from "./client";
import { setStoredAccessToken, clearStoredAccessToken } from "@/lib/auth-storage";
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, JwtAccessToken, AppUser } from "@/types/auth";

export async function login(payload: LoginRequest): Promise<JwtAccessToken> {
  const response = await apiClient.post<JwtAccessToken>("/api/v1/auth/login", payload);
  setStoredAccessToken(response.data.accessToken);
  return response.data;
}

export async function register(payload: RegisterRequest): Promise<AppUser> {
  const response = await apiClient.post<AppUser>("/api/v1/auth/register", payload);
  return response.data;
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiClient.post<void>("/api/v1/auth/forgot-password", payload);
}

export async function confirmPasswordReset(payload: ResetPasswordRequest): Promise<JwtAccessToken> {
  const response = await apiClient.post<JwtAccessToken>("/api/v1/auth/forgot-password/confirm", payload);
  return response.data;
}

export function logout(): void {
  clearStoredAccessToken();
}

