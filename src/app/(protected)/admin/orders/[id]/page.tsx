'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrder, useUpdateOrderStatus, useCancelOrder } from '@/features/orders/hooks/use-orders'
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_METHOD_LABELS
} from '@/features/orders/types/order.types'
import { TypographyH3 } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import { ArrowLeft, MapPin, CreditCard, Package, User } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PENDING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID]: 'bg-emerald-100 text-emerald-800',
  [OrderStatus.PACKED]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.READY_TO_SHIP]: 'bg-cyan-100 text-cyan-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.RETURNED]: 'bg-orange-100 text-orange-800'
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const { data: order, isLoading } = useOrder(orderId)
  const updateStatusMutation = useUpdateOrderStatus()
  const cancelMutation = useCancelOrder()

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus })
      toast.success('Cập nhật trạng thái thành công')
    } catch (error: any) {
      toast.error(error?.message || 'Cập nhật thất bại')
    }
  }

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: orderId, reason: 'Hủy bởi admin' })
      toast.success('Đã hủy đơn hàng')
    } catch (error: any) {
      toast.error(error?.message || 'Hủy đơn thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-96 w-full rounded-xl' />
      </div>
    )
  }

  if (!order) {
    return (
      <div className='py-20 text-center'>
        <p className='text-gray-500'>Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status] || []

  return (
    <div>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <TypographyH3>Chi tiết đơn hàng</TypographyH3>
            <p className='font-mono text-sm text-gray-500'>{order.code}</p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Badge variant='secondary' className={`${STATUS_COLORS[order.status]} border-0 text-sm`}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </Badge>

          {allowedTransitions.length > 0 && (
            <Select onValueChange={handleStatusUpdate}>
              <SelectTrigger className='w-44'>
                <SelectValue placeholder='Cập nhật trạng thái' />
              </SelectTrigger>
              <SelectContent>
                {allowedTransitions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left column */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Order Items */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <Package className='h-5 w-5 text-rose-600' />
              <h3 className='font-semibold'>Sản phẩm ({order.items?.length || 0})</h3>
            </div>

            <div className='space-y-4'>
              {order.items?.map((item) => {
                const imageUrl =
                  item.productVariant?.imageUrl ||
                  item.productVariant?.product?.images?.[0]?.url ||
                  '/placeholder.png'

                return (
                  <div key={item.id} className='flex items-center gap-4'>
                    <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                      <Image
                        src={imageUrl}
                        alt={item.productVariant?.name || ''}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{item.productVariant?.product?.name}</p>
                      <p className='text-xs text-gray-500'>{item.productVariant?.name}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium'>
                        {formatNumberToVnCurrency(Number(item.productPrice))} × {item.quantity}
                      </p>
                      <p className='text-sm font-semibold text-rose-600'>
                        {formatNumberToVnCurrency(Number(item.productPrice) * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className='my-4' />

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Tạm tính</span>
                <span>{formatNumberToVnCurrency(Number(order.totalPrice) - Number(order.shippingFee))}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Phí vận chuyển</span>
                <span>{formatNumberToVnCurrency(Number(order.shippingFee))}</span>
              </div>
              <Separator />
              <div className='flex justify-between'>
                <span className='font-semibold'>Tổng cộng</span>
                <span className='text-lg font-bold text-rose-600'>
                  {formatNumberToVnCurrency(Number(order.totalPrice))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          {/* Customer Info */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-3 flex items-center gap-2'>
              <User className='h-5 w-5 text-rose-600' />
              <h3 className='font-semibold'>Khách hàng</h3>
            </div>
            <div className='space-y-1 text-sm'>
              <p className='font-medium'>{order.user?.fullName || '—'}</p>
              <p className='text-gray-500'>{order.user?.email || '—'}</p>
              <p className='text-gray-500'>{order.user?.phoneNumber || '—'}</p>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingInfo && (
            <div className='rounded-xl border bg-white p-6 shadow-sm'>
              <div className='mb-3 flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-rose-600' />
                <h3 className='font-semibold'>Địa chỉ giao hàng</h3>
              </div>
              <div className='space-y-1 text-sm'>
                <p className='font-medium'>{order.shippingInfo.fullName}</p>
                <p className='text-gray-500'>{order.shippingInfo.phoneNumber}</p>
                <p className='text-gray-500'>{order.shippingInfo.email}</p>
                <p className='text-gray-500'>
                  {[
                    order.shippingInfo.streetAddress,
                    order.shippingInfo.ward,
                    order.shippingInfo.district,
                    order.shippingInfo.province
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {order.shippingInfo.note && (
                  <p className='mt-2 text-gray-400'>Ghi chú: {order.shippingInfo.note}</p>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-3 flex items-center gap-2'>
              <CreditCard className='h-5 w-5 text-rose-600' />
              <h3 className='font-semibold'>Thanh toán</h3>
            </div>
            <div className='space-y-1 text-sm'>
              <p>{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</p>
              {order.paidAt && (
                <p className='text-gray-500'>
                  Thanh toán lúc: {new Date(order.paidAt).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
          </div>

          {/* Cancel Reason */}
          {order.cancelReason && order.status === OrderStatus.CANCELLED && (
            <div className='rounded-xl border border-red-200 bg-red-50 p-6'>
              <h3 className='mb-2 font-semibold text-red-800'>Lý do hủy</h3>
              <p className='text-sm text-red-700'>{order.cancelReason}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <h3 className='mb-3 font-semibold'>Thời gian</h3>
            <div className='space-y-1 text-sm text-gray-500'>
              <p>Tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              {order.paidAt && <p>Thanh toán: {new Date(order.paidAt).toLocaleString('vi-VN')}</p>}
              {order.deliveredAt && (
                <p>Giao hàng: {new Date(order.deliveredAt).toLocaleString('vi-VN')}</p>
              )}
              {order.cancelledAt && (
                <p>Hủy: {new Date(order.cancelledAt).toLocaleString('vi-VN')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
