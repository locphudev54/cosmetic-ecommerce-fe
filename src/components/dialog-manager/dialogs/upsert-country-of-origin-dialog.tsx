'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UpsertCountryOfOriginForm } from '@/features/country-of-origin/components/upsert-country-of-origin-form'
import { CountryOfOrigin } from '@/features/country-of-origin/types/country-of-origin.types'
import type { DialogWrapperProps, UpsertCountryOfOriginDialogData } from '@/types/dialog.types'

export function UpsertCountryOfOriginDialog({
  config,
  onClose
}: DialogWrapperProps<'upsert-country-of-origin'>) {
  const { countryOfOrigin } = config.data as UpsertCountryOfOriginDialogData

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className='max-w-lg' onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{countryOfOrigin ? 'Chỉnh sửa xuất xứ' : 'Thêm mới xuất xứ'}</DialogTitle>
        </DialogHeader>
        <div className='px-2'>
          <UpsertCountryOfOriginForm
            countryOfOrigin={countryOfOrigin}
            onSuccess={(upsertResult: CountryOfOrigin) =>
              onClose({
                data: upsertResult,
                actionType: countryOfOrigin ? 'update' : 'create'
              })
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
