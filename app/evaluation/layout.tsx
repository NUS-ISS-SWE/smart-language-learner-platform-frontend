'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  // Only instructors/graders can access evaluation routes
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Evaluation Center</h1>
        {children}
      </div>
    </div>
  );
}
