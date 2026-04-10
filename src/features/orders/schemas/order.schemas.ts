import { PaymentMethod } from '@/features/orders/types/order.types'
import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Vui lòng nhập họ tên')
    .max(100, 'Họ tên không được vượt quá 100 ký tự'),
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(255, 'Email phải ít hơn 255 ký tự'),
  phoneNumber: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không đúng định dạng'),
  province: z
    .string()
    .min(1, 'Vui lòng nhập tỉnh/thành phố')
    .max(255, 'Tỉnh/thành phố không được vượt quá 255 ký tự'),
  district: z
    .string()
    .min(1, 'Vui lòng nhập quận/huyện')
    .max(255, 'Quận/huyện không được vượt quá 255 ký tự'),
  ward: z
    .string()
    .min(1, 'Vui lòng nhập phường/xã')
    .max(255, 'Phường/xã không được vượt quá 255 ký tự'),
  streetAddress: z
    .string()
    .max(255, 'Địa chỉ không được vượt quá 255 ký tự')
    .optional()
    .or(z.literal('')),
  note: z.string().max(500, 'Ghi chú không được vượt quá 500 ký tự').optional().or(z.literal('')),
  paymentMethod: z.enum(PaymentMethod, {
    message: 'Phương thức thanh toán không hợp lệ'
  })
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
