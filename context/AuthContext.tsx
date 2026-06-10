"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate auth state from stored token on mount
  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    // Token exists but we do not have a profile endpoint in source of truth.
    // Restore a minimal user state so the app knows the user is authenticated.
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("sllp.user") : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
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
    window.sessionStorage.setItem("sllp.user", JSON.stringify(authUser));
    router.push("/dashboard");
  }, [router]);

  const signUp = useCallback(async (payload: RegisterRequest) => {
    await register(payload);
    router.push("/register/success");
  }, [router]);

  const signOut = useCallback(() => {
    logout();
    setUser(null);
    window.sessionStorage.removeItem("sllp.user");
    router.push("/login");
  }, [router]);

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
