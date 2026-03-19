import { envServer } from '@/config/env.server'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { JSON_WEB_TOKEN_KEYS } from '@/constants/cookies.constant'
import { ROUTES } from '@/constants/route.constant'
import { RefreshTokenServerResponse } from '@/features/auth/types/auth.types'
import serverFetchClient from '@/lib/server-fetch'
import { getAccessToken, getRefreshToken } from '@/utilts/cookies.utils'
import { decodeToken } from '@/utilts/server.utils'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Define auth routes (exclude logout)
const authRoutes = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY_EMAIL,
  ROUTES.AUTH.OAUTH_CALLBACK
]

const protectedRoutesPrefixes = [ROUTES.ADMIN.HOME]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookieStore = await cookies()

  const accessToken = getAccessToken(cookieStore)
  const refreshToken = getRefreshToken(cookieStore)
  const isAuthenticated = !!refreshToken

  const response = NextResponse.next()

  const isAuthRoute = authRoutes.some((route) => pathname === route)
  const isProtectedRoute = protectedRoutesPrefixes.some((prefix) => pathname.startsWith(prefix))

  // In case acess token is expired ~ it has been remove from cookies, try to refresh it
  // Only do this if refresh token exists and not on auth routes
  if (!accessToken && refreshToken && !isAuthRoute) {
    try {
      const refreshResponse = await serverFetchClient.post<RefreshTokenServerResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      )
      if (refreshResponse.success && refreshResponse.data) {
        const newAccessToken = refreshResponse.data.accessToken
        const newRefreshToken = refreshResponse.data.refreshToken

        // set new tokens to cookies - Not work here, but work in route handlers
        // await setAuthCookies(cookieStore, newAccessToken, newRefreshToken)

        const newAccessDecoded = decodeToken(newAccessToken)
        const newRefreshDecoded = decodeToken(newRefreshToken)
        const now = Math.floor(Date.now() / 1000)
        const newAccessMaxAge = newAccessDecoded ? newAccessDecoded.exp - now : 15 * 60
        const refreshMaxAge = newRefreshDecoded ? newRefreshDecoded.exp - now : 7 * 24 * 60 * 60

        // Redirect to the same path to ensure Zustand stores in AuthInitializer (Client Component) are updated
        // Because Server Components will get the new access token from cookies on next request automatically
        // Not working properly yet. Because when redirecting, it won't act as reload the page, so Client Components
        // won't re-mount and re-call the AuthInitializer component to update the Zustand stores
        // So we have to rely on other ways to update the Zustand stores in Client Components after token refresh

        // const originalRequestedUrl = new URL(request.url) // New URL object from the original request
        // response = NextResponse.redirect(originalRequestedUrl)

        // Set new cookies - Not work here, but work in route handlers
        // setAccessTokenCookie(cookieStore, newAccessToken, newAccessMaxAge)
        // setRefreshTokenCookie(cookieStore, newRefreshToken, refreshMaxAge)

        // Update response cookies as well
        // We cannot  use cookies() inside middleware to set cookies for response
        // Instead, we have to set cookies on the RESPONSE object directly
        // But in Route Handlers, we can use cookies() to set cookies for both request and response

        response.cookies.set(JSON_WEB_TOKEN_KEYS.ACCESS_TOKEN, newAccessToken, {
          httpOnly: true,
          secure: envServer.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: newAccessMaxAge
          // path: '/'
        })
        response.cookies.set(JSON_WEB_TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          secure: envServer.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: refreshMaxAge
          // path: '/'
        })
      }
    } catch (error) {
      // Refresh failed, redirect to logout
      const logoutUrl = new URL(ROUTES.AUTH.LOGOUT, request.url)
      logoutUrl.searchParams.set('key', envServer.LOGOUT_SECRET_KEY)
      return NextResponse.redirect(logoutUrl)
    }
  }

  // Redirect logic
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email'
  ]
}
