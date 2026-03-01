import { Checkbox } from '@/components/ui/checkbox'
import { UploadedImage } from '@/features/product/components/upload-product-images'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, ScanSearch, ZoomIn } from 'lucide-react'
import Image from 'next/image'

interface ThumbnailProps {
  image: UploadedImage
  isPrimary?: boolean
  isSelected: boolean
  onSelect: () => void
  onZoomIn: () => void
}

export default function ProductImageThumbnail({
  image,
  onSelect,
  isSelected,
  onZoomIn,
  isPrimary = false
}: ThumbnailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative aspect-square h-full w-full cursor-pointer overflow-hidden rounded-lg border bg-gray-50 shadow',
        {
          'border-primary/50 shadow-lg': isDragging
          // 'border-muted hover:border-red-500': !isDragging
        }
      )}
    >
      <Image
        sizes='100vw'
        width={0}
        height={0}
        src={image.preview}
        alt='Thumbnail'
        className='h-full w-full object-cover'
      />

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className='absolute inset-0 z-10 flex cursor-grab items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-20 active:cursor-grabbing'
      />

      {/* Overlay for selecting action */}
      <div
        className={cn('bg-primary/50 absolute inset-0 rounded-lg opacity-0 transition-opacity', {
          'opacity-50': isSelected
        })}
      />

      {/* Checkbox Selection */}
      <Checkbox
        checked={isSelected}
        className={cn(
          'absolute inset-0 top-1.5 left-2 size-4 cursor-pointer border-gray-400 opacity-0 transition-opacity group-hover:opacity-100',
          {
            'opacity-100': isSelected
          }
        )}
      />

      {/* Zoom In Button */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          onZoomIn()
        }}
        className={cn(
          'absolute top-[50%] left-[50%] z-20 translate-x-[-50%] translate-y-[-50%] cursor-pointer rounded-full bg-white p-3 opacity-0 transition-opacity group-hover:opacity-100',
          { 'p-5': isPrimary }
        )}
      >
        <ScanSearch className={cn('size-5 text-gray-400', { 'size-6': isPrimary })} />
      </button>
    </div>
  )
}
