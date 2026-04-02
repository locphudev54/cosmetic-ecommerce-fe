export const ROUTES = {
  // Home
  HOME: '/',
  ABOUT: '/about',

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

  // Products
  PRODUCTS: {
    HOME: '/products',
    DETAIL: (slug: string) => `/products/${slug}`
  },

  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',

  // Collections
  COLLECTIONS: {
    ALL: '/collections/all',
    DETAIL: (slug: string) => `/collections/${slug}`
  },

  // Dashboard
  ADMIN: {
    HOME: '/admin',
    PRODUCT: {
      HOME: '/admin/products',
      NEW: '/admin/products/new',
      EDIT: (id: string) => `/admin/products/${id}`
    },
    COLLECTION: {
      HOME: '/admin/collections',
      NEW: '/admin/collections/new',
      EDIT: (id: string) => `/admin/collections/${id}`
    },
    CATEGORY: {
      HOME: '/admin/categories',
      NEW: '/admin/categories/new',
      EDIT: (id: string) => `/admin/categories/${id}`
    },
    ATTRIBUTE: {
      HOME: '/admin/attributes'
    },
    BRAND: {
      HOME: '/admin/brands'
    },
    COUNTRY_OF_ORIGIN: {
      HOME: '/admin/country-of-origin'
    }
  }
}
