import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  CountryOfOrigin,
  CreateCountryOfOriginDto,
  FindAllCountriesOfOriginQueryParams,
  UpdateCountryOfOriginDto
} from '@/features/country-of-origin/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'

export const countryOfOriginService = {
  getCountriesOfOrigin(
    params?: FindAllCountriesOfOriginQueryParams
  ): Promise<ApiResponse<CountryOfOrigin[], OffsetPaginationMeta>> {
    return apiClient.get<CountryOfOrigin[], OffsetPaginationMeta>(
      API_ENDPOINTS.COUNTRY_OF_ORIGIN.LIST,
      { params }
    )
  },

  async getCountryOfOriginById(id: string): Promise<CountryOfOrigin> {
    const response = await apiClient.get<CountryOfOrigin>(
      API_ENDPOINTS.COUNTRY_OF_ORIGIN.DETAIL(id)
    )
    return response.data
  },

  async createCountryOfOrigin(data: CreateCountryOfOriginDto): Promise<CountryOfOrigin> {
    const response = await apiClient.post<CountryOfOrigin>(
      API_ENDPOINTS.COUNTRY_OF_ORIGIN.CREATE,
      data
    )
    return response.data
  },

  async updateCountryOfOrigin(
    id: string,
    data: UpdateCountryOfOriginDto
  ): Promise<CountryOfOrigin> {
    const response = await apiClient.patch<CountryOfOrigin>(
      API_ENDPOINTS.COUNTRY_OF_ORIGIN.UPDATE(id),
      data
    )
    return response.data
  },

  async deleteCountryOfOrigin(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COUNTRY_OF_ORIGIN.DELETE(id))
  }
}
