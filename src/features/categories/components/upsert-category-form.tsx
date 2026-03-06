'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCategory, useUpdateCategory } from '@/features/categories/hooks'
import { UpsertCategoryFormValues, createCategorySchema } from '@/features/categories/schemas'
import { Category } from '@/features/categories/types'
import CategorySelection from '@/features/product/components/category-selection'
import { ApiError } from '@/types'
import { slugifyString } from '@/utilts/client.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertCategoryFormProps {
  onSuccess?: () => void
  category?: Category | null
}

export function UpsertCategoryForm({ onSuccess, category }: UpsertCategoryFormProps) {
  const form = useForm<UpsertCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: category ?? {
      name: '',
      slug: '',
      description: '',
      parentId: undefined,
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    }
  })

  const createCategoryMutation = useCreateCategory()
  const updateCaegoryMutation = useUpdateCategory()

  const parentIdValue = form.watch('parentId')
  const initialParentIds = React.useMemo(
    () => (parentIdValue ? [parentIdValue] : []),
    [parentIdValue]
  )

  const handleGenerateSlug = () => {
    const name = form.getValues('name')
    if (name) {
      const slug = slugifyString(name)
      form.setValue('slug', slug)
    }
  }

  const onSubmit = async (data: UpsertCategoryFormValues) => {
    try {
      if (category) {
        await updateCaegoryMutation.mutateAsync({ id: category.id, data })
        toast.success('Danh mục đã được cập nhật thành công!')
      } else {
        await createCategoryMutation.mutateAsync(data)
        toast.success('Danh mục đã được tạo thành công!')
      }

      form.reset()
      onSuccess?.()
    } catch (error: ApiError | unknown) {
      toast.error(error instanceof ApiError ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, console.error)} className='space-y-4'>
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

      {/* Slug */}
      <Controller
        name='slug'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='category_slug'>
              <TypographyMuted>Slug *</TypographyMuted>
            </FieldLabel>
            <div className='flex items-center gap-x-2'>
              <Input id='category_slug' type='text' placeholder='Nhập slug' {...field} />
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
              id='category_description'
              placeholder='Nhập mô tả danh mục...'
              rows={3}
              {...field}
            />
          </Field>
        )}
      />

      {/* 
      <Controller
        name='parentId'
        control={form.control}
        render={({ field }) => (
          <CategorySelection
            initialSelectedCategoryIds={field.value ? [field.value] : []}
            onSelectionChange={field.onChange}
          />
        )}
      /> */}

      <Controller
        name='parentId'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor='parentId'>
              <TypographyMuted>Danh mục cha</TypographyMuted>
            </FieldLabel>
            <CategorySelection
              initialParentCategoryIds={initialParentIds}
              onSelectionChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Is Active */}
      <Controller
        name='isActive'
        control={form.control}
        render={({ field }) => (
          <Field>
            <div className='flex items-center space-x-2'>
              <Switch id='category_active' checked={field.value} onCheckedChange={field.onChange} />
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

      <div className='flex justify-end space-x-2 pt-4'>
        {category ? (
          <Button type='submit' disabled={createCategoryMutation.isPending} className='min-w-24'>
            {createCategoryMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        ) : (
          <Button type='submit' disabled={createCategoryMutation.isPending} className='min-w-24'>
            {createCategoryMutation.isPending ? 'Đang tạo...' : 'Tạo mới'}
          </Button>
        )}
      </div>
    </form>
  )
}
