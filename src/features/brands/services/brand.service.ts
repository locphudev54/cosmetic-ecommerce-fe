import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  Brand,
  CreateBrandDto,
  FindAllBrandsQueryParams,
  UpdateBrandDto
} from '@/features/brands/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'

export const brandService = {
  getBrands(
    params?: FindAllBrandsQueryParams
  ): Promise<ApiResponse<Brand[], OffsetPaginationMeta>> {
    return apiClient.get<Brand[], OffsetPaginationMeta>(API_ENDPOINTS.BRANDS.LIST, { params })
  },

  async getBrandById(id: string): Promise<Brand> {
    const response = await apiClient.get<Brand>(API_ENDPOINTS.BRANDS.DETAIL(id))
    return response.data
  },

  async createBrand(data: CreateBrandDto): Promise<Brand> {
    const response = await apiClient.post<Brand>(API_ENDPOINTS.BRANDS.CREATE, data)
    return response.data
  },

  async updateBrand(id: string, data: UpdateBrandDto): Promise<Brand> {
    const response = await apiClient.patch<Brand>(API_ENDPOINTS.BRANDS.UPDATE(id), data)
    return response.data
  },

  async deleteBrand(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.BRANDS.DELETE(id))
  }
}
