import ProductDetailPage from '@/components/pages/product-detail-page'
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
      const response = await serverFetchClient.get<Product>(
        API_ENDPOINTS.PRODUCTS.DETAIL_BY_SLUG(slug)
      )
      return response.data
    }
  })

  return (
    // If we don't use pass dehydrated state to the client, the client will fetch the data again and cause a flash of loading state
    // Also, it's not good for SEO because the server-rendered HTML will not have the product data and search engines might not be able to index the page properly
    // <ProductDetailPage slug={slug} />

    // On the other hand, if we use HydrationBoundary to pass the dehydrated state to the client,
    // the client can use the pre-fetched data and avoid the flash of loading state,
    // and also improve SEO because the server-rendered HTML will have the product data
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailPage slug={slug} />
    </HydrationBoundary>
  )
}
