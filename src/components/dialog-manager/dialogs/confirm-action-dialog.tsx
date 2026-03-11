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
import type { ConfirmActionDialogData, DialogWrapperProps } from '@/types/dialog.types'

export function ConfirmActionDialog({ config, onClose }: DialogWrapperProps<'confirm-action'>) {
  const {
    title,
    description,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    variant = 'default'
  } = config.data as ConfirmActionDialogData

  return (
    <AlertDialog open onOpenChange={() => onClose({ confirmed: false })}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose({ confirmed: false })}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => onClose({ confirmed: true })}
            className={
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
