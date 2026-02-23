import { ProductStatus } from '@/enums'

export interface Product {
  id: string
  brandId: string
  countryOriginId: string
  code: string
  name: string
  slug: string
  description: string | null
  status: ProductStatus | null
  basePrice: string | number
  views: number | null
  brand?: Brand
  countryOfOrigin?: CountryOfOrigin
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  attributes?: ProductAttribute[]
  images?: ProductImage[]
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface Brand {
  id: string
  code: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface CountryOfOrigin {
  id: string
  code: string
  name: string
  slug: string
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductCategory {
  id: string
  productId: string
  categoryId: string
  category?: Category
  createdAt: string | Date
}

export interface Category {
  id: string
  code: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  level: number
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  price: string | number
  stock: number
  isDefault: boolean
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
  isPrimary: boolean
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  status?: ProductStatus
  brandId?: string
  categoryId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateProductDto {
  brandId: string
  countryOriginId: string
  name: string
  slug: string
  description?: string
  status?: ProductStatus
  basePrice: number
  categoryIds?: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
