import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ROUTES } from '@/constants/route.constant'
import { CategoryTreeNodeType } from '@/features/categories/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface AccordionCategoryMenuItemProps {
  category: CategoryTreeNodeType
  level?: number
  shouldNavigate?: boolean
}

export const AccordionCategoryMenuItem = ({
  category,
  level = 0,
  shouldNavigate = false
}: AccordionCategoryMenuItemProps) => {
  const hasChildren = category.children && category.children.length > 0
  const isRootCategory = level === 0

  if (!hasChildren) {
    return (
      <Link href={ROUTES.COLLECTIONS.DETAIL(category.slug)} className='block'>
        <button
          className={cn(
            'w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:text-blue-600',
            isRootCategory && 'font-bold'
          )}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          {category.name}
        </button>
      </Link>
    )
  }

  return (
    <AccordionItem value={category.id} className='border-0'>
      {shouldNavigate ? (
        <div
          className='flex cursor-pointer items-center justify-between px-4 hover:bg-gray-50 hover:text-blue-600 hover:no-underline'
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <Link
            href={ROUTES.COLLECTIONS.DETAIL(category.slug)}
            className={cn('w-full text-sm text-gray-800', isRootCategory && 'font-bold')}
          >
            {category.name}
          </Link>
          <AccordionTrigger className={cn('cursor-pointer')} />
        </div>
      ) : (
        <AccordionTrigger
          className={cn(
            'ptext-left flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-gray-700 transition-colors hover:text-blue-600 hover:no-underline',
            isRootCategory && 'font-bold'
          )}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          {category.name}
        </AccordionTrigger>
      )}
      <AccordionContent className='border-0 pb-0'>
        <div className='space-y-0'>
          {category.children?.map((child) => (
            <AccordionCategoryMenuItem
              key={child.id}
              category={child}
              level={level + 1}
              shouldNavigate={shouldNavigate}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
