import { API_ENDPOINTS } from '@/constants/api.constant'
import { PaginationType } from '@/enums'
import {
  CreateProductDto,
  FindAllProductsQueryParams,
  Product,
  UpdateProductDto
} from '@/features/product/types'
import apiClient from '@/lib/api-client'
import { ApiResponse, CursorPaginationMeta, OffsetPaginationMeta } from '@/types/api.types'

export const productService = {
  getProductsOffset(
    params?: FindAllProductsQueryParams
  ): Promise<ApiResponse<Product[], OffsetPaginationMeta>> {
    return apiClient.get<Product[], OffsetPaginationMeta>(API_ENDPOINTS.PRODUCTS.LIST, {
      params: { ...params, paginationType: PaginationType.OFFSET }
    })
  },

  getProductsCursor(
    params?: FindAllProductsQueryParams
  ): Promise<ApiResponse<Product[], CursorPaginationMeta>> {
    return apiClient.get<Product[], CursorPaginationMeta>(API_ENDPOINTS.PRODUCTS.LIST, {
      params: { ...params, paginationType: PaginationType.CURSOR }
    })
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id))
    return response.data
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug))
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
