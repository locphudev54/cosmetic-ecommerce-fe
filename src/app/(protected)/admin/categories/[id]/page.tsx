import UpsertCategoryForm from '@/features/categories/components/upsert-category-form'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <UpsertCategoryForm categoryId={id} />
}
