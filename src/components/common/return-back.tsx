'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReturnBack() {
  const router = useRouter()
  return (
    <div
      onClick={router.back}
      className='inline-flex cursor-pointer items-center justify-center gap-x-0.5'
    >
      <ChevronLeft className='size-4' strokeWidth={2.5} />
      <span className='text-sm font-normal'>Quay lại</span>
    </div>
  )
}
