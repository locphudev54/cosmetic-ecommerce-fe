'use client'

import { DeleteAlertDialog } from '@/components/common/delete-alert-dialog'
import type { DeleteAlertDialogData, DialogWrapperProps } from '@/types/dialog.types'

export function DeleteAlertDialogWrapper({
  config,
  onClose
}: DialogWrapperProps<'delete-alert'>) {
  const {
    selectedItems,
    entityName,
    deleteMutation,
    bulkDeleteMutation,
    getItemName,
    onSuccess
  } = config.data as DeleteAlertDialogData

  return (
    <DeleteAlertDialog
      isOpen
      onClose={() => onClose()}
      selectedItems={selectedItems}
      entityName={entityName}
      deleteMutation={deleteMutation}
      bulkDeleteMutation={bulkDeleteMutation}
      getItemName={getItemName}
      onSuccess={() => {
        onSuccess?.()
        onClose({ confirmed: true })
      }}
    />
  )
}
