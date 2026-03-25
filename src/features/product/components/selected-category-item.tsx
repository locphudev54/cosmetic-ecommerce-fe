import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { cn } from '@/lib/utils'
import { Package, Star, X } from 'lucide-react'

interface SelectedCategoryItemProps {
  node: CategoryTreeNodeType
  ancestorCategories?: CategoryTreeNodeType[]
  canSelectPrimaryCategory?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export default function SelectedCategoryItem({
  node,
  onClick,
  onRemove,
  ancestorCategories = [],
  canSelectPrimaryCategory = true
}: SelectedCategoryItemProps) {
  const primaryCategoryId = useCategoryTreeStore((state) => state.primaryCategoryId)
  const setPrimaryCategoryId = useCategoryTreeStore((state) => state.setPrimaryCategoryId)
  const multiSelect = useCategoryTreeStore((state) => state.multiSelect)

  const handleSelectPrimaryCategory =
    (nodeId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      const isPrimary = primaryCategoryId === nodeId

      if (isPrimary) {
        // Get the leaf category and set it as a primary category if the current primary category is removed
        // const leafCategory = selectedCategories[selectedCategories.length - 1]
        // setPrimaryCategoryId(leafCategory.id)
        setPrimaryCategoryId(null)
      } else {
        setPrimaryCategoryId(nodeId)
      }
    }

  return (
    <div
      // onClick={onClick}
      className={cn(
        'cursor-pointer rounded-sm bg-blue-50 px-1.5 py-2 pl-2 text-sm shadow transition-colors select-none'
      )}
    >
      <div className='flex items-center gap-x-2'>
        <div className='inline-block rounded-sm bg-gray-200 p-2'>
          <Package size={20} strokeWidth={2} className={cn('inline-block')} />
        </div>
        <div className='grow'>
          <TypographyMuted className='flex max-w-fit items-center gap-x-1 text-xs'>
            {ancestorCategories.map((cat) => {
              const isPrimary = primaryCategoryId === cat.id

              return (
                <span key={cat.id} className='flex items-center gap-x-1'>
                  <span className='max-w-18 truncate'>{cat.name}</span>
                  {canSelectPrimaryCategory && (
                    <Button
                      type='button'
                      variant='ghost'
                      className='cursor-pointer'
                      size='xs'
                      onClick={handleSelectPrimaryCategory(cat.id)}
                    >
                      {isPrimary ? (
                        <Star className='h-3 w-3 fill-current text-yellow-500' />
                      ) : (
                        <Star className='h-3 w-3' />
                      )}
                    </Button>
                  )}
                  <span className='text-muted-foreground select-none'>/</span>
                </span>
              )
            })}
          </TypographyMuted>

          <div className='flex w-full items-center justify-between'>
            <span className='line-clamp-2 font-medium'>{node.name}</span>
            <div className='flex items-center'>
              {multiSelect && canSelectPrimaryCategory && (
                <Button
                  type='button'
                  variant='ghost'
                  className='cursor-pointer'
                  size='xs'
                  onClick={handleSelectPrimaryCategory(node.id)}
                >
                  {primaryCategoryId === node.id ? (
                    <Star className='fill-current text-yellow-500' />
                  ) : (
                    <Star />
                  )}
                </Button>
              )}
              <Button
                type='button'
                variant='ghost'
                className='cursor-pointer'
                size='xs'
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove?.()
                }}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
