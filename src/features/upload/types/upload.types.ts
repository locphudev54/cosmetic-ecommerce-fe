/** Shape returned after a successful Cloudinary upload */
export interface CloudinaryUploadResult {
  /** Cloudinary public_id — needed for deletion */
  publicId: string
  /** Full secure HTTPS URL of the uploaded asset */
  url: string
  /** Original file name as received from the client */
  originalName: string
  /** File size in bytes */
  size: number
  /** MIME type / format */
  format: string
  /** Width in pixels (images / videos only) */
  width?: number
  /** Height in pixels (images / videos only) */
  height?: number
}

export interface UploadImageParams {
  /** Optional folder path in Cloudinary to organize uploads */
  folder?: string
}
