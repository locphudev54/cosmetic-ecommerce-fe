import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UseFormReturn } from 'react-hook-form'
import { ApiError } from '@/types'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isServer = typeof window === 'undefined'

/**
 * Checks if code is running on the client
 */
export const isClient = !isServer

export function formatNumberWithCommas(number: number): string {
  return number.toLocaleString('en-US')
}

/**
 * Centralized API error handler
 * Handles validation errors by setting form errors, otherwise shows toast
 */
export function handleApiError(error: unknown, form?: UseFormReturn<any>) {
  if (error instanceof ApiError) {
    // Check if it's a validation error (422 with message as array)
    if (Array.isArray(error.message)) {
      if (form) {
        // Set form errors for each field
        error.message.forEach((err: { field: string; message: string }) => {
          form.setError(err.field, { message: err.message })
        })
      } else {
        // If no form provided, show toast with first error message
        toast.error(error.message[0]?.message || 'Validation error')
      }
    } else {
      // Other API errors
      toast.error(
        typeof error.message === 'string' ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      )
    }
  } else {
    // Non-API errors
    toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
  }
}
