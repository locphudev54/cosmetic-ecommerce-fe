import { cartService } from '@/features/cart/services/cart.service'
import type { Cart } from '@/features/cart/types/cart.types'
import {
  AddToCartRequest,
  BulkRemoveCartItemsRequest,
  RemoveCartItemRequest,
  UpdateCartItemRequest
} from '@/features/cart/types/cart.types'
import { ApiError } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

export const CART_QUERY_KEY = ['cart'] as const

type RemoveCartItemVariables = { itemId: string; data: RemoveCartItemRequest }

/**
 * Hook to fetch the current cart
 */
export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await cartService.getCart()
      return response.data
    }
  })
}

/**
 * Hook to add an item to the cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (response) => {
      // Update cart data in cache after adding to cart
      queryClient.setQueryData(CART_QUERY_KEY, response.data)
    }
  })
}

/**
 * Hook to update a cart item (quantity or variant swap)
 * Handles 409 Conflict (optimistic locking) by refetching cart
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
      cartService.updateCartItem(itemId, data),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, response.data)
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === HttpStatusCode.Conflict) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      }
    }
  })
}

/**
 * Hook to remove a cart item
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: RemoveCartItemVariables) =>
      cartService.removeCartItem(itemId, data),
    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart = queryClient.getQueryData<Cart>(CART_QUERY_KEY)

      if (previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, {
          ...previousCart,
          items: previousCart.items.filter((cartItem) => cartItem.id !== itemId)
        })
      }

      return { previousCart }
    },
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, response.data)
    },
    onError: (error, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart)
      }

      if (error instanceof ApiError && error.statusCode === HttpStatusCode.Conflict) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      }
    }
  })
}

/**
 * Hook for bulk removing cart items
 */
export function useBulkRemoveCartItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkRemoveCartItemsRequest) => cartService.bulkRemoveCartItems(data),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, response.data)
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === HttpStatusCode.Conflict) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      }
    }
  })
}

/**
 * Hook to merge guest cart after login
 */
export function useMergeCart() {
  return useMutation({
    mutationFn: () => cartService.mergeCart()
  })
}

/**
 * Hook to get product variants for variant swap
 */
export function useProductVariants(productId: string | null) {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return []
      const response = await cartService.getProductVariants(productId)
      return response.data
    },
    enabled: !!productId
  })
}
