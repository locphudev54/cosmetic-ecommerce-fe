import apiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ApiResponse, CursorPaginationMeta, OffsetPaginationMeta } from '@/types/api.types'
import {
  Order,
  CreateOrderRequest,
  CreateGuestOrderRequest,
  OrderQueryParams
} from '@/features/orders/types/order.types'

export const orderService = {
  /**
   * Create an order (authenticated user)
   */
  createOrder: (data: CreateOrderRequest, idempotencyKey?: string): Promise<ApiResponse<Order>> => {
    const config = idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data, config)
  },

  /**
   * Create a guest order
   */
  createGuestOrder: (
    data: CreateGuestOrderRequest,
    idempotencyKey?: string
  ): Promise<ApiResponse<Order>> => {
    const config = idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.GUEST_CREATE, data, config)
  },

  /**
   * Get orders with pagination
   */
  getOrders: (
    params?: OrderQueryParams
  ): Promise<ApiResponse<Order[], OffsetPaginationMeta | CursorPaginationMeta>> => {
    return apiClient.get<Order[], OffsetPaginationMeta | CursorPaginationMeta>(
      API_ENDPOINTS.ORDERS.LIST,
      { params }
    )
  },

  /**
   * Get order by ID
   */
  getOrderById: (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id))
  },

  /**
   * Cancel an order
   */
  cancelOrder: (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.CANCEL(id), { reason })
  },

  /**
   * Update order status (admin)
   */
  updateOrderStatus: (id: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status })
  },

  /**
   * Get shipping fee
   */
  getShippingFee: (): Promise<ApiResponse<{ shippingFee: number }>> => {
    return apiClient.get<{ shippingFee: number }>(API_ENDPOINTS.ORDERS.SHIPPING_FEE)
  }
}
