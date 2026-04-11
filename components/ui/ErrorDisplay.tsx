'use client';

import { Card } from './Card';
import { Button } from './Button';

interface ErrorDisplayProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly isDevelopment?: boolean;
}

export function ErrorDisplay({
  error,
  reset,
  isDevelopment = process.env.NODE_ENV === 'development',
}: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <div className="space-y-4">
          {/* Error Icon & Header */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong
            </h1>
          </div>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {error?.message ||
              'An unexpected error occurred. Please try again.'}
          </p>

          {/* Development Error Details */}
          {isDevelopment && error?.message && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 space-y-2">
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                Error Details:
              </p>
              <details className="cursor-pointer">
                <summary className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  View stack trace
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-32 text-gray-700 dark:text-gray-300">
                  {error?.stack}
                </pre>
              </details>
              {error?.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try again
            </Button>
            <Button
              onClick={() => (globalThis.window.location.href = '/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Go home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
