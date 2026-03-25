import { PaginationQueryParams } from '@/types'

export interface CollectionProductItemDto {
  productId: string
  displayOrder?: number
}

export interface CollectionAttributeItemDto {
  attributeId: string
  displayOrder?: number
}

export interface CollectionCategoryItemDto {
  categoryId: string
}

export interface Collection {
  id: string
  title: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string | Date
  updatedAt?: string | Date | null
}

export interface CreateCollectionDto {
  title: string
  slug?: string
  description?: string
  imageUrl?: string
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
  products?: CollectionProductItemDto[]
  attributes?: CollectionAttributeItemDto[]
  categories?: CollectionCategoryItemDto[]
}

export type UpdateCollectionDto = Partial<CreateCollectionDto>

export interface FindAllCollectionsQueryParams extends PaginationQueryParams {
  search?: string
  isActive?: boolean
  isDeleted?: boolean
  includeProducts?: boolean
  includeAttributes?: boolean
  includeCategories?: boolean
}
