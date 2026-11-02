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
  selectedCartItemIds: string[]

  // Actions
  toggleCartItem: (itemId: string) => void
  selectAll: (itemIds: string[]) => void
  clearCartSelection: () => void
  isSelected: (itemId: string) => boolean
  removeFromSelection: (itemIds: string[]) => void

  // Computed-like getters (called as functions)
  getSelectedCount: () => number
}

export const useCartSelectionStore = create<CartSelectionState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedCartItemIds: [],

        toggleCartItem: (itemId: string) => {
          const current = get().selectedCartItemIds
          const isCurrentlySelected = current.includes(itemId)

          set({
            selectedCartItemIds: isCurrentlySelected
              ? current.filter((id) => id !== itemId)
              : [...current, itemId]
          })
        },

        selectAll: (itemIds: string[]) => {
          const current = get().selectedCartItemIds
          const allSelected = itemIds.every((id) => current.includes(id))

          set({
            selectedCartItemIds: allSelected ? [] : itemIds
          })
        },

        clearCartSelection: () => {
          set({ selectedCartItemIds: [] })
        },

        isSelected: (itemId: string) => {
          return get().selectedCartItemIds.includes(itemId)
        },

        removeFromSelection: (itemIds: string[]) => {
          set({
            selectedCartItemIds: get().selectedCartItemIds.filter((id) => !itemIds.includes(id))
          })
        },

        getSelectedCount: () => {
          return get().selectedCartItemIds.length
        }
      }),
      {
        name: 'cart-selection-store',
        // Only persist selectedCartItemIds
        partialize: (state) => ({ selectedCartItemIds: state.selectedCartItemIds })
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
export function computeSelectedTotal(items: CartItemType[], selectedCartItemIds: string[]): number {
  return items
    .filter((item) => selectedCartItemIds.includes(item.id))
    .reduce((total, item) => total + Number(item.subtotal), 0)
}

/**
 * Helper to get selected cart items
 */
export function getSelectedCartItems(
  items: CartItemType[],
  selectedCartItemIds: string[]
): CartItemType[] {
  return items.filter((item) => selectedCartItemIds.includes(item.id))
}
