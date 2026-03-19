'use client'
import { Button } from '@/components/ui/button'
import { envClient } from '@/config/env.client'
import { ROUTES } from '@/constants/route.constant'
import { useDialog } from '@/hooks/use-dialog'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/dist/client/components/navigation'
import React, { use } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const dialog = useDialog()

  const handleLogout = async () => {
    const result = await dialog.open('confirm-action', {
      title: 'Xác nhận đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất không?',
      cancelLabel: 'Hủy',
      confirmLabel: 'Đăng xuất',
      variant: 'destructive'
    })

    if (result && result.confirmed) {
      const logoutKey = envClient.NEXT_PUBLIC_LOGOUT_SECRET_KEY
      router.push(`${ROUTES.AUTH.LOGOUT}?key=${logoutKey}`)
    }
  }

  return (
    <Button variant={'ghost'} className='w-full justify-start' onClick={handleLogout}>
      Đăng xuất
      <LogOut />
    </Button>
  )
}
