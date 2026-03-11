import { AuthInitializer } from '@/features/auth/components/auth-initializer'
import { getAccessToken } from '@/utilts'
import { cookies } from 'next/headers'

export default async function ServerWrapper() {
  const cookieStore = await cookies()
  const accessToken = getAccessToken(cookieStore)
  return <AuthInitializer accessToken={accessToken} />
}
