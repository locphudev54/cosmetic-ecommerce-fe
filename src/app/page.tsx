import LogoutButton from '@/features/auth/components/logout-button'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/route.constant'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className='flex items-center space-x-3.5 py-6 justify-center'>
      <Link href={ROUTES.PROTECTED.CLIENT}>
        <Button>Go to Protected Client Page</Button>
      </Link>
      <br />
      <Link href={ROUTES.PROTECTED.SERVER}>
        <Button>Go to Protected Server Page</Button>
      </Link>

      <Link href={ROUTES.AUTH.LOGIN}>
        <Button>Go to Login Page</Button>
      </Link>
      <LogoutButton />
    </div>
  )
}
