export interface CreatePaymentDto {
  orderCode: string
  amount: number
  orderId: string
}

export interface CreatePaymentResult {
  paymentUrl: string
}
