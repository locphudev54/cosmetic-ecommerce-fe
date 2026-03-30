import CollectionPage from '@/components/pages/collection/collection-page'
import { API_ENDPOINTS, DEFAULT_PAGINATION_FILTER } from '@/constants/api.constant'
import { ProductSortBy, SortOrder } from '@/enums'
import { Attribute, ATTRIBUTE_QUERY_KEYS } from '@/features/attributes'
import { Brand, BRAND_QUERY_KEYS } from '@/features/brands'
import { CATEGORY_QUERY_KEYS } from '@/features/categories/hooks'
import { Category } from '@/features/categories/types/category.types'
import { COLLECTION_QUERY_KEYS, CollectionDetailBySlug } from '@/features/collections'
import { COUNTRY_OF_ORIGIN_QUERY_KEYS, CountryOfOrigin } from '@/features/country-of-origin'
import { SEARCH_QUERY_KEYS } from '@/features/search/hooks/use-search'
import { ProductDocument } from '@/features/search/types/search.types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { ApiResponse, CursorPaginationMeta, OffsetPaginationMeta } from '@/types'
import { dehydrate, HydrationBoundary, InfiniteData } from '@tanstack/react-query'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const queryClient = getServerQueryClient()

  const isInAllCollectionsPage = slug === 'all'
  let productIdsOfCollection: string[] = []

  try {
    if (isInAllCollectionsPage) {
      // Fetch all attribute records with isGlobalFilter = true and existing categories to display in the sidebar filters on /collections/all
      await Promise.all([
        queryClient.fetchQuery({
          queryKey: ATTRIBUTE_QUERY_KEYS.list({ isGlobalFilter: true, getAll: true }),
          queryFn: () =>
            serverFetchClient.get<Attribute[], OffsetPaginationMeta>(
              `${API_ENDPOINTS.ATTRIBUTES.LIST}?isGlobalFilter=true&getAll=true`
            )
        }),
        queryClient.fetchQuery({
          queryKey: CATEGORY_QUERY_KEYS.list({ getAll: true }),
          queryFn: () =>
            serverFetchClient.get<Category[], OffsetPaginationMeta>(
              `${API_ENDPOINTS.CATEGORIES.LIST}?getAll=true`
            )
        })
      ])
    }

    const [collectionData] = await Promise.all([
      !isInAllCollectionsPage
        ? queryClient.fetchQuery({
            queryKey: COLLECTION_QUERY_KEYS.detail(slug),
            queryFn: async () => {
              const res = await serverFetchClient.get<CollectionDetailBySlug>(
                `${API_ENDPOINTS.COLLECTIONS.DETAIL_BY_SLUG(slug)}`
              )
              return res.data
            }
          })
        : null,
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

    productIdsOfCollection = collectionData?.products.map((product) => product.productId) || []

    const searchParams = new URLSearchParams({
      limit: String(DEFAULT_PAGINATION_FILTER.limit),
      sortBy: ProductSortBy.CREATED_AT,
      sortOrder: SortOrder.DESC
    })

    productIdsOfCollection.forEach((id) => {
      searchParams.append('productIds', id)
    })

    await queryClient.prefetchInfiniteQuery<
      ApiResponse<ProductDocument[], CursorPaginationMeta>,
      Error,
      InfiniteData<ApiResponse<ProductDocument[], CursorPaginationMeta>>,
      ReturnType<typeof SEARCH_QUERY_KEYS.infiniteCursor>,
      string | null
    >({
      queryKey: SEARCH_QUERY_KEYS.infiniteCursor({
        productIds: productIdsOfCollection,
        limit: DEFAULT_PAGINATION_FILTER.limit,
        sortBy: ProductSortBy.CREATED_AT,
        sortOrder: SortOrder.DESC
      }),
      queryFn: ({ pageParam }) => {
        if (pageParam) {
          searchParams.set('cursor', pageParam)
        } else {
          searchParams.delete('cursor')
        }

        return serverFetchClient.get<ProductDocument[], CursorPaginationMeta>(
          `${API_ENDPOINTS.SEARCH.PRODUCTS}?${searchParams.toString()}`
        )
      },
      initialPageParam: null,
      getNextPageParam: (lastPage: ApiResponse<ProductDocument[], CursorPaginationMeta>) =>
        lastPage.meta?.hasNextPage ? lastPage.meta?.nextCursor : undefined
    })
  } catch (error) {
    throw new Error('Failed to fetch in collection page')
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CollectionPage
        slug={slug}
        isInAllCollectionsPage={isInAllCollectionsPage}
        productIds={productIdsOfCollection}
      />
    </HydrationBoundary>
  )
}
