import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CategoryTreeState {
  // Data
  categories: CategoryTreeNodeType[]
  searchQuery: string
  expanded: Set<string>
  selectedCategories: CategoryTreeNodeType[]
  multiSelect: boolean
  showProductCount: boolean

  // Callbacks
  // onSelectionChange?: (selected: string[]) => void

  // Computed
  matchingNodes: Set<string>
  autoExpandedNodes: Set<string>
  filteredCategories: CategoryTreeNodeType[]

  // Actions
  setCategories: (categories: CategoryTreeNodeType[]) => void
  setSearchQuery: (query: string) => void
  setMultiSelect: (multiSelect: boolean) => void
  setShowProductCount: (showProductCount: boolean) => void
  // setOnSelectionChange: (callback?: (selected: string[]) => void) => void
  toggleExpand: (id: string) => void
  toggleSelect: (id: string) => void
  clearSearch: () => void
  clearSelection: () => void
  isExpanded: (id: string) => boolean
  isSelected: (id: string) => boolean
  isNodeMatching: (id: string) => boolean
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

  return { matchingNodes, autoExpandedNodes, filteredCategories }
}

// Recursively find category in the tree to check if it exists (defensive programming)
function findCategory(nodes: CategoryTreeNodeType[], id: string): CategoryTreeNodeType | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const foundInChildren = findCategory(node.children, id)
      if (foundInChildren) return foundInChildren
    }
  }
  return null
}

export const useCategoryTreeStore = create<CategoryTreeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      searchQuery: '',
      expanded: new Set<string>(),
      selectedCategories: [],
      multiSelect: true,
      showProductCount: false,
      onSelectionChange: undefined,

      // Computed (initial)
      matchingNodes: new Set<string>(),
      autoExpandedNodes: new Set<string>(),
      filteredCategories: [],

      // Actions
      setCategories: (categories) =>
        set((state) => {
          const derived = recomputeDerived({ ...state, categories })
          return { categories, ...derived }
        }),

      setSearchQuery: (searchQuery) =>
        set((state) => {
          const derived = recomputeDerived({ ...state, searchQuery })
          return { searchQuery, ...derived }
        }),

      setMultiSelect: (multiSelect) => set({ multiSelect }),

      setShowProductCount: (showProductCount) => set({ showProductCount }),

      // setOnSelectionChange: (callback) => set({ onSelectionChange: callback }),

      toggleExpand: (id) =>
        set((state) => {
          const next = new Set(state.expanded)
          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }
          const derived = recomputeDerived({ ...state, expanded: next })
          return { expanded: next, ...derived }
        }),

      toggleSelect: (id) =>
        set((state) => {
          const next = state.selectedCategories
          const isExisting = next.some((cat) => cat.id === id)

          if (isExisting) {
            const filtered = next.filter((cat) => cat.id !== id)
            return { selectedCategories: filtered }
          }

          const categoryToAdd = findCategory(state.categories, id)
          if (categoryToAdd) {
            return { selectedCategories: [...next, categoryToAdd] }
          }

          return { selectedCategories: next }

          // if (state.multiSelect) {
          //   if (next.has(id)) {
          //     next.delete(id)
          //   } else {
          //     next.add(id)
          //   }
          // } else {
          //   next.clear()
          //   next.add(id)
          // }

          // // state.onSelectionChange?.(Array.from(next))
          // return { selected: next }
        }),

      clearSearch: () =>
        set((state) => {
          const derived = recomputeDerived({ ...state, searchQuery: '' })
          return { searchQuery: '', ...derived }
        }),

      clearSelection: () =>
        set((state) => {
          // state.onSelectionChange?.([])
          return { selectedCategories: [] }
          // return { selected: new Set<string>() }
        }),

      isExpanded: (id) => get().autoExpandedNodes.has(id),
      isSelected: (id) => get().selectedCategories.some((cat) => cat.id === id),
      isNodeMatching: (id) => get().matchingNodes.has(id)
    }),
    {
      name: 'category-tree-store'
    }
  )
)
