import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/route.constant'
import LogoutButton from '@/features/auth/components/logout-button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className='flex items-center justify-center space-x-3.5 py-6'>
      <Link href={ROUTES.ADMIN.HOME}>
        <Button>Go to Admin Page</Button>
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
