import { envClient } from '@/config/env.client'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { isClient } from '@/lib/utils'
import { ApiError, ApiResponse } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CanceledError,
  InternalAxiosRequestConfig
} from 'axios'
import { is } from 'zod/v4/locales'

/**
 * Production-ready Axios client for Next.js API routes with advanced features:
 * - Request cancellation with AbortController
 * - Timeout protection (30s default)
 * - Memory leak prevention
 * - Proper error handling
 *
 * Usage Examples:
 *
 * // Basic usage (automatic timeout and cancellation support)
 * const response = await internalApiClient.get('/auth/user')
 *
 * // Manual cancellation
 * const { signal, cancel } = createCancellableInternalRequest()
 * const response = await internalApiClient.get('/data', { signal })
 * // cancel() // Cancel the request
 *
 * // Component cleanup
 * useEffect(() => {
 *   const { signal, cleanup } = createInternalCancelOnUnmount()
 *   internalApiClient.get('/data', { signal })
 *   return cleanup
 * }, [])
 */

class InternalApiClient {
  private instance = axios.create({
    baseURL: '/api',
    timeout: 300000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  constructor() {
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Registry to track active requests for bulk cancellation
    let activeInternalControllers: Set<AbortController> = new Set()

    /**
     * Request Interceptor: Handle AbortController for timeout protection
     */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add AbortController if not provided (for timeout protection)
        if (!config.signal) {
          const controller = new AbortController()
          config.signal = controller.signal
          activeInternalControllers.add(controller)

          // Set up timeout cancellation
          const timeoutId = setTimeout(() => {
            controller.abort()
            activeInternalControllers.delete(controller)
          }, config.timeout || 30000)

          // Clean up when request completes or is aborted
          controller.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId)
            activeInternalControllers.delete(controller)
          })
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    /**
     * Response Interceptor: Handle cancellation and auth errors
     */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error: unknown) => {
        // Handle request cancellation
        if (error instanceof CanceledError) {
          // Return a specific cancelled error without triggering logout logic
          throw new CanceledError('Request was cancelled')
        }

        if (error instanceof AxiosError) {
          const errorObject = error.response?.data
          // In case refresh token fails / invalid refresh token / revoked RT / invalidated ATs (not match the version in Redis)
          // Logout the user on client side by redirecting to logout page
          if (
            isApiError(errorObject) &&
            errorObject?.statusCode === 401 &&
            error.config?.url === API_ENDPOINTS.AUTH.REFRESH
          ) {
            if (isClient) {
              const logoutKey = envClient.NEXT_PUBLIC_LOGOUT_SECRET_KEY
              const logoutUrl = `${ROUTES.AUTH.LOGOUT}?key=${encodeURIComponent(logoutKey)}`
              window.location.href = logoutUrl
              return
            }
          }

          // For all other errors, reject normally - 400, 403, 500, etc. - received from Backend
          if (isApiError(errorObject)) {
            throw new ApiError(errorObject)
          }
        }

        // Non-Axios error - Unexpected or Unknown error
        throw new Error('An unexpected error occurred')
      }
    )
  }

  /**
   * Typed GET request
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config)
  }

  /**
   * Typed POST request
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config)
  }

  /**
   * Typed PUT request
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config)
  }

  /**
   * Typed PATCH request
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config)
  }

  /**
   * Typed DELETE request
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config)
  }
}

// Registry to track active requests for bulk cancellation
let activeInternalControllers: Set<AbortController> = new Set()

/**
 * Utility functions for request cancellation
 */

/**
 * Create a cancellable internal API request with AbortController
 * Useful for search debouncing or component cleanup
 */
export const createCancellableInternalRequest = () => {
  const controller = new AbortController()
  activeInternalControllers.add(controller)

  // Remove from registry when aborted
  controller.signal.addEventListener('abort', () => {
    activeInternalControllers.delete(controller)
  })

  return {
    controller,
    signal: controller.signal,
    cancel: (reason?: string) => {
      controller.abort(reason)
      activeInternalControllers.delete(controller)
    },
    isCancelled: () => controller.signal.aborted
  }
}

/**
 * Cancel all active internal API requests tracked by the registry
 * Useful for global cleanup or emergency cancellation
 */
export const cancelAllInternalRequests = (reason = 'All internal requests cancelled') => {
  const controllers = Array.from(activeInternalControllers)
  controllers.forEach((controller) => {
    controller.abort(reason)
    activeInternalControllers.delete(controller)
  })
  return controllers.length // Return number of cancelled requests
}

/**
 * Get the count of currently active internal API requests
 */
export const getActiveInternalRequestCount = () => activeInternalControllers.size

/**
 * Hook-like utility for React components to auto-cancel internal API requests on unmount
 * Usage: const cancelToken = createInternalCancelOnUnmount()
 */
export const createInternalCancelOnUnmount = () => {
  const controller = new AbortController()
  activeInternalControllers.add(controller)

  return {
    signal: controller.signal,
    cancel: () => {
      controller.abort('Component unmounted')
      activeInternalControllers.delete(controller)
    },
    cleanup: () => {
      controller.abort('Component unmounted')
      activeInternalControllers.delete(controller)
    }
  }
}

const internalApiClient = new InternalApiClient()
export default internalApiClient
