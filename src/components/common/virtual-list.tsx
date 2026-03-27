'use client'

import React from 'react'
import type { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualListProps<TItem> {
  items: TItem[]
  rows: TItem[][] // rows from useVirtualInfiniteScroll
  scrollContainerRef: (node: HTMLDivElement | null) => void
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>
  totalSize: number
  renderItem: (item: TItem, index: number) => React.ReactNode // flat index
  isLoading: boolean
  isVirtualizerReady: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  isError: boolean
  error?: Error | null
  fetchNextPage: () => void // for manual mode button
  mode?: 'scroll' | 'manual'
  /** Fixed height of the scrollable container. Defaults to '600px'. */
  containerHeight?: string
  loadingFallback?: React.ReactNode
  emptyState?: React.ReactNode
}

export function VirtualList<TItem>({
  items,
  rows,
  scrollContainerRef,
  virtualizer,
  totalSize,
  renderItem,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isVirtualizerReady,
  isError,
  error,
  fetchNextPage,
  mode = 'scroll',
  containerHeight = '600px',
  loadingFallback,
  emptyState
}: VirtualListProps<TItem>) {
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
        {/* Inner spacer — height equals total virtual scroll area */}
        <div style={{ height: totalSize, position: 'relative' }}>
          {virtualItems.map((virtualRow) => {
            // rows is always [[item]] for list mode (columns=1)
            const item = rows[virtualRow.index]?.[0]
            if (item === undefined) return null

            // Flat index = same as virtual row index for single-column
            const flatIndex = virtualRow.index

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
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {renderItem(item, flatIndex)}
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
