'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div className='flex items-center justify-center flex-col gap-5 min-h-screen'>
      <h2>Something went wrong!</h2>
      <Button
        onClick={() => {
          router.refresh()
          reset()
        }}
      >
        Try again
      </Button>
    </div>
  )
}
