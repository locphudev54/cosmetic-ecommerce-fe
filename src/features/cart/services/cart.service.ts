import apiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ApiResponse } from '@/types/api.types'
import {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveCartItemRequest,
  BulkRemoveCartItemsRequest,
  SwapVariantInfo
} from '@/features/cart/types/cart.types'

export const cartService = {
  /**
   * Get the current user's/guest's cart
   */
  getCart: (): Promise<ApiResponse<Cart>> => {
    return apiClient.get<Cart>(API_ENDPOINTS.CART.GET)
  },

  /**
   * Add an item to the cart
   */
  addToCart: (data: AddToCartRequest): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>(API_ENDPOINTS.CART.ADD_ITEM, data)
  },

  /**
   * Update a cart item (quantity or variant swap)
   */
  updateCartItem: (
    itemId: string,
    data: UpdateCartItemRequest
  ): Promise<ApiResponse<Cart>> => {
    return apiClient.patch<Cart>(API_ENDPOINTS.CART.UPDATE_ITEM(itemId), data)
  },

  /**
   * Remove a cart item
   */
  removeCartItem: (
    itemId: string,
    data: RemoveCartItemRequest
  ): Promise<ApiResponse<Cart>> => {
    return apiClient.delete<Cart>(API_ENDPOINTS.CART.REMOVE_ITEM(itemId), {
      data // Send version in request body
    })
  },

  /**
   * Bulk remove cart items
   */
  bulkRemoveCartItems: (
    data: BulkRemoveCartItemsRequest
  ): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>(API_ENDPOINTS.CART.BULK_REMOVE, data)
  },

  /**
   * Merge guest cart into authenticated user cart (called after login)
   */
  mergeCart: (): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>(API_ENDPOINTS.CART.MERGE)
  },

  /**
   * Get product variants for variant swap UI
   */
  getProductVariants: (productId: string): Promise<ApiResponse<SwapVariantInfo[]>> => {
    return apiClient.get<SwapVariantInfo[]>(API_ENDPOINTS.CART.VARIANTS(productId))
  }
}
