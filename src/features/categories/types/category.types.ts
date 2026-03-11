import { PaginationQueryParams } from '@/types/api.types'

export interface CategoryTreeNodeType {
  id: string
  name: string
  slug: string
  path: string
  depth: number
  isActive: boolean
  productCount?: number
  children?: CategoryTreeNodeType[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  path: string
  depth: number
  isActive: boolean
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
  slug: string
  description?: string
  parentId?: string
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
  parentId?: string
  isActive?: boolean
  metaTitle?: string
  metaDescription?: string
}

export interface FindAllCategoriesQueryParams extends PaginationQueryParams {
  search?: string
  isActive?: boolean
  parentId?: string
  includeProductCount?: boolean
  includeChildren?: boolean
  includeParent?: boolean
}
