'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5'>
      <h2>Something went wrong layout!</h2>
      <Button
        onClick={() => {
          router.refresh() // re-call failed api requests
          startTransition(reset) // reset the error boundary state - remove the built-in error state in the error boundary
        }}
      >
        Try again
      </Button>
    </div>
  )
}
