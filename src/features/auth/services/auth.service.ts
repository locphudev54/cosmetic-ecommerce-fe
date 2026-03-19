import { API_ENDPOINTS } from '@/constants/api.constant'
import { LoginClientResponse, LoginCredentials } from '@/features/auth/types/auth.types'
import { User } from '@/features/user/types'
import apiClient from '@/lib/api-client'
import internalApiClient from '@/lib/internal-api-client'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginClientResponse> {
    const response = await internalApiClient.post<LoginClientResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  async syncTokens(accessToken: string, refreshToken: string): Promise<void> {
    await internalApiClient.post(API_ENDPOINTS.AUTH.SYNC_TOKENS, {
      accessToken,
      refreshToken
    })
  },

  // export interface User extends BaseEntity {
  //   email: string
  //   code: string
  //   fullName: string
  //   phoneNumber: string
  //   isActive: boolean
  //   avatarUrl: string
  //   role: UserRole
  // }

  async getMe(accessToken: string): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data
  }
}
