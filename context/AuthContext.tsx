"use client";
 
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/types/auth";
import { login, logout, register } from "@/lib/api/auth";
import { getStoredAccessToken } from "@/lib/auth-storage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate auth state from stored token on mount
  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    const storedUser = window.localStorage.getItem("sllp.user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (credentials: LoginRequest) => {
    const res = await login(credentials);
    const authUser: AuthUser = { username: credentials.username, role: res.role };
    setUser(authUser);
    window.localStorage.setItem("sllp.user", JSON.stringify(authUser));
    window.location.href = "/dashboard";
  }, []);

  const signUp = useCallback(async (payload: RegisterRequest) => {
    await register(payload);
    window.location.href = "/register/success";
  }, []);

  const signOut = useCallback(() => {
    logout();
    setUser(null);
    window.localStorage.removeItem("sllp.user");
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ user, isLoading, isAuthenticated: !!user, signIn, signUp, signOut }),
        [user, isLoading, signIn, signUp, signOut]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
