'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/route.constant'
import { useLogin } from '@/features/auth/hooks/use-auth'
import { LoginFormValues, loginSchema } from '@/features/auth/schemas'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { ApiError } from '@/types/api.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CanceledError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { setUser, setAccessToken } = useAuthStore()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [error, setError] = useState<string | null>(null)
  const loginMutation = useLogin()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || ROUTES.ADMIN.PRODUCT.NEW

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null)
      const res = await loginMutation.mutateAsync(data)
      setUser(res.user)
      setAccessToken(res.accessToken)
      router.push(decodeURIComponent(returnUrl))
    } catch (error) {
      if (error instanceof CanceledError) return

      if (error instanceof ApiError) {
        setError(error.message || 'Login failed')
      } else if (error instanceof Error) {
        // Axios error without proper ApiError response - unexpected error
        setError(error.message || 'Login failed due to an unexpected error')
      }

      setUser(null)
      setAccessToken(null)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {error && (
                <div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'>
                  {error}
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
                      <a
                        href='#'
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id='password'
                      type='password'
                      disabled={loginMutation.isPending}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Social Provider login */}
              <Field>
                <Button disabled={loginMutation.isPending} type='submit' className='w-full'>
                  {loginMutation.isPending ? 'Signing in...' : 'Login'}
                </Button>
                <Button
                  variant='outline'
                  type='button'
                  disabled={loginMutation.isPending}
                  className='w-full'
                >
                  Login with Google
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <a href='#'>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
