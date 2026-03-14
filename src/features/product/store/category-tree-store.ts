import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CategoryTreeState {
  // Data
  primaryCategoryId: string | null // always one primary category for the product, must be one of the selected categories or may be undefined
  categories: CategoryTreeNodeType[]
  searchQuery: string
  expanded: Set<string>
  selectedCategories: CategoryTreeNodeType[]
  multiSelect: boolean
  showProductCount: boolean

  // Computed
  matchingNodes: Set<string>
  autoExpandedNodes: Set<string>
  filteredCategories: CategoryTreeNodeType[]
  visibleNodeIds: string[]

  // Keyboard navigation
  focusedCategoryId: string | null

  // Actions
  setPrimaryCategoryId: (id: string | null) => void
  clearPrimaryCategoryId: () => void
  setCategories: (categories: CategoryTreeNodeType[]) => void
  setSearchQuery: (query: string) => void
  setMultiSelect: (multiSelect: boolean) => void
  setShowProductCount: (showProductCount: boolean) => void
  // set: (callback?: (selected: string[]) => void) => void
  toggleExpand: (id: string) => void
  expandNodes: (ids: string[]) => void
  toggleSelect: (id: string) => void
  unSelectNodes: (ids: string[]) => void

  clearSearch: () => void
  clearSelection: () => void
  setFocusedCategoryId: (id: string | null) => void
  moveFocusedCategory: (direction: 'up' | 'down') => void
  isExpanded: (id: string) => boolean
  isSelected: (id: string) => boolean
  isNodeMatching: (id: string) => boolean
  isFocused: (id: string) => boolean
}

function findMatchingNodes(nodes: CategoryTreeNodeType[], query: string): Set<string> {
  const matching = new Set<string>()

  const traverse = (node: CategoryTreeNodeType): boolean => {
    const isMatching = node.name.toLowerCase().includes(query.toLowerCase())
    let hasMatchingChildren = false

    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) {
          hasMatchingChildren = true
        }
      }
    }

    if (isMatching || hasMatchingChildren) {
      matching.add(node.id)
      return true
    }
    return false
  }

  for (const node of nodes) {
    traverse(node)
  }

  return matching
}

function computeAutoExpandedNodes(
  expanded: Set<string>,
  matchingNodes: Set<string>,
  categories: CategoryTreeNodeType[],
  searchQuery: string
): Set<string> {
  if (!searchQuery) return expanded

  const toExpand = new Set(expanded)
  const traverse = (node: CategoryTreeNodeType) => {
    if (matchingNodes.has(node.id) && node.children && node.children.length > 0) {
      toExpand.add(node.id)
    }
    node.children?.forEach(traverse)
  }

  categories.forEach(traverse)
  return toExpand
}

function filterCategories(
  categories: CategoryTreeNodeType[],
  matchingNodes: Set<string>,
  searchQuery: string
): CategoryTreeNodeType[] {
  if (!searchQuery) return categories

  const filterNodes = (nodes: CategoryTreeNodeType[]): CategoryTreeNodeType[] => {
    return nodes
      .filter((node) => matchingNodes.has(node.id))
      .map((node) => ({
        ...node,
        children: node.children ? filterNodes(node.children) : []
      }))
  }

  return filterNodes(categories)
}

function computeVisibleNodeIds(
  filteredCategories: CategoryTreeNodeType[],
  autoExpandedNodes: Set<string>
): string[] {
  const result: string[] = []
  const traverse = (node: CategoryTreeNodeType) => {
    result.push(node.id)
    if (node.children && node.children.length > 0 && autoExpandedNodes.has(node.id)) {
      node.children.forEach(traverse)
    }
  }
  filteredCategories.forEach(traverse)
  return result
}

function recomputeDerived(state: {
  categories: CategoryTreeNodeType[]
  searchQuery: string
  expanded: Set<string>
}) {
  const matchingNodes = state.searchQuery
    ? findMatchingNodes(state.categories, state.searchQuery)
    : new Set<string>()

  const autoExpandedNodes = computeAutoExpandedNodes(
    state.expanded,
    matchingNodes,
    state.categories,
    state.searchQuery
  )

  const filteredCategories = filterCategories(state.categories, matchingNodes, state.searchQuery)
  const visibleNodeIds = computeVisibleNodeIds(filteredCategories, autoExpandedNodes)

  return { matchingNodes, autoExpandedNodes, filteredCategories, visibleNodeIds }
}

// Recursively find category in the tree to check if it exists (defensive programming)
export function findCategory(
  nodes: CategoryTreeNodeType[],
  id: string
): CategoryTreeNodeType | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const foundInChildren = findCategory(node.children, id)
      if (foundInChildren) return foundInChildren
    }
  }
  return null
}

// Returns the IDs of all ancestors (parents) of the target node, from root down to direct parent.
export function findAncestorIds(nodes: CategoryTreeNodeType[], targetId: string): string[] {
  const dfs = (current: CategoryTreeNodeType, path: string[]): string[] | null => {
    if (current.id === targetId) return path
    if (current.children) {
      for (const child of current.children) {
        const result = dfs(child, [...path, current.id])
        if (result) return result
      }
    }
    return null
  }

  for (const node of nodes) {
    const result = dfs(node, [])
    if (result) return result
  }
  return []
}

export const useCategoryTreeStore = create<CategoryTreeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      searchQuery: '',
      expanded: new Set<string>(),
      selectedCategories: [],
      multiSelect: false,
      showProductCount: false,

      // Computed (initial)
      matchingNodes: new Set<string>(),
      autoExpandedNodes: new Set<string>(),
      filteredCategories: [],
      visibleNodeIds: [],

      // Keyboard navigation (initial)
      focusedCategoryId: null,

      // Actions
      clearPrimaryCategoryId: () =>
        set((state) => {
          return { ...state, primaryCategoryId: null }
        }),

      setPrimaryCategoryId: (id) =>
        set((state) => {
          if (id === null) {
            // Get the leaf Category and set it as a primary category if the current primary category is removed
            const leafCategory = state.selectedCategories[state.selectedCategories.length - 1]
            return { ...state, primaryCategoryId: leafCategory?.id || null }
          }

          return { ...state, primaryCategoryId: id }
        }),

      setCategories: (categories) =>
        set((state) => {
          // Prevent unnecessary recomputation if categories reference doesn't change
          if (state.categories === categories) {
            return state
          }

          const derived = recomputeDerived({ ...state, categories })
          return { categories, ...derived }
        }),

      setSearchQuery: (searchQuery) =>
        set((state) => {
          const derived = recomputeDerived({ ...state, searchQuery })
          return { searchQuery, focusedCategoryId: null, ...derived }
        }),

      setMultiSelect: (multiSelect) => set({ multiSelect }),

      setShowProductCount: (showProductCount) => set({ showProductCount }),

      toggleExpand: (id) =>
        set((state) => {
          const next = new Set(state.expanded)
          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }
          const derived = recomputeDerived({ ...state, expanded: next })
          // Reset focus if the focused node is no longer visible after collapsing
          const focusedCategoryId =
            state.focusedCategoryId && derived.visibleNodeIds.includes(state.focusedCategoryId)
              ? state.focusedCategoryId
              : null
          return { expanded: next, focusedCategoryId, ...derived }
        }),

      expandNodes: (ids) =>
        set((state) => {
          if (ids.length === 0) return state
          const next = new Set(state.expanded)
          ids.forEach((id) => next.add(id))
          const derived = recomputeDerived({ ...state, expanded: next })
          return { expanded: next, ...derived }
        }),

      toggleSelect: (id) =>
        set((state) => {
          const next = state.selectedCategories
          const isExisting = next.some((cat) => cat.id === id)

          if (state.multiSelect) {
            if (isExisting) {
              const filtered = next.filter((cat) => cat.id !== id)
              return { selectedCategories: filtered }
            }

            const categoryToAdd = { ...findCategory(state.categories, id)! } // Avoid mutating the original category object
            if (categoryToAdd) {
              categoryToAdd.children = [] // Reduce the size of the category object to store only necessary info in selectedCategories
              return { selectedCategories: [...next, categoryToAdd] }
            }

            return { selectedCategories: next }
          } else {
            return { selectedCategories: isExisting ? [] : [findCategory(state.categories, id)!] }
          }
        }),

      unSelectNodes: (ids) =>
        set((state) => {
          if (ids.length === 0) return state

          const next = state.selectedCategories.filter((cat) => !ids.includes(cat.id))
          return { selectedCategories: next }
        }),

      clearSearch: () =>
        set((state) => {
          const derived = recomputeDerived({ ...state, searchQuery: '' })
          return { searchQuery: '', focusedCategoryId: null, ...derived }
        }),

      clearSelection: () =>
        set(() => {
          return { selectedCategories: [] }
          // return { selected: new Set<string>() }
        }),

      setFocusedCategoryId: (id) => set({ focusedCategoryId: id }),

      moveFocusedCategory: (direction) =>
        set((state) => {
          const { visibleNodeIds, focusedCategoryId } = state
          if (visibleNodeIds.length === 0) return state

          const currentIndex = focusedCategoryId ? visibleNodeIds.indexOf(focusedCategoryId) : -1

          let nextIndex: number
          if (direction === 'down') {
            nextIndex =
              currentIndex === -1 ? 0 : Math.min(currentIndex + 1, visibleNodeIds.length - 1)
          } else {
            nextIndex =
              currentIndex === -1 ? visibleNodeIds.length - 1 : Math.max(currentIndex - 1, 0)
          }

          return { focusedCategoryId: visibleNodeIds[nextIndex] }
        }),

      isExpanded: (id) => get().autoExpandedNodes.has(id),
      isSelected: (id) => get().selectedCategories.some((cat) => cat.id === id),
      isNodeMatching: (id) => get().matchingNodes.has(id),
      isFocused: (id) => get().focusedCategoryId === id
    }),
    {
      name: 'category-tree-store'
    }
  )
)
