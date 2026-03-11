import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  Attribute,
  CreateAttributeDto,
  FindAllAttributesQueryParams,
  UpdateAttributeDto
} from '@/features/attributes/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'

export const attributeService = {
  getAttributes(
    params?: FindAllAttributesQueryParams
  ): Promise<ApiResponse<Attribute[], OffsetPaginationMeta>> {
    return apiClient.get<Attribute[], OffsetPaginationMeta>(API_ENDPOINTS.ATTRIBUTES.LIST, {
      params
    })
  },

  async getAttributeById(id: string): Promise<Attribute> {
    const response = await apiClient.get<Attribute>(API_ENDPOINTS.ATTRIBUTES.DETAIL(id))
    return response.data
  },

  async createAttribute(data: CreateAttributeDto): Promise<Attribute> {
    const response = await apiClient.post<Attribute>(API_ENDPOINTS.ATTRIBUTES.CREATE, data)
    return response.data
  },

  async updateAttribute(id: string, data: UpdateAttributeDto): Promise<Attribute> {
    const response = await apiClient.patch<Attribute>(API_ENDPOINTS.ATTRIBUTES.UPDATE(id), data)
    return response.data
  },

  async deleteAttribute(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ATTRIBUTES.DELETE(id))
  },

  async bulkDeleteAttributes(ids: string[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.ATTRIBUTES.BULK_DELETE, { ids })
  }
}
