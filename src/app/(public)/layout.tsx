import PublicCategoryNav from '@/components/common/public-category-nav'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { CATEGORY_QUERY_KEYS } from '@/features/categories/hooks'
import { CategoryTreeNodeType, GetCategoryTreeQueryParams } from '@/features/categories/types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
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
      <Header categoryTree={categoryTree} prunedCategoryTree={prunedCategoryTree} />
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
