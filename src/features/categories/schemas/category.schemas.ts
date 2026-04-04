import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục không được để trống')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  slug: z.string().max(255, 'Slug không được vượt quá 255 ký tự').optional(),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
  parentId: z.uuid('ID danh mục cha không hợp lệ').nullable().optional(),
  imageUrl: z
    .url('URL bộ sưu tập không hợp lệ')
    .max(500, 'URL bộ sưu tập không được vượt quá 500 ký tự')
    .optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().max(200, 'Tiêu đề meta không được vượt quá 200 ký tự').optional(),
  metaDescription: z.string().max(300, 'Mô tả meta không được vượt quá 300 ký tự').optional(),
  attributeIds: z.array(z.uuid('ID của từng thuộc tính phải ở dạng UUID')).optional()
})

export type UpsertCategoryFormValues = z.infer<typeof createCategorySchema>
