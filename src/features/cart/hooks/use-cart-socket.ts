'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { envClient } from '@/config/env.client'
import { useAuthStore } from '@/stores/auth-store'
import { CART_QUERY_KEY } from '@/features/cart/hooks/use-cart'
import { toast } from 'sonner'

/**
 * useCartSocket — Real-time cart sync via WebSocket
 * ==================================================
 * - Only connects for authenticated users (JWT required)
 * - Guests don't use WebSocket (their cart exists only on one device)
 * - Listens for `cart:updated` events and invalidates React Query cache
 * - Listens for `cart:conflict` events and shows a notification
 * - Automatically reconnects on token refresh
 */
export function useCartSocket() {
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const { accessToken, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Only connect if authenticated
    if (!isAuthenticated || !accessToken) {
      // Disconnect if was connected
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    // Create socket connection to /cart namespace
    const socket = io(`${envClient.NEXT_PUBLIC_BACKEND_API_URL.replace('/api/v1', '')}/cart`, {
      auth: {
        token: accessToken
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socketRef.current = socket

    // Handle connection
    socket.on('connect', () => {
      console.log('[CartSocket] Connected')
    })

    // Handle cart update from another device
    socket.on('cart:updated', (data: { cart: any; timestamp: string }) => {
      console.log('[CartSocket] Cart updated from another device')
      // Update React Query cache directly with the new cart data
      queryClient.setQueryData(CART_QUERY_KEY, data.cart)
    })

    // Handle version conflict notification
    socket.on('cart:conflict', (data: { message: string }) => {
      toast.warning(data.message || 'Giỏ hàng đã được cập nhật từ thiết bị khác')
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[CartSocket] Disconnected: ${reason}`)
    })

    // Handle connection error
    socket.on('connect_error', (error) => {
      console.warn('[CartSocket] Connection error:', error.message)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, accessToken, queryClient])

  return socketRef.current
}
