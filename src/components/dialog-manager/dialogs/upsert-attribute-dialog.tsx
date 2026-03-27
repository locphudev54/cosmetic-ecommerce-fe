'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UpsertAttributeForm } from '@/features/attributes/components/upsert-attribute-form'
import { Attribute } from '@/features/attributes/types/attribute.types'
import type { DialogWrapperProps, UpsertAttributeDialogData } from '@/types/dialog.types'

export function UpsertAttributeDialog({ config, onClose }: DialogWrapperProps<'upsert-attribute'>) {
  const { attribute } = config.data
  // const dialog = useDialog()
  // const deleteAttributeMutation = useDeleteAttribute()

  // const handleDeleteAttribute = async () => {
  //   if (!attribute) return

  //   const result = await dialog.open('confirm-action', {
  //     title: 'Xóa thuộc tính',
  //     description: `Bạn có chắc chắn muốn xóa thuộc tính "${attribute.name}"? Hành động này không thể hoàn tác.`,
  //     confirmLabel: 'Xóa',
  //     cancelLabel: 'Hủy',
  //     variant: 'destructive'
  //   })

  //   if (result && result.confirmed) {
  //     try {
  //       await deleteAttributeMutation.mutateAsync(attribute.id)
  //       onClose()
  //     } catch {
  //       // Error handled by mutation
  //     }
  //   }
  // }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className='max-w-2xl' onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{attribute ? 'Chỉnh sửa thuộc tính' : 'Thêm mới thuộc tính'}</DialogTitle>
        </DialogHeader>
        <div className='px-2'>
          <UpsertAttributeForm
            attribute={attribute}
            onSuccess={(upsertResult: Attribute) =>
              onClose({
                data: upsertResult,
                actionType: attribute ? 'update' : 'create'
              })
            }
          />
        </div>
        {/* {attribute && (
          <DialogFooter>
            <Button
              type='button'
              variant='destructive'
              onClick={handleDeleteAttribute}
              disabled={deleteAttributeMutation.isPending}
            >
              <Trash2 className='mr-1 h-4 w-4' />
              {deleteAttributeMutation.isPending ? 'Đang xóa...' : 'Xóa thuộc tính'}
            </Button>
          </DialogFooter>
        )} */}
      </DialogContent>
    </Dialog>
  )
}
