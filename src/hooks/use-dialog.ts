'use client'

import { useDialogStore } from '@/stores/dialog-store'

/**
 * Ergonomic, type-safe hook for opening / closing dialogs via the Dialog Manager.
 *
 * @example
 * ```tsx
 * const dialog = useDialog()
 *
 * // Fire-and-forget
 * dialog.open('upsert-attribute', { attribute: null })
 *
 * // Await user decision (promise-based)
 * const result = await dialog.open('confirm-action', {
 *   title: 'Xác nhận xóa',
 *   description: 'Bạn chắc chắn muốn xóa?',
 * })
 * if (result.confirmed) { ... }
 * ```
 */
export function useDialog() {
  const open = useDialogStore((s) => s.open)
  const close = useDialogStore((s) => s.close)
  const closeAll = useDialogStore((s) => s.closeAll)
  const isOpen = useDialogStore((s) => s.isOpen)

  return {
    open,
    close,
    closeAll,
    isOpen
  }
}
