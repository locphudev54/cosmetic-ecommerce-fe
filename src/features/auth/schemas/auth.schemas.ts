import z from 'zod'

/**
 * Strong password regex: at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
 */
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const STRONG_PASSWORD_MESSAGE =
  'Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)'

/**
 * Reusable strong password field
 */
const strongPasswordField = z
  .string()
  .min(8, 'Password phải ít nhất 8 ký tự')
  .max(50, 'Password phải ít hơn 50 ký tự')
  .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE)

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
    .min(8, 'Password phải ít nhất 8 ký tự')
    .max(50, `Password phải ít hơn 50 ký tự`)
})

/**
 * Register form schema
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ')
      .max(255, 'Email phải ít hơn 255 ký tự'),
    password: strongPasswordField,
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
    fullName: z
      .string()
      .max(100, 'Họ và tên phải ít hơn 100 ký tự')
      .optional()
      .or(z.literal('')),
    phoneNumber: z
      .string()
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không đúng định dạng')
      .optional()
      .or(z.literal(''))
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email phải ít hơn 255 ký tự')
})

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z
  .object({
    newPassword: strongPasswordField,
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được để trống')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
