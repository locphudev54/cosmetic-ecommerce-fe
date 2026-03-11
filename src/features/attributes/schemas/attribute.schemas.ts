import { z } from 'zod'

export const createAndUpdateAttributeSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên thuộc tính không được để trống')
    .max(255, 'Tên thuộc tính không được vượt quá 255 ký tự'),
  slug: z.string().max(255, 'Slug không được vượt quá 255 ký tự').optional(),
  isGlobalFilter: z.boolean().optional(),
  values: z
    .array(z.string().min(1, 'Giá trị không được để trống'))
    .min(1, 'Phải có ít nhất một giá trị')
    .refine((values) => new Set(values.map((v) => v.toLowerCase())).size === values.length, {
      message: 'Các giá trị phải là duy nhất'
    })
})

export type UpsertAttributeFormValues = z.infer<typeof createAndUpdateAttributeSchema>
