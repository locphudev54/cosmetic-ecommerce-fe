import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  CreateProductDto,
  FindAllProductsQueryParams,
  Product,
  UpdateProductDto
} from '@/features/product/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, OffsetPaginationMeta } from '@/types/api.types'

export const productService = {
  getProducts(
    params?: FindAllProductsQueryParams
  ): Promise<ApiResponse<Product[], OffsetPaginationMeta>> {
    return apiClient.get<Product[], OffsetPaginationMeta>(API_ENDPOINTS.PRODUCTS.LIST, { params })
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id))
    return response.data
  },

  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data)
    return response.data
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.patch<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data)
    return response.data
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
  },

  async bulkDeleteProducts(ids: string[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PRODUCTS.BULK_DELETE, { ids })
  }
}
