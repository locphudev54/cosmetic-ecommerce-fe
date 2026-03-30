'use client'

import * as React from 'react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { ProductSortBy, ProductStatus, SortOrder } from '@/enums'
import {
  getAttributesParser,
  getBooleanFilterParser,
  getPositiveNumberParser,
  getSortByParser,
  getSortOrderParser,
  getStatusParser,
  getUuidArrayParser
} from '@/features/product/lib/query-parsers'
import { AttributeFilter, FindAllProductsQueryParams } from '@/features/product/types'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { DEFAULT_PAGINATION_FILTER } from '@/constants/api.constant'

/**
 * Schema mapping URL param names → nuqs parsers with defaults.
 * Every key here becomes a query param in the URL.
 */
const productFilterParsers = {
  page: parseAsInteger.withDefault(DEFAULT_PAGINATION_FILTER.page),
  limit: parseAsInteger.withDefault(DEFAULT_PAGINATION_FILTER.limit),
  searchQuery: parseAsString.withDefault(''),
  status: getStatusParser().withDefault([]),
  categoryIds: getUuidArrayParser().withDefault([]),
  brandIds: getUuidArrayParser().withDefault([]),
  countryIds: getUuidArrayParser().withDefault([]),
  minPrice: getPositiveNumberParser(),
  maxPrice: getPositiveNumberParser(),
  attributes: getAttributesParser().withDefault([]),
  inStock: getBooleanFilterParser(),
  hasActiveVariants: getBooleanFilterParser(),
  sortBy: getSortByParser().withDefault(ProductSortBy.CREATED_AT),
  sortOrder: getSortOrderParser().withDefault(SortOrder.DESC)
}

/** The shape of the nuqs state object */
type ProductFilterState = {
  page: number
  limit: number
  searchQuery: string
  status: ProductStatus[]
  categoryIds: string[]
  brandIds: string[]
  countryIds: string[]
  minPrice: number | null
  maxPrice: number | null
  attributes: AttributeFilter[]
  inStock: boolean | null
  hasActiveVariants: boolean | null
  sortBy: ProductSortBy
  sortOrder: SortOrder
}

export interface UseProductFilterParamsOptions {
  /**
   * Static overrides merged into every API call
   * (e.g. `{ categorySlug }` from route params).
   */
  overrides?: Partial<FindAllProductsQueryParams>
  /**
   * Debounce delay in ms. Default: 400
   */
  debounceMs?: number
}

/**
 * Transforms the raw nuqs state into a clean `FindAllProductsQueryParams`
 * object suitable for the API, stripping empty/null/default values.
 */
function toQueryParams(
  state: ProductFilterState,
  overrides?: Partial<FindAllProductsQueryParams>
): FindAllProductsQueryParams {
  const params: FindAllProductsQueryParams = {
    page: state.page,
    limit: state.limit
  }

  if (state.searchQuery) params.searchQuery = state.searchQuery
  if (state.status.length > 0) params.status = state.status
  if (state.categoryIds.length > 0) params.categoryIds = state.categoryIds
  if (state.brandIds.length > 0) params.brandIds = state.brandIds
  if (state.countryIds.length > 0) params.countryIds = state.countryIds
  if (state.minPrice != null) params.minPrice = state.minPrice
  if (state.maxPrice != null) params.maxPrice = state.maxPrice
  if (state.attributes && state.attributes.length > 0) params.attributes = state.attributes
  if (state.inStock != null) params.inStock = state.inStock
  if (state.hasActiveVariants != null) params.hasActiveVariants = state.hasActiveVariants
  if (state.sortBy) params.sortBy = state.sortBy
  if (state.sortOrder) params.sortOrder = state.sortOrder

  return { ...params, ...overrides }
}

/**
 * Reusable hook that syncs product filter/sort/pagination state between URL
 * query params and component state using `nuqs`.
 *
 * **URL → Component**: When a user enters a URL with query params, nuqs hydrates
 * the state with validated values. Invalid params are silently discarded.
 *
 * **Component → URL**: When the user clicks a filter or sort option, calling
 * `setQueryParams` updates both the component state and the URL instantly.
 *
 * **Debouncing**: `debouncedQueryParams` lags behind the live state by `debounceMs`
 * to avoid hammering the API during rapid filter changes.
 *
 * @example
 * ```tsx
 * const { debouncedQueryParams, setQueryParams } = useProductFilterParams({
 *   overrides: { categorySlug: slug },
 *   debounceMs: 400
 * })
 *
 * // Pass to useProducts for offset pagination
 * const { data } = useProducts(debouncedQueryParams)
 *
 * // Wire a filter
 * <CollapsibleFilter
 *   onSelectionChange={(ids) => setQueryParams({ brandIds: ids as string[] })}
 * />
 *
 * // Change page
 * setQueryParams({ page: 2 })
 * ```
 */
export function useProductFilterParams(options: UseProductFilterParamsOptions = {}) {
  const { overrides, debounceMs = 400 } = options

  // nuqs state — synced with URL query params
  const [queryState, setQueryState] = useQueryStates(productFilterParsers, {
    history: 'push',
    shallow: false // trigger Next.js re-render so RSC can read params too
  })

  // Debounced query params for API calls
  const [debouncedQueryParams, setDebouncedQueryParams] = React.useState(() =>
    toQueryParams(queryState as ProductFilterState, overrides)
  )

  const debouncedUpdate = useDebouncedCallback((state: ProductFilterState) => {
    setDebouncedQueryParams(toQueryParams(state, overrides))
  }, debounceMs)

  // When URL state changes (user interaction or URL navigation), schedule a debounced update
  React.useEffect(() => {
    debouncedUpdate(queryState as ProductFilterState)
  }, [queryState, debouncedUpdate])

  /**
   * Convenience setter — accepts a partial update to merge into the current state.
   * When changing filters (non-page params), automatically resets page to 1.
   * This updates the URL immediately; the API call fires after debounce.
   */
  const setQueryParams = React.useCallback(
    (updates: Partial<ProductFilterState>) => {
      setQueryState((prev) => {
        // If the update changes any filter (not page/limit), reset page to 1
        const isFilterChange = Object.keys(updates).some((key) => key !== 'page' && key !== 'limit')
        return {
          ...prev,
          ...updates,
          ...(isFilterChange && !('page' in updates)
            ? { page: DEFAULT_PAGINATION_FILTER.page }
            : {})
        }
      })
    },
    [setQueryState]
  )

  /**
   * Reset all filters to defaults (also resets page to 1)
   */
  const resetFilters = React.useCallback(() => {
    setQueryState({
      page: DEFAULT_PAGINATION_FILTER.page,
      limit: DEFAULT_PAGINATION_FILTER.limit,
      searchQuery: '',
      status: [],
      categoryIds: [],
      brandIds: [],
      countryIds: [],
      minPrice: null,
      maxPrice: null,
      attributes: [],
      inStock: null,
      hasActiveVariants: null,
      sortBy: ProductSortBy.CREATED_AT,
      sortOrder: SortOrder.DESC
    })
  }, [setQueryState])

  return {
    /** Live URL-synced filter state (updates immediately on user interaction) */
    queryParams: queryState as ProductFilterState,
    /** Update one or more filter fields — URL updates instantly */
    setQueryParams,
    /** Debounced params safe to pass to API / TanStack Query hooks */
    debouncedQueryParams,
    /** Reset all filters to their defaults */
    resetFilters
  }
}
