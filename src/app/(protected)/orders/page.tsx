'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useOrders, useCancelOrder } from '@/features/orders/hooks/use-orders'
import {
  Order,
  OrderStatus,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from '@/features/orders/types/order.types'
import { ROUTES } from '@/constants/route.constant'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import { ChevronRight, Package, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { SortOrder } from '@/enums'

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

const CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.PROCESSING, OrderStatus.PENDING_PAYMENT]

export default function CustomerOrdersPage() {
  const router = useRouter()
  const { data, isLoading } = useOrders({ sortBy: 'createdAt', sortOrder: SortOrder.DESC })
  const cancelMutation = useCancelOrder()

  const orders = data?.data || []

  const handleCancel = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return

    try {
      await cancelMutation.mutateAsync({ id: orderId })
      toast.success('Đã hủy đơn hàng')
    } catch (error: any) {
      toast.error(error?.message || 'Hủy đơn hàng thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-4xl space-y-4 px-4 py-8'>
        <Skeleton className='h-8 w-48' />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-40 w-full rounded-xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-6 flex items-center gap-2'>
        <ShoppingBag className='h-6 w-6 text-rose-600' />
        <h1 className='text-2xl font-bold text-gray-900'>Đơn hàng của tôi</h1>
      </div>

      {orders.length === 0 ? (
        <div className='rounded-xl border bg-white py-16 text-center shadow-sm'>
          <Package className='mx-auto mb-4 h-12 w-12 text-gray-300' />
          <p className='text-gray-500'>Bạn chưa có đơn hàng nào</p>
          <Button variant='outline' className='mt-4' onClick={() => router.push(ROUTES.HOME)}>
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order: Order) => {
            const canCancel = CANCELLABLE_STATUSES.includes(order.status)
            const firstItem = order.items?.[0]
            const imageUrl =
              firstItem?.productVariant?.imageUrl ||
              firstItem?.productVariant?.product?.images?.[0]?.url ||
              '/placeholder.png'

            return (
              <div
                key={order.id}
                className='cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
                onClick={() => router.push(ROUTES.ACCOUNT.ORDER_DETAIL(order.id))}
              >
                {/* Header */}
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='font-mono text-sm font-medium text-gray-700'>
                      {order.code}
                    </span>
                    <Badge
                      variant='secondary'
                      className={`${STATUS_COLORS[order.status]} border-0`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-400'>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>

                {/* Items preview */}
                <div className='flex items-center gap-4'>
                  <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                    <Image
                      src={imageUrl}
                      alt={firstItem?.productVariant?.name || ''}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {firstItem?.productVariant?.product?.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {order.items.length > 1
                        ? `và ${order.items.length - 1} sản phẩm khác`
                        : firstItem?.productVariant?.name}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-rose-600'>
                      {formatNumberToVnCurrency(Number(order.totalPrice))}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {canCancel && (
                  <div className='mt-3 flex justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:bg-red-50 hover:text-red-700'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancel(order.id)
                      }}
                    >
                      Hủy đơn hàng
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
