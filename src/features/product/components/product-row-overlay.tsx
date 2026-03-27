import { SortableProductListRowProps } from '@/features/product/components/sortable-product-list-row'
import { GripVertical } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

// Overlay version (no sortable hooks needed)
export function ProductRowOverlay({
  product,
  index,
  onRemove
}: Omit<SortableProductListRowProps, 'isDragging' | 'isOverlay'>) {
  return (
    <div
      className={[
        'flex items-center gap-3 rounded-2xl bg-white px-4 py-3 select-none',
        'scale-[1.02] border border-gray-200 shadow-2xl'
      ].join(' ')}
    >
      {/* Drag Handle */}
      <div className='flex h-8 w-5 cursor-grabbing flex-col items-center justify-center gap-[3px] rounded-md'>
        <GripVertical className='h-4 w-4' />
      </div>

      {/* Index */}
      <span className='w-5 shrink-0 text-right text-sm font-medium text-gray-400'>
        {index + 1}.
      </span>

      {/* Avatar / Badge */}
      <div className='relative shrink-0'>
        {product.images ? (
          <div className='aspect-square w-10 shrink-0'>
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
        ) : (
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 shadow-inner'>
            <span className='text-lg leading-none font-bold text-white drop-shadow-sm'>
              {/* {product.badge ?? product.name.charAt(0)} */}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <span className='flex-1 truncate text-[15px] font-medium text-gray-800'>{product.name}</span>

      {/* Status Badge */}
      <span className={['shrink-0 rounded-full px-3 py-1 text-sm font-semibold'].join(' ')}>
        {product.status}
      </span>

      {/* Remove placeholder */}
      <div className='h-6 w-6 shrink-0 opacity-0' />
    </div>
  )
}
