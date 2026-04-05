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
import { useForgotPasswordMutation } from '@/features/auth/hooks/use-auth'
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/features/auth/schemas'
import { cn } from '@/lib/utils'
import { ApiError } from '@/types/api.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CanceledError } from 'axios'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const forgotPasswordMutation = useForgotPasswordMutation()

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setGeneralError(null)
      await forgotPasswordMutation.mutateAsync(data)
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } catch (error) {
      if (error instanceof CanceledError) return

      if (error instanceof ApiError) {
        setGeneralError(error.message || 'Gửi yêu cầu thất bại')
      } else if (error instanceof Error) {
        setGeneralError(error.message || 'Đã xảy ra lỗi không mong muốn')
      }
    }
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
            <CardTitle className='text-xl font-semibold'>Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
              <span className='text-foreground font-medium'>{submittedEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700'>
                <div className='flex items-start gap-2'>
                  <Mail className='mt-0.5 h-4 w-4 shrink-0' />
                  <div>
                    <p>
                      Vui lòng kiểm tra hộp thư đến (và thư mục spam) để tìm email đặt lại mật khẩu.
                    </p>
                    <p className='mt-1 text-xs text-blue-600'>Liên kết sẽ hết hạn sau 1 giờ.</p>
                  </div>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  setIsSuccess(false)
                  setSubmittedEmail('')
                  form.reset()
                }}
              >
                Gửi lại email
              </Button>
            </div>
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

  return (
    <div className='max-w-[25rem] shrink-0 grow px-3 sm:px-0'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Quên mật khẩu</CardTitle>
          <CardDescription>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu</CardDescription>
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
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='forgot-email'>Email</FieldLabel>
                    <Input
                      id='forgot-email'
                      type='email'
                      placeholder='m@example.com'
                      disabled={forgotPasswordMutation.isPending}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button
                  variant={'blue'}
                  disabled={forgotPasswordMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  {forgotPasswordMutation.isPending
                    ? 'Đang gửi...'
                    : 'Gửi liên kết đặt lại mật khẩu'}
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
              forgotPasswordMutation.isPending
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
