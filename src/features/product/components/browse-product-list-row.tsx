import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

interface BrowseProductListRowProps {
  product: any
  isSelected: boolean
  onToggleSelect: () => void
}

export default function BrowseProductListRow({
  product,
  isSelected,
  onToggleSelect
}: BrowseProductListRowProps) {
  return (
    <div className='flex items-center gap-4 border-b p-4 hover:bg-gray-50' onClick={onToggleSelect}>
      <Checkbox checked={isSelected} />
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
      <div className='line-clamp-2 flex-1 cursor-pointer text-sm'>{product.name}</div>
    </div>
  )
}
