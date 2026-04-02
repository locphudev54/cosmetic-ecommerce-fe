import { AccordionCategoryItem, MegaMenu } from '@/components/common/mega-menu'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { CATEGORY_QUERY_KEYS } from '@/features/categories/hooks'
import { CategoryTreeNodeType, GetCategoryTreeQueryParams } from '@/features/categories/types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import React from 'react'

const CATEGORY_MEGA_MENU_MAX_DEPTH = 5 // Max depth of category tree to show in the menu
const CATEGORY_SUB_MENU_MAX_DEPTH = 2 // Max depth of category tree to show in the sub-menu

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getServerQueryClient()
  const { data: categoryTree } = await queryClient.fetchQuery({
    queryKey: CATEGORY_QUERY_KEYS.tree({
      isDeleted: false,
      maxDepth: CATEGORY_MEGA_MENU_MAX_DEPTH
    }),
    queryFn: () =>
      serverFetchClient.get<CategoryTreeNodeType[], undefined, GetCategoryTreeQueryParams>(
        API_ENDPOINTS.CATEGORIES.TREE,
        { params: { isDeleted: false, maxDepth: CATEGORY_MEGA_MENU_MAX_DEPTH } }
      )
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

  const prunedCategoryTree = truncateCategoryTree(
    categoryTree || [],
    0,
    CATEGORY_SUB_MENU_MAX_DEPTH
  )

  return (
    <React.Fragment>
      <Header />
      <div className='bg-business-primary py-1.5'>
        <div className='customer-page-container'>
          <div className='flex justify-evenly'>
            <MegaMenu categoryTree={categoryTree} />
            {prunedCategoryTree.slice(-5).map((category, index) => (
              <div key={category.id} className='group'>
                <HoverCard openDelay={10} closeDelay={100} key={index}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant={'ghost'}
                      className='rounded font-bold transition-colors duration-200 group-hover:bg-black group-hover:text-white hover:bg-black hover:text-white'
                    >
                      <span className='uppercase'>{category.name}</span>
                      <ChevronDown
                        className={cn(
                          'ml-auto h-4 w-4 transition-transform duration-200 group-hover:rotate-180'
                        )}
                      />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align='start'
                    sideOffset={1}
                    className='custom-scrollbar max-h-[500px] overflow-y-auto rounded p-2'
                  >
                    <Accordion type='multiple' className='py-0'>
                      {category.children?.map((category) => (
                        <AccordionCategoryItem
                          key={category.id}
                          category={category}
                          level={0}
                          shouldNavigate={false}
                        />
                      ))}
                    </Accordion>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))}
          </div>
        </div>
      </div>
      <main className='grow'>
        <React.Suspense
          fallback={
            <div className='flex min-h-[50vh] items-center justify-center text-lg text-gray-600'>
              Vui lòng truy cập lại website sau khoảng 5 phút nếu có lỗi xảy ra
            </div>
          }
        >
          {children}
        </React.Suspense>
      </main>
      <Footer />
    </React.Fragment>
  )
}
