'use client'

import { Input } from '@/components/ui/input'
import { searchService } from '@/features/search/services/search.service'
import { ProductDocument } from '@/features/search/types/search.types'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { getSearchHistory, saveSearchHistory } from '@/utilts/client.utils'
import { Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { trendingSearches } from './search/mock-data'
import { SearchEmptyState } from './search/search-empty-state'
import { SearchResults } from './search/search-results'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

export interface SearchBarProps {
  onSearch?: (query: string) => void
  onProductSelect?: (product: ProductDocument) => void
  placeholder?: string
  className?: string
}

export const AdvancedSearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onProductSelect,
  placeholder = 'Search products...',
  className
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<ProductDocument[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>(getSearchHistory())
  const [trendingData] = useState(trendingSearches)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const isMobile = useIsMobile()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // Mock API call to fetch suggestions
  const fetchSuggestions = useDebouncedCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setHighlightedIndex(-1)
      return
    }

    setLoading(true)

    const results = await searchService.searchProducts(searchQuery)
    const products = results.products || []

    setSuggestions(products.slice(0, 8))
    setLoading(false)
  }, 800)

  // Debounced search
  useEffect(() => {
    fetchSuggestions(query)
  }, [query, fetchSuggestions])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return

      // Add to history
      const newHistory = [searchQuery, ...searchHistory.filter((q) => q !== searchQuery)].slice(
        0,
        8
      )
      setSearchHistory(newHistory)
      saveSearchHistory(newHistory)

      // Trigger callback
      onSearch?.(searchQuery)

      // Close dropdown
      setIsOpen(false)
      setQuery('')
      setSuggestions([])
    },
    [searchHistory, onSearch]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const itemsCount = suggestions.length + (query === '' ? searchHistory.length : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : 0))
        break

      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : itemsCount - 1))
        break

      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          if (highlightedIndex < suggestions.length) {
            const product = suggestions[highlightedIndex]
            onProductSelect?.(product)
            handleSearch(product.name)
          } else {
            const historyIdx = highlightedIndex - suggestions.length
            if (searchHistory[historyIdx]) {
              setQuery(searchHistory[historyIdx])
              handleSearch(searchHistory[historyIdx])
            }
          }
        } else if (query.trim()) {
          handleSearch(query)
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  const handleProductClick = (product: ProductDocument) => {
    onProductSelect?.(product)
    handleSearch(product.name)
  }

  const removeHistory = (queryToRemove: string) => {
    const newHistory = searchHistory.filter((q) => q !== queryToRemove)
    setSearchHistory(newHistory)
    saveSearchHistory(newHistory)
  }

  const showDropdown = isOpen && (query.trim() || (!query && searchHistory.length > 0))

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full',
        isMobile && isOpen ? 'fixed inset-0 z-50 flex flex-col' : '',
        className
      )}
    >
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className='absolute inset-0 -z-10 bg-black/30' onClick={() => setIsOpen(false)} />
      )}

      {/* Search input */}
      <div
        className={cn(
          'relative flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-all',
          isOpen && 'border-blue-500 ring-2 ring-blue-100',
          isMobile && isOpen ? 'w-full rounded-b-none' : ''
        )}
      >
        <Search className='h-5 w-5 text-gray-400' />
        <Input
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className='h-6 border-0 p-0 focus-visible:ring-0'
          autoComplete='off'
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              inputRef.current?.focus()
            }}
            className='rounded p-1 text-gray-400 hover:bg-gray-100'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={cn(
            'absolute top-full right-0 left-0 z-40 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
            isMobile && isOpen ? 'fixed top-14 right-0 left-0 mt-0 rounded-t-none' : '',
            isMobile && isOpen ? 'bottom-0' : ''
          )}
        >
          {/* Results or empty state */}
          {query.trim() ? (
            <SearchResults
              query={query}
              loading={loading}
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onProductSelect={handleProductClick}
              isMobile={isMobile}
              isOpen={isOpen}
            />
          ) : (
            <SearchEmptyState
              searchHistory={searchHistory}
              trendingSearches={trendingData}
              onSelectHistory={(q) => {
                setQuery(q)
                handleSearch(q)
              }}
              onSelectTrending={(q) => {
                setQuery(q)
                handleSearch(q)
              }}
              onRemoveHistory={removeHistory}
            />
          )}
        </div>
      )}
    </div>
  )
}
