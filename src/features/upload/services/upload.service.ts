import { CloudinaryUploadResult, UploadImageParams } from '@/features/upload/types/upload.types'
import apiClient from '@/lib/api-client'

export const uploadService = {
  async uploadSingleImage(file: File, params: UploadImageParams): Promise<CloudinaryUploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post<CloudinaryUploadResult>('/upload/single', formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  },

  async uploadMultipleImages(
    files: File[],
    params: UploadImageParams
  ): Promise<CloudinaryUploadResult[]> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await apiClient.post<CloudinaryUploadResult[]>('/upload/multiple', formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
