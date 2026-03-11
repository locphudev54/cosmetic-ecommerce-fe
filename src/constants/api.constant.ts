export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Haven't implemented these in the backend yet
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    PROFILE: '/auth/profile',
    ME: '/auth/me',

    // OAuth
    GOOGLE: '/auth/google',
    GITHUB: '/auth/github',
    OAUTH_CALLBACK: '/auth/callback'
  },

  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
    BULK_DELETE: '/users/bulk-delete',
    EXPORT: '/users/export',
    IMPORT: '/users/import'
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    BULK_DELETE: '/products/bulk-delete'
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    TREE: '/categories/tree',
    DETAIL: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}/soft`,
    BULK_DELETE: '/categories/bulk-delete'
  },

  // Attributes
  ATTRIBUTES: {
    LIST: '/attributes',
    DETAIL: (id: string) => `/attributes/${id}`,
    CREATE: '/attributes',
    UPDATE: (id: string) => `/attributes/${id}`,
    DELETE: (id: string) => `/attributes/${id}/soft`,
    BULK_DELETE: '/attributes/bulk-delete'
  },

  // Health check
  HEALTH: '/health'
} as const

export const EXPIRED_ACCESS_TOKEN_MESSAGE = 'Access token has expired'
