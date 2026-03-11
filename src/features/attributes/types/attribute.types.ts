import { PaginationQueryParams } from '@/types'

export interface Attribute {
  id: string
  name: string
  slug: string
  isGlobalFilter: boolean
  values: AttributeValue[]
  createdAt?: string
  updatedAt?: string
}

export interface AttributeValue {
  id: string
  attributeId: string
  value: string
}

export interface CreateAttributeDto {
  name: string
  slug?: string
  isGlobalFilter?: boolean
  values: string[]
}

export interface UpdateAttributeDto {
  name?: string
  slug?: string
  isGlobalFilter?: boolean
  values?: string[]
}

export interface FindAllAttributesQueryParams extends PaginationQueryParams {
  search?: string
  getAll?: boolean
  categoryId?: string
}
