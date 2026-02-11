import { Button } from '@/components/ui/button'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { User } from '@/features/user/types'
import Link from 'next/dist/client/link'
import { cookies } from 'next/headers'
import { getAccessToken } from '@/utilts/cookies.utils'
import serverFetchClient from '@/lib/server-fetch'

export default async function Page() {
  const cookieStore = await cookies()
  const accessToken = getAccessToken(cookieStore)
  let userList: User[] = []

  try {
    // Fetch user list on server side
    const [response] = await Promise.all([
      serverFetchClient.get<User[]>(API_ENDPOINTS.USERS.LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }),
      serverFetchClient.get<User[]>(API_ENDPOINTS.USERS.LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }),
      serverFetchClient.get<User[]>(API_ENDPOINTS.USERS.LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    ])
    userList = response.data
  } catch (error) {
    console.error('Error fetching user list:', error)
    throw error
  }

  return (
    <div className='flex items-center justify-center py-6 flex-col'>
      <h1>Server Page</h1>
      <Link href={ROUTES.HOME} className='ml-4'>
        <Button>Go to Home</Button>
      </Link>

      <div className='mt-6'>
        <h2 className='mb-4 text-lg font-medium'>User List (Fetched on Server):</h2>
        <ul className='space-y-2'>
          {userList.map((user) => (
            <li key={user.id} className='border p-4 rounded-md'>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
