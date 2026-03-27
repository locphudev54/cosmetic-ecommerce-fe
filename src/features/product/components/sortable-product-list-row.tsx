import { Button } from '@/components/ui/button'
import { PartialProduct } from '@/features/product/types'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

// ─── ProductRow (Sortable) ────────────────────────────────────────────────────

export interface SortableProductListRowProps {
  product: PartialProduct
  index: number
  onRemove: (id: string) => void
  isDragging?: boolean
  isOverlay?: boolean
}

export default function SortableProductListRow({
  product,
  index,
  onRemove,
  isDragging = false,
  isOverlay = false
}: SortableProductListRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id: product.id
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging && !isOverlay ? 0 : 1,
    zIndex: isOverlay ? 999 : undefined
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 border border-b border-transparent border-b-gray-200 bg-white px-4 py-3 transition-all duration-200 select-none last:border-b-0 hover:rounded-lg',
        isOverlay
          ? 'scale-[1.02] border-gray-200 shadow-2xl'
          : isSorting
            ? 'shadow-none'
            : 'hover:border-gray-200 hover:shadow-md'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={
          'flex cursor-grab flex-col items-center justify-center rounded-md transition-opacity duration-150 focus:outline-none active:cursor-grabbing'
        }
        aria-label='Drag to reorder'
      >
        <GripVertical className='h-4 w-4' />
      </button>

      {/* Index */}
      <span className='shrink-0 text-right text-sm font-medium text-gray-400'>{index + 1}.</span>

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
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-yellow-500 shadow-inner'>
            <span className='text-lg leading-none font-bold text-white drop-shadow-sm'>
              {/* {product.badge ?? product.name.charAt(0)} */}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <span className='flex-1 truncate text-[15px] font-medium text-gray-800'>{product.name}</span>

      {/* Status Badge */}
      <span
        className={[
          'shrink-0 rounded-full px-3 py-1 text-sm font-semibold'
          // statusStyles[product.status]
        ].join(' ')}
      >
        {product.status}
      </span>

      {/* Remove Button */}
      <Button variant={'ghost'} size={'icon-xs'} onClick={() => onRemove(product.id)}>
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}
