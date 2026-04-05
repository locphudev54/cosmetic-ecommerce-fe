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

  // Accounts
  ACCOUNT: {
    DASHBOARD: '/account/dashboard', // View recent orders, manage account details, and access other account-related features.
    ORDERS: '/account/orders', // View order history, track current orders, and manage returns or cancellations.
    ORDER_DETAIL: (orderId: string) => `/account/orders/${orderId}`,
    ADDRESSES: '/account/addresses', // View and manage shipping addresses, choose default address, add new address, edit or delete existing addresses.
    PROFILE: '/account/profile', // View and edit profile information such as: name, email, phone number, etc.
    CHANGE_PASSWORD: '/account/change-password'
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
