'use client'

import { Button } from '@/components/ui/button'
import { ApiError } from '@/types'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition } from 'react'

export default function Error({ error, reset }: { error: ApiError | Error; reset: () => void }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5'>
      <h2>Something went wrong!</h2>
      <p>{JSON.stringify(error)}</p>
      <Button
        variant={'default'}
        onClick={() => {
          router.refresh() // re-call failed api requests
          startTransition(reset) // reset the error boundary state - remove the built-in error state in the error boundary
        }}
      >
        Try again (nằm ở route: {pathname})
      </Button>
    </div>
  )
}
