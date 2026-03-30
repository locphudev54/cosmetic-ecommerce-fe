import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { HighlightedText } from './highlighted-text'
import { ProductDocument } from '@/features/search/types/search.types'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'

interface ProductResultItemProps {
  product: ProductDocument
  query: string
  onSelect: (product: ProductDocument) => void
  isHovered: boolean
}

export const ProductResultItem: React.FC<ProductResultItemProps> = ({
  product,
  query,
  onSelect,
  isHovered
}) => {
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null

  return (
    <button
      onClick={() => onSelect(product)}
      className={cn(
        'w-full border-b px-4 py-3 text-left transition-colors',
        isHovered ? 'bg-slate-100' : 'hover:bg-slate-50'
      )}
    >
      <div className='flex gap-3'>
        {primaryImage && (
          <div className='h-12 w-12 flex-shrink-0 rounded border bg-slate-200'>
            <Image
              src={primaryImage.url}
              alt={product.name}
              className='h-full w-full rounded object-cover'
              width={48}
              height={48}
            />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-gray-900'>
            <HighlightedText text={product.name} query={query} />
          </p>
          <p className='truncate text-xs text-gray-500'>{product.brand?.name}</p>
          <p className='mt-1 text-sm font-bold text-blue-600'>
            {formatNumberToVnCurrency(product.basePrice)}
          </p>
        </div>
      </div>
    </button>
  )
}
