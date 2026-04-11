"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="text-lg font-bold text-indigo-700 hidden sm:block">
            SmartLangLearn
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/courses" className="hover:text-indigo-600 transition-colors">
              Courses
            </Link>
            <Link href="/vocabulary" className="hover:text-indigo-600 transition-colors">
              Vocabulary
            </Link>
          </nav>
        )}

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                Hi, <span className="font-medium text-gray-900">{user?.name}</span>
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
