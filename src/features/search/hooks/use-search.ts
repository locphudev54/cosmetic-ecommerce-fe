import { searchService } from '@/features/search/services/search.service'
import { ProductDocument, SearchProductsBody } from '@/features/search/types/search.types'
import { InfiniteScrollMode, useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useQuery } from '@tanstack/react-query'

export const SEARCH_QUERY_KEYS = {
  all: ['search'] as const,
  products: (body?: SearchProductsBody) => [...SEARCH_QUERY_KEYS.all, 'products', body] as const,
  infiniteCursor: (body?: SearchProductsBody) =>
    [...SEARCH_QUERY_KEYS.all, 'products', 'infinite-cursor', body] as const,
  offsetProducts: (body?: SearchProductsBody) =>
    [...SEARCH_QUERY_KEYS.all, 'products', 'offset', body] as const
}

/**
 * Infinite scroll hook for the Collection Page.
 * Calls `GET /search/products` via ElasticSearch with cursor-based pagination.
 *
 * Drop-in replacement for `useProductsInfiniteScroll` — same return type interface.
 *
 * @example
 * ```tsx
 * const { items, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
 *   useSearchProductsInfiniteScroll({
 *     params: debouncedQueryParams,
 *     mode: 'manual'
 *   })
 * ```
 */
export function useSearchProductsInfiniteScroll({
  params,
  mode = 'scroll',
  enabled = true
}: {
  params?: Omit<SearchProductsBody, 'cursor'>
  mode?: InfiniteScrollMode
  enabled?: boolean
} = {}) {
  return useInfiniteScroll<ProductDocument>({
    queryKey: SEARCH_QUERY_KEYS.infiniteCursor(params),
    mode,
    queryFn: (cursor) =>
      searchService.searchProductsCursor({ ...params, cursor: cursor ?? undefined }),
    queryOptions: { enabled }
  })
}

/**
 * Offset-based pagination hook for the Collection Page.
 * Calls `GET /search/products` via ElasticSearch with page-based pagination.
 *
 * Drop-in replacement for `useProducts` — returns the same shape.
 *
 * @example
 * ```tsx
 * const { data, isLoading, isFetching } = useSearchProductsOffset({
 *   params: { ...debouncedQueryParams, page: 1 }
 * })
 * const products = data?.data ?? []
 * const totalPages = data?.meta?.totalPages ?? 0
 * ```
 */
export function useSearchProductsOffset({
  params,
  enabled = true
}: {
  params?: SearchProductsBody
  enabled?: boolean
} = {}) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.offsetProducts(params),
    queryFn: () => searchService.searchProductsOffset(params),
    enabled
  })
}
