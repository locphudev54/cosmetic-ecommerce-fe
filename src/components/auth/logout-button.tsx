'use client'
import { Button } from '@/components/ui/button'
import { envClient } from '@/config/env.client'
import { ROUTES } from '@/constants/route.constant'
import { useRouter } from 'next/dist/client/components/navigation'
import React from 'react'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    const logoutSecretKey = envClient.NEXT_PUBLIC_LOGOUT_SECRET_KEY
    router.push(`${ROUTES.AUTH.LOGOUT}?key=${logoutSecretKey}`)
  }

  return <Button onClick={handleLogout}>Logout</Button>
}
