export interface BaseEntity {
  id: string
  isDeleted?: boolean
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export type LayoutMode = 'grid' | 'list'

export type InfiniteFetchingMode = 'scroll' | 'manual'
