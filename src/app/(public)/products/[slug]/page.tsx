import ProductDetailPage from '@/components/pages/home/product-detail/product-detail-page'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { PRODUCT_QUERY_KEYS } from '@/features/product/hooks'
import { Product } from '@/features/product/types/product.types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const queryClient = getServerQueryClient()

  await queryClient.fetchQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(slug),
    queryFn: async () => {
      const response = await serverFetchClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug))
      return response.data
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailPage slug={slug} />
    </HydrationBoundary>
  )
}
