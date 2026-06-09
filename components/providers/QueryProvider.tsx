"use client";

import React from "react";
import {
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

interface QueryProviderProps {
  readonly children: React.ReactNode;
}

/**
 * QueryProvider wraps the application with React Query's QueryClientProvider.
 * This enables all server state management features throughout the app.
 *
 * Must be placed inside the root layout or a top-level component.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
