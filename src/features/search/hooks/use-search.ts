import { searchService } from '@/features/search/services/search.service'
import { SearchResult } from '@/features/search/types/search.types'
import { useQuery } from '@tanstack/react-query'

export const useSearchProducts = (query: string) => {
  return useQuery<SearchResult>({
    queryKey: ['search', 'products', query],
    queryFn: () => searchService.searchProducts(query)
  })
}
