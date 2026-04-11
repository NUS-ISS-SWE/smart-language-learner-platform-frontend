'use client';

import { Card } from './Card';
import { Badge } from './Badge';

interface FeatureStubProps {
  readonly route: string;
  readonly sprint: number;
  readonly description?: string;
}

export function FeatureStub({ route, sprint, description }: FeatureStubProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </h1>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Sprint {sprint}
            </Badge>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            {description || `The ${route} feature is currently under development.`}
          </p>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Route: <code className="font-mono text-gray-700 dark:text-gray-300">{route}</code>
            </p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Check back later for updates!
          </p>
        </div>
      </Card>
    </div>
  );
}
