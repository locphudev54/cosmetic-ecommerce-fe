'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { envClient } from '@/config/env.client'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { useAuthStore } from '@/stores/auth-store'
import internalApiClient from '@/lib/internal-api-client'

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearAuth, accessToken } = useAuthStore()

  useEffect(() => {
    const key = searchParams.get('key')
    const expectedKey = envClient.NEXT_PUBLIC_LOGOUT_SECRET_KEY

    // Check if the logout key matches
    if (!key || key !== expectedKey) {
      // Invalid or missing key, redirect to home
      router.push(ROUTES.HOME)
      return
    }

    const logout = async () => {
      try {
        debugger
        // Call logout API
        await internalApiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      } catch (error) {
        // Logout should always succeed, ignore errors
        console.log('Logout API error (ignored):', error)
      }

      // Clear local auth state
      clearAuth()

      // Redirect to login page
      router.push(ROUTES.AUTH.LOGIN)
    }

    logout()
  }, [router, searchParams, clearAuth])

  return <div>Logging out...</div>
}
