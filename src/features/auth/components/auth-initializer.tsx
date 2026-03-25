'use client'

import { useEffect } from 'react'

import { API_ENDPOINTS } from '@/constants/api.constant'
import { authService } from '@/features/auth/services'
import { RefreshTokenClientResponse } from '@/features/auth/types/auth.types'
import internalApiClient from '@/lib/internal-api-client'
import { useAuthStore } from '@/stores/auth-store'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/constants/route.constant'

interface AuthInitializerProps {
  accessToken?: string
  refreshToken?: string
}

export function AuthInitializer({ accessToken, refreshToken }: AuthInitializerProps) {
  const pathname = usePathname()
  const { clearAuth, setUser, setAccessToken } = useAuthStore()

  // const isAuthenticationPath = [
  //   ROUTES.AUTH.LOGIN,
  //   ROUTES.AUTH.REGISTER,
  //   ROUTES.AUTH.LOGOUT
  // ].includes(pathname)

  useEffect(
    () => {
      const refreshTokenFunction = async () => {
        // If already have access token received from server-side rendering, no need to refresh
        // Set this access token to auth store

        if (accessToken) {
          const user = await authService.getMe(accessToken).catch((error) => {
            console.log('Failed to fetch user with existing access token:', error)
            clearAuth()
          })

          if (!user) {
            return
          }

          setUser(user)
          setAccessToken(accessToken)
          return
        }

        if (
          !refreshToken
          // || pathname === ROUTES.AUTH.LOGOUT
        )
          return

        try {
          const response = await internalApiClient.post<RefreshTokenClientResponse>(
            API_ENDPOINTS.AUTH.REFRESH
          )

          const { user, accessToken } = response.data
          setUser(user)
          setAccessToken(accessToken)
        } catch (error) {
          clearAuth()
          console.log('Token refresh failed:', error)
        }
      }

      // Bug, when user go to home page, this useEffect will run, but accessToken is undefined, so it will call refreshToken, but refreshToken will fail because there is no refresh token in cookie, so it will clearAut
      //  but user is not authenticated and user will be logged out, and user will be redirected to login page
      refreshTokenFunction()
    },

    // []
    [accessToken, clearAuth, refreshToken, setAccessToken, setUser]
  )

  return null
}
