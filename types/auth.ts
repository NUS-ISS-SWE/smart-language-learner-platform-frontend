export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  nativeLanguage?: string;
  learningLanguages?: string[];
  createdAt?: string;
}
