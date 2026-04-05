'use client'

import { OAUTH_ERROR_MESSAGE } from '@/constants/api.constant'
import { JSON_WEB_TOKEN_KEYS } from '@/constants/cookies.constant'
import { ROUTES } from '@/constants/route.constant'
import { useSyncTokensMutation } from '@/features/auth/hooks/use-auth'
import { authService } from '@/features/auth/services'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2, ShieldCheck } from 'lucide-react'
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

  return (
    <div className='flex h-screen w-full items-center justify-center bg-blue-50 dark:bg-zinc-950'>
      <div className='flex flex-col items-center gap-6'>
        {/* Animated icon */}
        <div className='relative'>
          <div className='absolute inset-0 animate-ping rounded-full bg-blue-200 opacity-30' />
          <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
            <ShieldCheck className='h-8 w-8 text-blue-600' />
          </div>
        </div>

        {/* Text */}
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-foreground'>Đang xác thực...</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Vui lòng đợi trong giây lát
          </p>
        </div>

        {/* Spinner */}
        <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
      </div>
    </div>
  )
}
