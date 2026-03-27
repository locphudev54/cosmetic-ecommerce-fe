'use client'

import { AdvancedSearchBar } from '@/components/common/advanced-search-bar'
import { ImageUploadButton } from '@/components/common/image-upload-button'
import ReturnBack from '@/components/common/return-back'
import { TypographyH3, TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/route.constant'
import { CollectionType } from '@/enums'
import {
  useCollection,
  useCreateCollection,
  useUpdateCollection
} from '@/features/collections/hooks'
import { UpsertCollectionFormValues, upsertCollectionSchema } from '@/features/collections/schemas'
import CategorySelection from '@/features/product/components/category-selection'
import VerticallySortableProductList from '@/features/product/components/vertically-sortable-product-list'
import { useProducts } from '@/features/product/hooks'
import { productService } from '@/features/product/services'
import { PartialProduct, Product } from '@/features/product/types'
import { useUploadSingleImage } from '@/features/upload/hooks/use-upload'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { useDialog } from '@/hooks/use-dialog'
import { handleApiError } from '@/lib/utils'
import { slugifyString } from '@/utilts/client.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Eye, Plus, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertCollectionFormProps {
  collectionId?: string
}

export default function UpsertCollectionForm({ collectionId }: UpsertCollectionFormProps) {
  const router = useRouter()
  const dialog = useDialog()

  // local state
  const [collectionType, setCollectionType] = React.useState<CollectionType>(CollectionType.MANUAL)
  const [selectedProducts, setSelectedProducts] = React.useState<PartialProduct[]>([])
  const [collectionThumbnailFile, setCollectionThumbnailFile] = React.useState<File | null>(null)

  const form = useForm<UpsertCollectionFormValues>({
    resolver: zodResolver(upsertCollectionSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      imageUrl: undefined,
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    }
  })

  const { data: collectionData, error } = useCollection(collectionId)
  const initialCategoryIds = React.useMemo(
    () => (collectionData?.categories || []).map((c) => c.categoryId),
    [collectionData]
  )

  const createCollectionMutation = useCreateCollection()
  const updateCollectionMutation = useUpdateCollection()
  const uploadSingleImageMutation = useUploadSingleImage()
  const isSubmitting = createCollectionMutation.isPending || updateCollectionMutation.isPending

  React.useEffect(() => {
    if (collectionData) {
      form.reset({
        title: collectionData.title,
        slug: collectionData.slug,
        description: collectionData.description || '',
        imageUrl: collectionData.imageUrl || undefined,
        isActive: collectionData.isActive,
        metaTitle: collectionData.metaTitle || '',
        metaDescription: collectionData.metaDescription || '',
        products: collectionData.products?.map((p) => ({
          productId: p.product.id,
          displayOrder: p.displayOrder
        }))
      })

      if (collectionData.products?.length) {
        // sync initial product list to the state for the drag-and-drop list component
        const initialProducts: PartialProduct[] = collectionData.products.map((p) => ({
          id: p.product.id,
          basePrice: p.product.basePrice,
          images: p.product.images,
          name: p.product.name,
          slug: p.product.slug,
          status: p.product.status
        }))
        setSelectedProducts(initialProducts)
      }
    }
  }, [collectionData, form])

  const handleGenerateSlug = () => {
    const title = form.getValues('title')
    if (title) {
      form.setValue('slug', slugifyString(title))
    }
  }

  const handleBrowseProducts = async () => {
    const selectedProductIds = form.getValues('products')?.map((p) => p.productId) || []
    const result = await dialog.open('browse-products', { selectedProductIds })

    if (result && result.data.length > 0) {
      const selectedProducts = result.data

      setSelectedProducts(
        selectedProducts.map((p: Product) => ({
          id: p.id,
          basePrice: +p.basePrice,
          images: (p.images || []).map((img) => ({ url: img.url, alt: img.altText || '' })),
          name: p.name,
          slug: p.slug,
          status: p.status
        }))
      )

      form.setValue(
        'products',
        selectedProducts.map((p: Product, index: number) => ({
          productId: p.id,
          displayOrder: index + 1
        }))
      )
    }
  }

  const handleChangeCollectionType = (value: string) => {
    setCollectionType(value as CollectionType)
  }

  const handleFileChange = (files: File[]) => {
    const file = files[0]
    setCollectionThumbnailFile(file)
  }

  const handleDragProducts = (sortedProducts: PartialProduct[]) => {
    setSelectedProducts(sortedProducts)
    form.setValue(
      'products',
      sortedProducts.map((p: PartialProduct, index: number) => ({
        productId: p.id,
        displayOrder: index + 1
      }))
    )
  }

  const fetchAndSetProductsByCategoryIds = useDebouncedCallback(async (categoryIds: string[]) => {
    if (categoryIds.length === 0) {
      setSelectedProducts([])
      form.setValue('products', [])
      return
    }

    const { data: products } = await productService.getProductsOffset({ categoryIds, limit: 100 }) // TODO: handle pagination if there are more than 100 products

    const newSelectedProducts: PartialProduct[] = products.map((p) => ({
      id: p.id,
      basePrice: +p.basePrice,
      images: (p.images || []).map((img) => ({ url: img.url, alt: img.altText || '' })),
      name: p.name,
      slug: p.slug,
      status: p.status
    }))

    const currentProductIdsInForm = form.getValues('products')?.map((p) => p.productId) || []

    const hasIncluedAllProductsInForm =
      currentProductIdsInForm.length > 0 &&
      currentProductIdsInForm.every((currentProductId) =>
        newSelectedProducts.some((newProduct) => newProduct.id === currentProductId)
      )

    if (hasIncluedAllProductsInForm) {
      toast('Các sản phẩm trong bộ sưu tập đã được cập nhật dựa trên danh mục đã chọn.', {
        icon: <Zap />
      })
      return
    }

    setSelectedProducts(newSelectedProducts)
    form.setValue(
      'products',
      newSelectedProducts.map((p: PartialProduct, index: number) => ({
        productId: p.id,
        displayOrder: index + 1
      }))
    )
  }, 800)

  const handleSelectCategories = React.useCallback(
    async (categories: Array<{ categoryId: string; isPrimary: boolean }>) => {
      const categoryIds = categories.map((c) => c.categoryId)
      fetchAndSetProductsByCategoryIds(categoryIds)
    },
    [fetchAndSetProductsByCategoryIds]
  )

  const onSubmit = async (data: UpsertCollectionFormValues) => {
    try {
      if (collectionThumbnailFile) {
        const uploadResult = await uploadSingleImageMutation.mutateAsync({
          file: collectionThumbnailFile,
          params: { folder: 'collection-thumbnails' }
        })
        data.imageUrl = uploadResult.url
      }

      if (collectionId) {
        await updateCollectionMutation.mutateAsync({ id: collectionId, data })
      } else {
        await createCollectionMutation.mutateAsync(data)
      }
      toast.success(`Bộ sưu tập đã được ${collectionId ? 'cập nhật' : 'tạo'} thành công!`)
      form.reset()
      router.push(ROUTES.ADMIN.COLLECTION.HOME)
    } catch (error) {
      handleApiError(error, form)
    }
  }

  if (error) {
    throw error
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, console.error)} className='pb-10'>
      <ReturnBack />
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-8'>
          <TypographyH3>Bộ sưu tập</TypographyH3>
          <div className='mt-4 flex flex-col gap-y-4'>
            <Card className=''>
              <CardContent className='flex flex-col gap-y-4'>
                <div className='grid grid-cols-1 gap-x-4 md:grid-cols-3 lg:grid-cols-5'>
                  <div className='md:col-span-2 lg:col-span-3'>
                    {/* Title */}
                    <Controller
                      name='title'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor='collection_title'>
                            <TypographyMuted>
                              Tên <span className='text-destructive'>(*)</span>
                            </TypographyMuted>
                          </FieldLabel>
                          <Input
                            autoFocus
                            id='collection_title'
                            type='text'
                            placeholder='Nhập tên bộ sưu tập...'
                            disabled={isSubmitting}
                            {...field}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                  <div className='md:col-span-1 lg:col-span-2'>
                    {/* Slug */}
                    <div className='flex items-end gap-x-2'>
                      <Controller
                        name='slug'
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor='collection_slug'>
                              <TypographyMuted>Slug</TypographyMuted>
                            </FieldLabel>
                            <div className='flex items-center gap-x-2'>
                              <Input
                                id='collection_slug'
                                type='text'
                                placeholder='Nhập slug'
                                disabled={isSubmitting}
                                {...field}
                              />
                              <Button
                                variant={'outline'}
                                className='bg-gray-200 hover:bg-gray-200/90'
                                onClick={handleGenerateSlug}
                                type='button'
                                disabled={isSubmitting}
                              >
                                Generate
                              </Button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Controller
                  name='description'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='collection_description'>
                        <TypographyMuted>Mô tả</TypographyMuted>
                      </FieldLabel>
                      <Textarea
                        className='min-h-48' // 16rem height
                        placeholder='Nhập mô tả bộ sưu tập...'
                        disabled={isSubmitting}
                        {...field}
                      />
                    </Field>
                  )}
                />
              </CardContent>
            </Card>

            {/* Collection Type */}
            <Card>
              <CardContent className='flex flex-col gap-y-4'>
                <RadioGroup
                  value={collectionType}
                  className='w-fit'
                  onValueChange={handleChangeCollectionType}
                >
                  <FieldLabel className='mb-3'>
                    <TypographyMuted>Loại bộ sưu tập</TypographyMuted>
                  </FieldLabel>
                  <Field orientation='horizontal'>
                    <RadioGroupItem value={CollectionType.MANUAL} id={CollectionType.MANUAL} />
                    <FieldContent>
                      <FieldLabel htmlFor={CollectionType.MANUAL}>Thủ công</FieldLabel>
                      <FieldDescription>
                        Thêm sản phẩm vào bộ sưu tập theo cách thủ công
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                  <Field orientation='horizontal'>
                    <RadioGroupItem
                      value={CollectionType.CATEGORY_BASED}
                      id={CollectionType.CATEGORY_BASED}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={CollectionType.CATEGORY_BASED}>
                        Dựa trên danh mục
                      </FieldLabel>
                      <FieldDescription>
                        Những sản phẩm hiện tại và tương lai thuộc một hoặc nhiều danh mục sẽ tự
                        động được tự động thêm vào bộ sưu tập
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </RadioGroup>

                {collectionType === CollectionType.CATEGORY_BASED && (
                  <Field>
                    <FieldLabel htmlFor='category' className='flex justify-between'>
                      <TypographyMuted>Danh mục</TypographyMuted>
                    </FieldLabel>
                    <CategorySelection
                      multiSelect
                      canSelectPrimaryCategory={false}
                      onChange={handleSelectCategories}
                      initialSelectedParentCategoryIds={initialCategoryIds}
                    />
                  </Field>
                )}
              </CardContent>
            </Card>

            {/* Category Selection & Product Browse */}
            <Card className=''>
              <CardContent className='flex flex-col gap-y-4'>
                <Controller
                  name='products'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='category' className='flex justify-between'>
                        <TypographyMuted>Sản phẩm</TypographyMuted>
                      </FieldLabel>
                      <div className='grid grid-cols-5 items-center gap-x-4'>
                        <div className='col-span-3'>
                          <div className='flex items-center justify-between gap-x-2'>
                            <AdvancedSearchBar />
                            <Dialog>
                              <Button
                                type='button'
                                variant='outline'
                                onClick={handleBrowseProducts}
                              >
                                Browse
                              </Button>
                            </Dialog>
                          </div>
                        </div>
                        <div className='col-span-2'>
                          <Select>
                            <SelectTrigger className='w-full max-w-48'>
                              <SelectValue placeholder='Sắp xếp sản phẩm' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='price_asc'>Giá: Thấp đến cao</SelectItem>
                              <SelectItem value='price_desc'>Giá: Cao đến thấp</SelectItem>
                              <SelectItem value='createdAt_desc'>Mới nhất</SelectItem>
                              <SelectItem value='createdAt_asc'>Cũ nhất</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Field>
                  )}
                />

                <Separator />
                {/* Drag-and-Drop Selected Product List Area */}
                <VerticallySortableProductList
                  initialProducts={selectedProducts}
                  onChange={handleDragProducts}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='col-span-4'>
          <div className='sticky top-3'>
            <div className='flex items-center justify-end gap-x-3'>
              {collectionId && collectionData?.slug && (
                <Link href={ROUTES.COLLECTIONS.DETAIL(collectionData.slug)} target='_blank'>
                  <Button type='button' variant={'outline'}>
                    <Eye />
                    View
                  </Button>
                </Link>
              )}

              {collectionId ? (
                <Button type='submit' variant={'blue_gradient'} disabled={isSubmitting}>
                  <Edit />
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              ) : (
                <Button type='submit' variant={'blue_gradient'} disabled={isSubmitting}>
                  <Plus />
                  {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
                </Button>
              )}
            </div>

            <Card className='mt-3'>
              <CardContent className='flex flex-col gap-y-4'>
                <Controller
                  name='isActive'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <div className='flex items-center space-x-2'>
                        <Switch
                          id='collection_active'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor='collection_active'>
                          <TypographyMuted>Kích hoạt</TypographyMuted>
                        </Label>
                      </div>
                    </Field>
                  )}
                />

                <ImageUploadButton
                  className='max-h-40'
                  maxFiles={1}
                  uploadedImageUrls={[form.getValues('imageUrl')].filter(Boolean) as string[]}
                  onChange={handleFileChange}
                  label='Click or drag images here to upload'
                />
              </CardContent>
            </Card>

            <Card className='mt-3'>
              <CardContent className='flex flex-col gap-y-4'>
                <Controller
                  name='metaTitle'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='collection_meta_title'>
                        <TypographyMuted>Meta Title</TypographyMuted>
                      </FieldLabel>
                      <Input
                        id='collection_meta_title'
                        type='text'
                        placeholder='Nhập meta title...'
                        disabled={isSubmitting}
                        {...field}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name='metaDescription'
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='collection_meta_description'>
                        <TypographyMuted>Meta Description</TypographyMuted>
                      </FieldLabel>
                      <Textarea
                        id='collection_meta_description'
                        placeholder='Nhập meta description...'
                        rows={5}
                        disabled={isSubmitting}
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
