import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  Collection,
  CreateCollectionDto,
  FindAllCollectionsQueryParams,
  UpdateCollectionDto
} from '@/features/collections/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'

export const collectionService = {
  getCollections(
    params?: FindAllCollectionsQueryParams
  ): Promise<ApiResponse<Collection[], OffsetPaginationMeta>> {
    return apiClient.get<Collection[], OffsetPaginationMeta>(API_ENDPOINTS.COLLECTIONS.LIST, {
      params
    })
  },

  async getCollectionById(id: string): Promise<Collection> {
    const response = await apiClient.get<Collection>(API_ENDPOINTS.COLLECTIONS.DETAIL(id))
    return response.data
  },

  async createCollection(data: CreateCollectionDto): Promise<Collection> {
    const response = await apiClient.post<Collection>(API_ENDPOINTS.COLLECTIONS.CREATE, data)
    return response.data
  },

  async updateCollection(id: string, data: UpdateCollectionDto): Promise<Collection> {
    const response = await apiClient.patch<Collection>(API_ENDPOINTS.COLLECTIONS.UPDATE(id), data)
    return response.data
  },

  async deleteCollection(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COLLECTIONS.DELETE(id))
  },

  async bulkDeleteCollections(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => apiClient.delete(API_ENDPOINTS.COLLECTIONS.DELETE(id))))
  }
}
