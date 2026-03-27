import { z } from 'zod'

const collectionProductSchema = z.object({
  productId: z.uuid('ID sản phẩm không hợp lệ'),
  displayOrder: z
    .number()
    .int('Thứ tự hiển thị phải là số nguyên')
    .min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0')
    .optional()
})

const collectionAttributeSchema = z.object({
  attributeId: z.uuid('ID thuộc tính không hợp lệ'),
  displayOrder: z
    .number()
    .int('Thứ tự hiển thị phải là số nguyên')
    .min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0')
    .optional()
})

const collectionCategorySchema = z.object({
  categoryId: z.uuid('ID danh mục không hợp lệ')
})

export const upsertCollectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Tên bộ sưu tập không được để trống')
    .max(255, 'Tên bộ sưu tập không được vượt quá 255 ký tự'),
  slug: z.string().max(255, 'Slug không được vượt quá 255 ký tự').optional(),
  description: z.string().max(10000, 'Mô tả không được vượt quá 10000 ký tự').optional(),
  imageUrl: z
    .url('URL bộ sưu tập không hợp lệ')
    .max(500, 'URL bộ sưu tập không được vượt quá 500 ký tự')
    .optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().max(255, 'Tiêu đề meta không được vượt quá 255 ký tự').optional(),
  metaDescription: z.string().max(500, 'Mô tả meta không được vượt quá 500 ký tự').optional(),
  products: z.array(collectionProductSchema).optional()
  // attributes: z.array(collectionAttributeSchema).optional(),
  // categories: z.array(collectionCategorySchema).optional()
})

export type UpsertCollectionFormValues = z.infer<typeof upsertCollectionSchema>
