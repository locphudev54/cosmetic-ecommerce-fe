import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { cn } from '@/lib/utils'
import { ChevronRight, Package } from 'lucide-react'

interface CategorySelectionItemProps {
  node: CategoryTreeNodeType
}

export default function CategorySelectionItem({ node }: CategorySelectionItemProps) {
  const isSelected = useCategoryTreeStore((s) => s.isSelected(node.id))
  const isExpanded = useCategoryTreeStore((s) => s.isExpanded(node.id))
  const isMatching = useCategoryTreeStore((s) => s.isNodeMatching(node.id))
  const toggleExpand = useCategoryTreeStore((s) => s.toggleExpand)
  const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)

  const hasChildren = !!(node.children && node.children.length > 0)
  const isActive = node.isActive

  return (
    <div
      onClick={(e) => {
        if (!isActive) return

        e.stopPropagation()
        toggleSelect(node.id)
      }}
      className={cn(
        'z-100 flex items-center rounded-sm border-[1.5px] border-transparent pl-2 transition-colors',
        {
          'border-blue-400/80 bg-blue-50': isSelected,
          'hover:bg-accent': !isSelected,
          'cursor-pointer': isActive,
          'line-through opacity-50': !isActive
        }
      )}
    >
      {hasChildren ? (
        <CollapsibleTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChevronRight
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(node.id)
                }}
                className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{!isExpanded ? 'Mở rộng danh mục' : 'Thu gon danh mục'}</p>
            </TooltipContent>
          </Tooltip>
        </CollapsibleTrigger>
      ) : (
        <div className='h-4 w-4' />
      )}

      <div
        className={cn(
          'flex w-full cursor-pointer items-center px-1.5 py-2 text-sm select-none',
          !node.isActive && 'line-through opacity-50',
          isMatching && !isSelected && 'rounded bg-yellow-100 font-semibold dark:bg-yellow-900'
        )}
      >
        <div className='mr-2 inline-block rounded-sm bg-gray-200 p-1'>
          <Package size={20} strokeWidth={2} className={cn('inline-block')} />
        </div>
        <span className='max-w-fix line-clamp-2 font-medium'>{node.name}</span>
      </div>
    </div>
  )
}
