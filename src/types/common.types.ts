export interface BaseEntity  {
  id: string
  isDeleted?: boolean
  deletedAt?: string
  createdAt: string
  updatedAt: string
}