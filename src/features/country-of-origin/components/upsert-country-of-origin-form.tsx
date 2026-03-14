'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  useCreateCountryOfOrigin,
  useUpdateCountryOfOrigin
} from '@/features/country-of-origin/hooks'
import {
  UpsertCountryOfOriginFormValues,
  createAndUpdateCountryOfOriginSchema
} from '@/features/country-of-origin/schemas'
import { CountryOfOrigin } from '@/features/country-of-origin/types'
import { handleApiError } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpsertCountryOfOriginFormProps {
  onSuccess?: (upsertResult: CountryOfOrigin) => void
  countryOfOrigin?: CountryOfOrigin | null
}

export function UpsertCountryOfOriginForm({
  onSuccess,
  countryOfOrigin
}: UpsertCountryOfOriginFormProps) {
  const form = useForm<UpsertCountryOfOriginFormValues>({
    resolver: zodResolver(createAndUpdateCountryOfOriginSchema),
    defaultValues: countryOfOrigin ? { name: countryOfOrigin.name } : { name: '' }
  })

  const createMutation = useCreateCountryOfOrigin()
  const updateMutation = useUpdateCountryOfOrigin()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (data: UpsertCountryOfOriginFormValues) => {
    try {
      let upsertResult: CountryOfOrigin | undefined = undefined

      if (countryOfOrigin) {
        upsertResult = await updateMutation.mutateAsync({ id: countryOfOrigin.id, data })
        toast.success('Xuất xứ đã được cập nhật thành công!')
      } else {
        upsertResult = await createMutation.mutateAsync(data)
        toast.success('Xuất xứ đã được tạo thành công!')
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
            <FieldLabel htmlFor='country_of_origin_name'>
              <TypographyMuted>
                Tên <span className='text-destructive'>(*)</span>
              </TypographyMuted>
            </FieldLabel>
            <Input
              disabled={isSubmitting}
              autoFocus
              id='country_of_origin_name'
              type='text'
              placeholder='Nhập tên xuất xứ...'
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : countryOfOrigin ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  )
}
