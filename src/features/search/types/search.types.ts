export interface ProductDocument {
  id: string
  code: string
  name: string
  slug: string
  description: string
  status: string
  basePrice: number
  views: number
  brand: { id: string; name: string }
  countryOfOrigin: { id: string; name: string }
  categories: { id: string; name: string; slug: string; isPrimary: boolean }[]
  // Flat list of all attribute values across all variants — for faceted filtering
  attributes: { attributeId: string; attributeName: string; valueId: string; value: string }[]
  // Variant price range for filter UI
  minSellingPrice: number
  maxSellingPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  total: number
  products: ProductDocument[]
  facets: Facets
}

interface Facets {
  brands: FacetItem[]
  countries: FacetItem[]
  categories: FacetItem[]
  attributes: AttributeFacet[]
  priceRange: { min: number; max: number }
}

interface FacetItem {
  id: string
  name: string
  count: number
}

interface AttributeFacet {
  attributeId: string
  attributeName: string
  values: FacetItem[]
}
