import { User } from '@/features/user/types'

export interface LoginCredentials {
  email: string
  password: string
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

export interface LoginClientResponse extends RefreshTokenClientResponse {}

export interface LoginServerResponse extends RefreshTokenServerResponse {}
