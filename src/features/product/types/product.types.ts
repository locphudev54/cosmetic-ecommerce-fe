import { ProductSortBy, ProductStatus } from '@/enums'
import { Brand } from '@/features/brands'
import { Category } from '@/features/categories/types/category.types'
import { CountryOfOrigin } from '@/features/country-of-origin'
import { PaginationQueryParams } from '@/types/api.types'

export interface Product {
  id: string
  brandId: string
  countryOriginId: string
  code: string
  name: string
  slug: string
  description: string | null
  status: ProductStatus
  basePrice: string | number // using string to handle large numbers from backend
  views: number | null
  brand?: Brand
  countryOfOrigin?: CountryOfOrigin
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  images?: ProductImage[]
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface PartialProduct extends Pick<
  Product,
  'id' | 'name' | 'slug' | 'basePrice' | 'status'
> {
  images: { url: string; alt: string }[]
}

export interface ProductCategory {
  id: string
  productId: string
  categoryId: string
  isPrimary: boolean
  category?: Category
  createdAt: string | Date
}

export interface VariantAttributeValueItem {
  id: string
  variantId: string
  attributeValueId: string
  attributeValue?: {
    id: string
    value: string
    attribute?: {
      id: string
      name: string
    }
  }
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  barcode: string
  costPrice: string | number
  sellingPrice: string | number
  stockOnHand: number | null
  imageUrl?: string | null
  lowStockThreshold: number
  maxStockThreshold: number
  isActive: boolean
  attributeValues?: VariantAttributeValueItem[]
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductAttribute {
  id: string
  productId: string
  attributeId: string
  value: string
  createdAt: string | Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string | null
  displayOrder: number
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface AttributeFilter {
  attributeId: string
  valueIds: string[]
}

export interface FindAllProductsQueryParams extends PaginationQueryParams {
  searchQuery?: string
  productIds?: string[] // Optional list of product IDs to filter by (used for Collection Page)
  status?: ProductStatus[]
  categoryIds?: string[]
  categorySlug?: string
  brandIds?: string[]
  countryIds?: string[]
  minPrice?: number
  maxPrice?: number
  attributes?: AttributeFilter[]
  inStock?: boolean
  minStock?: number
  maxStock?: number
  hasActiveVariants?: boolean
  minVariantPrice?: number
  maxVariantPrice?: number
  sku?: string
  sortBy?: ProductSortBy
}

export interface FindAllAttributesQueryParams extends PaginationQueryParams {
  getAll?: boolean
}

export interface CreateProductCategoryDto {
  categoryId: string
  isPrimary: boolean
}

export interface CreateProductImageDto {
  url: string
  displayOrder?: number
  altText?: string
}

export interface CreateVariantAttributeValueDto {
  attributeValueId: string
  value: string
}

export interface CreateProductVariantDto {
  sku?: string
  name: string
  barcode?: string
  costPrice: number
  sellingPrice: number
  stockOnHand?: number
  imageUrl?: string
  lowStockThreshold?: number
  maxStockThreshold?: number
  isActive?: boolean
  attributeValues: CreateVariantAttributeValueDto[]
}

export interface CreateProductDto {
  name: string
  slug?: string
  description?: string
  status?: ProductStatus
  basePrice: number
  brandId: string
  countryOriginId: string
  categories: CreateProductCategoryDto[]
  images?: CreateProductImageDto[]
  variants?: CreateProductVariantDto[]
}

export interface UpdateProductCategoryDto extends Partial<CreateProductCategoryDto> {
  id?: string
  _delete?: boolean
}

export interface UpdateProductImageDto extends Partial<CreateProductImageDto> {
  id?: string
  _delete?: boolean
}

export interface UpdateVariantAttributeValueDto extends Partial<CreateVariantAttributeValueDto> {
  id?: string
  _delete?: boolean
}

export interface UpdateVariantImageDto {
  id?: string
  url?: string
  altText?: string
  _delete?: boolean
}

export interface UpdateProductVariantDto extends Partial<
  Omit<CreateProductVariantDto, 'sku' | 'attributeValues'>
> {
  id?: string
  attributeValues?: UpdateVariantAttributeValueDto[]
  images?: UpdateVariantImageDto[]
  _delete?: boolean
}

export interface UpdateProductAttributeDto {
  id?: string
  attributeId?: string
  isRequired?: boolean
  _delete?: boolean
}

export interface UpdateProductDto extends Partial<
  Omit<CreateProductDto, 'categories' | 'images' | 'variants' | 'attributes'>
> {
  code?: string
  categories?: UpdateProductCategoryDto[]
  images?: UpdateProductImageDto[]
  variants?: UpdateProductVariantDto[]
  attributes?: UpdateProductAttributeDto[]
}

/// state types
export type ProductVariantType = {
  id?: string // present in edit mode to track existing variants
  sku?: string
  name: string
  barcode?: string
  costPrice: number
  sellingPrice: number
  stockOnHand: number
  imageUrl?: string
  lowStockThreshold?: number
  maxStockThreshold?: number
  isActive?: boolean
  attributeValues: ProductAttributeValueType[]
}

export interface ProductAttributeType {
  id: string
  name: string
  values: ProductAttributeValueType[]
}

export interface ProductAttributeValueType {
  attributeValueId: string
  value: string
}

export interface ProuctSortingOptionType {
  label: string
  value: string
}
