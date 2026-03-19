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
import { OAUTH_ERROR_MESSAGE } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { useLoginMutation } from '@/features/auth/hooks/use-auth'
import { LoginFormValues, loginSchema } from '@/features/auth/schemas'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { ApiError, OAuthProviders } from '@/types/api.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CanceledError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const loginMutation = useLoginMutation()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || ROUTES.HOME
  const errorMessageOnUrl = searchParams.get('error')

  // Show error if redirected from OAuth callback with error
  React.useEffect(() => {
    if (errorMessageOnUrl === OAUTH_ERROR_MESSAGE) {
      setGeneralError('Failed to authenticate with Google')
    }
  }, [errorMessageOnUrl])

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setGeneralError(null)
      const res = await loginMutation.mutateAsync(data)
      setUser(res.user)
      setAccessToken(res.accessToken)
      router.push(decodeURIComponent(returnUrl))
    } catch (error) {
      if (error instanceof CanceledError) return

      if (error instanceof ApiError) {
        setGeneralError(error.message || 'Login failed')
      } else if (error instanceof Error) {
        // Axios error without proper ApiError response - unexpected error
        setGeneralError(error.message || 'Login failed due to an unexpected error')
      }

      setUser(null)
      setAccessToken(null)
    }
  }

  const handleLoginWithSocial = (provider: OAuthProviders) => {
    window.location.href = `${envClient.NEXT_PUBLIC_BACKEND_API_URL}/auth/${provider}`
  }

  return (
    <div className='max-w-[25rem] shrink-0 grow px-3 sm:px-0'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Đăng nhập</CardTitle>
          <CardDescription>Chào mừng bạn đến với AB Beauty</CardDescription>
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
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      disabled={loginMutation.isPending}
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
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='password'>Password</FieldLabel>
                      <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? (
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
              {/* Social Provider login */}
              <Field>
                <Button
                  variant={'blue'}
                  disabled={loginMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
                <div className='grid grid-cols-2 gap-x-3'>
                  <div className='col-span-1'>
                    {' '}
                    <Button
                      type='button'
                      variant={'outline'}
                      className={cn('w-full', {
                        'cursor-not-allowed opacity-80': loginMutation.isPending
                      })}
                      onClick={() => handleLoginWithSocial('google')}
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
                      className={cn('w-full', {
                        'cursor-not-allowed opacity-80': loginMutation.isPending
                      })}
                      onClick={() => handleLoginWithSocial('facebook')}
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
            href={ROUTES.AUTH.REGISTER}
            className='w-full text-center text-sm text-red-500 dark:text-red-800'
          >
            Bạn chưa có tài khoản? Đăng ký ngay
          </Link>
          <div className='w-full text-center text-xs italic'>Cosmetic E-commerce</div>
        </CardFooter>
      </Card>
    </div>
  )
}
