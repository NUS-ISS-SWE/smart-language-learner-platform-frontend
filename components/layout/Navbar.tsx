"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

type UserRole = 'learner' | 'instructor' | 'admin';

interface NavbarProps {
  readonly userRole?: UserRole;
}

export function Navbar({ userRole = 'learner' }: NavbarProps) {
  const { t } = useTranslation("common");
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

        {/* Nav links - Role based */}
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
            {(userRole === 'instructor' || userRole === 'admin') && (
              <>
                <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors">
                  Admin
                </Link>
                <Link href="/admin/rubrics" className="hover:text-indigo-600 transition-colors">
                  Rubrics
                </Link>
              </>
            )}
            {userRole === 'admin' && (
              <Link href="/admin/analytics" className="hover:text-indigo-600 transition-colors">
                Analytics
              </Link>
            )}
          </nav>
        )}

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
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
                <Button variant="ghost" size="sm">{t("signIn")}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("getStarted")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
