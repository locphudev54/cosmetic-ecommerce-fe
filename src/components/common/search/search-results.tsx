import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProductDocument } from '@/features/search/types/search.types'
import { cn } from '@/lib/utils'
import { Package2 } from 'lucide-react'
import React from 'react'
import { ProductResultItem } from './product-result-item'
import { SearchSkeleton } from './search-skeleton'

interface SearchResultsProps {
  query: string
  loading: boolean
  suggestions: ProductDocument[]
  highlightedIndex: number
  onProductSelect: (product: ProductDocument) => void
  isMobile: boolean
  isOpen: boolean
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  loading,
  suggestions,
  highlightedIndex,
  onProductSelect,
  isMobile,
  isOpen
}) => {
  if (!query.trim()) return null

  return (
    <div>
      {loading ? (
        <SearchSkeleton />
      ) : suggestions.length > 0 ? (
        <ScrollArea
          className={cn('overflow-hidden rounded-lg', isMobile && isOpen ? 'h-96' : 'max-h-96')}
        >
          <div className='divide-y'>
            {suggestions.map((product, idx) => (
              <ProductResultItem
                key={product.id}
                product={product}
                query={query}
                onSelect={onProductSelect}
                isHovered={highlightedIndex === idx}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className='p-8'>
          <Empty className=''>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <Package2 />
              </EmptyMedia>
              <EmptyTitle>Không tìm thấy sản phẩm nào</EmptyTitle>
              <EmptyDescription>
                Hãy thử lại với từ khóa khác hoặc kiểm tra lại chính tả
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {/* <Button variant='outline' size='sm'>
                Upload Files
              </Button> */}
            </EmptyContent>
          </Empty>
        </div>
      )}
    </div>
  )
}
