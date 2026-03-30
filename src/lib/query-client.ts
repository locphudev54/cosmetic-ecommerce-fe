// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { isServer } from '@/lib/utils'
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        staleTime: 1000 * 60,
        // staleTime: 1000 * 10,

        // Cached data is garbage collected after 5 minutes
        gcTime: 1000 * 60 * 5,

        // Retry failed queries up to 3 times
        retry: 0,

        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (good for keeping data fresh)
        refetchOnWindowFocus: false,

        // Don't refetch on mount if data is fresh, just refresh if data is stale - by invalidate function AND the component mounts
        refetchOnMount: true,

        // Refetch on reconnect
        refetchOnReconnect: true,

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

// The below function is usually used in client components,
// but it can also be used in server components if you want to create a new query client for each request
// (not recommended for performance reasons) -> in that case, you can use getServerQueryClient (below) instead which is cached per request

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
