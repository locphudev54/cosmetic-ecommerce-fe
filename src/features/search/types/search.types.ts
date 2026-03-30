import { ProductStatus } from '@/enums'
import { FindAllProductsQueryParams } from '@/features/product/types'

/**
 * Denormalized product document returned directly from ElasticSearch.
 * This is the flat representation of a product with all relations embedded.
 */
export interface ProductDocument {
  id: string
  code: string
  name: string
  slug: string
  description: string | null
  status: ProductStatus | string
  basePrice: number
  views: number
  brand: { id: string; name: string } | null
  countryOfOrigin: { id: string; name: string } | null
  categories: Array<{ id: string; name: string; slug: string; isPrimary: boolean }>
  images: Array<{ url: string; altText: string | null; displayOrder: number }>
  variants: Array<{
    id: string
    sku: string
    name: string
    sellingPrice: number
    costPrice: number
    stockOnHand: number
    imageUrl: string | null
    isActive: boolean
    attributeValues: Array<{
      attributeId: string
      attributeName: string
      valueId: string
      value: string
    }>
  }>
  /** Flattened attribute values for faceted filtering */
  attributes: Array<{
    attributeId: string
    attributeName: string
    valueId: string
    value: string
  }>
  minSellingPrice: number | null
  maxSellingPrice: number | null
  createdAt: string
  updatedAt: string | null
}

/**
 * Aggregation facets returned alongside search results.
 */
export interface SearchFacets {
  brands?: Array<{ id: string; name: string; count: number }>
  countries?: Array<{ id: string; name: string; count: number }>
  categories?: Array<{ id: string; name: string; count: number }>
  priceRange?: { min: number; max: number }
}

/**
 * Parameters accepted by the unified GET /search/products endpoint.
 */
export interface SearchProductsParams extends Omit<FindAllProductsQueryParams, 'paginationType'> {
  includeFacets?: boolean
}
