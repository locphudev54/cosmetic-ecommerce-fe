import { API_ENDPOINTS } from '@/constants/api.constant'
import { SearchResult } from '@/features/search/types/search.types'
import apiClient from '@/lib/api-client'

export const searchService = {
  async searchProducts(query: string): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>(API_ENDPOINTS.SEARCH.PRODUCTS, {
      params: { query }
    })

    return response.data
  }
}
