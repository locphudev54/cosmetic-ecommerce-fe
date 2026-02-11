'use client'

import type { ReactNode } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next'
import QueryProvider from '@/providers/query-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </QueryProvider>
  )
}
