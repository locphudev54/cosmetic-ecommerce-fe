import { envClient } from '@/config/env.client'
import { API_ENDPOINTS, EXPIRED_ACCESS_TOKEN_MESSAGE } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { isClient } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import axios, { AxiosError, InternalAxiosRequestConfig, CanceledError, AxiosResponse } from 'axios'
import internalApiClient from '@/lib/internal-api-client'
import { ApiError, ApiResponse } from '@/types/api.types'
import { AxiosRequestConfig } from 'axios'
import { RefreshTokenClientResponse } from '@/features/auth/types/auth.types'
import { isApiError } from '@/utilts/common.utils'

/**
 * Production-ready Axios client for Client Components with advanced features:
 * - Automatic token refresh with request queuing (via Next.js API routes)
 * - Request cancellation with AbortController
 * - Timeout protection (30s default)
 * - Memory leak prevention
 * - Race condition handling
 *
 * Token Refresh Flow:
 * 1. Client makes API call with expired token
 * 2. Gets 401, triggers refresh via /api/auth/refresh-token
 * 3. Next.js route calls backend, gets new tokens, sets cookies
 * 4. Client gets new access token, retries original request
 *
 * Usage Examples:
 *
 * // Basic usage (automatic timeout and cancellation support)
 * const response = await apiClient.get('/products')
 *
 * // Manual cancellation
 * const { signal, cancel } = createCancellableRequest()
 * const response = await apiClient.get('/search', { signal })
 * // cancel() // Cancel the request
 *
 * // Component cleanup
 * useEffect(() => {
 *   const { signal, cleanup } = createCancelOnUnmount()
 *   apiClient.get('/data', { signal })
 *   return cleanup
 * }, [])
 */

class ApiClient {
  private instance = axios.create({
    baseURL: envClient.NEXT_PUBLIC_BACKEND_API_URL,
    timeout: 300000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true // Important: This sends cookies with requests
  })

  // Queue to hold pending requests during token refresh
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
    config: InternalAxiosRequestConfig
  }> = []

  constructor() {
    this.setupInterceptors()
  }

  private setupInterceptors() {
    /**
     * Process all queued requests after token refresh
     */
    const processQueue = (error: Error | null = null, newToken?: string) => {
      this.failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
          reject(error)
        } else {
          // Update config with new token if provided
          if (newToken && config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`
          }
          resolve(this.instance(config))
        }
      })

      this.failedQueue = []
    }

    /**
     * Refresh the access token using the refresh token from cookies
     */
    const refreshAccessToken = async (): Promise<string> => {
      try {
        // Use internalApiClient to call our Next.js API route for better security and consistency
        const response = await internalApiClient.post<RefreshTokenClientResponse>(
          API_ENDPOINTS.AUTH.REFRESH // Calls our Next.js API route at /api/auth/refresh-token
        )

        const { accessToken } = response.data

        // Update Zustand store
        useAuthStore.getState().setAccessToken(accessToken)

        return accessToken
      } catch (error) {
        // Clear auth state on refresh failure
        useAuthStore.getState().clearAuth()
        throw error
      }
    }

    /**
     * Request Interceptor: Add access token and handle AbortController
     */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState()

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }

        // Add AbortController if not provided (for timeout protection)
        if (!config.signal) {
          const controller = new AbortController()
          config.signal = controller.signal
          activeControllers.add(controller)

          // Set up timeout cancellation
          const timeoutId = setTimeout(() => {
            controller.abort()
            activeControllers.delete(controller)
          }, config.timeout || 30000)

          // Clean up when request completes or is aborted
          controller.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId)
            activeControllers.delete(controller)
          })
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    /**
     * Response Interceptor: Handle token expiration, refresh, and cancellation
     */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Return successful responses as-is
        return response.data
      },
      async (error: unknown) => {
        // Handle request cancellation
        if (error instanceof CanceledError) {
          // Return a specific cancelled error without retrying
          throw new CanceledError('Request was cancelled')
        }

        if (error instanceof AxiosError) {
          const errorObject = error.response?.data

          const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
          }

          //  Check if error is 401 - Unauthorized Errors
          if (isApiError(errorObject) && errorObject.statusCode === 401) {
            // Expired access token - Only expired access token -> Trigger refresh
            if (errorObject.message === EXPIRED_ACCESS_TOKEN_MESSAGE && !originalRequest._retry) {
              // Prevent infinite retry loops
              originalRequest._retry = true

              if (this.isRefreshing) {
                // Token refresh is already in progress
                // Queue this request to be retried after refresh completes
                return new Promise((resolve, reject) => {
                  this.failedQueue.push({
                    resolve,
                    reject,
                    config: originalRequest
                  })
                })
              }

              // Start token refresh process
              this.isRefreshing = true

              try {
                // Refresh the access token
                const newAccessToken = await refreshAccessToken()

                // Update the Authorization header with new token
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                }

                // Process all queued requests with new token
                processQueue(null, newAccessToken)

                // Retry the original request
                return this.instance(originalRequest)
              } catch (refreshError: unknown) {
                // Refresh failed - reject all queued requests
                processQueue(refreshError as Error)

                useAuthStore.getState().clearAuth()

                // Optionally redirect to login page -  Dont need to handle here
                // Because internalApiClient' error interceptor will handle redirecting to logout page and then navigate to login page
                // if (isClient) {
                //   window.location.href = ROUTES.AUTH.LOGIN
                // }

                // Don't need to throw error to caller because we have already handled logout and redirect
                // if (isApiError(refreshError)) {
                //   return Promise.reject(new ApiError(refreshError))
                // }

                // return Promise.reject(
                //   new ApiError({
                //     success: false,
                //     message: 'Token refresh failed',
                //     statusCode: 500
                //   })
                // )
              } finally {
                this.isRefreshing = false
              }
            } else if (errorObject.message !== EXPIRED_ACCESS_TOKEN_MESSAGE) {
              // Invalid / Invalidated / Missing ATs -> Logout user instead
              if (isClient) {
                const logoutKey = envClient.NEXT_PUBLIC_LOGOUT_SECRET_KEY
                const logoutUrl = `${ROUTES.AUTH.LOGOUT}?key=${encodeURIComponent(logoutKey)}`
                window.location.href = logoutUrl
                return
              }
            }
          }
          // For all other errors, reject normally - 400, 403, 500, etc. received from Backend
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
  get<T = any, M = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T, M>> {
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
let activeControllers: Set<AbortController> = new Set()

/**
 * Utility functions for request cancellation
 */

/**
 * Create a cancellable request with AbortController
 * Useful for search debouncing or component cleanup
 */
export const createCancellableRequest = () => {
  const controller = new AbortController()
  activeControllers.add(controller)

  // Remove from registry when aborted
  controller.signal.addEventListener('abort', () => {
    activeControllers.delete(controller)
  })

  return {
    controller,
    signal: controller.signal,
    cancel: (reason?: string) => {
      controller.abort(reason)
      activeControllers.delete(controller)
    },
    isCancelled: () => controller.signal.aborted
  }
}

/**
 * Cancel all active requests tracked by the registry
 * Useful for global cleanup or emergency cancellation
 */
export const cancelAllRequests = (reason = 'All requests cancelled') => {
  const controllers = Array.from(activeControllers)
  controllers.forEach((controller) => {
    controller.abort(reason)
    activeControllers.delete(controller)
  })
  return controllers.length // Return number of cancelled requests
}

/**
 * Get the count of currently active requests
 */
export const getActiveRequestCount = () => activeControllers.size

/**
 * Hook-like utility for React components to auto-cancel requests on unmount
 * Usage: const cancelToken = useCancelOnUnmount()
 */
export const createCancelOnUnmount = () => {
  const controller = new AbortController()
  activeControllers.add(controller)

  return {
    signal: controller.signal,
    cancel: () => {
      controller.abort('Component unmounted')
      activeControllers.delete(controller)
    },
    cleanup: () => {
      controller.abort('Component unmounted')
      activeControllers.delete(controller)
    }
  }
}

const apiClient = new ApiClient()
export default apiClient
