'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error is handled by the error boundary
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          An unexpected error occurred. Please try again.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm font-mono text-red-800">{error.message}</p>
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
