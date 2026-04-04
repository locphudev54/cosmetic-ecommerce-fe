import { Attribute } from '@/features/attributes'
import { PaginationQueryParams } from '@/types/api.types'
import { CategoryTreeFormat } from '@/enums'

export interface CategoryTreeNodeType {
  id: string
  name: string
  slug: string
  imageUrl: string
  path: string
  depth: number
  isActive: boolean
  productCount?: number
  children?: CategoryTreeNodeType[] // In FLAT mode, this will be undefined, and in TREE mode, this will be an array of child nodes (may be empty array if no children)
}

export interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string
  description?: string
  parentId?: string
  path: string
  depth: number
  isActive: boolean
  categoryAttributes?: CategoryAttribute[]
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
  children?: Category[]
  productCount?: number
  parent?: Category
}

export interface CreateCategoryDto {
  name: string
  slug?: string
  description?: string
  parentId?: string | null
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
  attributeIds?: string[]
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
  parentId?: string | null // Allow setting parentId to null to remove parent category
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
}

export interface FindAllCategoriesQueryParams extends PaginationQueryParams {
  search?: string
  isActive?: boolean
  isDeleted?: boolean
  getAll?: boolean
  parentId?: string
  includeProductCount?: boolean
  includeChildren?: boolean
  includeParent?: boolean
}

export interface CategoryAttribute {
  attributeId: string
  attribute: Attribute
  categoryId: string
}

export interface GetCategoryTreeQueryParams {
  rootId?: string
  maxDepth?: number
  isDeleted?: boolean
  activeOnly?: boolean
  format?: CategoryTreeFormat
  limit?: number
  includeProductCount?: boolean
}

export interface MoveCategoryDto {
  newParentId: string | null
}
