'use client'
import ReturnBack from '@/components/common/return-back'
import { TypographyH3, TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductVariantsForm, UploadProductImages } from '@/features/product/components'
import CategorySelection from '@/features/product/components/category-selection'
import {
  UpsertProductFormValues,
  createProductSchema
} from '@/features/product/schemas/product.schemas'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

const RichTextEditor = dynamic(() => import('@/components/common/rich-text-editor'), {
  ssr: false,
  loading: () => <Skeleton className='h-70 w-full' />
})

export default function UpsertProductForm() {
  const clearPrimaryCategoryId = useCategoryTreeStore((state) => state.clearPrimaryCategoryId)

  const form = useForm<UpsertProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

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

  const onSubmit = (data: UpsertProductFormValues) => {
    console.log({ data })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (error) => console.log({ error }))}
      className='pb-10'
    >
      <ReturnBack />
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-9'>
          <TypographyH3>Sản phẩm</TypographyH3>
          <Card className='mt-4 min-h-[75vh]'>
            <CardContent className='flex flex-col gap-y-4'>
              {/* Product name */}
              <Controller
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
              />

              {/* Product Description */}
              <Controller
                name='description'
                control={form.control}
                render={({ field }) => (
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
                )}
              />

              {/* Product Images */}
              <Field>
                <UploadProductImages maxImages={10} />
              </Field>

              <Field>
                <FieldLabel htmlFor='category' className='flex justify-between'>
                  <TypographyMuted>Danh mục</TypographyMuted>
                </FieldLabel>
                <CategorySelection multiSelect />
              </Field>

              {/* Product Variants   */}
              <ProductVariantsForm />
            </CardContent>
          </Card>
        </div>
        <div className='col-span-3'>
          <div className='sticky top-3'>
            {/* Action buttons */}
            <div className='inline-flex flex-col items-center justify-center gap-x-2 md:flex-row'>
              <Button type='button' variant={'outline'}>
                <Eye />
                View
              </Button>
              <Button type='submit' variant={'blue_gradient'}>
                Cập nhật
              </Button>
            </div>

            <Card className='mt-3 min-h-[75vh]'>
              <CardContent>
                {/* Category Selection */}
                kdkdkdk
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
