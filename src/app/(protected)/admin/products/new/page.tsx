import UpsertProductForm from '@/features/product/components/upsert-product-form'
import { Attribute } from '@/features/product/types/product.types'
import { getServerQueryClient } from '@/lib/query-client'
import serverFetchClient from '@/lib/server-fetch'
import { OffsetPaginationMeta } from '@/types'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const queryClient = getServerQueryClient()

  await queryClient.fetchQuery({
    queryKey: ['attributes'],
    queryFn: () =>
      serverFetchClient.get<Attribute[], OffsetPaginationMeta>('/attributes?getAll=true', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpsertProductForm />
    </HydrationBoundary>
  )
}
