import { API_ENDPOINTS } from '@/constants/api.constant'
import {
  ForgotPasswordRequest,
  LoginClientResponse,
  LoginCredentials,
  RegisterClientResponse,
  RegisterCredentials,
  ResetPasswordRequest
} from '@/features/auth/types/auth.types'
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

  async register(credentials: RegisterCredentials): Promise<RegisterClientResponse> {
    const response = await internalApiClient.post<RegisterClientResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    )
    return response.data
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await internalApiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await internalApiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  },

  async syncTokens(accessToken: string, refreshToken: string): Promise<void> {
    await internalApiClient.post(API_ENDPOINTS.AUTH.SYNC_TOKENS, {
      accessToken,
      refreshToken
    })
  },

  async getMe(accessToken: string): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data
  }
}
