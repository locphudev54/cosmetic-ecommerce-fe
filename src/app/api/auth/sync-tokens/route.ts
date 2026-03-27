import { ApiError, ApiResponse } from '@/types/api.types'
import { setAuthCookies } from '@/utilts/cookies.utils'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type SyncTokensBody = {
  accessToken: string
  refreshToken: string
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const { accessToken, refreshToken }: SyncTokensBody = await request.json()

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        new ApiError({
          success: false,
          message: 'Access token and refresh token are required',
          statusCode: 400
        }),
        { status: 400 }
      )
    }

    // Optionally, you could verify the tokens with the backend here before setting cookies
    // For simplicity, we'll just set the cookies directly

    // Set cookies
    await setAuthCookies(cookieStore, accessToken, refreshToken)
    // Return success with user data
    return NextResponse.json(
      new ApiResponse({
        success: true,
        message: 'Tokens synchronized successfully',
        data: {
          accessToken
        }
      }),
      { status: 200 }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      new ApiError({
        success: false,
        message: error instanceof Error ? error.message.toUpperCase() : 'Sync tokens failed',
        statusCode: 500
      }),
      { status: 500 }
    )
  }
}
