import { CartItemType } from '@/features/cart/types/cart.types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Cart Selection Store
 * ====================
 * Zustand store for tracking which cart items the user has selected
 * for checkout. Persisted to localStorage so selections survive page reloads.
 */
interface CartSelectionState {
  selectedItemIds: string[]

  // Actions
  toggleItem: (itemId: string) => void
  selectAll: (itemIds: string[]) => void
  clearSelection: () => void
  isSelected: (itemId: string) => boolean
  removeFromSelection: (itemIds: string[]) => void

  // Computed-like getters (called as functions)
  getSelectedCount: () => number
}

export const useCartSelectionStore = create<CartSelectionState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedItemIds: [],

        toggleItem: (itemId: string) => {
          const current = get().selectedItemIds
          const isCurrentlySelected = current.includes(itemId)

          set({
            selectedItemIds: isCurrentlySelected
              ? current.filter((id) => id !== itemId)
              : [...current, itemId]
          })
        },

        selectAll: (itemIds: string[]) => {
          const current = get().selectedItemIds
          const allSelected = itemIds.every((id) => current.includes(id))

          set({
            selectedItemIds: allSelected ? [] : itemIds
          })
        },

        clearSelection: () => {
          set({ selectedItemIds: [] })
        },

        isSelected: (itemId: string) => {
          return get().selectedItemIds.includes(itemId)
        },

        removeFromSelection: (itemIds: string[]) => {
          set({
            selectedItemIds: get().selectedItemIds.filter((id) => !itemIds.includes(id))
          })
        },

        getSelectedCount: () => {
          return get().selectedItemIds.length
        }
      }),
      {
        name: 'cart-selection-store',
        // Only persist selectedItemIds
        partialize: (state) => ({ selectedItemIds: state.selectedItemIds })
      }
    ),
    {
      name: 'cart-selection-store'
    }
  )
)

/**
 * Helper to compute selected total from cart items
 */
export function computeSelectedTotal(
  items: CartItemType[],
  selectedItemIds: string[]
): number {
  return items
    .filter((item) => selectedItemIds.includes(item.id))
    .reduce((total, item) => total + Number(item.subtotal), 0)
}

/**
 * Helper to get selected cart items
 */
export function getSelectedCartItems(
  items: CartItemType[],
  selectedItemIds: string[]
): CartItemType[] {
  return items.filter((item) => selectedItemIds.includes(item.id))
}
