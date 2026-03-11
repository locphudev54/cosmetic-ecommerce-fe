import { ApiError } from '@/types/api.types'

// The util function in this file can be used across between client and server

export const isApiError = (error: unknown): error is ApiError => {
  return (
    error instanceof ApiError ||
    (typeof error === 'object' &&
      error !== null &&
      'success' in error &&
      error.success === false &&
      'statusCode' in error &&
      typeof error.statusCode === 'number' &&
      'message' in error &&
      'error' in error &&
      typeof error.error === 'string' &&
      'path' in error &&
      typeof error.path === 'string' &&
      'timestamp' in error &&
      typeof error.timestamp === 'string')
  )
}
