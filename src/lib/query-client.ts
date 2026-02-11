'use client'

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { isServer, QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        // staleTime: 1000 * 60,
        staleTime: 1000 * 5,

        // Cached data is garbage collected after 5 minutes
        // gcTime: 1000 * 60 * 5,
        gcTime: 1000 * 10,

        // Retry failed queries up to 3 times
        retry: 0,

        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (good for keeping data fresh)
        refetchOnWindowFocus: false,

        // Don't refetch on mount if data is fresh
        refetchOnMount: false,

        // Refetch on reconnect
        refetchOnReconnect: false,

        // Keep previous data while fetching new data
        placeholderData: (previousData: unknown) => previousData
      },
      mutations: {
        // Retry mutations once on failure
        retry: 0,

        // Short retry delay for mutations
        retryDelay: 1000
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

// Use in server components
export const getServerQueryClient = cache(() => makeQueryClient())
