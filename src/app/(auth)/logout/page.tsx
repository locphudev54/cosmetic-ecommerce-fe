'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { envClient } from '@/config/env.client'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import internalApiClient from '@/lib/internal-api-client'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2, LogOut } from 'lucide-react'

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

  return (
    <div className='flex h-screen w-full items-center justify-center bg-blue-50 dark:bg-zinc-950'>
      <div className='flex flex-col items-center gap-6'>
        {/* Animated icon */}
        <div className='relative'>
          <div className='absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-30' />
          <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-orange-100'>
            <LogOut className='h-8 w-8 text-orange-600' />
          </div>
        </div>

        {/* Text */}
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-foreground'>Đang đăng xuất...</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Vui lòng đợi trong giây lát
          </p>
        </div>

        {/* Spinner */}
        <Loader2 className='h-5 w-5 animate-spin text-orange-600' />
      </div>
    </div>
  )
}
