import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { cn } from '@/lib/utils'
import { Check, ChevronRight, Package } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface CategorySelectionItemProps {
  node: CategoryTreeNodeType
}

export default function CategorySelectionItem({ node }: CategorySelectionItemProps) {
  const isSelected = useCategoryTreeStore((s) => s.isSelected(node.id))
  const isExpanded = useCategoryTreeStore((s) => s.isExpanded(node.id))
  const isMatching = useCategoryTreeStore((s) => s.isNodeMatching(node.id))
  const isFocused = useCategoryTreeStore((s) => s.isFocused(node.id))
  const toggleExpand = useCategoryTreeStore((s) => s.toggleExpand)
  const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)
  const setFocusedCategoryId = useCategoryTreeStore((s) => s.setFocusedCategoryId)

  const itemRef = useRef<HTMLDivElement>(null)

  // Scroll the item into view when it receives keyboard focus
  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isFocused])

  const hasChildren = !!(node.children && node.children.length > 0)
  const isActive = node.isActive

  return (
    <div
      ref={itemRef}
      onClick={(e) => {
        if (!isActive) return

        e.stopPropagation()
        setFocusedCategoryId(node.id)
        toggleSelect(node.id)
        // Restore DOM focus to the tree container so Arrow keys work immediately.
        // Use closest() — it traverses the DOM tree directly, unaffected by stopPropagation.
        const treeEl = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-category-tree]')
        treeEl?.focus()
      }}
      className={cn(
        'z-100 flex items-center rounded-sm border-[1.5px] pl-2 transition-colors',
        isSelected
          ? 'border-blue-400/80 bg-blue-50'
          : isFocused
            ? 'border-blue-400/60'
            : 'border-transparent',
        {
          'hover:bg-accent hover:border-blue-400/60': !isSelected && !isFocused,
          'cursor-pointer': isActive,
          'line-through opacity-50': !isActive,
          'outline-3 outline-blue-400/50': isFocused && isSelected
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
          'relative flex w-full cursor-pointer items-center px-1.5 py-2 text-sm select-none',
          !node.isActive && 'line-through opacity-50',
          isMatching && !isSelected && 'rounded bg-yellow-100 font-semibold dark:bg-yellow-900'
        )}
      >
        <div className='mr-2 inline-block rounded-sm bg-gray-200 p-1'>
          <Package size={20} strokeWidth={2} className={cn('inline-block')} />
        </div>
        <span className='max-w-fix line-clamp-2 font-medium'>{node.name}</span>
        {isSelected && (
          <div className='absolute top-[50%] right-2 -translate-y-1/2'>
            <Check size={16} />
          </div>
        )}
      </div>
    </div>
  )
}
