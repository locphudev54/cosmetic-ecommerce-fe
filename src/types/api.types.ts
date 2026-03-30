import { PaginationType, SortOrder } from '@/enums'

/**
 * Standard API response wrapper
 * All API endpoints should return this format
 */
export class ApiResponse<TData = any, TMeta = Record<string, any>> {
  success: boolean = true
  statusCode: number = 200
  message: string = ''
  data: TData = [] as any
  meta?: TMeta
  timestamp: string = ''

  constructor(init?: Partial<ApiResponse<TData, TMeta>>) {
    Object.assign(this, init)
  }
}

/**
 * Standard API error response
 */
export class ApiError {
  success = false as const
  statusCode: number = 400
  message: any
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

export interface PaginationMeta {
  limit: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface OffsetPaginationMeta extends PaginationMeta {
  page: number
  totalPages: number
}

export interface CursorPaginationMeta extends PaginationMeta {
  nextCursor: string | null
  previousCursor: string | null
}

export interface PaginationQueryParams {
  paginationType?: PaginationType
  page?: number
  limit?: number
  sortOrder?: SortOrder
  sortBy?: string
  cursor?: string
}

export interface DateRangeQueryParams {
  startDate?: string
  endDate?: string
  timezone?: string
}

export type OAuthProviders = 'google' | 'facebook' | 'github' | 'twitter'
