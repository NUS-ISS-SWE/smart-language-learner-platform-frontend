import axios, { AxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/lib/constants";
import { clearStoredAccessToken, getStoredAccessToken } from "@/lib/auth-storage";
import type { ApiError } from "@/types/common";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const onAuthPage = AUTH_PATHS.some((p) => window.location.pathname.startsWith(p));
      if (!onAuthPage) {
        clearStoredAccessToken();
        window.localStorage.removeItem("sllp.user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | string | undefined;
    if (typeof data === "string" && data.trim().length > 0) return data;
    if (typeof data === "object" && data?.detail) return data.detail;
    if (typeof data === "object" && data?.message) return data.message;
    if (typeof data === "object" && data?.error) return data.error;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
