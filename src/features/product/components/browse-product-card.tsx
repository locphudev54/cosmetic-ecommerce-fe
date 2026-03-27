interface BrowseProductCardProps {
  product: any
  isSelected: boolean
  onToggleSelect: () => void
}

import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import React from 'react'

export default function BrowseProductCard({
  product,
  isSelected,
  onToggleSelect
}: BrowseProductCardProps) {
  return (
    <div
      className='relative flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-gray-50'
      onClick={onToggleSelect}
    >
      <div className='aspect-square w-20 shrink-0'>
        {product.images && product.images.length > 0 && (
          <Image
            width={0}
            height={0}
            sizes='100vw'
            src={product.images[0].url}
            alt={product.name}
            className='aspect-square h-full w-full rounded-md object-cover'
          />
        )}
      </div>
      <Checkbox checked={isSelected} className='absolute top-3 right-3' />
      <div className='line-clamp-2 max-w-full cursor-pointer text-center text-sm'>
        {product.name} 123 123 123
        123123123123123123123123123123123123123123123123123123123123123123123123 123 123 123 123 123
        123 123123123123123123123123123123123123123123123123123123123123123123123123 123 123 123 123
        123 123 123123123123123123123123123123123123123123123123123123123123123123123123 123 123 123
        123 123 123 123123123123123123123123123123123123123123123123123123123123123123123123 123 123
        123 123 123 123
      </div>
    </div>
  )
}
