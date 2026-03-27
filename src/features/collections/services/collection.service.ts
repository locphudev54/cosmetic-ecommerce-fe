import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  Collection,
  CollectionDetailBySlug,
  CreateCollectionDto,
  DeriveFromProductsDto,
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

  async getCollectionBySlug(slug: string): Promise<CollectionDetailBySlug> {
    const response = await apiClient.get<CollectionDetailBySlug>(
      API_ENDPOINTS.COLLECTIONS.DETAIL_BY_SLUG(slug)
    )
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
  },

  async deriveFromProducts(dto: DeriveFromProductsDto): Promise<{
    attributes: { id: string; name: string; slug: string; displayName: string | null }[]
    categories: { id: string; name: string; slug: string; parentId: string | null; depth: number }[]
  }> {
    const response = await apiClient.post(API_ENDPOINTS.COLLECTIONS.DERIVE_FROM_PRODUCTS, dto)
    return response.data
  }
}
