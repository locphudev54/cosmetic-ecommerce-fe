'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { handleApiError } from '@/lib/utils'
import { UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteAlertDialogProps<T> {
  isOpen: boolean
  onClose: () => void
  selectedItems: T[]
  entityName: string
  deleteMutation?: UseMutationResult<void, Error, string>
  bulkDeleteMutation?: UseMutationResult<void, Error, string[]>
  getItemName?: (item: T) => string
  onSuccess?: () => void
}

export function DeleteAlertDialog<T>({
  isOpen,
  onClose,
  selectedItems,
  entityName,
  deleteMutation,
  bulkDeleteMutation,
  getItemName,
  onSuccess
}: DeleteAlertDialogProps<T>) {
  const isMultiple = selectedItems.length > 1
  const mutation = isMultiple ? bulkDeleteMutation : deleteMutation

  const handleDelete = async () => {
    if (!mutation) return

    try {
      if (isMultiple && bulkDeleteMutation) {
        const ids = selectedItems.map((item) => (item as any).id)
        await bulkDeleteMutation.mutateAsync(ids)
        toast.success(`Đã xóa ${selectedItems.length} ${entityName} thành công!`)
      } else if (!isMultiple && deleteMutation && selectedItems[0]) {
        const id = (selectedItems[0] as any).id
        await deleteMutation.mutateAsync(id)
        const itemName = getItemName ? getItemName(selectedItems[0]) : entityName
        toast.success(`Đã xóa ${itemName} thành công!`)
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  const getDescription = () => {
    if (isMultiple) {
      return `Bạn có chắc chắn muốn xóa ${selectedItems.length} ${entityName} đã chọn? Hành động này không thể hoàn tác.`
    } else if (selectedItems[0]) {
      const itemName = getItemName
        ? getItemName(selectedItems[0])
        : (selectedItems[0] as any).name || entityName
      return (
        <div>
          Bạn có chắc chắn muốn xóa {entityName} <Badge variant={'warning'}> {itemName}</Badge> ?
          <div>Hành động này không thể hoàn tác.</div>
        </div>
      )
    }
    return `Bạn có chắc chắn muốn xóa ${entityName} này? Hành động này không thể hoàn tác.`
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Xóa {isMultiple ? `${selectedItems.length} ${entityName}` : entityName}
          </AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            variant={'destructive'}
            disabled={mutation?.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer'
          >
            {mutation?.isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
