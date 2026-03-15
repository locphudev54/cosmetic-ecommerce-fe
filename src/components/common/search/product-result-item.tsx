import React from 'react'
import { cn } from '@/lib/utils'
import { HighlightedText } from './highlighted-text'
import { Product } from '@/features/product/types'

interface ProductResultItemProps {
  product: Product
  query: string
  onSelect: (product: Product) => void
  isHovered: boolean
}

export const ProductResultItem: React.FC<ProductResultItemProps> = ({
  product,
  query,
  onSelect,
  isHovered
}) => {
  const primaryImage = product.images?.find((img) => img.isPrimary)
  const displayPrice =
    typeof product.basePrice === 'string' ? parseFloat(product.basePrice) : product.basePrice

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
            <img
              src={primaryImage.url}
              alt={product.name}
              className='h-full w-full rounded object-cover'
            />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-gray-900'>
            <HighlightedText text={product.name} query={query} />
          </p>
          <p className='truncate text-xs text-gray-500'>{product.brand?.name}</p>
          <p className='mt-1 text-sm font-bold text-blue-600'>${displayPrice.toFixed(2)}</p>
        </div>
      </div>
    </button>
  )
}
