'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SWRConfig } from 'swr'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

// SWR configuration
const swrConfig = {
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
}

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SWRConfig value={swrConfig}>
          {children}
        </SWRConfig>
      </QueryClientProvider>
    </ThemeProvider>
  )
} 