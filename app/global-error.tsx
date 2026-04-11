'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    // Error is handled by the global error boundary
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Application Error
            </h1>
            <p className="mb-6 text-lg text-gray-600">
              The application encountered a critical error.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                <p className="text-sm font-mono text-red-800">{error.message}</p>
              </div>
            )}
            <button
              onClick={reset}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
