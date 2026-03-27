import CollectionPage from '@/components/pages/collection/collection-page'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { Brand, BRAND_QUERY_KEYS } from '@/features/brands'
import { COLLECTION_QUERY_KEYS, CollectionDetailBySlug } from '@/features/collections'
import { COUNTRY_OF_ORIGIN_QUERY_KEYS, CountryOfOrigin } from '@/features/country-of-origin'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { OffsetPaginationMeta } from '@/types'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const queryClient = getServerQueryClient()

  await Promise.all([
    queryClient.fetchQuery({
      queryKey: COLLECTION_QUERY_KEYS.detail(slug),
      queryFn: async () => {
        const res = await serverFetchClient.get<CollectionDetailBySlug>(
          `${API_ENDPOINTS.COLLECTIONS.DETAIL_BY_SLUG(slug)}`
        )
        return res.data
      }
    }),
    queryClient.fetchQuery({
      queryKey: BRAND_QUERY_KEYS.list({ getAll: true }), // Todo: Implement proper pagination to get all brands and cache them
      queryFn: () =>
        serverFetchClient.get<Brand[], OffsetPaginationMeta>(
          `${API_ENDPOINTS.BRANDS.LIST}?getAll=true`
        )
    }),
    queryClient.fetchQuery({
      queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.list({ getAll: true }), // Todo: Implement proper pagination to get all countries of origin and cache them
      queryFn: () =>
        serverFetchClient.get<CountryOfOrigin[], OffsetPaginationMeta>(
          `${API_ENDPOINTS.COUNTRY_OF_ORIGIN.LIST}?getAll=true`
        )
    })
  ])

  // queryClient.fetchQuery({
  //   queryKey: COLLECTION_QUERY_KEYS.detail(slug),
  //   queryFn: () =>
  //     serverFetchClient.get<CollectionDetailBySlug>(
  //       `${API_ENDPOINTS.COLLECTIONS.DETAIL_BY_SLUG(slug)}`
  //     )
  // })

  // const { data: productsData } = await queryClient.fetchQuery({
  //   queryKey: PRODUCT_QUERY_KEYS.list({}),
  //   queryFn: () => {
  //     return serverFetchClient.get<Product[], OffsetPaginationMeta>(API_ENDPOINTS.PRODUCTS.LIST)
  //   }
  // })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CollectionPage slug={slug} />
    </HydrationBoundary>
  )
}
