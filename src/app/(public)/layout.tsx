import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { CATEGORY_QUERY_KEYS } from '@/features/categories/hooks'
import { CategoryTreeNodeType, GetCategoryTreeQueryParams } from '@/features/categories/types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

const CATEGORY_MEGA_MENU_MAX_DEPTH = 5 // Max depth of category tree to show in the menu

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery({
    queryKey: CATEGORY_QUERY_KEYS.tree({
      isDeleted: false,
      maxDepth: 5
    }),
    queryFn: async () => {
      const res = await serverFetchClient.get<
        CategoryTreeNodeType[],
        undefined,
        GetCategoryTreeQueryParams
      >(API_ENDPOINTS.CATEGORIES.TREE, {
        params: { isDeleted: false, maxDepth: CATEGORY_MEGA_MENU_MAX_DEPTH }
      })

      return res.data
    }
  })

  return (
    <React.Fragment>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header />
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
      </HydrationBoundary>
    </React.Fragment>
  )
}
