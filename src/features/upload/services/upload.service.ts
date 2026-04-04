import { CloudinaryUploadResult, UploadImageParams } from '@/features/upload/types/upload.types'
import apiClient from '@/lib/api-client'

export const uploadService = {
  async uploadSingleImage(file: File, params: UploadImageParams): Promise<CloudinaryUploadResult> {
    const formData = new FormData()

    const processedFile = await this.injectXmlDeclarationIfSvg(file)
    formData.append('file', processedFile)

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
  },

  async injectXmlDeclarationIfSvg(file: File): Promise<File> {
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      return file
    }

    const text = await file.text()

    // Already has XML declaration — no need to inject
    if (text.trimStart().startsWith('<?xml')) {
      return file
    }

    const patched = `<?xml version="1.0" encoding="UTF-8"?>\n${text}`
    return new File([patched], file.name, { type: file.type })
  }
}
