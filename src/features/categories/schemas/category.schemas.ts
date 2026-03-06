import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục không được để trống')
    .max(50, 'Tên danh mục không được vượt quá 50 ký tự'),
  slug: z.string().max(50, 'Slug không được vượt quá 50 ký tự'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

export type UpsertCategoryFormValues = z.infer<typeof createCategorySchema>
