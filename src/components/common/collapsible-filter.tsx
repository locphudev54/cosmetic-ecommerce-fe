'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fuzzySearch } from '@/utilts/fuzzy-search.utils'

export interface FilterItem {
  id: string | number
  name: string
}

interface CollapsibleFilterProps {
  title: string
  items: FilterItem[]
  /** Externally controlled selected IDs (e.g. from URL state). When provided, the component is "controlled". */
  selectedIds?: (string | number)[]
  onSelectionChange?: (selectedIds: (string | number)[]) => void
}

export function CollapsibleFilter({
  title,
  items,
  selectedIds: controlledSelectedIds,
  onSelectionChange
}: CollapsibleFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string | number>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const isControlled = !!controlledSelectedIds

  // Use controlled IDs if provided, otherwise use internal state
  const effectiveSelectedIds = React.useMemo(
    () => (isControlled ? new Set(controlledSelectedIds) : internalSelectedIds),
    [controlledSelectedIds, internalSelectedIds, isControlled]
  )

  const filteredItems = fuzzySearch(items, searchQuery, { keys: ['name'] }).map((r) => r.item)

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    setCanScrollUp(scrollTop > 0)
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 5)
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener('resize', checkScrollButtons)
    return () => window.removeEventListener('resize', checkScrollButtons)
  }, [filteredItems])

  const scroll = (direction: 'up' | 'down') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 100
    const newScrollTop =
      direction === 'up' ? container.scrollTop - scrollAmount : container.scrollTop + scrollAmount

    container.scrollTo({ top: newScrollTop, behavior: 'smooth' })
  }

  const handleScroll = () => {
    checkScrollButtons()
  }

  const handleCheckboxChange = (itemId: string | number, checked: boolean) => {
    const newSet = new Set(effectiveSelectedIds)
    if (checked) {
      newSet.add(itemId)
    } else {
      newSet.delete(itemId)
    }

    // Update internal state only when uncontrolled
    if (!isControlled) {
      setInternalSelectedIds(newSet)
    }

    onSelectionChange?.(Array.from(newSet))
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div
        className={cn('rounded border border-gray-100 text-sm shadow', {
          'py-1.5': isExpanded,
          'pt-1.5': !isExpanded
        })}
      >
        {/* Header with Collapsible Trigger */}
        <CollapsibleTrigger asChild>
          <button className='flex w-full items-center justify-between border-b border-gray-200 px-3.5 py-2 transition-colors'>
            <h3 className='text-base font-bold text-gray-900'>{title}</h3>
            <motion.div animate={{ rotate: isExpanded ? 0 : -180 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={22} className='text-gray-500' strokeWidth={1} />
            </motion.div>
          </button>
        </CollapsibleTrigger>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative mt-4 space-y-4 pr-2'
            >
              {/* Search Bar */}
              <div className='relative mx-auto max-w-[95%]'>
                <Search
                  size={16}
                  className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    checkScrollButtons()
                  }}
                  className='w-full rounded-md border border-gray-200 py-1.5 pr-3 pl-9 text-sm placeholder:text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              {/* Navigation Button Top */}
              {canScrollUp && (
                <button
                  onClick={() => scroll('up')}
                  className='absolute top-10 left-[50%] z-10 flex translate-x-[-50%] justify-center rounded-full bg-gray-50 p-2 transition-colors hover:bg-gray-100'
                  aria-label='Scroll up'
                >
                  <ChevronUp size={16} className='text-gray-600' strokeWidth={1} />
                </button>
              )}

              {/* Items Container with Hidden Scrollbar */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className={cn('custom-scrollbar mb-0 h-40 overflow-y-auto', {
                  'flex items-center justify-center': filteredItems.length === 0
                })}
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <label
                      key={item.id}
                      className='flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 transition-colors hover:bg-gray-50'
                    >
                      <Checkbox
                        checked={effectiveSelectedIds.has(item.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(item.id, checked as boolean)
                        }
                        className='h-4 w-4'
                      />
                      <span className='flex-1 font-medium text-gray-700'>{item.name}</span>
                    </label>
                  ))
                ) : (
                  <p className='w-full py-4 text-center text-gray-400'>No filter items found</p>
                )}
              </div>

              {/* Navigation Button Bottom */}
              {canScrollDown && (
                <button
                  onClick={() => scroll('down')}
                  className='absolute bottom-0 left-[50%] z-10 flex translate-x-[-50%] justify-center rounded-full bg-gray-50 p-2 transition-colors hover:bg-gray-100'
                  aria-label='Scroll down'
                >
                  <ChevronDown size={16} className='text-gray-600' strokeWidth={1} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Collapsible>
  )
}
