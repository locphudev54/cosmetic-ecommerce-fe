'use client'

import { OAUTH_ERROR_MESSAGE } from '@/constants/api.constant'
import { JSON_WEB_TOKEN_KEYS } from '@/constants/cookies.constant'
import { ROUTES } from '@/constants/route.constant'
import { useSyncTokensMutation } from '@/features/auth/hooks/use-auth'
import { authService } from '@/features/auth/services'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const accessToken = searchParams.get(JSON_WEB_TOKEN_KEYS.ACCESS_TOKEN)
  const refreshToken = searchParams.get(JSON_WEB_TOKEN_KEYS.REFRESH_TOKEN)

  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const setUser = useAuthStore((state) => state.setUser)

  const syncTokensMutation = useSyncTokensMutation()

  const handleSyncTokens = async () => {
    debugger
    try {
      if (accessToken && refreshToken) {
        const [user] = await Promise.all([
          authService.getMe(accessToken),
          syncTokensMutation.mutateAsync({ accessToken, refreshToken })
        ])

        setUser(user)
        setAccessToken(accessToken)

        router.push(ROUTES.HOME)
      } else {
        router.push(`${ROUTES.AUTH.LOGIN}?error=${OAUTH_ERROR_MESSAGE}`)
      }
    } catch (error) {
      console.error('Failed to sync tokens:', error)
      setAccessToken(null)
      router.push(ROUTES.AUTH.LOGIN)
    }
  }

  useEffect(() => {
    handleSyncTokens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  debugger
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <p className='text-center text-lg'>Processing authentication...</p>
    </div>
  )
}
