import { paymentService } from '@/features/payment/services'
import { CreatePaymentDto } from '@/features/payment/types'
import { useMutation } from '@tanstack/react-query'

/**
 * Hook to create a payment for an order
 */
export function useCreatePayment() {
  return useMutation({
    mutationFn: ({ orderCode, amount, orderId }: CreatePaymentDto) =>
      paymentService.createPayment({ amount, orderCode, orderId })
  })
}
