'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/route.constant'
import { useResetPasswordMutation } from '@/features/auth/hooks/use-auth'
import { ResetPasswordFormValues, resetPasswordSchema } from '@/features/auth/schemas'
import { cn } from '@/lib/utils'
import { ApiError } from '@/types/api.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CanceledError } from 'axios'
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const resetPasswordMutation = useResetPasswordMutation()

  // Auto-redirect countdown after success
  useEffect(() => {
    if (!isSuccess) return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push(ROUTES.AUTH.LOGIN)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSuccess, router])

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return

    try {
      setGeneralError(null)
      await resetPasswordMutation.mutateAsync({
        resetToken: token,
        newPassword: data.newPassword
      })
      setIsSuccess(true)
    } catch (error) {
      if (error instanceof CanceledError) return

      if (error instanceof ApiError) {
        setGeneralError(error.message || 'Đặt lại mật khẩu thất bại')
      } else if (error instanceof Error) {
        setGeneralError(error.message || 'Đã xảy ra lỗi không mong muốn')
      }
    }
  }

  // No token in URL — show error state
  if (!token) {
    return (
      <div className='max-w-[25rem] shrink-0 grow px-3 sm:px-0'>
        <Card>
          <CardHeader className='items-center text-center'>
            <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-6 w-6 text-red-600' />
            </div>
            <CardTitle className='text-xl font-semibold'>Liên kết không hợp lệ</CardTitle>
            <CardDescription>
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>
              <Button variant='blue' className='w-full'>
                Yêu cầu liên kết mới
              </Button>
            </Link>
          </CardContent>
          <CardFooter className='flex-col gap-y-3'>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className='flex w-full items-center justify-center gap-1 text-center text-sm text-red-500 hover:underline dark:text-red-800'
            >
              <ArrowLeft className='h-4 w-4' />
              Quay lại đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className='max-w-[25rem] shrink-0 grow px-3 sm:px-0'>
        <Card>
          <CardHeader className='items-center text-center'>
            <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
              <CheckCircle2 className='h-6 w-6 text-green-600' />
            </div>
            <CardTitle className='text-xl font-semibold'>Đặt lại mật khẩu thành công</CardTitle>
            <CardDescription>
              Mật khẩu của bạn đã được đặt lại. Bạn có thể đăng nhập bằng mật khẩu mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700'>
                Tự động chuyển hướng đến trang đăng nhập sau{' '}
                <span className='font-semibold'>{countdown}</span> giây...
              </div>
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant='blue' className='w-full'>
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='max-w-[25rem] shrink-0 grow px-3 sm:px-0'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Nhập mật khẩu mới cho tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {generalError && (
                <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
                  {generalError}
                </div>
              )}
              <Controller
                name='newPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='reset-new-password' required>
                      Mật khẩu mới
                    </FieldLabel>
                    <div className='relative'>
                      <Input
                        id='reset-new-password'
                        type={showPassword ? 'text' : 'password'}
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={resetPasswordMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                    </p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='reset-confirm-password' required>
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <div className='relative'>
                      <Input
                        id='reset-confirm-password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={resetPasswordMutation.isPending}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button
                  variant={'blue'}
                  disabled={resetPasswordMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-y-3'>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              'flex w-full items-center justify-center gap-1 text-center text-sm text-red-500 dark:text-red-800',
              resetPasswordMutation.isPending
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : 'hover:underline'
            )}
          >
            <ArrowLeft className='h-4 w-4' />
            Quay lại đăng nhập
          </Link>
          <div className='w-full text-center text-xs italic'>Cosmetic E-commerce</div>
        </CardFooter>
      </Card>
    </div>
  )
}
