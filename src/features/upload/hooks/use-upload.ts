import { uploadService } from '@/features/upload/services/upload.service'
import { UploadImageParams } from '@/features/upload/types/upload.types'
import { useMutation } from '@tanstack/react-query'

export const useUploadSingleImage = () => {
  return useMutation({
    mutationFn: ({ file, params }: { file: File; params: UploadImageParams }) =>
      uploadService.uploadSingleImage(file, params)
  })
}

export const useUploadMultipleImages = () => {
  return useMutation({
    mutationFn: ({ files, params }: { files: File[]; params: UploadImageParams }) =>
      uploadService.uploadMultipleImages(files, params)
  })
}
