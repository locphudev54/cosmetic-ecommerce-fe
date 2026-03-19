import { API_ENDPOINTS } from '@/constants/api.constant'
import { LoginServerResponse } from '@/features/auth/types/auth.types'
import serverFetchClient from '@/lib/server-fetch'
import { ApiError } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import { setAuthCookies } from '@/utilts/cookies.utils'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type LoginBody = {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginBody = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        new ApiError({
          success: false,
          message: 'Email and password are required',
          statusCode: 400
        }),
        { status: 400 }
      )
    }

    // Call NestJS server
    const backendData = await serverFetchClient.post<LoginServerResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password
      }
    )

    // Remove refresh token from response before sending to client
    const { refreshToken, ...dataWithoutRefreshToken } = backendData.data

    // Set cookies
    const cookieStore = await cookies()
    await setAuthCookies(cookieStore, backendData.data.accessToken, backendData.data.refreshToken)

    // Return success with user data
    return NextResponse.json({ ...backendData, data: dataWithoutRefreshToken })
  } catch (error: unknown) {
    // Error received from external backend server
    // => The same ApiError format which are consistent with server
    if (isApiError(error)) {
      return NextResponse.json(error, { status: error.statusCode })
    }

    return NextResponse.json(
      new ApiError({
        success: false,
        message: error instanceof Error ? error.message.toUpperCase() : 'Login failed',
        statusCode: 500
      }),
      { status: 500 }
    )
  }
}
