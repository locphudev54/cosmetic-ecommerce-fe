'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCategoryTree } from '@/features/categories/hooks'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { CategoryTree } from '@/features/product/components/category-tree'
import SelectedCategoryItem from '@/features/product/components/selected-category-item'
import { findCategory, useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { Plus, Settings2 } from 'lucide-react'
import React, { useState, useMemo } from 'react'

interface CategorySelectionProps {
  initialParentCategoryIds?: string[]
  multiSelect?: boolean
  showProductCount?: boolean
  onSelectionChange?: (selectedParentCategoryId: string) => void
}

function CategorySelection({
  // If you assign the empty array as the default value for this prop,
  // It will cause an unnecessary re-renders because the memoized value will always be a new array reference when the parent component re-render.
  // By leaving it as undefined, you can handle the default case inside the component without causing unnecessary re-renders.
  initialParentCategoryIds,
  multiSelect = false,
  showProductCount = false,
  onSelectionChange
}: CategorySelectionProps) {
  const [open, setOpen] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<CategoryTreeNodeType[]>([])

  // Instead of maintaining local selection state in CategoryTree component and binding the callback from here to sync with the store,
  //  we can directly read the selected categories from the store here and pass it down to CategoryTree as a prop.
  // This way, we have a single source of truth for the selection state in the store, and we can avoid potential issues with syncing local state and store state
  const selectedCategoriesFromStore = useCategoryTreeStore((s) => s.selectedCategories)
  const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)

  const setCategories = useCategoryTreeStore((s) => s.setCategories)
  const setMultiSelect = useCategoryTreeStore((s) => s.setMultiSelect)
  const setShowProductCount = useCategoryTreeStore((s) => s.setShowProductCount)
  const clearSelection = useCategoryTreeStore((s) => s.clearSelection)

  const { data } = useCategoryTree()
  const categoryTreeNodeList = useMemo(() => data || [], [data])

  // Update categories in store whenever the tree data changes
  React.useEffect(() => {
    if (categoryTreeNodeList.length > 0) {
      setCategories(categoryTreeNodeList)
    }
  }, [categoryTreeNodeList, setCategories])

  React.useEffect(() => {
    if (hasInitialized) return

    // Case 1: Always mark the initialized flag as True even though the selected Category doesn't have any parent category
    if (categoryTreeNodeList.length > 0) {
      setHasInitialized(true)
    }

    // Case 2: The selected Category has parent category, we need to expand the tree to the parent category and select it
    if (initialParentCategoryIds && initialParentCategoryIds.length > 0) {
      initialParentCategoryIds.forEach((id) => {
        const category = findCategory(categoryTreeNodeList, id)
        if (category) {
          toggleSelect(id)
          setSelectedCategories((prev) => [...prev, category])
        }
      })

      setHasInitialized(true)
    }
  }, [categoryTreeNodeList, hasInitialized, initialParentCategoryIds, toggleSelect])

  React.useEffect(() => {
    setMultiSelect(multiSelect)
  }, [multiSelect, setMultiSelect])

  React.useEffect(() => {
    setShowProductCount(showProductCount)
  }, [showProductCount, setShowProductCount])

  React.useEffect(() => {
    return () => {
      clearSelection()
    }
  }, [clearSelection])

  // Sync selection changes to the store
  // React.useEffect(() => {
  //   selectedCategories.forEach((cat) => toggleSelect(cat.id))
  // }, [selectedCategories, toggleSelect])

  return (
    <React.Fragment>
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          // When popover closes, sync the current selection from the store to local state
          if (!open) {
            setSelectedCategories(selectedCategoriesFromStore)
            onSelectionChange?.(selectedCategoriesFromStore[0]?.id)
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant={'outline'} className='w-full'>
            {selectedCategories.length === 0 ? (
              <>
                <Plus />
                <span>Chọn danh mục</span>
              </>
            ) : (
              <>
                <Settings2 />
                <span>{selectedCategories.length} danh mục đã chọn</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-96' align='end'>
          <CategoryTree />
        </PopoverContent>
      </Popover>
      {selectedCategories.length > 0 && (
        <React.Fragment>
          {selectedCategories.map((cat) => {
            return (
              <SelectedCategoryItem
                key={cat.id}
                node={cat}
                onClick={() => setOpen(true)}
                onRemove={() => {
                  setSelectedCategories((prev) => {
                    return prev.filter((c) => c.id !== cat.id)
                  })
                  toggleSelect(cat.id)
                }}
              />
            )
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default React.memo(CategorySelection)
