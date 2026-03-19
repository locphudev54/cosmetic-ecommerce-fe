import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/route.constant'
import { House } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Auth Layout Loading...</div>}>
      <section className='relative flex min-h-screen items-center justify-center bg-blue-50 dark:bg-zinc-950'>
        <Link href={ROUTES.HOME}>
          <Button variant={'outline'} className='absolute top-4 left-4'>
            <House />
            Trang chủ
          </Button>
        </Link>
        {children}
      </section>
    </Suspense>
  )
}
