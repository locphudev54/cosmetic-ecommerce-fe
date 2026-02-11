import { API_ENDPOINTS } from '@/constants/api.constant'
import serverFetchClient from '@/lib/server-fetch'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getRefreshToken, clearAuthCookies } from '@/utilts/cookies.utils'
import { ApiResponse } from '@/types/api.types'

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies
    const cookieStore = await cookies()
    const accessToken = getAccessToken(cookieStore)
    const refreshToken = getRefreshToken(cookieStore)

    // If access token exists, try to logout on backend (but don't fail if it errors)
    if (accessToken) {
      try {
        await serverFetchClient.post(
          API_ENDPOINTS.AUTH.LOGOUT,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      } catch (error) {
        // Ignore backend logout errors - proceed with local logout
        console.log('Backend logout error (ignored):', error)
      }
    }

    // Always clear cookies regardless of backend response
    clearAuthCookies(cookieStore)

    // Return success - logout is always successful
    return NextResponse.json(new ApiResponse({ success: true, message: 'Logged out successfully' }))
  } catch (error) {
    // Even if something goes wrong, return success for logout
    return NextResponse.json(new ApiResponse({ success: true, message: 'Logged out successfully' }))
  }
}
