import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const TOKEN_KEY = "sllp_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function createServiceClient(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL, timeout: 10000 });

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Each environment variable maps to a dedicated Spring Boot microservice.
// Fall back to localhost defaults so the app works out-of-the-box.
export const authClient = createServiceClient(
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? "http://localhost:8081"
);

export const userClient = createServiceClient(
  process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:8082"
);

export const courseClient = createServiceClient(
  process.env.NEXT_PUBLIC_COURSE_SERVICE_URL ?? "http://localhost:8083"
);

export const vocabularyClient = createServiceClient(
  process.env.NEXT_PUBLIC_VOCABULARY_SERVICE_URL ?? "http://localhost:8084"
);

export const compositionClient = createServiceClient(
  process.env.NEXT_PUBLIC_COMPOSITION_SERVICE_URL ?? "http://localhost:8085"
);

export const evaluationClient = createServiceClient(
  process.env.NEXT_PUBLIC_EVALUATION_SERVICE_URL ?? "http://localhost:8086"
);

export const rubricClient = createServiceClient(
  process.env.NEXT_PUBLIC_RUBRIC_SERVICE_URL ?? "http://localhost:8087"
);

export const analyticsClient = createServiceClient(
  process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL ?? "http://localhost:8088"
);

// Generic helper to unwrap Axios responses
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
