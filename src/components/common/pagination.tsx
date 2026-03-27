'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Generates a pagination range with ellipsis.
 *
 * Algorithm: Always show first `boundaryCount` pages, last `boundaryCount` pages,
 * and `siblingCount` pages on each side of the current page. Everything else
 * is collapsed into ellipsis ("…").
 *
 * Example with totalPages=20, currentPage=10, siblingCount=1, boundaryCount=1:
 *   [1, "…", 9, 10, 11, "…", 20]
 */
function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
  boundaryCount: number = 1
): (number | 'ellipsis')[] {
  if (totalPages <= 0) return []

  // If total pages fits within display limit, show all pages
  const totalDisplaySlots = boundaryCount * 2 + siblingCount * 2 + 3 // +3 for current + 2 ellipses
  if (totalPages <= totalDisplaySlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftBoundary = Array.from({ length: boundaryCount }, (_, i) => i + 1)
  const rightBoundary = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + 1 + i
  )

  const siblingStart = Math.max(currentPage - siblingCount, boundaryCount + 1)
  const siblingEnd = Math.min(currentPage + siblingCount, totalPages - boundaryCount)

  const showLeftEllipsis = siblingStart > boundaryCount + 2
  const showRightEllipsis = siblingEnd < totalPages - boundaryCount - 1

  const result: (number | 'ellipsis')[] = []

  // Left boundary
  result.push(...leftBoundary)

  // Left ellipsis or fill
  if (showLeftEllipsis) {
    result.push('ellipsis')
  } else {
    // Fill the gap between left boundary and sibling start
    for (let i = boundaryCount + 1; i < siblingStart; i++) {
      result.push(i)
    }
  }

  // Sibling range (including current page)
  for (let i = siblingStart; i <= siblingEnd; i++) {
    result.push(i)
  }

  // Right ellipsis or fill
  if (showRightEllipsis) {
    result.push('ellipsis')
  } else {
    // Fill the gap between sibling end and right boundary
    for (let i = siblingEnd + 1; i <= totalPages - boundaryCount; i++) {
      result.push(i)
    }
  }

  // Right boundary
  result.push(...rightBoundary)

  // Deduplicate (in case of overlaps at boundaries)
  const seen = new Set<number | 'ellipsis'>()
  const deduped: (number | 'ellipsis')[] = []
  let lastWasEllipsis = false
  for (const item of result) {
    if (item === 'ellipsis') {
      if (!lastWasEllipsis) {
        deduped.push(item)
        lastWasEllipsis = true
      }
    } else if (!seen.has(item)) {
      seen.add(item)
      deduped.push(item)
      lastWasEllipsis = false
    }
  }

  return deduped
}

interface PaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Callback when a page is selected */
  onPageChange: (page: number) => void
  /**
   * Number of pages to show on each side of the current page.
   * @default 1
   */
  siblingCount?: number
  /**
   * Number of pages to always show at the start and end.
   * @default 1
   */
  boundaryCount?: number
  /** Additional CSS class for the container */
  className?: string
  /** Whether the pagination is disabled (e.g. during loading) */
  disabled?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  className,
  disabled = false
}: PaginationProps) {
  const range = generatePaginationRange(currentPage, totalPages, siblingCount, boundaryCount)

  if (totalPages <= 1) return null

  return (
    <nav
      aria-label='Pagination'
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* Previous button */}
      <Button
        variant='outline'
        size='icon-sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label='Trang trước'
      >
        <ChevronLeft className='size-4' />
      </Button>

      {/* Page numbers */}
      {range.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className='text-muted-foreground flex size-8 items-center justify-center'
              aria-hidden
            >
              <MoreHorizontal className='size-4' />
            </span>
          )
        }

        const isActive = item === currentPage

        return (
          <Button
            key={item}
            variant={isActive ? 'default' : 'outline'}
            size='icon-sm'
            onClick={() => onPageChange(item)}
            disabled={disabled}
            aria-label={`Trang ${item}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item}
          </Button>
        )
      })}

      {/* Next button */}
      <Button
        variant='outline'
        size='icon-sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label='Trang sau'
      >
        <ChevronRight className='size-4' />
      </Button>
    </nav>
  )
}
