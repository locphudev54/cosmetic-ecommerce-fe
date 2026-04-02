'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/route.constant'
import CartExpiryWarning from '@/features/cart/components/cart-expiry-warning'
import CartItemRow from '@/features/cart/components/cart-item-row'
import { useBulkRemoveCartItems, useCart } from '@/features/cart/hooks/use-cart'
import { useCartSocket } from '@/features/cart/hooks/use-cart-socket'
import {
  computeSelectedTotal,
  useCartSelectionStore
} from '@/features/cart/store/cart-selection-store'
import { cn, formatNumberWithCommas, handleApiError } from '@/lib/utils'
import { Inbox, Ticket, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'

export default function CartPage() {
  const router = useRouter()
  const { data: cartData, isLoading, isError } = useCart()
  const bulkRemoveMutation = useBulkRemoveCartItems()

  // Real-time sync for authenticated users
  useCartSocket()

  const { selectedItemIds, selectAll, clearSelection, removeFromSelection } =
    useCartSelectionStore()

  const cartItems = cartData?.items ?? []
  const cartVersion = cartData?.version ?? 1

  // Compute selected items total
  const selectedTotalPrice = useMemo(
    () => computeSelectedTotal(cartItems, selectedItemIds),
    [cartItems, selectedItemIds]
  )

  const selectedCount = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.id)).length,
    [cartItems, selectedItemIds]
  )

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => selectedItemIds.includes(item.id))

  const handleSelectAll = () => {
    selectAll(cartItems.map((item) => item.id))
  }

  const handleBulkDelete = async () => {
    try {
      if (selectedCount === 0) return
      const itemIdsToRemove = selectedItemIds.filter((id) =>
        cartItems.some((item) => item.id === id)
      )
      await bulkRemoveMutation.mutateAsync({ itemIds: itemIdsToRemove, version: cartVersion })
      toast.success('Đã xóa các sản phẩm đã chọn')
      removeFromSelection(itemIdsToRemove)
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCheckout = () => {
    if (selectedCount === 0) return
    router.push(ROUTES.CHECKOUT)
  }

  // Loading state
  // if (isLoading) {
  //   return (
  //     <div className='min-h-screen bg-gray-50 pb-10'>
  //       <div className='container'>
  //         <div className='flex min-h-[500px] items-center justify-center'>
  //           <Loader2 size={32} className='animate-spin text-gray-400' />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className='min-h-screen pb-10'>
      <div className='container'>
        {/* Breadcrumb */}
        <Breadcrumb className='py-2 font-normal'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{`Giỏ hàng (${cartItems.length})`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Guest cart expiry warning */}
        {cartData?.expiresAt && (
          <div className='mb-3'>
            <CartExpiryWarning expiresAt={cartData.expiresAt} />
          </div>
        )}

        {/* Header */}
        <div className='mt-2 rounded-tl-sm rounded-tr-sm border border-gray-100 bg-white px-8 py-8 shadow-md'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Giỏ hàng của bạn</h1>
          </div>
        </div>

        {/* Column headers */}
        <div className='rounded-br-sm rounded-bl-sm border border-gray-100 bg-white px-4 py-5 shadow-md'>
          <div className='grid grid-cols-12'>
            <div className='col-span-6'>
              <div className='flex items-center gap-x-5 text-[15px]'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className='h-4 w-4 cursor-pointer rounded-none accent-black'
                />
                <span>Sản phẩm</span>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='grid grid-cols-5 text-[15px] font-medium text-gray-500'>
                <div className='col-span-1 text-right'>Đơn Giá</div>
                <div className='col-span-2 text-center'>Số Lượng</div>
                <div className='col-span-1'>Số Tiền</div>
                <div className='col-span-1 text-center'>Thao Tác</div>
              </div>
            </div>
          </div>
        </div>

        {/* Item list */}
        <div>
          <div className='mt-5 rounded-sm border border-gray-100 bg-white px-4 py-5 shadow-md min-h-[40vh]'>
            {cartItems.length > 0 ? (
              <div className=''>
                {cartItems.map((item) => (
                  <CartItemRow key={item.id} item={item} cartVersion={cartVersion} />
                ))}
              </div>
            ) : (
              <div className='flex  flex-col items-center justify-center gap-y-3'>
                <Inbox strokeWidth={1} size={48} className='text-gray-500' />
                <span className='text-gray-500'>Giỏ hàng trống</span>
                <Link href={ROUTES.COLLECTIONS.ALL}>
                  <Button variant={'yellow'}>Tiếp tục mua sắm</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Cart footer */}
          <div className='sticky bottom-0 mt-8 rounded-sm border-t border-t-gray-100 bg-white px-4 pt-5 pb-8 shadow-lg'>
            <div className='grid grid-cols-12'>
              {/* Voucher row */}
              <div className='col-span-4 col-start-9'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-x-2 text-base capitalize'>
                    <span className='text-fourth text-xl'>
                      <Ticket strokeWidth={1.5} />
                    </span>
                    <span className='text-black'>AB Beauty voucher</span>
                  </div>
                  <div className='cursor-pointer text-sm font-semibold text-blue-600 hover:underline'>
                    Nhập mã giảm giá
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className='col-span-12'>
                <div className='mt-5 mb-8 h-[1px] w-full bg-gray-200'></div>
              </div>

              {/* Actions */}
              <div className='col-span-6'>
                <div className='flex items-center gap-x-5 text-[15px]'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className='h-4 w-4 cursor-pointer rounded-none accent-black'
                  />
                  <span>Chọn tất cả ({cartItems.length})</span>

                  {/* Bulk delete */}
                  {selectedCount > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={bulkRemoveMutation.isPending}
                      className='flex cursor-pointer items-center gap-x-1 text-sm text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <Trash2 size={14} />
                      <span>Xóa ({selectedCount})</span>
                    </button>
                  )}
                </div>
              </div>

              <div className='col-span-6'>
                <div className='flex justify-end gap-x-3.5'>
                  <span className='mt-0.5 text-base font-medium'>
                    Tổng thanh toán ({selectedCount} Sản phẩm):
                  </span>
                  <div>
                    <span className='text-fourth text-business-secondary text-2xl font-bold'>
                      ₫{formatNumberWithCommas(selectedTotalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={selectedCount === 0}
                    className={cn(
                      'rounded-sm bg-black px-14 py-4 text-[15px] font-medium text-white capitalize',
                      {
                        'pointer-events-none cursor-not-allowed opacity-50': selectedCount === 0,
                        'cursor-pointer opacity-100 hover:opacity-80': selectedCount > 0
                      }
                    )}
                  >
                    Mua hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
