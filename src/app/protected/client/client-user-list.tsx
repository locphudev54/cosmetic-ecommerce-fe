'use client'

import { Button } from '@/components/ui/button'
import { API_ENDPOINTS } from '@/constants/api.constant'
import { ROUTES } from '@/constants/route.constant'
import { User } from '@/features/user/types'
import apiClient from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function ClientUserList() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST)
  })

  return (
    <div className='flex items-center justify-center py-6 flex-col'>
      <h1>Client Page</h1>
      <Link href={ROUTES.HOME} className='ml-4'>
        <Button>Go to Home</Button>
      </Link>

      <div className='mt-6'></div>
      <h2 className='mb-4 text-lg font-medium'>User List (Fetched on Client):</h2>
      {data && (
        <ul className='space-y-2'>
          {data.data.map((user: User) => (
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
      )}
    </div>
  )
}
