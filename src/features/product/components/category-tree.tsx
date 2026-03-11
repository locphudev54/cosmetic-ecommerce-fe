'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CategoryTreeNode from '@/features/product/components/category-tree-node'
import { findCategory, useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { Search, X } from 'lucide-react'
import React from 'react'

interface CategoryTreeProps {
  onConfirm?: () => void
}

export function CategoryTree({ onConfirm }: CategoryTreeProps) {
  const searchQuery = useCategoryTreeStore((s) => s.searchQuery)
  const selectedCategories = useCategoryTreeStore((s) => s.selectedCategories)
  const filteredCategories = useCategoryTreeStore((s) => s.filteredCategories)
  const setSearchQuery = useCategoryTreeStore((s) => s.setSearchQuery)
  const clearSearch = useCategoryTreeStore((s) => s.clearSearch)
  const clearSelection = useCategoryTreeStore((s) => s.clearSelection)
  const moveFocusedCategory = useCategoryTreeStore((s) => s.moveFocusedCategory)
  const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)
  const toggleExpand = useCategoryTreeStore((s) => s.toggleExpand)
  const setFocusedCategoryId = useCategoryTreeStore((s) => s.setFocusedCategoryId)

  // Reset keyboard focus when this component unmounts (popover closes)
  React.useEffect(() => {
    return () => {
      setFocusedCategoryId(null)
    }
  }, [setFocusedCategoryId])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocusedCategory('down')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocusedCategory('up')
      } else if (e.key === 'ArrowRight') {
        // Use getState() for a non-stale snapshot at the moment of the keypress
        const { focusedCategoryId, categories, isExpanded } = useCategoryTreeStore.getState()
        if (!focusedCategoryId) return
        e.preventDefault()
        const node = findCategory(categories, focusedCategoryId)
        // Only expand if the node has children and is not already expanded
        if (node?.children && node.children.length > 0 && !isExpanded(focusedCategoryId)) {
          toggleExpand(focusedCategoryId)
        }
      } else if (e.key === 'ArrowLeft') {
        const { focusedCategoryId, categories, isExpanded } = useCategoryTreeStore.getState()
        if (!focusedCategoryId) return
        e.preventDefault()
        const node = findCategory(categories, focusedCategoryId)
        // Only collapse if the node has children and is currently expanded
        if (node?.children && node.children.length > 0 && isExpanded(focusedCategoryId)) {
          toggleExpand(focusedCategoryId)
        }
      } else if (e.key === 'Enter') {
        // Use getState() for a non-stale snapshot at the moment of the keypress
        const { focusedCategoryId, categories } = useCategoryTreeStore.getState()
        if (!focusedCategoryId) return
        e.preventDefault()
        const node = findCategory(categories, focusedCategoryId)
        if (node?.isActive) {
          toggleSelect(focusedCategoryId)
        }
      }
    },
    [moveFocusedCategory, toggleExpand, toggleSelect]
  )

  return (
    <div className='w-full space-y-4' tabIndex={0} data-category-tree onKeyDown={handleKeyDown}>
      <div className='space-y-2'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Tìm danh mục...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pr-10 pl-10'
          />
          {searchQuery && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearSearch}
              className='absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>

      <div className='bg-card custom-scrollbar max-h-96 space-y-1.5 overflow-y-auto rounded-sm pr-3'>
        {filteredCategories.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center'>
            {searchQuery ? 'No categories found' : 'No categories available'}
          </div>
        ) : (
          <React.Fragment>
            {filteredCategories.map((category) => (
              <CategoryTreeNode key={category.id} node={category} />
            ))}
            {selectedCategories.length > 0 && (
              <div className='bg-card/80 sticky bottom-0 flex items-center justify-between px-3 py-2 text-sm backdrop-blur'>
                {/* <span className='text-muted-foreground'>
                  {selectedCategories.length}{' '}
                  {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                </span> */}
                <Button variant='outline' size='sm' onClick={clearSelection}>
                  <span>Clear ({selectedCategories.length})</span>
                </Button>

                <Button
                  variant='blue_gradient'
                  size='sm'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Prevent the event from bubbling up to the parent event - toggle the category selection
                      e.stopPropagation()
                      onConfirm?.()
                    }
                  }}
                  onClick={onConfirm}
                >
                  <span>Select ({selectedCategories.length})</span>
                </Button>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
