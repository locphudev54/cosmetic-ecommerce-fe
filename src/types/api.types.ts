import { PaginationType, SortOrder } from '@/enums'

/**
 * Standard API response wrapper
 * All API endpoints should return this format
 */
export class ApiResponse<T = any> {
  success: boolean = true
  statusCode: number = 200
  message: string = ''
  data: T = {} as T
  meta?: Record<string, any>
  timestamp: string

  constructor(init?: Partial<ApiResponse<T>>) {
    Object.assign(this, init)
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Standard API error response
 */
export class ApiError {
  success: false = false
  statusCode: number = 400
  message: string = ''
  error: string = ''
  path: string = ''
  details?: any
  timestamp: string = ''
  requestId?: string

  constructor(init?: Partial<ApiError>) {
    Object.assign(this, init)
    this.timestamp = new Date().toISOString()
  }
}

export interface OffsetPaginationResponse<T = any> {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    filters?: Record<string, any> // Optional filters applied - e.g., search terms, date ranges.
  }
}

export interface CursorPaginationResponse<T = any> {
  items: T[]
  meta: {
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextCursor: string | null
    previousCursor: string | null
    filters?: Record<string, any> // Optional filters applied - e.g., search terms, date ranges.
  }
}

export interface PaginationQueryParams {
  paginationType?: PaginationType
  page?: number
  limit?: number
  sortBy?: 'createdAt'
  sortOrder?: SortOrder
  cursor: string
}
