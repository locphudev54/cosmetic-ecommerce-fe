'use client'

import React from 'react'
import type { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualGridProps<TItem> {
  items: TItem[]
  rows: TItem[][] // rows from useVirtualInfiniteScroll
  columns: number
  scrollContainerRef: (node: HTMLDivElement | null) => void
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>
  totalSize: number
  /**
   * Render a single cell. Receives the item and its flat index across all pages.
   * Return `null` for empty cells in the last row (item will be undefined).
   */
  renderItem: (item: TItem, index: number) => React.ReactNode
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  isError: boolean
  error?: Error | null
  isVirtualizerReady: boolean
  fetchNextPage: () => void
  mode?: 'scroll' | 'manual'
  /** Gap between cells (px). Defaults to 16. */
  gap?: number
  /** Fixed height of the scrollable container. Defaults to '600px'. */
  containerHeight?: string
  loadingFallback?: React.ReactNode
  emptyState?: React.ReactNode
}

export function VirtualGrid<TItem>({
  items,
  rows,
  columns,
  scrollContainerRef,
  virtualizer,
  totalSize,
  isVirtualizerReady,
  renderItem,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  error,
  fetchNextPage,
  mode = 'scroll',
  gap = 16,
  containerHeight = '600px',
  loadingFallback,
  emptyState
}: VirtualGridProps<TItem>) {
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className='flex justify-center py-20'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
        </div>
      )
    )
  }

  if (isError) {
    return (
      <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm'>
        {error?.message ?? 'Something went wrong.'}
      </div>
    )
  }

  if (items.length === 0) {
    return emptyState ?? <p className='text-muted-foreground py-10 text-center'>No items found.</p>
  }

  const virtualItems = isVirtualizerReady ? virtualizer.getVirtualItems() : []

  return (
    <div className='flex flex-col gap-4'>
      {/* Scrollable viewport */}
      <div
        ref={scrollContainerRef}
        style={{ height: containerHeight, overflowY: 'auto' }}
        className='rounded-lg border'
      >
        {/* Inner spacer */}
        <div style={{ height: totalSize, position: 'relative' }}>
          {virtualItems.map((virtualRow) => {
            const rowItems = rows[virtualRow.index]
            if (!rowItems) return null

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  // bottom padding acts as the row gap
                  paddingBottom: gap
                }}
              >
                {/* Row: divide container into equal columns */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap
                  }}
                >
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const item = rowItems[colIndex]
                    const flatIndex = virtualRow.index * columns + colIndex

                    // Empty cell — keeps grid alignment in the last row
                    if (item === undefined) {
                      return <div key={colIndex} aria-hidden='true' />
                    }

                    return (
                      <div className='' key={colIndex}>
                        {renderItem(item, flatIndex)}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Manual mode: View more button */}
      {mode === 'manual' && hasNextPage && (
        <div className='flex justify-center'>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='hover:bg-accent rounded-lg border px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50'
          >
            {isFetchingNextPage ? (
              <span className='flex items-center gap-2'>
                <span className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                Loading…
              </span>
            ) : (
              'View more'
            )}
          </button>
        </div>
      )}

      {/* Scroll mode: loading more indicator */}
      {mode === 'scroll' && isFetchingNextPage && (
        <div className='text-muted-foreground flex items-center justify-center gap-2 py-4 text-sm'>
          <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
          Loading more…
        </div>
      )}

      {!hasNextPage && !isFetchingNextPage && (
        <p className='text-muted-foreground py-2 text-center text-sm'>You have reached the end.</p>
      )}
    </div>
  )
}
