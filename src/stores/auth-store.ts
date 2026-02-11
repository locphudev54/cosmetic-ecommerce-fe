import { User } from '@/features/user/types'
import { get } from 'http'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  user: User | null
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,

      // Actions
      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: !!token
        }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          isAuthenticated: false,
          user: null
        }),

      // Getters
      getAccessToken: () => get().accessToken
    }),
    {
      name: 'auth-store'
    }
  )
)
