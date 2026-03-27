import HomagePage from '@/components/pages/home/home-page'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { PRODUCT_QUERY_KEYS } from '@/features/product/hooks'
import { Product } from '@/features/product/types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { OffsetPaginationMeta } from '@/types/api.types'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function Page() {
  const queryClient = getServerQueryClient()

  await queryClient.fetchQuery({
    queryKey: PRODUCT_QUERY_KEYS.list({}),
    queryFn: () => {
      return serverFetchClient.get<Product[], OffsetPaginationMeta>(API_ENDPOINTS.PRODUCTS.LIST)
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomagePage />
    </HydrationBoundary>
  )
}
