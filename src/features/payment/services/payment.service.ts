import { API_ENDPOINTS } from '@/constants/api.constant'
import { CreatePaymentDto, CreatePaymentResult } from '@/features/payment/types'
import apiClient from '@/lib/api-client'

export const paymentService = {
  async createPayment({ amount, orderCode, orderId }: CreatePaymentDto) {
    const res = await apiClient.post<CreatePaymentResult>(API_ENDPOINTS.PAYMENTS.CREATE, {
      orderCode,
      orderId,
      amount
    })

    return res.data
  }
}
