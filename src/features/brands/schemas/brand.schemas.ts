import { z } from 'zod'

export const createAndUpdateBrandSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên thương hiệu không được để trống')
    .max(255, 'Tên thương hiệu không được vượt quá 255 ký tự'),
  imageUrl: z
    .string()
    .url('URL hình ảnh không hợp lệ')
    .max(500, 'URL hình ảnh không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal(''))
})

export type UpsertBrandFormValues = z.infer<typeof createAndUpdateBrandSchema>
