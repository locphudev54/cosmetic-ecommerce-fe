import { AuthInitializer } from '@/features/auth/components/auth-initializer'
import { getAccessToken, getRefreshToken } from '@/utilts'
import { cookies } from 'next/headers'

export default async function ServerWrapper() {
  const cookieStore = await cookies()
  const accessToken = getAccessToken(cookieStore)
  const refreshToken = getRefreshToken(cookieStore)

  return <AuthInitializer accessToken={accessToken} refreshToken={refreshToken} />
}
