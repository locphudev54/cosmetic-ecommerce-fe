'use client'

import { InfiniteScrollMode, useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { ApiResponse, CursorPaginationMeta } from '@/types'
import { groupIntoRows, isNearEnd } from '@/utilts/client.utils'
import type { QueryKey } from '@tanstack/react-query'
import { useVirtualizer, type VirtualizerOptions } from '@tanstack/react-virtual'
import React, { useCallback, useEffect, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseVirtualInfiniteScrollOptions<TData, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey
  queryFn: (cursor: string | null) => Promise<ApiResponse<TData[], CursorPaginationMeta>>

  /**
   * - `'scroll'` — fetches next page automatically when the user scrolls near
   *                the bottom of the virtual list (default)
   * - `'manual'` — fetches next page only when `fetchNextPage` is called
   *                (e.g. a "View more" button)
   */
  mode?: InfiniteScrollMode

  /**
   * Estimated height (px) of each row. Used by the virtualizer before it has
   * measured the real DOM node. Defaults to 80.
   */
  estimateSize?: number

  /**
   * Number of items to render beyond the visible window. Defaults to 5.
   * Also controls how early the next page is pre-fetched in `'scroll'` mode.
   */
  overscan?: number

  /**
   * Number of columns for grid layout. Pass `1` (default) for a plain list.
   * Items are grouped into rows; each row is one virtual item.
   */
  columns?: number

  /**
   * Extra virtualizer options forwarded directly to `useVirtualizer`.
   * `count`, `getScrollElement`, `estimateSize`, and `overscan` are managed
   * internally and should not be overridden here.
   */
  virtualizerOptions?: Omit<
    VirtualizerOptions<HTMLDivElement, Element>,
    'count' | 'getScrollElement' | 'estimateSize' | 'overscan'
  >

  enabled?: boolean
}

export interface UseVirtualInfiniteScrollResult<TData> {
  /** Flat list of all fetched items (same as useInfiniteScroll) */
  items: TData[]

  /**
   * For grid mode: 2-D array of rows derived from `items`.
   * For list mode: identical to `items` wrapped in single-element rows.
   * Use this when rendering virtual rows.
   */
  rows: TData[][]

  /** Attach this to the scrollable container div */
  scrollContainerRef: (node: HTMLDivElement | null) => void

  /** The virtualizer instance — use `virtualizer.getVirtualItems()` to render */
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>

  /** Total height/width of the virtual scroll area (px) */
  totalSize: number

  /** True once the scroll container is mounted and the virtualizer is ready */
  isVirtualizerReady: boolean

  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null

  /** Call this to load the next page (primary API in `'manual'` mode) */
  fetchNextPage: () => void
  refetch: () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVirtualInfiniteScroll<TData, TQueryKey extends QueryKey = QueryKey>({
  queryKey,
  queryFn,
  mode = 'scroll',
  estimateSize = 80,
  overscan = 5,
  columns = 1,
  virtualizerOptions,
  enabled = true
}: UseVirtualInfiniteScrollOptions<TData, TQueryKey>): UseVirtualInfiniteScrollResult<TData> {
  const [scrollElement, setScrollElement] = React.useState<HTMLDivElement | null>(null)
  const isVirtualizerReady = scrollElement !== null

  const scrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    setScrollElement(node)
  }, [])

  // ── Data layer (cursor pagination) ────────────────────────────────────────
  const {
    items,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isFetching,
    error,
    fetchNextPage,
    refetch
  } = useInfiniteScroll({
    queryKey,
    queryFn,
    mode: 'manual', // virtualizer drives fetching — IntersectionObserver not needed
    queryOptions: { enabled }
  })

  // ── Grid grouping ─────────────────────────────────────────────────────────
  const rows = useMemo(() => groupIntoRows(items, Math.max(1, columns)), [items, columns])

  // ── Virtualizer ──────────────────────────────────────────────────────────
  const virtualizer = useVirtualizer<HTMLDivElement, Element>({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateSize,
    overscan,
    ...virtualizerOptions
  })

  const totalSize = virtualizer.getTotalSize()
  const virtualItems = virtualizer.getVirtualItems()

  // ── Auto-fetch when near the end (scroll mode only) ──────────────────────
  const fetchIfNearEnd = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    if (virtualItems.length === 0) return

    const lastIndex = virtualItems[virtualItems.length - 1].index
    if (isNearEnd(lastIndex, rows.length, overscan)) {
      fetchNextPage()
    }
  }, [virtualItems, rows.length, overscan, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    if (mode !== 'scroll') return
    fetchIfNearEnd()
  }, [mode, fetchIfNearEnd])

  return {
    items,
    rows,
    scrollContainerRef,
    virtualizer,
    isVirtualizerReady,
    totalSize,
    isFetching,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
    refetch
  }
}
