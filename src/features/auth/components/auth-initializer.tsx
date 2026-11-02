'use client'

import { useEffect, useRef } from 'react'

import { API_ENDPOINTS } from '@/constants/api.constant'
import { authService } from '@/features/auth/services'
import { RefreshTokenClientResponse } from '@/features/auth/types/auth.types'
import internalApiClient from '@/lib/internal-api-client'
import { useAuthStore } from '@/stores/auth-store'

interface AuthInitializerProps {
  accessToken?: string
  refreshToken?: string
}

export function AuthInitializer({ accessToken, refreshToken }: AuthInitializerProps) {
  const initializedTokenKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const tokenKey = `${accessToken ?? ''}:${refreshToken ?? ''}`

    if (initializedTokenKeyRef.current === tokenKey) {
      return
    }

    initializedTokenKeyRef.current = tokenKey

    let isCurrent = true

    const syncAuthState = async () => {
      const { clearAuth, setAccessToken, setUser } = useAuthStore.getState()

      if (!accessToken && !refreshToken) {
        return
      }

      if (accessToken) {
        try {
          const user = await authService.getMe(accessToken)

          if (!isCurrent) {
            return
          }

          const { accessToken: storeAccessToken, user: storeUser } = useAuthStore.getState()

          if (storeAccessToken !== accessToken) {
            setAccessToken(accessToken)
          }

          if (storeUser?.id !== user.id) {
            setUser(user)
          }
        } catch (error) {
          if (!isCurrent) {
            return
          }

          clearAuth()
          console.log('Failed to fetch user with existing access token:', error)
        }

        return
      }

      try {
        const response = await internalApiClient.post<RefreshTokenClientResponse>(
          API_ENDPOINTS.AUTH.REFRESH
        )

        if (!isCurrent) {
          return
        }

        const { user, accessToken } = response.data
        setAccessToken(accessToken)
        setUser(user)
      } catch (error) {
        if (!isCurrent) {
          return
        }

        clearAuth()
        console.log('Token refresh failed:', error)
      }
    }

    syncAuthState()

    return () => {
      isCurrent = false
    }
  }, [accessToken, refreshToken])

  return null
}
