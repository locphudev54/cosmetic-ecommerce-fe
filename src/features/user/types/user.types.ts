import { UserRole } from "@/enums"
import { BaseEntity } from "@/types/common.types"

export interface User extends BaseEntity {
  email: string
  code: string
  fullName: string
  phoneNumber: string
  isActive: boolean
  avatarUrl: string
  role: UserRole
}