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
import { cn } from '@/lib/utils'
import type { DialogWrapperProps } from '@/types/dialog.types'

export function ConfirmActionDialog({ config, onClose }: DialogWrapperProps<'confirm-action'>) {
  const {
    title,
    description,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    variant = 'default'
  } = config.data

  return (
    <AlertDialog open onOpenChange={() => onClose({ confirmed: false })}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='cursor-pointer'
            onClick={() => onClose({ confirmed: false })}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => onClose({ confirmed: true })}
            className={
              cn(
                'cursor-pointer',
                variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : ''
              ) || undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
