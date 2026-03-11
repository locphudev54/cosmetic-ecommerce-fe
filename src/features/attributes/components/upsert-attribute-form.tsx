'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputList
} from '@/components/ui/tags-input'
import { useCreateAttribute, useUpdateAttribute } from '@/features/attributes/hooks'
import {
  UpsertAttributeFormValues,
  createAndUpdateAttributeSchema
} from '@/features/attributes/schemas'
import { Attribute } from '@/features/attributes/types'
import { handleApiError } from '@/lib/utils'
import { slugifyString } from '@/utilts/client.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCcw } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertAttributeFormProps {
  onSuccess?: (upsertResult: Attribute) => void
  attribute?: Attribute | null
}

export function UpsertAttributeForm({ onSuccess, attribute }: UpsertAttributeFormProps) {
  const form = useForm<UpsertAttributeFormValues>({
    resolver: zodResolver(createAndUpdateAttributeSchema),
    defaultValues: attribute
      ? {
          name: attribute.name,
          slug: attribute.slug,
          isGlobalFilter: attribute.isGlobalFilter,
          values: attribute.values.map((v) => v.value)
        }
      : {
          name: '',
          slug: '',
          isGlobalFilter: false,
          values: []
        }
  })

  const createAttributeMutation = useCreateAttribute()
  const updateAttributeMutation = useUpdateAttribute()
  const isSubmitting = createAttributeMutation.isPending || updateAttributeMutation.isPending

  const handleGenerateSlug = () => {
    const name = form.getValues('name')
    if (name) {
      const slug = slugifyString(name)
      form.setValue('slug', slug)
    }
  }

  const onSubmit = async (data: UpsertAttributeFormValues) => {
    try {
      let upsertResult: Attribute | undefined = undefined

      if (attribute) {
        upsertResult = await updateAttributeMutation.mutateAsync({ id: attribute.id, data })
        toast.success('Thuộc tính đã được cập nhật thành công!')
      } else {
        upsertResult = await createAttributeMutation.mutateAsync(data)
        toast.success('Thuộc tính đã được tạo thành công!')
      }

      form.reset()
      onSuccess?.(upsertResult!)
    } catch (error) {
      handleApiError(error, form)
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
            <FieldLabel htmlFor='attribute_name'>
              <TypographyMuted>
                Tên <span className='text-destructive'>(*)</span>
              </TypographyMuted>
            </FieldLabel>
            <Input
              disabled={isSubmitting}
              autoFocus
              id='attribute_name'
              type='text'
              placeholder='Nhập tên thuộc tính...'
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
            <FieldLabel htmlFor='attribute_slug'>
              <TypographyMuted>Slug</TypographyMuted>
            </FieldLabel>
            <div className='flex items-center gap-x-2'>
              <Input
                id='attribute_slug'
                type='text'
                placeholder='Nhập slug'
                {...field}
                disabled={isSubmitting}
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

      {/* Values */}
      <Controller
        name='values'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              <TypographyMuted>
                Giá Trị <span className='text-destructive'>(*)</span>
              </TypographyMuted>
            </FieldLabel>
            <TagsInput
              disabled={isSubmitting}
              value={field.value}
              onValueChange={(values: string[]) => {
                // Delete case
                if (values.length < field.value.length) {
                  field.onChange(values)
                  return
                }

                // Add case - validate duplicate (case-insensitive)
                const recentlyAddedValue = values[values.length - 1]
                if (
                  values
                    .slice(0, -1)
                    .some((v) => v.toLowerCase() === recentlyAddedValue.toLowerCase())
                ) {
                  toast.error('Giá trị đã tồn tại')
                  return
                }

                field.onChange(values)
              }}
              editable
              addOnPaste
              className='w-full'
            >
              <TagsInputList className='custom-scrollbar max-h-30 overflow-y-auto'>
                {field.value.map((value: string) => (
                  <TagsInputItem key={value} value={value}>
                    {value}
                  </TagsInputItem>
                ))}
                <TagsInputInput
                  placeholder={
                    field.value.length === 0 ? 'Nhập giá trị thuộc tính và nhấn enter...' : ''
                  }
                />
              </TagsInputList>
              <TagsInputClear asChild>
                <Button variant='outline' disabled={isSubmitting}>
                  <RefreshCcw className='h-4 w-4' />
                  Xóa tất cả
                </Button>
              </TagsInputClear>
            </TagsInput>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='isGlobalFilter'
        control={form.control}
        render={({ field }) => (
          <Field>
            <div className='flex items-center space-x-2'>
              <Switch
                disabled={isSubmitting}
                id='attribute_global_filter'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor='attribute_global_filter'>
                <TypographyMuted>Hiển thị trên bộ lọc toàn cục (/collections/all)</TypographyMuted>
              </Label>
            </div>
          </Field>
        )}
      />

      <div className='flex justify-end space-x-2 pt-4'>
        {attribute ? (
          <Button type='submit' disabled={updateAttributeMutation.isPending} className='min-w-24'>
            {updateAttributeMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        ) : (
          <Button type='submit' disabled={createAttributeMutation.isPending} className='min-w-24'>
            {createAttributeMutation.isPending ? 'Đang tạo...' : 'Tạo mới'}
          </Button>
        )}
      </div>
    </form>
  )
}
