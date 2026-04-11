'use client';

import { useAuth } from '@/context/AuthContext';
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Determine user role for conditional navigation
  const userRole = user?.role || 'learner';

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar userRole={userRole} />
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userRole={userRole} />
      <div className="flex flex-1">
        <Sidebar userRole={userRole} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
