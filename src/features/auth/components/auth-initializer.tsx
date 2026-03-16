'use client'

import { useEffect } from 'react'

import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import internalApiClient from '@/lib/internal-api-client'
import { useAuthStore } from '@/stores/auth-store'
import { usePathname } from 'next/navigation'
import { RefreshTokenClientResponse } from '@/features/auth/types/auth.types'

interface AuthInitializerProps {
  accessToken?: string
}

export function AuthInitializer({ accessToken }: AuthInitializerProps) {
  const pathname = usePathname()
  const { clearAuth, setUser, setAccessToken, isAuthenticated } = useAuthStore()

  const isAuthenticationPath = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.LOGOUT
  ].includes(pathname)

  useEffect(() => {
    const refreshToken = async () => {
      // If already have access token received from server-side rendering, no need to refresh
      // Set this access token to auth store
      if (accessToken) {
        setAccessToken(accessToken)
        return
      }

      if (isAuthenticated || isAuthenticationPath) return

      try {
        const response = await internalApiClient.post<RefreshTokenClientResponse>(
          API_ENDPOINTS.AUTH.REFRESH
        )

        const { user, accessToken } = response.data
        setUser(user)
        setAccessToken(accessToken)
      } catch (error) {
        // If refresh fails, clear any stale auth state
        clearAuth()
        console.log('Token refresh failed:', error)
      }
    }

    // Bug, when user go to home page, this useEffect will run, but accessToken is undefined, so it will call refreshToken, but refreshToken will fail because there is no refresh token in cookie, so it will clearAut
    //  but user is not authenticated and user will be logged out, and user will be redirected to login page
    // refreshToken()
  }, [accessToken, clearAuth, isAuthenticated, isAuthenticationPath, setAccessToken, setUser])

  return null
}
