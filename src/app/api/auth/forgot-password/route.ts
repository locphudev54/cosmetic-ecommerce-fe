import { API_ENDPOINTS } from '@/constants/api.constant'
import serverFetchClient from '@/lib/server-fetch'
import { ApiError } from '@/types/api.types'
import { isApiError } from '@/utilts/common.utils'
import { NextRequest, NextResponse } from 'next/server'

type ForgotPasswordBody = {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const { email }: ForgotPasswordBody = await request.json()

    if (!email) {
      return NextResponse.json(
        new ApiError({
          success: false,
          message: 'Email is required',
          statusCode: 400
        }),
        { status: 400 }
      )
    }

    // Call NestJS server
    const backendData = await serverFetchClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email
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
        message:
          error instanceof Error ? error.message.toUpperCase() : 'Forgot password request failed',
        statusCode: 500
      }),
      { status: 500 }
    )
  }
}
