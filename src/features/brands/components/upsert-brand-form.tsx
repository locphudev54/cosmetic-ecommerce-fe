'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useCreateBrand, useUpdateBrand } from '@/features/brands/hooks'
import { UpsertBrandFormValues, createAndUpdateBrandSchema } from '@/features/brands/schemas'
import { Brand } from '@/features/brands/types'
import { handleApiError } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertBrandFormProps {
  onSuccess?: (upsertResult: Brand) => void
  brand?: Brand | null
}

export function UpsertBrandForm({ onSuccess, brand }: UpsertBrandFormProps) {
  const form = useForm<UpsertBrandFormValues>({
    resolver: zodResolver(createAndUpdateBrandSchema),
    defaultValues: brand
      ? {
          name: brand.name,
          imageUrl: brand.imageUrl ?? ''
        }
      : {
          name: '',
          imageUrl: ''
        }
  })

  const createBrandMutation = useCreateBrand()
  const updateBrandMutation = useUpdateBrand()
  const isSubmitting = createBrandMutation.isPending || updateBrandMutation.isPending

  const onSubmit = async (data: UpsertBrandFormValues) => {
    try {
      const payload = {
        name: data.name,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {})
      }

      let upsertResult: Brand | undefined = undefined

      if (brand) {
        upsertResult = await updateBrandMutation.mutateAsync({ id: brand.id, data: payload })
        toast.success('Thương hiệu đã được cập nhật thành công!')
      } else {
        upsertResult = await createBrandMutation.mutateAsync(payload)
        toast.success('Thương hiệu đã được tạo thành công!')
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
            <FieldLabel htmlFor='brand_name'>
              <TypographyMuted>
                Tên <span className='text-destructive'>(*)</span>
              </TypographyMuted>
            </FieldLabel>
            <Input
              disabled={isSubmitting}
              autoFocus
              id='brand_name'
              type='text'
              placeholder='Nhập tên thương hiệu...'
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Image URL */}
      <Controller
        name='imageUrl'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='brand_image_url'>
              <TypographyMuted>URL Logo</TypographyMuted>
            </FieldLabel>
            <Input
              disabled={isSubmitting}
              id='brand_image_url'
              type='text'
              placeholder='Nhập URL logo thương hiệu...'
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : brand ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  )
}
