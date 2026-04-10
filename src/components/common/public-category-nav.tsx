'use client'

import { AccordionCategoryMenuItem } from '@/components/common/accordion-category-menu-item'
import { MegaMenu } from '@/components/common/mega-menu'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ROUTES } from '@/constants/route.constant'
import { useCategoryTree } from '@/features/categories/hooks'
import { CategoryTreeNodeType } from '@/features/categories/types'
import { useIsTablet } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_SUB_MENU_MAX_DEPTH = 2 // Max depth of category tree to show in the sub-menu
const CATEGORY_MEGA_MENU_MAX_DEPTH = 5 // Max depth of category tree to show in the menu

export default function PublicCategoryNav() {
  const isTabletOrBelow = useIsTablet()
  const { data: categoryTreeData } = useCategoryTree({
    isDeleted: false,
    maxDepth: CATEGORY_MEGA_MENU_MAX_DEPTH
  })

  // Prune the category tree with the max depth is 3
  const truncateCategoryTree = (
    nodes: CategoryTreeNodeType[],
    currentDepth: number,
    maxDepth: number
  ): CategoryTreeNodeType[] => {
    if (currentDepth > maxDepth) {
      return []
    }
    return nodes.map((node) => ({
      ...node,
      children: node.children ? truncateCategoryTree(node.children, currentDepth + 1, maxDepth) : []
    }))
  }

  const categoryTree = categoryTreeData || []

  const prunedCategoryTree = truncateCategoryTree(
    categoryTree || [],
    0,
    CATEGORY_SUB_MENU_MAX_DEPTH
  )

  return (
    <div className='bg-business-primary py-1.5'>
      <div className='customer-page-container'>
        <div className='flex justify-evenly'>
          <MegaMenu categoryTree={categoryTree} />
          {prunedCategoryTree.slice(-5).map((category) => {
            const triggerButton = (
              <Button
                variant={'ghost'}
                className={cn(
                  'rounded font-bold transition-colors duration-200 group-hover:bg-black group-hover:text-white hover:bg-black hover:text-white'
                )}
              >
                <span className='uppercase'>{category.name}</span>
                <ChevronDown
                  className={cn(
                    'ml-auto h-4 w-4 transition-transform duration-200 group-hover:rotate-180'
                  )}
                />
              </Button>
            )

            if (isTabletOrBelow) {
              return (
                <div key={category.id} className='group'>
                  <Popover>
                    <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
                    <PopoverContent
                      align='start'
                      sideOffset={11}
                      className='custom-scrollbar max-h-125 overflow-y-auto rounded p-2'
                    >
                      <Accordion type='multiple' className='py-0'>
                        {category.children?.map((childCategory) => (
                          <AccordionCategoryMenuItem
                            key={childCategory.id}
                            category={childCategory}
                            level={0}
                          />
                        ))}
                      </Accordion>
                    </PopoverContent>
                  </Popover>
                </div>
              )
            }

            return (
              <div key={category.id} className='group'>
                <HoverCard openDelay={10} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Link href={ROUTES.COLLECTIONS.DETAIL(category.slug)}>{triggerButton}</Link>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align='start'
                    sideOffset={11}
                    className='custom-scrollbar max-h-125 overflow-y-auto rounded p-2'
                  >
                    <Accordion type='multiple' className='py-0'>
                      {category.children?.map((childCategory) => (
                        <AccordionCategoryMenuItem
                          key={childCategory.id}
                          category={childCategory}
                          level={0}
                        />
                      ))}
                    </Accordion>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )
          })}
          <Link href={ROUTES.COLLECTIONS.ALL}>
            <Button
              variant={'ghost'}
              className='rounded font-bold transition-colors duration-200 group-hover:bg-black group-hover:text-white hover:bg-black hover:text-white'
            >
              <span className='uppercase'>Tất cả sản phẩm</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
