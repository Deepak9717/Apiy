/**
 * providers.tsx
 * 
 * All React context providers in one place.
 * Keeps layout.tsx clean — just import <Providers> and wrap children.
 * 
 * Why combine them here?
 * - QueryProvider (React Query) and AuthProvider (NextAuth SessionProvider)
 *   are both pure wrappers with no UI. They belong in lib/, not providers/.
 * - One import in layout.tsx is cleaner than two.
 */
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState so QueryClient is created once per component lifetime, not on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries:   { staleTime: 1000 * 60 * 5, retry: false },
          mutations: { retry: false },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
