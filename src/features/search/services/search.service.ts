import { API_ENDPOINTS } from '@/constants/api.constant'
import { ProductDocument, SearchProductsBody } from '@/features/search/types/search.types'
import apiClient from '@/lib/api-client'
import { ApiResponse, CursorPaginationMeta, OffsetPaginationMeta } from '@/types/api.types'

export const searchService = {
  /**
   * Search products via the unified ES endpoint.
   * Used by AdvancedSearchBar for keyword search (lightweight call: `{ q, limit: 8 }`).
   * Returns the full ApiResponse with data and meta.
   */
  async searchProducts(
    body: SearchProductsBody
  ): Promise<ApiResponse<ProductDocument[], CursorPaginationMeta>> {
    return apiClient.post<ProductDocument[], CursorPaginationMeta>(
      API_ENDPOINTS.SEARCH.PRODUCTS,
      body
    )
  },

  /**
   * Cursor-paginated search for infinite scroll on the Collection Page.
   * Accepts the full search body plus an optional cursor.
   * Compatible with the `useInfiniteScroll` hook's `queryFn` signature.
   */
  searchProductsCursor(
    body?: Omit<SearchProductsBody, 'cursor'> & { cursor?: string }
  ): Promise<ApiResponse<ProductDocument[], CursorPaginationMeta>> {
    return apiClient.post<ProductDocument[], CursorPaginationMeta>(
      API_ENDPOINTS.SEARCH.PRODUCTS,
      body
    )
  },

  /**
   * Offset-paginated search for traditional pagination on the Collection Page.
   * Pass `page` param (1-based) for offset-based pagination.
   * Returns OffsetPaginationMeta with total, page, totalPages.
   */
  searchProductsOffset(
    body?: Omit<SearchProductsBody, 'page'> & { page?: number }
  ): Promise<ApiResponse<ProductDocument[], OffsetPaginationMeta>> {
    return apiClient.post<ProductDocument[], OffsetPaginationMeta>(
      API_ENDPOINTS.SEARCH.PRODUCTS,
      body
    )
  }
}
