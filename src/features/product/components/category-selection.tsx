'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCategoryTree } from '@/features/categories/hooks'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { CategoryTree } from '@/features/product/components/category-tree'
import SelectedCategoryItem from '@/features/product/components/selected-category-item'
import { findCategory, useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { Plus, Settings2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface CategorySelectionProps {
  initialParentCategoryIds?: string[]
  multiSelect?: boolean
  showProductCount?: boolean
  onSelectionChange?: (selectedParentCategoryIds: string[]) => void
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
  const [selectedLeafCategories, setSelectedLeafCategories] = useState<CategoryTreeNodeType[]>([])
  // const [selectedCategories, setSelectedCategories] = useState<CategoryTreeNodeType[]>([])

  // Instead of maintaining local selection state in CategoryTree component and binding the callback from here to sync with the store,
  //  we can directly read the selected categories from the store here and pass it down to CategoryTree as a prop.
  // This way, we have a single source of truth for the selection state in the store, and we can avoid potential issues with syncing local state and store state

  // The first way
  // const selectedCategoriesFromStore = useCategoryTreeStore((s) => s.selectedCategories)
  // const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)

  // const setCategories = useCategoryTreeStore((s) => s.setCategories)
  // const setMultiSelect = useCategoryTreeStore((s) => s.setMultiSelect)
  // const setShowProductCount = useCategoryTreeStore((s) => s.setShowProductCount)
  // const clearSelection = useCategoryTreeStore((s) => s.clearSelection)

  // The second way: use a single selector to get all the necessary state and actions from the store, this way we can ensure that the component only re-renders when the relevant parts of the state change
  const {
    selectedCategories,
    toggleSelect,
    setCategories,
    setMultiSelect,
    setShowProductCount,
    clearSelection,
    expandNodes,
    setPrimaryCategoryId
  } = useCategoryTreeStore(
    useShallow((s) => ({
      selectedCategories: s.selectedCategories,
      setPrimaryCategoryId: s.setPrimaryCategoryId,
      toggleSelect: s.toggleSelect,
      setCategories: s.setCategories,
      setMultiSelect: s.setMultiSelect,
      setShowProductCount: s.setShowProductCount,
      clearSelection: s.clearSelection,
      expandNodes: s.expandNodes
    }))
  )

  // The third way: use the store state and actions directly in the component without destructuring, this way we can avoid unnecessary re-renders caused by changing references of the destructured variables, but it may make the code less readable and harder to maintain
  // const categoryTreeStore = useCategoryTreeStore(s => s)
  // const { selectedCategories, toggleSelect, setCategories, setMultiSelect, setShowProductCount, clearSelection } = categoryTreeStore

  const { data } = useCategoryTree({ isDeleted: false })
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
    if (
      categoryTreeNodeList.length > 0 &&
      initialParentCategoryIds &&
      initialParentCategoryIds.length === 0
    ) {
      setHasInitialized(true)
    }

    // Case 2: The selected Category has parent category, we need to expand the tree to the parent category and select it
    if (
      initialParentCategoryIds &&
      initialParentCategoryIds.length > 0 &&
      categoryTreeNodeList.length > 0
    ) {
      const ancestorIds: string[] = []

      initialParentCategoryIds.forEach((id) => {
        const category = findCategory(categoryTreeNodeList, id)

        // Prevent duplicate selection and expansion in case of the parent component of CategorySelection re-rendering
        // with the same initialParentCategoryIds
        const isSelected = selectedCategories.some((cat) => cat.id === id)

        if (category && !isSelected) {
          toggleSelect(id)
          // setSelectedCategories((prev) => [...prev, category])
          setSelectedLeafCategories((prev) => [...prev, category])
          // Collect ancestor IDs so the tree expands to reveal this node
          // const ancestors = findAncestorIds(categoryTreeNodeList, id)
          const ancestors = category.path.split('/').slice(0, -1) // Assuming path is like "root/parent/child", this will give us ["root", "parent"]
          ancestorIds.push(...ancestors)
        }
      })

      // Bulk-expand all ancestors in a single recomputation
      if (ancestorIds.length > 0) {
        expandNodes(ancestorIds)
      }

      setHasInitialized(true)
    }
  }, [
    categoryTreeNodeList,
    hasInitialized,
    initialParentCategoryIds,
    toggleSelect,
    expandNodes,
    selectedCategories
  ])

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

  const handleClose = React.useCallback(() => {
    // Use getState() to guarantee a non-stale snapshot at the moment of closing,
    // regardless of whether the close was triggered by Radix (click-outside / Escape)
    // or programmatically via onConfirm.
    // const { selectedCategories } = useCategoryTreeStore.getState()

    if (multiSelect) {
      // Only display leaf categories in the UI
      const leafCategoryIds = new Set(selectedCategories.map((cat) => cat.id))

      // Remove ancestor category IDs from the leafCategoryIds set
      selectedCategories.forEach((cat) => {
        //  "root_id/parent_id/child", this will give us ["root_id", "parent_id"]
        const ancestorCategoryIds = cat.path.split('/').slice(0, -1)

        ancestorCategoryIds.forEach((ancestorId) => {
          if (leafCategoryIds.has(ancestorId)) {
            leafCategoryIds.delete(ancestorId)
          }
        })
      })

      const selectedLeafCategoryList = selectedCategories.filter((cat) =>
        leafCategoryIds.has(cat.id)
      )

      // const selectedLeafCategoryList = selectedCategories.filter(
      //   (cat) => cat.children && cat.children.length === 0 // Wrong, because user can select a category that still has children
      // )

      if (selectedLeafCategoryList.length > 0) {
        // Only set the primary category if there is at least one selected leaf category
        const leafCategory = selectedLeafCategoryList[selectedLeafCategoryList.length - 1]
        setPrimaryCategoryId(leafCategory.id)
        setSelectedLeafCategories(selectedLeafCategoryList)
      } else {
        // Otherwise clear the primary category selection
        setPrimaryCategoryId(null)
        setSelectedLeafCategories([])
      }
    } else {
      setSelectedLeafCategories(selectedCategories)
    }

    // setSelectedCategories(selectedCategories)
    // Use the selected categories instead of leafCategories beacuse it's full and correct than leaf categories -> Use for displaying in the UI
    onSelectionChange?.(selectedCategories.map((cat) => cat.id))
    setOpen(false)
  }, [multiSelect, onSelectionChange, selectedCategories, setPrimaryCategoryId])

  // Sync selection changes to the store
  // React.useEffect(() => {
  //   selectedCategories.forEach((cat) => toggleSelect(cat.id))
  // }, [selectedCategories, toggleSelect])

  return (
    <React.Fragment>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose()
          } else {
            setOpen(true)
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
          <CategoryTree onConfirm={handleClose} />
        </PopoverContent>
      </Popover>
      {selectedLeafCategories.length > 0 && (
        <React.Fragment>
          {selectedLeafCategories.map((leafCat, leafCatIdx) => {
            // Whenever render each selectedCatgoryItem, we need to determine wheter if this item will be removed
            // The nearest ancestor category that will be added back to the selection if the user click the "remove" button

            // And we also need to re-determine the ancestor categories to pass it to the SelectedCategoryItem component via props

            const ancestorCategoryIds = multiSelect ? leafCat.path.split('/') : []

            // order-guaranteed parent categories of the selected category
            // from the root category down to the most specific sub-category
            const ancestorCategories = multiSelect
              ? ancestorCategoryIds
                  .map(
                    (parentId) =>
                      selectedCategories.find((selectedCat) => selectedCat.id === parentId) // Only filter the user-selected ancestor categories
                  )
                  .filter((cat) => cat !== undefined)
              : []

            // Add the nearest parent category back to the selection and remove the removing category
            const nearestAncestorCategory =
              multiSelect && ancestorCategories.length > 0
                ? ancestorCategories[ancestorCategories.length - 1]
                : null

            const shouldDisplayBackNearestAncestor =
              nearestAncestorCategory &&
              selectedLeafCategories.filter((leafCat) => {
                const ancestorLeafCatIds = leafCat.path.split('/')
                // determine by the id of nearest ancestor instead of using path property + starsWith method
                // because there is may be many other categories that have the same path prefix but different nearest ancestor category. Mostly in the case:
                // nearestAncestorCategory: the root category
                return ancestorLeafCatIds.includes(nearestAncestorCategory.id)
              }).length === 1

            return (
              <SelectedCategoryItem
                key={leafCat.id}
                node={leafCat}
                ancestorCategories={ancestorCategories}
                onClick={() => setOpen(true)}
                onRemove={() => {
                  if (shouldDisplayBackNearestAncestor) {
                    setSelectedLeafCategories((prev) => {
                      // ~  remove + replace
                      prev[leafCatIdx] = nearestAncestorCategory
                      return [...prev]
                    })
                  } else {
                    // Remove from the UI state
                    setSelectedLeafCategories((prev) => prev.filter((c) => c.id !== leafCat.id))
                  }

                  // Remove the leaf category from the store selection
                  toggleSelect(leafCat.id)
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
