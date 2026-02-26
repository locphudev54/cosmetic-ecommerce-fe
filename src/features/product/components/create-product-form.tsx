'use client'
import ReturnBack from '@/components/common/return-back'
import { TypographyH3, TypographyMuted, TypographyP } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductVariantsForm, UploadProductImages } from '@/features/product/components'
import {
  CreateProductFormValues,
  createProductSchema
} from '@/features/product/schemas/product.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Controller, useForm } from 'react-hook-form'

const RichTextEditor = dynamic(() => import('@/components/common/rich-text-editor'), {
  ssr: false,
  loading: () => <Skeleton className='h-70 w-full' />
})

export default function CreateProductForm() {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const onSubmit = (data: CreateProductFormValues) => {
    console.log({ data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log({ error }))}>
      <ReturnBack />
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-9'>
          <TypographyH3>Sản phẩm</TypographyH3>
          <Card className='mt-4'>
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

              {/* Product Variants   */}
              <Field>
                <ProductVariantsForm />
              </Field>
            </CardContent>
          </Card>
        </div>
        <div className='col-span-3'>
          <div className='sticky top-3'>
            {/* Action buttons */}
            <div className='inline-flex items-center justify-center gap-x-2'>
              <Button type='button' variant={'outline'}>
                <Eye />
                View
              </Button>
              <Button type='submit' variant={'blue_gradient'}>
                Cập nhật
              </Button>
            </div>

            <Card className='mt-3'>
              <CardContent>
                <TypographyP>Loc 02 23</TypographyP>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
