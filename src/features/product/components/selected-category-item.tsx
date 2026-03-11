import { Button } from '@/components/ui/button'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { cn } from '@/lib/utils'
import { Package, X } from 'lucide-react'

interface SelectedCategoryItemProps {
  node: CategoryTreeNodeType
  onClick?: () => void
  onRemove?: () => void
}

export default function SelectedCategoryItem({
  node,
  onClick,
  onRemove
}: SelectedCategoryItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between rounded-sm bg-blue-50 px-1.5 py-2 pl-2 text-sm shadow transition-colors select-none'
      )}
    >
      <div className='flex items-center gap-x-2'>
        <div className='inline-block rounded-sm bg-gray-200 p-1'>
          <Package size={20} strokeWidth={2} className={cn('inline-block')} />
        </div>
        <span className='line-clamp-2 font-medium'>{node.name}</span>
      </div>
      <Button
        type='button'
        variant='ghost'
        className='cursor-pointer hover:bg-transparent'
        size='icon-xs'
        onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }}
      >
        <X className='h-3 w-3' />
      </Button>
    </div>
  )
}
