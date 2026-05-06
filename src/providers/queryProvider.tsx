'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Wraps the app with TanStack Query's QueryClientProvider.
 * Placed in app/layout.tsx so all routes can use useQuery/useMutation.
 *
 * Default config:
 * - staleTime: 60s  — data stays fresh for 1 minute before a background refetch
 * - retry: 1        — one automatic retry on failure
 * - refetchOnWindowFocus: false — avoids unexpected refetches when switching tabs
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
