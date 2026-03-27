import { API_ENDPOINTS } from '@/constants/api.constant'
import { JSON_WEB_TOKEN_KEYS } from '@/constants/cookies.constant'
import { Attribute, ATTRIBUTE_QUERY_KEYS } from '@/features/attributes'
import UpsertCategoryForm from '@/features/categories/components/upsert-category-form'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { OffsetPaginationMeta } from '@/types'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(JSON_WEB_TOKEN_KEYS.ACCESS_TOKEN)?.value
  const queryClient = getServerQueryClient()

  await queryClient.fetchQuery({
    queryKey: ATTRIBUTE_QUERY_KEYS.list({ getAll: true }),
    queryFn: () =>
      serverFetchClient.get<Attribute[], OffsetPaginationMeta>(
        `${API_ENDPOINTS.ATTRIBUTES.LIST}?getAll=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpsertCategoryForm />
    </HydrationBoundary>
  )
}
