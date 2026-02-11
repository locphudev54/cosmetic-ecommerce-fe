import { authService } from '@/features/auth/services'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login
    // onSuccess: (data) => {
    // }
    // onError: (error) => {
    //
    //   console.log({ error })
    // }
  })
}
