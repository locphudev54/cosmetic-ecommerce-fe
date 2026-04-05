import { API_ENDPOINTS } from '@/constants/api.constant'
import serverFetchClient from '@/lib/server-fetch'
import { ApiError } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import { NextRequest, NextResponse } from 'next/server'

type ResetPasswordBody = {
  resetToken: string
  newPassword: string
}

export async function POST(request: NextRequest) {
  try {
    const { resetToken, newPassword }: ResetPasswordBody = await request.json()

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        new ApiError({
          success: false,
          message: 'Reset token and new password are required',
          statusCode: 400
        }),
        { status: 400 }
      )
    }

    // Call NestJS server
    const backendData = await serverFetchClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      resetToken,
      newPassword
    })

    return NextResponse.json(backendData)
  } catch (error: unknown) {
    // Error received from external backend server
    if (isApiError(error)) {
      return NextResponse.json(error, { status: error.statusCode })
    }

    return NextResponse.json(
      new ApiError({
        success: false,
        message: error instanceof Error ? error.message.toUpperCase() : 'Password reset failed',
        statusCode: 500
      }),
      { status: 500 }
    )
  }
}
