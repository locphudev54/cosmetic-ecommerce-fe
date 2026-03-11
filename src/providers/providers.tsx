'use client'

import type { ReactNode } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import QueryProvider from '@/providers/query-provider'
import { DialogManager } from '@/components/dialog-manager'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        {children}
        <DialogManager />
      </NuqsAdapter>
    </QueryProvider>
  )
}
