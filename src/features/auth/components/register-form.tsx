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
import { envClient } from '@/config/env.client'
import { ROUTES } from '@/constants/route.constant'
import { useRegisterMutation } from '@/features/auth/hooks/use-auth'
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { ApiError, OAuthProviders } from '@/types/api.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CanceledError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const registerMutation = useRegisterMutation()

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setGeneralError(null)
      const { confirmPassword, ...credentials } = data

      // Remove empty optional fields
      const cleanedCredentials = {
        email: credentials.email,
        password: credentials.password,
        ...(credentials.fullName && { fullName: credentials.fullName }),
        ...(credentials.phoneNumber && { phoneNumber: credentials.phoneNumber })
      }

      const res = await registerMutation.mutateAsync(cleanedCredentials)
      setUser(res.user)
      setAccessToken(res.accessToken)
      router.push(ROUTES.HOME)
    } catch (error) {
      if (error instanceof CanceledError) return

      if (error instanceof ApiError) {
        setGeneralError(error.message || 'Đăng ký thất bại')
      } else if (error instanceof Error) {
        setGeneralError(error.message || 'Đăng ký thất bại do lỗi không mong muốn')
      }

      setUser(null)
      setAccessToken(null)
    }
  }

  const handleRegisterWithSocial = (provider: OAuthProviders) => {
    window.location.href = `${envClient.NEXT_PUBLIC_BACKEND_API_URL}/auth/${provider}`
  }

  return (
    <div className='max-w-[30rem] shrink-0 grow px-3 sm:px-0'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới tại AB Beauty</CardDescription>
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
                    <FieldLabel htmlFor='register-email' required>
                      Email
                    </FieldLabel>
                    <Input
                      id='register-email'
                      type='email'
                      placeholder='m@example.com'
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-password' required>
                      Mật khẩu
                    </FieldLabel>
                    <div className='relative'>
                      <Input
                        id='register-password'
                        type={showPassword ? 'text' : 'password'}
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={registerMutation.isPending}
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
                    <FieldLabel htmlFor='register-confirm-password' required>
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <div className='relative'>
                      <Input
                        id='register-confirm-password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={registerMutation.isPending}
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
              <Controller
                name='fullName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='register-fullname'>Họ và tên </FieldLabel>
                    <Input
                      id='register-fullname'
                      type='text'
                      placeholder='Nguyễn Văn A'
                      disabled={registerMutation.isPending}
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
                    <FieldLabel htmlFor='register-phone'>Số điện thoại </FieldLabel>
                    <Input
                      id='register-phone'
                      type='tel'
                      placeholder='0912345678'
                      disabled={registerMutation.isPending}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Submit and Social */}
              <Field>
                <Button
                  variant={'blue'}
                  disabled={registerMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
                <div className='grid grid-cols-2 gap-x-3'>
                  <div className='col-span-1'>
                    <Button
                      type='button'
                      variant={'outline'}
                      disabled={registerMutation.isPending}
                      className={cn('w-full', {})}
                      onClick={() => handleRegisterWithSocial('google')}
                    >
                      <Image
                        alt='googleIcon'
                        src={'/google.svg'}
                        width={24}
                        height={24}
                        className='aspect-square w-6 object-cover'
                      />
                    </Button>
                  </div>
                  <div className='col-span-1'>
                    <Button
                      type='button'
                      variant={'outline'}
                      disabled={registerMutation.isPending}
                      className={cn('w-full', {})}
                      onClick={() => handleRegisterWithSocial('facebook')}
                    >
                      <Image
                        alt='facebookIcon'
                        src={'/facebook.png'}
                        width={24}
                        height={24}
                        className='aspect-square w-6 object-cover'
                      />
                    </Button>
                  </div>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-y-3'>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className={cn(
              'w-full text-center text-sm text-red-500 dark:text-red-800',
              registerMutation.isPending
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : 'hover:underline'
            )}
          >
            Bạn đã có tài khoản? Đăng nhập ngay
          </Link>
          <div className='w-full text-center text-xs italic'>Cosmetic E-commerce</div>
        </CardFooter>
      </Card>
    </div>
  )
}
