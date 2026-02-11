import { envServer } from '@/config/env.server'
import { COOKIES_TOKEN_KEYS } from '@/constants/cookies.constant'
import { cookies } from 'next/headers'

/**
 * Cookie options interface for setting cookies
 */
export interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  maxAge?: number
  path?: string // default value is: '/' means the cookie is valid for the entire site
  domain?: string
}

/**
 * Get the cookie store (awaited cookies())
 */
export async function getCookieStore() {
  return await cookies()
}

/**
 * Get a cookie value by key
 */
export function getCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  key: string
): string | undefined {
  return cookieStore.get(key)?.value
}

/**
 * Set a cookie with value and options
 */
export function setCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  key: string,
  value: string,
  options: CookieOptions = {}
): void {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: envServer.NODE_ENV === 'production',
    sameSite: 'strict'
    // path: '/'
  }

  cookieStore.set(key, value, { ...defaultOptions, ...options })
}

/**
 * Delete a cookie by key
 */
export function deleteCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, key: string): void {
  cookieStore.delete(key)
}

/**
 * Get access token from cookies
 */
export function getAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): string | undefined {
  return getCookie(cookieStore, COOKIES_TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): string | undefined {
  return getCookie(cookieStore, COOKIES_TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Set access token cookie with proper expiration
 */
export function setAccessTokenCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  token: string,
  maxAge?: number
): void {
  setCookie(cookieStore, COOKIES_TOKEN_KEYS.ACCESS_TOKEN, token, {
    maxAge: maxAge || 15 * 60 // 15 minutes default
  })
}

/**
 * Set refresh token cookie with proper expiration
 */
export function setRefreshTokenCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  token: string,
  maxAge?: number
): void {
  setCookie(cookieStore, COOKIES_TOKEN_KEYS.REFRESH_TOKEN, token, {
    maxAge: maxAge || 7 * 24 * 60 * 60 // 7 days default
  })
}

/**
 * Delete access token cookie
 */
export function deleteAccessTokenCookie(cookieStore: Awaited<ReturnType<typeof cookies>>): void {
  deleteCookie(cookieStore, COOKIES_TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Delete refresh token cookie
 */
export function deleteRefreshTokenCookie(cookieStore: Awaited<ReturnType<typeof cookies>>): void {
  deleteCookie(cookieStore, COOKIES_TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Clear all auth cookies (access and refresh tokens)
 */
export function clearAuthCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): void {
  deleteAccessTokenCookie(cookieStore)
  deleteRefreshTokenCookie(cookieStore)
}

/**
 * Set both access and refresh token cookies with calculated expiration from tokens
 */
export async function setAuthCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const { decodeToken } = await import('./server.utils')

  // Decode tokens to get expiration times
  const accessDecoded = decodeToken(accessToken)
  const refreshDecoded = decodeToken(refreshToken)
  const now = Math.floor(Date.now() / 1000) // current time in seconds

  // the value of exp in decoded token is in seconds

  const accessMaxAge = accessDecoded ? accessDecoded.exp - now : 15 * 60
  const refreshMaxAge = refreshDecoded ? refreshDecoded.exp - now : 7 * 24 * 60 * 60

  setAccessTokenCookie(cookieStore, accessToken, accessMaxAge)
  setRefreshTokenCookie(cookieStore, refreshToken, refreshMaxAge)
}
