import { API_ENDPOINTS } from '@/constants/api.constant'
import { RefreshTokenServerResponse } from '@/features/auth/types/auth.types'
import serverFetchClient from '@/lib/server-fetch'
import { ApiError } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import { getRefreshToken, setAuthCookies } from '@/utilts/cookies.utils'
import { isNextRedirectError } from '@/utilts/server.utils'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const cookieStore = await cookies()
    const refreshTokenFromCookie = getRefreshToken(cookieStore)

    if (!refreshTokenFromCookie) {
      return NextResponse.json(
        new ApiError({
          success: false,
          message: 'Refresh token not found in cookies',
          statusCode: 401
        }),
        {
          status: 401
        }
      )
    }

    // Call NestJS server to refresh tokens
    const backendData = await serverFetchClient.post<RefreshTokenServerResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      {
        refreshToken: refreshTokenFromCookie
      }
    )

    console.log({ newAT: backendData.data.accessToken, newRT: backendData.data.refreshToken })

    // Set new cookies with updated tokens
    await setAuthCookies(cookieStore, backendData.data.accessToken, backendData.data.refreshToken)

    // Remove refresh token from response before sending to client
    const { refreshToken, ...dataWithoutRefreshToken } = backendData.data

    // Return success with user data
    return NextResponse.json({ ...backendData, data: dataWithoutRefreshToken }, { status: 200 })
  } catch (error: unknown) {
    if (isApiError(error)) {
      return NextResponse.json(error, { status: error.statusCode })
    }

    // In case of Next.js redirect error, re-throw with 401 status
    return NextResponse.json(
      new ApiError({
        success: false,
        message: 'Token refresh failed',
        statusCode: 401
      }),
      { status: 401 }
    )
  }
}
