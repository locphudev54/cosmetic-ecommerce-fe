export const ROUTES = {
  // Home
  HOME: '/',

  // Authentication
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    OAUTH_CALLBACK: '/auth/callback'
  },

  // Protected
  PROTECTED: {
    HOME: '/protected',
    CLIENT: '/protected/client',
    SERVER: '/protected/server'
  },

  // Dashboard
  ADMIN: {
    HOME: '/admin',
    PRODUCT: {
      HOME: '/admin/products',
      NEW: '/admin/products/new',
      EDIT: (id: string) => `/admin/products/${id}/edit`
    },
    PROFILE: '/admin/profile',
    SETTINGS: '/admin/settings',
    ANALYTICS: '/admin/analytics',
    USERS: '/admin/users'
  }
}
