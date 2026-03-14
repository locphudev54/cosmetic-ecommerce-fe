import { z } from 'zod'

export const createAndUpdateCountryOfOriginSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên xuất xứ không được để trống')
    .max(255, 'Tên xuất xứ không được vượt quá 255 ký tự')
})

export type UpsertCountryOfOriginFormValues = z.infer<typeof createAndUpdateCountryOfOriginSchema>
