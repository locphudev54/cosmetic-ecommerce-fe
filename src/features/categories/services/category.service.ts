import { API_ENDPOINTS } from '@/constants/api.constant'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  FindAllCategoriesQueryParams,
  CategoryTreeNodeType
} from '@/features/categories/types'
import { get } from 'http'

export const categoryService = {
  getCategories(
    params?: FindAllCategoriesQueryParams
  ): Promise<ApiResponse<Category[], OffsetPaginationMeta>> {
    return apiClient.get<Category[], OffsetPaginationMeta>(API_ENDPOINTS.CATEGORIES.LIST, {
      params
    })
  },

  async getCategoryTree(): Promise<CategoryTreeNodeType[]> {
    const response = await apiClient.get<CategoryTreeNodeType[]>(API_ENDPOINTS.CATEGORIES.TREE)
    return response.data
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(API_ENDPOINTS.CATEGORIES.DETAIL(id))
    return response.data
  },

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES.CREATE, data)
    return response.data
  },

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.patch<Category>(API_ENDPOINTS.CATEGORIES.UPDATE(id), data)
    return response.data
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id))
  },

  async bulkDeleteCategories(ids: string[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.CATEGORIES.BULK_DELETE, { ids })
  }
}
