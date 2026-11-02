'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/route.constant'
import { PaymentResult } from '@/enums'
import { useAuthStore } from '@/stores/auth-store'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const searchParams = new URLSearchParams(window.location.search)
  const result = searchParams.get('result')
  const orderCode = searchParams.get('orderCode')

  return (
    <div className='mx-auto flex h-[80vh] max-w-lg flex-col items-center justify-center py-20 text-center'>
      {result === PaymentResult.SUCCESS.toString() && (
        <>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100'>
            <CheckCircle2 className='h-10 w-10 text-emerald-600' />
          </div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Thanh toán thành công!</h1>
          <p className='mb-1 text-gray-600'>Mã đơn hàng của bạn:</p>
          <p className='mb-6 text-xl font-semibold text-rose-600'>{orderCode}</p>
          <p className='mb-8 text-sm text-gray-500'>
            Chúng tôi đã gửi email xác nhận đến tài khoản của bạn. Bạn có thể theo dõi trạng thái
            đơn hàng trong phần &quot;Đơn hàng&quot; của tài khoản.
          </p>
          <div className='flex justify-center gap-4'>
            <Link href={ROUTES.HOME}>
              <Button variant='outline'>Về trang chủ</Button>
            </Link>
            {isAuthenticated && (
              <Link href={ROUTES.ACCOUNT.ORDERS}>
                <Button>Xem đơn hàng</Button>
              </Link>
            )}
          </div>
        </>
      )}

      {result === PaymentResult.FAILED.toString() && (
        <>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
            <XCircle className='h-10 w-10 text-red-600' />
          </div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Thanh toán thất bại</h1>
          <p className='mb-6 text-gray-600'>
            Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán.
          </p>
          <p className='mb-8 text-sm text-gray-500'>
            Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ khách hàng nếu vấn đề vẫn tiếp diễn.
          </p>
          <div className='flex justify-center gap-4'>
            <Link href={ROUTES.HOME}>
              <Button variant='outline'>Về trang chủ</Button>
            </Link>
            <Link href={ROUTES.CART}>
              <Button>Quay lại giỏ hàng</Button>
            </Link>
          </div>
        </>
      )}

      {result === PaymentResult.PENDING.toString() && (
        <>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100'>
            <Clock className='h-10 w-10 text-yellow-600' />
          </div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>
            Đang xử lý - Vui lòng thanh toán sớm nhất có thể
          </h1>
          <p className='mb-6 text-gray-600'>Đơn hàng của bạn đang được xử lý.</p>
          <div className='flex justify-center gap-4'>
            <Link href={ROUTES.HOME}>
              <Button variant='outline'>Về trang chủ</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
