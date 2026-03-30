import { API_ENDPOINTS } from '@/constants/api.constant'
import { ProductDocument, SearchProductsParams } from '@/features/search/types/search.types'
import apiClient from '@/lib/api-client'
import { ApiResponse, CursorPaginationMeta, OffsetPaginationMeta } from '@/types/api.types'

export const searchService = {
  /**
   * Search products via the unified ES endpoint.
   * Used by AdvancedSearchBar for keyword search (lightweight call: `{ q, limit: 8 }`).
   * Returns the full ApiResponse with data and meta.
   */
  async searchProducts(
    params: SearchProductsParams
  ): Promise<ApiResponse<ProductDocument[], CursorPaginationMeta>> {
    return apiClient.get<ProductDocument[], CursorPaginationMeta>(API_ENDPOINTS.SEARCH.PRODUCTS, {
      params
    })
  },

  /**
   * Cursor-paginated search for infinite scroll on the Collection Page.
   * Accepts the full search params plus an optional cursor.
   * Compatible with the `useInfiniteScroll` hook's `queryFn` signature.
   */
  searchProductsCursor(
    params?: Omit<SearchProductsParams, 'cursor'> & { cursor?: string }
  ): Promise<ApiResponse<ProductDocument[], CursorPaginationMeta>> {
    return apiClient.get<ProductDocument[], CursorPaginationMeta>(API_ENDPOINTS.SEARCH.PRODUCTS, {
      params
    })
  },

  /**
   * Offset-paginated search for traditional pagination on the Collection Page.
   * Pass `page` param (1-based) for offset-based pagination.
   * Returns OffsetPaginationMeta with total, page, totalPages.
   */
  searchProductsOffset(
    params?: SearchProductsParams
  ): Promise<ApiResponse<ProductDocument[], OffsetPaginationMeta>> {
    return apiClient.get<ProductDocument[], OffsetPaginationMeta>(API_ENDPOINTS.SEARCH.PRODUCTS, {
      params
    })
  }
}
