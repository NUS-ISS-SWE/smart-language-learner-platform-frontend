"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { login, logout, register, getCurrentUser } from "@/lib/api/auth";
import { getToken } from "@/lib/api/client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signIn = async (credentials: LoginRequest) => {
    const res = await login(credentials);
    setUser({ id: res.userId, email: res.email, name: res.name });
    // Set a cookie so the proxy can verify authentication server-side
    document.cookie = "sllp_auth=1; path=/; SameSite=Lax";
    router.push("/dashboard");
  };

  const signUp = async (payload: RegisterRequest) => {
    const res = await register(payload);
    setUser({ id: res.userId, email: res.email, name: res.name });
    // Set a cookie so the proxy can verify authentication server-side
    document.cookie = "sllp_auth=1; path=/; SameSite=Lax";
    router.push("/dashboard");
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    // Remove the auth cookie
    document.cookie = "sllp_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
