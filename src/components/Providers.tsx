'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries:   { staleTime: 60_000, retry: 1 },
      mutations: { retry: 0 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-body)',
            borderRadius: '12px',
            border: '1px solid #E8E7E2',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#1D9E75', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
