'use client'

import { useCallback } from 'react'

import { useDialogStore } from '@/stores/dialog-store'
import { dialogRegistry } from '@/components/dialog-manager/dialog-registry'
import type { DialogResult } from '@/types/dialog.types'

/**
 * Renders all open dialogs from the Zustand stack.
 * Place this once in the root layout / providers.
 */
export function DialogManager() {
  const stack = useDialogStore((s) => s.stack)
  const close = useDialogStore((s) => s.close)

  const handleClose = useCallback(
    (id: string, result?: DialogResult) => {
      close(id, result)
    },
    [close]
  )

  return (
    <>
      {stack.map((config) => {
        const Component = dialogRegistry[config.dialogId]

        if (!Component) {
          console.warn(`[DialogManager] No component registered for dialogId: "${config.dialogId}"`)
          return null
        }

        return (
          <Component
            key={config.id}
            config={config}
            // onClose={close}
            onClose={(result) => {
              handleClose(config.id, result)
            }}
          />
        )
      })}
    </>
  )
}
