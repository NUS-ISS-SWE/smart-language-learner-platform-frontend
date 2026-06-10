export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  preferredLanguage: "ENGLISH" | "CHINESE";
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};

export type ForgotPasswordRequest = {
  email: string;
};

export type JwtAccessToken = {
  accessToken: string;
  role: string;
};

export type AppUser = {
  id?: number;
  username: string;
  email: string;
  role?: string;
  status?: string;
  preferredLanguage?: string;
  difficultyLevel?: string;
};

// Used in AuthContext to represent signed-in state
export type AuthUser = {
  username: string;
  role: string;
};

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
