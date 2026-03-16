'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5'>
      <h2>Something went wrong!</h2>
      {/* <Button
        onClick={() => {
          router.refresh()
          reset()
        }}
      >
        Try again
      </Button> */}
      <Button>kaskdfksdf</Button>
    </div>
  )
}
