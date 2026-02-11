import z from 'zod'

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email phải ít hơn 255 ký tự'),
  password: z
    .string()
    .min(1, 'Password không được để trống')
    .max(50, `Password phải ít hơn 50 ký tự`)
})

export type LoginFormValues = z.infer<typeof loginSchema>
