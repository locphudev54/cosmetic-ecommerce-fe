import { envServer } from '@/config/env.server'
import { EXPIRED_ACCESS_TOKEN_MESSAGE } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { ApiResponse, ApiError } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import { redirect } from 'next/navigation'

/**
 * Production-ready fetch wrapper for Server Components in NextJS App Router.
 * Features:
 * - Timeout protection (default 30s, configurable)
 * - Resource cleanup with AbortController
 * - Proper error handling and logging
 * - NextJS caching integration
 * - TypeScript support
 *
 * Usage Examples:
 *
 * // Basic usage with default timeout
 * const data = await serverFetchClient.get('/products');
 *
 * // Custom timeout
 * const data = await serverFetchClient.post('/products', { name: 'New Product' }, { timeout: 5000 });
 *
 * // With caching
 * const data = await serverFetchClient.get('/products', {
 *   next: { revalidate: 60 },
 *   timeout: 10000
 * });
 *
 * // Manual cancellation (for advanced use cases)
 * const controller = new AbortController();
 * const data = await serverFetchClient.get('/products', { signal: controller.signal });
 * // controller.abort(); // Cancel the request
 *
 * We don't need to handle access or refresh token expiration logic here
 * Because we are using proxy.ts acts as middleware to previously handle token refresh logic for all incoming requests to protected API routes
 * => When we navigate to protected Server Components, the access token in cookies will always be valid
 * (If expired, proxy.ts will try to refresh it before forward the request to API routes handlers)
 *
 */

class ServerFetchClient {
  private baseUrl = envServer.BACKEND_API_URL

  private async fetch<T = any>(
    endpoint: string,
    options: RequestInit & {
      next?: {
        revalidate?: number | false
        tags?: string[]
      }
      timeout?: number // Timeout in milliseconds (default: 30000)
      signal?: AbortSignal // Custom abort signal for manual cancellation
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    // Default timeout: 30 seconds
    const timeoutMs = options.timeout ?? 30000

    // Create AbortController for timeout and cleanup
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeoutMs)

    // Use provided signal or our controller's signal
    const signal = options.signal || controller.signal

    // Default headers
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'NextJS-Server-Component/1.0'
    }

    // Merge headers
    const headers = { ...defaultHeaders, ...options.headers }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      body: options.body,
      signal, // Add abort signal
      next: options.next // NextJS specific options for caching
    }

    try {
      const response = await fetch(url, fetchOptions)

      // Clear the timeout since request completed
      clearTimeout(timeoutId)

      // Handle non-OK responses
      if (!response.ok) {
        let errorData: unknown
        try {
          errorData = await response.json()
        } catch {
          // If response is not JSON, create a generic error
          errorData = {
            success: false,
            statusCode: response.status,
            message: `HTTP ${response.status}: ${response.statusText}`,
            error: response.statusText,
            path: endpoint,
            timestamp: new Date().toISOString()
          }
        }

        // Check whether erorr is Unauthorized (401) - Invalidated / Invalid / Missing ATs
        // Expired ATs will not be occurred here because proxy.ts middleware will handle it before forwarding request to API routes
        // So here we just log out the user on client side by redirecting to logout page
        if (
          isApiError(errorData) &&
          errorData.statusCode === 401 &&
          errorData.message !== EXPIRED_ACCESS_TOKEN_MESSAGE
        ) {
          console.error(
            `[----- SERVER FETCH ----] [>>>> Unauthorized Error <<<<] on ${url}:`,
            errorData
          )
          const logoutKey = envServer.LOGOUT_SECRET_KEY
          const logoutUrl = `${ROUTES.AUTH.LOGOUT}?key=${encodeURIComponent(logoutKey)}`
          redirect(logoutUrl)
        }

        // Another errors - 403, 404, 500, etc.
        if (isApiError(errorData)) {
          throw new ApiError(errorData)
        }

        // Unexpected or Unknown error
        throw new Error('An unexpected error occurred')
      }

      // Parse successful response
      const data: ApiResponse<T> = await response.json()

      // Optional: Log successful requests in development
      if (envServer.NODE_ENV === 'development') {
        console.log(`[----- SERVER FETCH ----] ${fetchOptions.method} ${url} - ${response.status}`)
      }

      return data
    } catch (error) {
      // Clear timeout
      clearTimeout(timeoutId)

      // Handle abort errors specifically
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${timeoutMs}ms`)
        console.error(`[----- SERVER FETCH ----] Timeout: ${url}`, timeoutError)
        throw timeoutError
      }

      // Log other errors
      console.error(`[----- SERVER FETCH ----] Error fetching ${url}:`, error)

      // Re-throw the error for the caller to handle
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method' | 'body'> & {
      next?: {
        revalidate?: number | false
        tags?: string[]
      }
      timeout?: number
      signal?: AbortSignal
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestInit, 'method' | 'body'> & {
      next?: {
        revalidate?: number | false
        tags?: string[]
      }
      timeout?: number
      signal?: AbortSignal
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestInit, 'method' | 'body'> & {
      next?: {
        revalidate?: number | false
        tags?: string[]
      }
      timeout?: number
      signal?: AbortSignal
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method' | 'body'> & {
      next?: {
        revalidate?: number | false
        tags?: string[]
      }
      timeout?: number
      signal?: AbortSignal
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

const serverFetchClient = new ServerFetchClient()
export default serverFetchClient
