import React from 'react'
import { HistoryItem } from './history-item'
import { TrendingItem } from './trending-item'

interface SearchEmptyStateProps {
  searchHistory: string[]
  trendingSearches: Array<{ query: string; count: number }>
  onSelectHistory: (query: string) => void
  onSelectTrending: (query: string) => void
  onRemoveHistory: (query: string) => void
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  searchHistory,
  trendingSearches,
  onSelectHistory,
  onSelectTrending,
  onRemoveHistory
}) => (
  <>
    {/* Recent searches */}
    {searchHistory.length > 0 && (
      <div>
        <div className='border-b bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Recent Searches
        </div>
        <div className='divide-y'>
          {searchHistory.slice(0, 5).map((item) => (
            <HistoryItem
              key={item}
              query={item}
              onSelect={onSelectHistory}
              onRemove={onRemoveHistory}
            />
          ))}
        </div>
      </div>
    )}

    {/* Trending searches */}
    {trendingSearches.length > 0 && (
      <div>
        <div className='border-t border-b bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Trending Now
        </div>
        <div className='divide-y'>
          {trendingSearches.slice(0, 5).map((item) => (
            <TrendingItem
              key={item.query}
              query={item.query}
              count={item.count}
              onSelect={onSelectTrending}
            />
          ))}
        </div>
      </div>
    )}
  </>
)
