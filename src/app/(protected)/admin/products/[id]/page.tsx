import UpsertProductForm from '@/features/product/components/upsert-product-form'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UpsertProductForm productId={id} />
}
