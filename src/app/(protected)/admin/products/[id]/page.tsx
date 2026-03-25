// import { API_ENDPOINTS } from '@/constants/api.constant'
// import UpsertProductForm from '@/features/product/components/upsert-product-form'
// import { PRODUCT_QUERY_KEYS } from '@/features/product/hooks'
// import { Product } from '@/features/product/types/product.types'
// import { getServerQueryClient } from '@/lib/query-client'
// import serverFetchClient from '@/lib/server-fetch'
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params
//   const queryClient = getServerQueryClient()

//   await queryClient.fetchQuery({
//     queryKey: PRODUCT_QUERY_KEYS.detail(id),
//     queryFn: async () => {
//       const response = await serverFetchClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id))
//       return response.data
//     }
//   })

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <UpsertProductForm productId={id} />
//     </HydrationBoundary>
//   )
// }

import UpsertProductForm from '@/features/product/components/upsert-product-form'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <UpsertProductForm productId={id} />
}
