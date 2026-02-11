import { API_ENDPOINTS } from '@/constants/api.constant'
import { LoginClientResponse, LoginCredentials } from '@/features/auth/types/auth.types'
import internalApiClient from '@/lib/internal-api-client'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginClientResponse> {
    const response = await internalApiClient.post<LoginClientResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  }
}
