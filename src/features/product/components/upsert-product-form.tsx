'use client'
import InputNumber from '@/components/common/input-number'
import ReturnBack from '@/components/common/return-back'
import { TypographyH3, TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/route.constant'
import { ProductStatus } from '@/enums'
import { ProductVariantsForm, UploadProductImages } from '@/features/product/components'
import CategorySelection from '@/features/product/components/category-selection'
import { SelectBrandCombobox } from '@/features/product/components/select-brand-combobox'
import { SelectCountryOfOriginCombobox } from '@/features/product/components/select-country-of-origin-combobox'
import { useCreateProduct, useProduct, useUpdateProduct } from '@/features/product/hooks'
import { UpsertProductFormValues, productSchema } from '@/features/product/schemas/product.schemas'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import {
  ProductAttributeType,
  ProductVariantType,
  UpdateProductCategoryDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductVariantDto
} from '@/features/product/types'
import { useDialog } from '@/hooks/use-dialog'
import { handleApiError } from '@/lib/utils'
import { generateProductCode } from '@/utilts/client.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Edit, Eye, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

const RichTextEditor = dynamic(() => import('@/components/common/rich-text-editor'), {
  ssr: false,
  loading: () => <Skeleton className='h-70 w-full' />
})

export default function UpsertProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const dialog = useDialog()
  const clearPrimaryCategoryId = useCategoryTreeStore((state) => state.clearPrimaryCategoryId)
  const setPrimaryCategoryId = useCategoryTreeStore((state) => state.setPrimaryCategoryId)

  const isEditMode = !!productId

  const form = useForm<UpsertProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      status: ProductStatus.PUBLISHED,
      basePrice: 0
    }
  })

  // Queries
  const { data: productData } = useProduct(productId ?? '')

  // Mutations
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()

  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending

  // Derived initial data for sub-components
  const initialCategoryIds = React.useMemo(
    () => productData?.categories?.map((c) => c.categoryId),
    [productData]
  )

  const initialImages = React.useMemo(() => productData?.images, [productData])

  // Derive initial variants and attributes from productData for edit mode
  const initialVariants = React.useMemo((): ProductVariantType[] => {
    if (!productData?.variants?.length) return []
    return productData.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      barcode: v.barcode,
      costPrice: Number(v.costPrice),
      sellingPrice: Number(v.sellingPrice),
      stockOnHand: v.stockOnHand ?? 0,
      imageUrl: v.imageUrl || undefined,
      lowStockThreshold: v.lowStockThreshold,
      maxStockThreshold: v.maxStockThreshold,
      isActive: v.isActive,
      attributeValues:
        v.attributeValues?.map((attrVal) => ({
          attributeValueId: attrVal.attributeValueId,
          value: attrVal.attributeValue?.value ?? ''
        })) ?? []
    }))
  }, [productData])

  const initialAttributes = React.useMemo((): ProductAttributeType[] => {
    if (!productData?.variants?.length) return []
    const attributeMap = new Map<string, ProductAttributeType>()
    productData.variants.forEach((variant) => {
      variant.attributeValues?.forEach((attrVal) => {
        const attrId = attrVal.attributeValue?.attribute?.id ?? ''
        const attrName = attrVal.attributeValue?.attribute?.name ?? ''
        if (!attrId) return
        if (!attributeMap.has(attrId)) {
          attributeMap.set(attrId, { id: attrId, name: attrName, values: [] })
        }
        const attr = attributeMap.get(attrId)!
        if (!attr.values.some((v) => v.attributeValueId === attrVal.attributeValueId)) {
          attr.values.push({
            attributeValueId: attrVal.attributeValueId,
            value: attrVal.attributeValue?.value ?? ''
          })
        }
      })
    })
    return Array.from(attributeMap.values())
  }, [productData])

  // Bug liên quan đến khái niệm closure trong JavaScript.
  // Khi useEffect được gọi, nó sẽ capture giá trị của primaryCategoryId tại thời điểm đó.
  // Nếu primaryCategoryId thay đổi sau đó, callback trong useEffect sẽ không nhận được giá trị
  // mới mà vẫn sử dụng giá trị cũ đã bị capture.
  // React.useEffect(() => {
  //   return () => {
  //
  //     // Correct way: get the latest state value inside the callback function
  //     // if (useCategoryTreeStore.getState().primaryCategoryId) {
  //     // Ở đây primaryCategoryId bị capture trong closure, nên sau khi store state update
  //     // thì callback vẫn dùng giá trị cũ.
  //     if (primaryCategoryId) {
  //
  //       setPrimaryCategoryId(null)
  //     }
  //     // }
  //   }
  // }, [primaryCategoryId, setPrimaryCategoryId])

  // Cleanup function sẽ chạy khi component unmount hoặc trước khi effect chạy lại.
  // Ví dụ: khi primaryCategoryId thay đổi, cleanup function sẽ chạy trước khi effect chính chạy với giá trị primaryCategoryId mới
  //   React.useEffect(() => {
  //   return () => {
  //   }
  // }, [primaryCategoryId])

  React.useEffect(() => {
    return () => {
      clearPrimaryCategoryId()
    }
  }, [clearPrimaryCategoryId])

  // Populate form when editing an existing product
  React.useEffect(() => {
    if (!productData) return

    form.reset({
      name: productData.name,
      slug: productData.slug,
      description: productData.description ?? '',
      status: productData.status ?? ProductStatus.PUBLISHED,
      basePrice: Number(productData.basePrice),
      brandId: productData.brandId,
      countryOriginId: productData.countryOriginId,
      // categories, images, variants are handled in their respective sub-components via derived initial data
      images: productData.images?.map((img) => ({
        url: img.url,
        displayOrder: img.displayOrder,
        altText: img.altText ?? undefined
      }))
    })
  }, [productData, form])

  // Set Primary Category in the store based on productData when in edit mode
  React.useEffect(() => {
    if (isEditMode && productData?.categories?.length) {
      const primaryCategory = productData.categories.find((cat) => cat.isPrimary)
      if (primaryCategory) {
        setPrimaryCategoryId(primaryCategory.categoryId)
      }
    }
  }, [isEditMode, productData, setPrimaryCategoryId])

  const handleCreateNewCountry = async () => {
    const result = await dialog.open('upsert-country-of-origin', { countryOfOrigin: null })
    if (result && result.actionType === 'create' && result.data) {
      form.setValue('countryOriginId', result.data.id)
    }
  }

  const handleCreateNewBrand = async () => {
    const result = await dialog.open('upsert-brand', { brand: null })
    if (result && result.actionType === 'create' && result.data) {
      form.setValue('brandId', result.data.id)
    } else {
    }
  }

  const onSubmit = async (data: UpsertProductFormValues) => {
    try {
      if (isEditMode) {
        // ── Image diff ──────────────────────────────────────────────────────
        const existingImages = productData?.images ?? []
        const formImages = data.images ?? []
        const imageUpdates: UpdateProductImageDto[] = [
          ...formImages.map((formImg) => {
            const existing = existingImages.find((e) => e.url === formImg.url)
            if (existing) {
              // Update images
              return {
                id: existing.id,
                url: formImg.url,
                displayOrder: formImg.displayOrder,
                altText: formImg.altText
              }
            }
            // Create new images
            return {
              url: formImg.url,
              displayOrder: formImg.displayOrder,
              altText: formImg.altText
            }
          }),
          // Deleted images
          ...existingImages
            .filter((e) => !formImages.some((f) => f.url === e.url))
            .map((e) => ({ id: e.id, _delete: true as const }))
        ]

        // ── Category diff ────────────────────────────────────────────────────
        const existingCategories = productData?.categories ?? []
        const formCategories = data.categories ?? []
        const categoryUpdates: UpdateProductCategoryDto[] = [
          ...formCategories.map((formCat) => ({
            categoryId: formCat.categoryId,
            isPrimary: formCat.isPrimary
          })),
          // Deleted categories
          ...existingCategories
            .filter((e) => !formCategories.some((f) => f.categoryId === e.categoryId))
            .map((e) => ({ categoryId: e.categoryId, _delete: true as const }))
        ]

        // ── Variant diff ─────────────────────────────────────────────────────
        // data.variants carries id for existing variants (from the schema) and no id for new ones

        const formVariants = data.variants ?? []
        const existingVariantIds = new Set((productData?.variants ?? []).map((v) => v.id))
        const presentVariantIds = new Set(
          formVariants.filter((v) => v.id).map((v) => v.id as string)
        )
        const variantUpdates: UpdateProductVariantDto[] = [
          ...formVariants.map((v) => {
            const updateEntry: UpdateProductVariantDto = {
              id: v.id, // can be undefined for new variants, which signals the backend to create instead of update
              name: v.name,
              barcode: v.barcode,
              costPrice: v.costPrice,
              sellingPrice: v.sellingPrice,
              stockOnHand: v.stockOnHand,
              imageUrl: v.imageUrl,
              lowStockThreshold: v.lowStockThreshold,
              maxStockThreshold: v.maxStockThreshold,
              isActive: v.isActive
            }

            const existingAttributeValueIds = new Set(
              productData?.variants
                ?.find((variant) => variant.id === v.id)
                ?.attributeValues?.map((av) => av.attributeValueId) ?? []
            )
            const formAttributeValueIds = new Set(
              v.attributeValues?.map((av) => av.attributeValueId)
            )

            // Always send attribute values for existing variants (with id - Update Mode)  to handle updates, additions, and deletions of attribute values in the backend.
            updateEntry.attributeValues = [
              ...v.attributeValues.map((attrVal) => ({
                // id: variant_attribute_value id is needed for updates -> We cannot update, we only can delete by id or delete by attributeValueId, and create new (add new association) ones (relationships between variant and attribute values)
                // So for updates, we need the id to identify which association to delete if it's marked for deletion. For additions, we just create new associations without needing an id.
                // NOTE: but since the form doesn't currently capture it, we will handle it in the backend by matching on variantId + attributeValueId
                // Or if we can capture the id in the form, that would be more straightforward for updates and deletes
                attributeValueId: attrVal.attributeValueId,
                value: attrVal.value
              })),
              // For existing variants that don't have changes to attribute values
              // we still need to send the existing attribute values to prevent them
              // from being deleted in the backend.
              // => So we set it to the existing attribute values from productData
              // if it's an existing variant without changes to attribute values.

              // Deleted attribute values
              // We can only mark for deletion by attributeValueId because we don't have the id of the variant_attribute_value record in the form (since it's not captured). So in the backend, if we see _delete: true with an attributeValueId, we will delete that association for that variant.
              // So here we identify deleted attribute values by comparing existing ones in productData with the ones submitted in the form. If an existing attribute value is not present in the form submission for that variant, we mark it for deletion.
              ...[...existingAttributeValueIds]
                .filter((id) => !formAttributeValueIds.has(id))
                .map((id) => ({ attributeValueId: id, _delete: true as const }))
            ]

            return updateEntry
          }),
          // Delete variants that were removed by the user
          ...[...existingVariantIds]
            .filter((id) => !presentVariantIds.has(id))
            .map((id) => ({ id, _delete: true as const }))
        ]

        const updatePayload: UpdateProductDto = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          status: data.status,
          basePrice: data.basePrice,
          brandId: data.brandId,
          countryOriginId: data.countryOriginId,
          categories: categoryUpdates,
          images: imageUpdates.length > 0 ? imageUpdates : undefined,
          variants: variantUpdates.length > 0 ? variantUpdates : undefined
        }

        await updateProductMutation.mutateAsync({ id: productId, data: updatePayload })
      } else {
        await createProductMutation.mutateAsync(data)
      }
      toast.success(`Sản phẩm đã được ${isEditMode ? 'cập nhật' : 'tạo'} thành công!`)
      router.push(ROUTES.ADMIN.PRODUCT.HOME)
    } catch (error) {
      handleApiError(error, form)
    }
  }

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors)
    toast.error(errors.message || 'Vui lòng kiểm tra lại thông tin đã nhập.')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className='pb-10'>
      <ReturnBack />
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-9'>
          <TypographyH3>Sản phẩm</TypographyH3>
          <Card className='mt-4 min-h-[75vh]'>
            <CardContent className='flex flex-col gap-y-4'>
              {/* Product name */}
              <div className='grid grid-cols-1 gap-x-4 md:grid-cols-3 lg:grid-cols-5'>
                <div className='md:col-span-2 lg:col-span-3'>
                  {/* <Controller
                    name='name'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='product_title'>
                          <TypographyMuted>Tiêu đề</TypographyMuted>
                        </FieldLabel>
                        <Input
                          id='product_title'
                          type='text'
                          autoFocus
                          placeholder='Nhập tiêu đề...'
                          {...field}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  /> */}

                  <Field data-invalid={!!form.formState.errors.name}>
                    <FieldLabel htmlFor='product_title'>
                      <TypographyMuted>Tiêu đề</TypographyMuted>
                    </FieldLabel>

                    <Input
                      id='product_title'
                      type='text'
                      autoFocus
                      placeholder='Nhập tiêu đề...'
                      {...form.register('name')}
                    />

                    {form.formState.errors.name && (
                      <FieldError errors={[form.formState.errors.name]} />
                    )}
                  </Field>
                </div>
                <div className='md:col-span-1 lg:col-span-2'>
                  {/* Code */}
                  <div className='flex items-end gap-x-2'>
                    <Controller
                      name='code'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor='base_price'>
                            <TypographyMuted>Mã sản phẩm</TypographyMuted>
                          </FieldLabel>
                          <Input
                            placeholder='Nhập mã sản phẩm'
                            value={field.value}
                            defaultValue={
                              form.getValues('name')
                                ? generateProductCode(form.getValues('name'))
                                : ''
                            }
                            onChange={field.onChange}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Button
                      variant={'outline'}
                      className='bg-gray-200 hover:bg-gray-200/90'
                      onClick={() => {
                        const generatedCode = generateProductCode(form.getValues('name'))
                        form.setValue('code', generatedCode)
                      }}
                      type='button'
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <Controller
                name='description'
                control={form.control}
                render={({ field }) => {
                  return (
                    <Field className='gap-0'>
                      <FieldLabel className='mb-3'>
                        <TypographyMuted>Mô tả</TypographyMuted>
                      </FieldLabel>
                      <RichTextEditor
                        defaultValue={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder='Nhập mô tả sản phẩm...'
                      />
                    </Field>
                  )
                }}
              />

              {/* Product Images */}
              <Controller
                name='images'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <UploadProductImages
                      // maxFiles={10}
                      onChange={field.onChange}
                      error={fieldState.error}
                      initialImages={initialImages}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          <Card className='mt-4'>
            <CardContent className='flex flex-col gap-y-4'>
              <Controller
                name='categories'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='category' className='flex justify-between'>
                      <TypographyMuted>Danh mục</TypographyMuted>
                    </FieldLabel>
                    <CategorySelection
                      multiSelect
                      onChange={field.onChange}
                      error={fieldState.error}
                      initialSelectedParentCategoryIds={initialCategoryIds}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          <Card className='mt-4'>
            <CardContent className='flex flex-col gap-y-4'>
              {/* Product Variants   */}
              <Controller
                name='variants'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ProductVariantsForm
                      productCode={form.getValues('code') ?? undefined}
                      // productVariantList={initialVariants.length > 0 ? initialVariants : undefined}
                      // attrbutes={initialAttributes.length > 0 ? initialAttributes : undefined}
                      productVariantList={initialVariants}
                      attrbutes={initialAttributes}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    {/* {props.error && <FieldError errors={[{ message: 'loc' }]} className='mt-2' />} */}
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className='col-span-3'>
          <div className='sticky top-3'>
            {/* Action buttons */}
            <div className='flex flex-col items-center justify-end gap-x-2 md:flex-row'>
              {isEditMode && (
                <Button type='button' variant={'outline'}>
                  <Eye />
                  View
                </Button>
              )}
              {isEditMode ? (
                <Button
                  type='submit'
                  variant={'blue_gradient'}
                  disabled={isSubmitting}
                  className='min-w-24'
                >
                  <Edit />
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              ) : (
                <Button
                  type='submit'
                  variant={'blue_gradient'}
                  disabled={isSubmitting}
                  className='min-w-24'
                >
                  <Plus />
                  {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
                </Button>
              )}
            </div>

            <Card className='mt-3'>
              <CardContent>
                {/* Status */}
                <Controller
                  name='status'
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ?? ProductStatus.PUBLISHED}
                      className='w-fit'
                      onValueChange={field.onChange}
                    >
                      <FieldLabel className='mb-3'>
                        <TypographyMuted>Trạng thái</TypographyMuted>
                      </FieldLabel>
                      <Field orientation='horizontal'>
                        <RadioGroupItem
                          value={ProductStatus.PUBLISHED}
                          id={ProductStatus.PUBLISHED}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={ProductStatus.PUBLISHED}>Công khai</FieldLabel>
                          <FieldDescription>12 tháng 03, 2026 lúc 22:43</FieldDescription>
                        </FieldContent>
                      </Field>
                      <Field orientation='horizontal'>
                        <RadioGroupItem value={ProductStatus.DRAFT} id={ProductStatus.DRAFT} />
                        <FieldContent>
                          <FieldLabel htmlFor={ProductStatus.DRAFT}>Nháp</FieldLabel>
                        </FieldContent>
                      </Field>
                    </RadioGroup>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='mt-4'>
              <CardContent className='flex flex-col gap-y-4'>
                {/* Base Price */}
                <Controller
                  name='basePrice'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='base_price' className='flex justify-between'>
                        <TypographyMuted>Giá sản phẩm</TypographyMuted>
                      </FieldLabel>
                      <InputNumber
                        placeholder='Nhập giá sản phẩm'
                        className='text-left'
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Select Brand */}
                <Controller
                  name='brandId'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className='flex justify-between'>
                        <TypographyMuted>Thương hiệu</TypographyMuted>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          type='button'
                          onClick={handleCreateNewBrand}
                        >
                          <CirclePlus size={16} />
                        </Button>
                      </FieldLabel>
                      <SelectBrandCombobox value={field.value} onChange={field.onChange} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Select Country of Origin */}
                <Controller
                  name='countryOriginId'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='mt-4'>
                      <FieldLabel className='flex justify-between'>
                        <TypographyMuted>Xuất xứ</TypographyMuted>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          type='button'
                          onClick={handleCreateNewCountry}
                        >
                          <CirclePlus size={16} />
                        </Button>
                      </FieldLabel>
                      <SelectCountryOfOriginCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
