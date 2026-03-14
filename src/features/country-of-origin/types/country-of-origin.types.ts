import { PaginationQueryParams } from '@/types'

export interface CountryOfOrigin {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCountryOfOriginDto {
  name: string
}

export interface UpdateCountryOfOriginDto {
  name?: string
}

export interface FindAllCountriesOfOriginQueryParams extends PaginationQueryParams {
  search?: string
  getAll?: boolean
}
