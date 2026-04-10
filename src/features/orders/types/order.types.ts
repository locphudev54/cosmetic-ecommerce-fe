import { DateRangeQueryParams, PaginationQueryParams } from '@/types/api.types'

// ==========================================
// Order Enums (client-side mirror)
// ==========================================

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PACKED = 'PACKED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum PaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING'
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PROCESSING]: 'Đang xử lý',
  [OrderStatus.PENDING_PAYMENT]: 'Chờ thanh toán',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.PACKED]: 'Đã đóng gói',
  [OrderStatus.READY_TO_SHIP]: 'Sẵn sàng giao',
  [OrderStatus.SHIPPED]: 'Đang giao hàng',
  [OrderStatus.DELIVERED]: 'Đã giao hàng',
  [OrderStatus.COMPLETED]: 'Hoàn thành',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.RETURNED]: 'Đã trả hàng'
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
  [PaymentMethod.BANKING]: 'Chuyển khoản ngân hàng'
}

/**
 * Valid transitions per status (FSM - client mirror)
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PROCESSING]: [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAID,
    OrderStatus.PACKED,
    OrderStatus.CANCELLED
  ],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.PACKED, OrderStatus.CANCELLED, OrderStatus.RETURNED],
  [OrderStatus.PACKED]: [OrderStatus.READY_TO_SHIP, OrderStatus.CANCELLED],
  [OrderStatus.READY_TO_SHIP]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.RETURNED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.RETURNED]: []
}

// ==========================================
// Order Interfaces
// ==========================================

export interface ShippingInfo {
  id: string
  orderId: string
  fullName: string
  email: string
  phoneNumber: string
  province: string
  district: string
  ward: string
  streetAddress: string
  note: string
}

export interface OrderDetailItem {
  id: string
  orderId: string
  productVariantId: string
  quantity: number
  productPrice: string | number
  productVariant: {
    id: string
    sku: string
    name: string
    sellingPrice: string | number
    imageUrl: string
    product: {
      id: string
      name: string
      slug: string
      images: { url: string; altText?: string | null }[]
    }
  }
}

export interface OrderUser {
  id: string
  email: string | null
  fullName: string | null
  phoneNumber: string | null
}

export interface Order {
  id: string
  userId: string
  idempotencyKey: string | null
  code: string | null
  status: OrderStatus
  totalPrice: string | number
  shippingFee: string | number
  paymentMethod: PaymentMethod
  cancelReason: string | null
  paidAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string | null
  items: OrderDetailItem[]
  shippingInfo: ShippingInfo | null
  user: OrderUser
}

// ==========================================
// Request DTOs
// ==========================================

export interface ShippingInfoRequest {
  fullName: string
  email: string
  phoneNumber: string
  province: string
  district: string
  ward: string
  streetAddress?: string
  note?: string
}

export interface CreateOrderRequest {
  cartId: string
  selectedItemIds: string[]
  paymentMethod: PaymentMethod
  shippingInfo: ShippingInfoRequest
  shippingFee?: number
}

export type CreateGuestOrderRequest = CreateOrderRequest

export interface OrderQueryParams extends PaginationQueryParams, DateRangeQueryParams {
  status?: OrderStatus[]
  userId?: string
  search?: string
}
