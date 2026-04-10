import { CART_QUERY_KEY } from '@/features/cart/hooks/use-cart'
import { orderService } from '@/features/orders/services/order.service'
import {
  CreateGuestOrderRequest,
  CreateOrderRequest,
  OrderQueryParams
} from '@/features/orders/types/order.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const ORDER_QUERY_KEY = ['orders'] as const

type CreateOrderMutationVariables = {
  data: CreateOrderRequest
  idempotencyKey?: string
}

type CreateGuestOrderMutationVariables = {
  data: CreateGuestOrderRequest
  idempotencyKey?: string
}

/**
 * Hook to fetch orders with pagination
 */
export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEY, params],
    queryFn: async () => {
      const response = await orderService.getOrders(params)
      return response
    }
  })
}

/**
 * Hook to fetch a single order
 */
export function useOrder(id: string | null) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await orderService.getOrderById(id)
      return response.data
    },
    enabled: !!id
  })
}

/**
 * Hook to create an order (authenticated user)
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, idempotencyKey }: CreateOrderMutationVariables) =>
      orderService.createOrder(data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    }
  })
}

/**
 * Hook to create a guest order
 */
export function useCreateGuestOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, idempotencyKey }: CreateGuestOrderMutationVariables) =>
      orderService.createGuestOrder(data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    }
  })
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      orderService.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY })
    }
  })
}

/**
 * Hook to update order status (admin)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY })
    }
  })
}

/**
 * Hook to get shipping fee
 */
export function useShippingFee() {
  return useQuery({
    queryKey: ['shipping-fee'],
    queryFn: async () => {
      const response = await orderService.getShippingFee()
      return response.data.shippingFee
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
