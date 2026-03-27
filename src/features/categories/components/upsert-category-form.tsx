'use client'
import ReturnBack from '@/components/common/return-back'
import { TypographyH3, TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/route.constant'
import { Attribute, attributeService } from '@/features/attributes'
import { AttributeSelector } from '@/features/categories/components/attribute-selector'
import { useCategory, useCreateCategory, useUpdateCategory } from '@/features/categories/hooks'
import { UpsertCategoryFormValues, createCategorySchema } from '@/features/categories/schemas'
import CategorySelection from '@/features/product/components/category-selection'
import { useDialog } from '@/hooks/use-dialog'
import { handleApiError } from '@/lib/utils'
import { slugifyString } from '@/utilts/client.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertCategoryFormProps {
  categoryId?: string
}

export default function UpsertCategoryForm({ categoryId }: UpsertCategoryFormProps) {
  const router = useRouter()
  const dialog = useDialog()

  const [parentAttributes, setParentAttributes] = React.useState<Attribute[]>([])
  const isFirstlyInit = React.useRef(true)

  const form = useForm<UpsertCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: undefined,
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    }
  })

  // Queries
  const { data: categoryData } = useCategory(categoryId)

  // Mutations
  const createCategoryMutation = useCreateCategory()
  const updateCaegoryMutation = useUpdateCategory()

  const parentIdValue = form.watch('parentId')
  const initialParentIds = React.useMemo(
    () => (parentIdValue ? [parentIdValue] : undefined),
    [parentIdValue]
  )

  React.useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || '',
        parentId: categoryData.parentId || undefined,
        isActive: categoryData.isActive,
        metaTitle: categoryData.metaTitle || '',
        metaDescription: categoryData.metaDescription || '',
        attributeIds: categoryData.categoryAttributes
          ? categoryData.categoryAttributes.map((attr) => attr.attributeId)
          : []
      })
      setParentAttributes(
        categoryData.categoryAttributes
          ? categoryData.categoryAttributes.map((attr) => attr.attribute)
          : []
      )
    }
  }, [categoryData, form])

  const handleGenerateSlug = () => {
    const name = form.getValues('name')
    if (name) {
      const slug = slugifyString(name)
      form.setValue('slug', slug)
    }
  }

  const removeParentAttributes = React.useCallback(() => {
    if (!categoryData) {
      // Add mode
      setParentAttributes([])
      form.setValue('attributeIds', [])
      return
    }

    // Edit mode - reset to original parent attributes
    const currentAttributes = categoryData.categoryAttributes?.map((attr) => attr.attribute) || []
    setParentAttributes(currentAttributes)
    form.setValue(
      'attributeIds',
      currentAttributes.map((attr) => attr.id)
    )
  }, [categoryData, form])

  const handleRemoveAttribute = (attributeId: string) => {
    const updatedAttributes = parentAttributes.filter((attr) => attr.id !== attributeId)
    setParentAttributes(updatedAttributes)
    form.setValue(
      'attributeIds',
      updatedAttributes.map((attr) => attr.id)
    )
  }

  const handleSelectParentCategory = React.useCallback(
    async (selectedCategories: Array<{ categoryId: string; isPrimary: boolean }>) => {
      if (isFirstlyInit.current && selectedCategories.length > 0) {
        isFirstlyInit.current = false
        return
      }

      // Select single parent category as a primary category
      const selectedId = selectedCategories.length > 0 ? selectedCategories[0].categoryId : null
      form.setValue('parentId', selectedId)

      if (!selectedId) {
        removeParentAttributes()
        return
      }

      const { data: parentAttributesData } = await attributeService.getAttributes({
        categoryId: selectedId,
        getAll: true
      })

      if (parentAttributesData.length === 0) {
        // toast.info('Danh mục cha không có thuộc tính nào để kế thừa')
        removeParentAttributes()
        return
      }

      const result = await dialog.open('confirm-action', {
        title: 'Bạn có muốn kế thừa thuộc tính từ danh mục cha?',
        description:
          'Bạn có thể thêm, xóa hoặc chỉnh sửa thuộc tính sau khi kế thừa. Việc kế thừa chỉ giúp tiết kiệm thời gian khi muốn sử dụng lại các thuộc tính của danh mục cha.',
        confirmLabel: 'Tiếp ',
        cancelLabel: 'Hủy',
        variant: 'default'
      })

      if (result && result.confirmed) {
        const isContainAllParentAttributes = parentAttributesData.every((parentAttr) =>
          parentAttributes.some((attr) => attr.id === parentAttr.id)
        )

        if (isContainAllParentAttributes) {
          toast.info('Đã kế thừa tất cả thuộc tính từ danh mục cha trước đó')
          return
        }

        // Inherit remaining parent attributes that are not already in the current child category
        const remainingParentAttributes = parentAttributesData.filter(
          (parentAttr) => !parentAttributes.some((attr) => attr.id === parentAttr.id)
        )

        setParentAttributes((prev) => {
          const mergedAttributes = [...prev, ...remainingParentAttributes]
          form.setValue(
            'attributeIds',
            mergedAttributes.map((attr) => attr.id)
          )
          return mergedAttributes
        })
        toast.success(`Đã kế thừa ${remainingParentAttributes.length} thuộc tính từ danh mục cha`)
      } else {
        removeParentAttributes()
      }
    },
    [dialog, form, parentAttributes, removeParentAttributes]
  )

  const handleAttributeSelectorChange = (selectedAttributes: Attribute[]) => {
    setParentAttributes(selectedAttributes)
    form.setValue(
      'attributeIds',
      selectedAttributes.map((attr) => attr.id)
    )
  }

  const onSubmit = async (data: UpsertCategoryFormValues) => {
    try {
      if (categoryId) {
        await updateCaegoryMutation.mutateAsync({ id: categoryId, data })
      } else {
        await createCategoryMutation.mutateAsync(data)
      }
      toast.success(`Danh mục đã được ${categoryId ? 'cập nhật' : 'tạo'} thành công!`)
      form.reset()
      router.push(ROUTES.ADMIN.CATEGORY.HOME)
    } catch (error) {
      handleApiError(error, form)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (error) => console.log({ error }))}
      className='pb-10'
    >
      <ReturnBack />
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-7'>
          <TypographyH3>Danh mục</TypographyH3>
          <Card className='mt-4'>
            <CardContent className='flex flex-col gap-y-4'>
              <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
                <div className='col-span-1'>
                  {/* Name */}
                  <Controller
                    name='name'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='category_name'>
                          <TypographyMuted>
                            Tên <span className='text-destructive'>(*)</span>
                          </TypographyMuted>
                        </FieldLabel>
                        <Input
                          autoFocus
                          id='category_name'
                          type='text'
                          placeholder='Nhập tên danh mục...'
                          {...field}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  {/* Slug */}
                  <Controller
                    name='slug'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='category_slug'>
                          <TypographyMuted>Slug</TypographyMuted>
                        </FieldLabel>
                        <div className='flex items-center gap-x-2'>
                          <Input
                            id='category_slug'
                            type='text'
                            placeholder='Nhập slug'
                            {...field}
                          />
                          <Button
                            variant={'outline'}
                            className='bg-gray-200 hover:bg-gray-200/90'
                            onClick={handleGenerateSlug}
                            type='button'
                          >
                            Generate
                          </Button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  {/* Description */}
                  <Controller
                    name='description'
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor='category_description'>
                          <TypographyMuted>Mô tả</TypographyMuted>
                        </FieldLabel>
                        <Textarea
                          className='min-h-24'
                          id='category_description'
                          placeholder='Nhập mô tả danh mục...'
                          rows={5}
                          {...field}
                        />
                      </Field>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <Controller
                    name='parentId'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor='parentId'>
                          <TypographyMuted>Danh mục cha</TypographyMuted>
                        </FieldLabel>
                        <CategorySelection
                          initialSelectedParentCategoryIds={initialParentIds}
                          onChange={handleSelectParentCategory}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </div>

              <Controller
                name='attributeIds'
                control={form.control}
                render={() => (
                  <Field>
                    <AttributeSelector
                      parentAttributes={parentAttributes}
                      onChange={handleAttributeSelectorChange}
                      onRemove={handleRemoveAttribute}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className='col-span-5'>
          <div className='sticky top-3'>
            {/* Action buttons */}
            <div className='flex items-center justify-end'>
              {categoryId ? (
                <Button
                  type='submit'
                  variant={'blue_gradient'}
                  disabled={createCategoryMutation.isPending}
                  className='min-w-24'
                >
                  <Edit />
                  {createCategoryMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              ) : (
                <Button
                  type='submit'
                  variant={'blue_gradient'}
                  disabled={createCategoryMutation.isPending}
                  className='min-w-24'
                >
                  <Plus />
                  {createCategoryMutation.isPending ? 'Đang tạo...' : 'Tạo mới'}
                </Button>
              )}
            </div>

            <Card className='mt-3'>
              <CardContent className='flex flex-col gap-y-4'>
                {/* Is Active */}
                <Controller
                  name='isActive'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          id='category_active'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor='category_active'>
                          <TypographyMuted>Kích hoạt</TypographyMuted>
                        </Label>
                      </div>
                    </Field>
                  )}
                />

                {/* Meta Title */}
                <Controller
                  name='metaTitle'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='category_meta_title'>
                        <TypographyMuted>Meta Title</TypographyMuted>
                      </FieldLabel>
                      <Input
                        id='category_meta_title'
                        type='text'
                        placeholder='Nhập meta title...'
                        {...field}
                      />
                    </Field>
                  )}
                />

                {/* Meta Description */}
                <Controller
                  name='metaDescription'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='category_meta_description'>
                        <TypographyMuted>Meta Description</TypographyMuted>
                      </FieldLabel>
                      <Textarea
                        id='category_meta_description'
                        placeholder='Nhập meta description...'
                        rows={2}
                        {...field}
                      />
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
