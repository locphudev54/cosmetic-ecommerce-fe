import { User } from '@/features/user/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName?: string
  phoneNumber?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  resetToken: string
  newPassword: string
}

export interface RefreshTokenClientResponse {
  user: User
  accessToken: string
}

export interface RefreshTokenServerResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export type LoginClientResponse = RefreshTokenClientResponse

export type LoginServerResponse = RefreshTokenServerResponse

// Register returns the same shape as login (auto-login after registration)
export type RegisterClientResponse = LoginClientResponse

export type RegisterServerResponse = LoginServerResponse
