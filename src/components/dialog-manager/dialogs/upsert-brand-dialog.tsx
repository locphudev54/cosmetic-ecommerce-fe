'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UpsertBrandForm } from '@/features/brands/components/upsert-brand-form'
import { Brand } from '@/features/brands/types/brand.types'
import type { DialogWrapperProps } from '@/types/dialog.types'

export function UpsertBrandDialog({ config, onClose }: DialogWrapperProps<'upsert-brand'>) {
  const { brand } = config.data

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className='max-w-lg' onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{brand ? 'Chỉnh sửa thương hiệu' : 'Thêm mới thương hiệu'}</DialogTitle>
        </DialogHeader>
        <div className='px-2'>
          <UpsertBrandForm
            brand={brand}
            onSuccess={(upsertResult: Brand) =>
              onClose({
                data: upsertResult,
                actionType: brand ? 'update' : 'create'
              })
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
