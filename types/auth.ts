export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'learner' | 'instructor';
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  name: string;
  role?: string;
  permissions?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'learner' | 'instructor' | 'admin';
  avatarUrl?: string;
  nativeLanguage?: string;
  learningLanguages?: string[];
  createdAt?: string;
  permissions?: UserPermission[];
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  phone?: string;
  preferences: UserPreferences;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  language: 'en' | 'zh';
  timezone?: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark';
}

export interface UserPermission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}
