'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CategoryTreeNode from '@/features/product/components/category-tree-node'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { Search, X } from 'lucide-react'
import React from 'react'

export function CategoryTree() {
  const searchQuery = useCategoryTreeStore((s) => s.searchQuery)
  const selectedCategories = useCategoryTreeStore((s) => s.selectedCategories)
  const filteredCategories = useCategoryTreeStore((s) => s.filteredCategories)
  const setSearchQuery = useCategoryTreeStore((s) => s.setSearchQuery)
  const clearSearch = useCategoryTreeStore((s) => s.clearSearch)
  const clearSelection = useCategoryTreeStore((s) => s.clearSelection)

  return (
    <div className='w-full space-y-4'>
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
                <span className='text-muted-foreground'>
                  {selectedCategories.length}{' '}
                  {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                </span>
                <Button variant='outline' size='sm' onClick={clearSelection}>
                  <span>Clear selection ({selectedCategories.length})</span>
                </Button>

                {/* <Button variant='blue_gradient' size='sm'>
                  <span>Chọn ({selectedCategories.length})</span>
                </Button> */}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
