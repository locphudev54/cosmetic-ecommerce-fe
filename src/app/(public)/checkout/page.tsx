'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart/hooks/use-cart'
import {
  useCartSelectionStore,
  computeSelectedTotal,
  getSelectedCartItems
} from '@/features/cart/store/cart-selection-store'
import {
  useCreateOrder,
  useCreateGuestOrder,
  useShippingFee
} from '@/features/orders/hooks/use-orders'
import { checkoutSchema, CheckoutFormValues } from '@/features/orders/schemas'
import { PaymentMethod, PAYMENT_METHOD_LABELS } from '@/features/orders/types/order.types'
import { useAuthStore } from '@/stores/auth-store'
import {
  clearCartIdempotencyKey,
  formatNumberToVnCurrency,
  getOrCreateCartIdempotencyKey
} from '@/utilts/client.utils'
import { ROUTES } from '@/constants/route.constant'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useShallow } from 'zustand/react/shallow'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: shippingFee = 0, isLoading: shippingFeeLoading } = useShippingFee()
  const { selectedItemIds, clearSelection } = useCartSelectionStore(
    useShallow((state) => ({
      selectedItemIds: state.selectedItemIds,
      clearSelection: state.clearSelection
    }))
  )

  const { accessToken } = useAuthStore()
  const isAuthenticated = !!accessToken

  const createOrderMutation = useCreateOrder()
  const createGuestOrderMutation = useCreateGuestOrder()

  const [submitted, setSubmitted] = React.useState(false)
  const [createdOrderCode, setCreatedOrderCode] = React.useState<string | null>(null)
  const [submittedShippingInfo, setSubmittedShippingInfo] =
    React.useState<CheckoutFormValues | null>(null)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      note: '',
      paymentMethod: PaymentMethod.COD
    }
  })

  // Compute selected items from cart
  const cartItems = cart?.items

  const selectedItems = React.useMemo(() => {
    if (!cartItems) return []
    return getSelectedCartItems(cartItems, selectedItemIds)
  }, [cartItems, selectedItemIds])

  const selectedTotal = React.useMemo(() => {
    if (!cartItems) return 0
    return computeSelectedTotal(cartItems, selectedItemIds)
  }, [cartItems, selectedItemIds])

  const grandTotal = selectedTotal + (shippingFee || 0)

  // Redirect if no items selected
  React.useEffect(() => {
    if (!cartLoading && selectedItems.length === 0 && !submitted) {
      router.push(ROUTES.CART)
    }
  }, [cartLoading, selectedItems.length, submitted, router])

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!cart) {
      toast.error('Giỏ hàng trống hoặc chưa tải xong.')
      return
    }

    const { paymentMethod, ...shippingInfo } = data
    const orderData = {
      cartId: cart.id,
      selectedItemIds,
      paymentMethod,
      shippingInfo,
      shippingFee: shippingFee || 0
    }
    const idempotencyKey = getOrCreateCartIdempotencyKey(cart.id)

    try {
      const mutation = isAuthenticated ? createOrderMutation : createGuestOrderMutation
      const response = await mutation.mutateAsync({ data: orderData, idempotencyKey })

      clearCartIdempotencyKey(cart.id)

      setSubmittedShippingInfo(data)
      setCreatedOrderCode(response.data?.code || null)
      setSubmitted(true)
      clearSelection()
      toast.success('Đặt hàng thành công!')
    } catch (error: any) {
      toast.error(error?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
    }
  }

  const isSubmitting =
    createOrderMutation.isPending ||
    createGuestOrderMutation.isPending ||
    form.formState.isSubmitting
  const submittedEmail = submittedShippingInfo?.email ?? ''

  // Success screen
  if (submitted && createdOrderCode) {
    return (
      <div className='mx-auto max-w-lg py-20 text-center'>
        <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100'>
          <CheckCircle2 className='h-10 w-10 text-emerald-600' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>Đặt hàng thành công!</h1>
        <p className='mb-1 text-gray-600'>Mã đơn hàng của bạn:</p>
        <p className='mb-6 text-xl font-semibold text-rose-600'>{createdOrderCode}</p>
        <p className='mb-8 text-sm text-gray-500'>
          Chúng tôi đã gửi email xác nhận đến {submittedEmail}. Bạn có thể theo dõi trạng thái đơn
          hàng trong phần &quot;Đơn hàng&quot; của tài khoản.
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
      </div>
    )
  }

  if (cartLoading || shippingFeeLoading) {
    return (
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <Skeleton className='mb-6 h-8 w-48' />
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <Skeleton className='h-96 w-full rounded-xl' />
          </div>
          <div>
            <Skeleton className='h-80 w-full rounded-xl' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8 flex items-center gap-3'>
        <Link href={ROUTES.CART}>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <h1 className='text-2xl font-bold text-gray-900'>Thanh toán</h1>
      </div>

      <form
        className='grid grid-cols-1 gap-8 lg:grid-cols-3'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Left Column: Forms */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Shipping Info */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <MapPin className='h-5 w-5 text-rose-600' />
              <h2 className='text-lg font-semibold'>Thông tin giao hàng</h2>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Controller
                name='fullName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='fullName' required>
                      Họ và tên
                    </FieldLabel>
                    <Input
                      id='fullName'
                      placeholder='Nguyễn Văn A'
                      disabled={isSubmitting}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='phoneNumber'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='phoneNumber' required>
                      Số điện thoại
                    </FieldLabel>
                    <Input
                      id='phoneNumber'
                      placeholder='0912345678'
                      disabled={isSubmitting}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className='md:col-span-2'>
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='email' required>
                        Email
                      </FieldLabel>
                      <Input
                        id='email'
                        type='email'
                        placeholder='email@example.com'
                        disabled={isSubmitting}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name='province'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='province' required>
                      Tỉnh / Thành phố
                    </FieldLabel>
                    <Input
                      id='province'
                      placeholder='TP. Hồ Chí Minh'
                      disabled={isSubmitting}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='district'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='district' required>
                      Quận / Huyện
                    </FieldLabel>
                    <Input id='district' placeholder='Quận 1' disabled={isSubmitting} {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='ward'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='ward' required>
                      Phường / Xã
                    </FieldLabel>
                    <Input
                      id='ward'
                      placeholder='Phường Bến Nghé'
                      disabled={isSubmitting}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='streetAddress'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='streetAddress'>Địa chỉ chi tiết</FieldLabel>
                    <Input
                      id='streetAddress'
                      placeholder='123 Đường ABC'
                      disabled={isSubmitting}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className='md:col-span-2'>
                <Controller
                  name='note'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='note'>Ghi chú</FieldLabel>
                      <Textarea
                        id='note'
                        placeholder='Ghi chú cho đơn hàng (nếu có)...'
                        disabled={isSubmitting}
                        rows={3}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <CreditCard className='h-5 w-5 text-rose-600' />
              <h2 className='text-lg font-semibold'>Phương thức thanh toán</h2>
            </div>

            <Controller
              name='paymentMethod'
              control={form.control}
              render={({ field, fieldState }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className='space-y-3'
                >
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => {
                    const method = value as PaymentMethod
                    const isSelected = field.value === method

                    return (
                      <label
                        key={method}
                        htmlFor={`payment-${method}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={method} id={`payment-${method}`} />
                        <span className='text-sm font-medium'>{label}</span>
                      </label>
                    )
                  })}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </RadioGroup>
              )}
            />
          </div>

          {/* Order Items Preview */}
          <div className='rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <Package className='h-5 w-5 text-rose-600' />
              <h2 className='text-lg font-semibold'>Sản phẩm ({selectedItems.length})</h2>
            </div>

            <div className='space-y-4'>
              {selectedItems.map((item) => {
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
                      <p className='truncate text-sm font-medium text-gray-900'>
                        {item.productVariant?.product?.name}
                      </p>
                      <p className='text-xs text-gray-500'>{item.productVariant?.name}</p>
                      <p className='text-xs text-gray-500'>SL: {item.quantity}</p>
                    </div>
                    <p className='text-sm font-semibold text-gray-900'>
                      {formatNumberToVnCurrency(Number(item.subtotal))}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20 rounded-xl border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5 text-rose-600' />
              <h2 className='text-lg font-semibold'>Tóm tắt đơn hàng</h2>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span className='font-medium'>{formatNumberToVnCurrency(selectedTotal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Phí vận chuyển</span>
                <span className='font-medium'>{formatNumberToVnCurrency(shippingFee || 0)}</span>
              </div>

              <Separator />

              <div className='flex justify-between'>
                <span className='text-base font-semibold'>Tổng cộng</span>
                <span className='text-lg font-bold text-rose-600'>
                  {formatNumberToVnCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <Button
              className='mt-6 w-full bg-rose-600 text-white hover:bg-rose-700'
              size='lg'
              type='submit'
              disabled={isSubmitting || selectedItems.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang đặt hàng...
                </>
              ) : (
                'Đặt hàng'
              )}
            </Button>

            {!isAuthenticated && (
              <p className='mt-3 text-center text-xs text-gray-500'>
                Bạn đang mua hàng với tư cách khách.
                <Link href={ROUTES.AUTH.LOGIN} className='text-rose-600 underline'>
                  Đăng nhập
                </Link>
                để quản lý đơn hàng dễ dàng hơn.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
