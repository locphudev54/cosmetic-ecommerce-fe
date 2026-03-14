import { PaginationQueryParams } from '@/types'

export interface Brand {
  id: string
  name: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateBrandDto {
  name: string
  imageUrl?: string
}

export interface UpdateBrandDto {
  name?: string
  imageUrl?: string
}

export interface FindAllBrandsQueryParams extends PaginationQueryParams {
  search?: string
  getAll?: boolean
}
