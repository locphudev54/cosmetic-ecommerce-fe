import { authService } from '@/features/auth/services'
import { ForgotPasswordRequest, ResetPasswordRequest } from '@/features/auth/types/auth.types'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authService.login
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data)
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data)
  })
}

export function useGetMe(accessToken: string) {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(accessToken)
  })
}

export function useSyncTokensMutation() {
  return useMutation({
    mutationFn: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) =>
      authService.syncTokens(accessToken, refreshToken)
  })
}
