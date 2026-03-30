'use client'

import { useEffect, useRef, useCallback } from 'react'
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey
} from '@tanstack/react-query'
import { ApiResponse, CursorPaginationMeta } from '@/types'

export interface UseInfiniteScrollResult<TData> {
  /** Flat list of all loaded items */
  items: TData[]
  /**
   * Ref to attach to the sentinel div at the bottom of your list.
   * Only required in `'scroll'` mode — ignored in `'manual'` mode.
   */
  sentinelRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  isFetchingNextPage: boolean
  isFetching: boolean
  hasNextPage: boolean
  isError: boolean
  error: Error | null
  totalItems: number
  /** Manually trigger loading the next page */
  fetchNextPage: () => void
  /** Refetch from the beginning */
  refetch: () => void
}

/**
 * - `'scroll'`  — next page loads automatically when the sentinel enters the
 *                 viewport (default). Attach `sentinelRef` to a div at the
 *                 bottom of your list.
 * - `'manual'`  — next page only loads when `fetchNextPage` is called
 *                 explicitly (e.g. a "View more" button). `sentinelRef` and
 *                 the IntersectionObserver are not used.
 */
export type InfiniteScrollMode = 'scroll' | 'manual'

export interface UseInfiniteScrollOptions<TData, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey
  queryFn: (cursor: string | null) => Promise<ApiResponse<TData[], CursorPaginationMeta>>
  /**
   * Controls how the next page is triggered. Defaults to `'scroll'`.
   */
  mode?: InfiniteScrollMode
  /**
   * Intersection Observer threshold (0–1). Defaults to 0.1.
   */
  threshold?: number
  /**
   * Root margin for the sentinel element. Defaults to '100px'.
   */
  rootMargin?: string
  /**
   * Any additional TanStack Query options (except queryKey / queryFn /
   * getNextPageParam / initialPageParam which are managed internally).
   */
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      ApiResponse<TData[], CursorPaginationMeta>,
      Error,
      InfiniteData<ApiResponse<TData[], CursorPaginationMeta>>,
      TQueryKey,
      string | null
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
}

export function useInfiniteScroll<TData, TQueryKey extends QueryKey = QueryKey>({
  queryKey,
  queryFn,
  mode = 'scroll',
  threshold = 0.1,
  rootMargin = '100px',
  queryOptions
}: UseInfiniteScrollOptions<TData, TQueryKey>): UseInfiniteScrollResult<TData> {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isError,
    error,
    refetch
  } = useInfiniteQuery<
    ApiResponse<TData[], CursorPaginationMeta>,
    Error,
    InfiniteData<ApiResponse<TData[], CursorPaginationMeta>>,
    TQueryKey,
    string | null
  >({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam ?? null),
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNextPage ? lastPage.meta?.nextCursor : undefined,
    initialPageParam: null,
    ...(queryOptions as any)
  })

  // Flatten pages → items
  const items: TData[] = data?.pages.flatMap((page) => page.data) ?? []

  // Auto-fetch when sentinel enters the viewport - only in 'scroll' mode
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  useEffect(() => {
    if (mode !== 'scroll') return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleIntersection, threshold, rootMargin, mode])

  console.log({ data })
  debugger
  return {
    items,
    sentinelRef,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    isError,
    totalItems: data?.pages[0].meta?.totalItems ?? 0,
    error: error ?? null,
    fetchNextPage,
    refetch
  }
}
