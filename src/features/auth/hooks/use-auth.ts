import { authService } from '@/features/auth/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authService.login
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
