import { PartialProduct } from '@/features/product/types'
import { PaginationQueryParams } from '@/types'

export interface PartialProductDto {
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
  products?: CollectionProduct[]
  categories?: CollectionCategory[]
  createdAt: string | Date
  updatedAt?: string | Date | null
}

export interface CollectionProductItem {
  productId: string
  displayOrder: number
}

export interface CollectionAttributeValue {
  id: string
  value: string
}

export interface CollectionAttributeItem {
  id: string
  name: string
  displayName: string
  values: CollectionAttributeValue[]
}

export interface CollectionAttribute {
  attribute: CollectionAttributeItem
}

export interface CollectionCategoryItem {
  id: string
  name: string
}

export interface CollectionCategoryDetail {
  category: CollectionCategoryItem
}

export interface CollectionDetailBySlug extends Pick<
  Collection,
  'id' | 'title' | 'slug' | 'description' | 'imageUrl' | 'metaTitle' | 'metaDescription'
> {
  products: CollectionProductItem[]
  attributes: CollectionAttribute[]
  categories: CollectionCategoryDetail[]
}

export interface CollectionProduct {
  collectionId: string
  displayOrder: number
  productId: string
  product: PartialProduct
}

export interface CollectionCategory {
  collectionId: string
  categoryId: string
}

export interface CreateCollectionDto {
  title: string
  slug?: string
  description?: string
  imageUrl?: string
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
  products?: PartialProductDto[]
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

export interface DeriveFromProductsDto {
  productIds: string[]
}
