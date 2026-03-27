import { productService } from '@/features/product/services/product.service'
import {
  CreateProductDto,
  FindAllProductsQueryParams,
  UpdateProductDto
} from '@/features/product/types'
import { InfiniteScrollMode, useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useVirtualInfiniteScroll } from '@/hooks/use-virtual-infinite-scroll'
import { DateRangeQueryParams } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FindAllProductsQueryParams) => [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  infiniteCursor: (params?: FindAllProductsQueryParams) =>
    [...PRODUCT_QUERY_KEYS.all, 'infinite-cursor', params] as const,
  virtualInfinite: (params?: FindAllProductsQueryParams) =>
    [...PRODUCT_QUERY_KEYS.all, 'virtual-infinite', params] as const
}

export const useProducts = (params?: FindAllProductsQueryParams & DateRangeQueryParams) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productService.getProductsOffset(params)
  })
}

/**
 * Ready-to-use infinite scroll hook for the Products list page.
 *
 * Usage:
 *   const { items, sentinelRef, isLoading, isFetchingNextPage } =
 *     useProductsInfiniteScroll({ params: { search: debouncedSearch } })
 */
export function useProductsInfiniteScroll({
  params,
  mode = 'scroll',
  enabled = true
}: {
  params?: Omit<FindAllProductsQueryParams, 'cursor'>
  mode?: InfiniteScrollMode
  enabled?: boolean
} = {}) {
  return useInfiniteScroll({
    queryKey: PRODUCT_QUERY_KEYS.infiniteCursor(params),
    mode,
    queryFn: (cursor) =>
      productService.getProductsCursor({ ...params, cursor: cursor ?? undefined }),
    queryOptions: { enabled }
  })
}

export function useProductsVirtualInfiniteScroll({
  params,
  mode = 'scroll',
  enabled = true,
  columns = 1,
  estimateSize = 80,
  overscan = 5
}: {
  params?: Omit<FindAllProductsQueryParams, 'cursor'>
  mode?: InfiniteScrollMode
  enabled?: boolean
  columns?: number
  estimateSize?: number
  overscan?: number
} = {}) {
  return useVirtualInfiniteScroll({
    queryKey: PRODUCT_QUERY_KEYS.virtualInfinite(params),
    queryFn: (cursor) =>
      productService.getProductsCursor({ ...params, cursor: cursor ?? undefined }),
    mode,
    columns,
    estimateSize,
    overscan,
    enabled
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id
  })
}

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
    }
  })
}

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => productService.bulkDeleteProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
    }
  })
}
