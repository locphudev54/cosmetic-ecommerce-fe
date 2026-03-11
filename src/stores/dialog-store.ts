import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { nanoid } from 'nanoid'

import type {
  DialogConfig,
  DialogId,
  DialogMeta,
  DialogRegistryMap,
  DialogResult
} from '@/types/dialog.types'

// ─── Store State ─────────────────────────────────────────────────────────────
interface DialogState {
  /** Ordered stack – last item is the top-most dialog */
  stack: DialogConfig[]

  // ── Actions ──────────────────────────────────────────────────────────────
  /**
   * Open a dialog and return a promise that resolves when the dialog closes.
   * Supports dialog stacking – multiple dialogs can be open simultaneously.
   */
  open: <TId extends DialogId>(
    dialogId: TId,
    data: DialogRegistryMap[TId],
    meta?: DialogMeta
  ) => Promise<DialogResult<TId>> | undefined

  /** Close a specific dialog instance by its unique id */
  close: (id: string, result?: DialogResult) => void

  /** Close all open dialogs */
  closeAll: () => void

  /** Update the data for an already-open dialog */
  update: <TId extends DialogId>(id: string, data: Partial<DialogRegistryMap[TId]>) => void

  // ── Selectors ────────────────────────────────────────────────────────────
  /** Get the top-most dialog config */
  getTopDialog: () => DialogConfig | undefined

  /** Check if a specific dialog type is currently open */
  isOpen: (dialogId: DialogId) => boolean

  /** Get a dialog config by its instance id */
  getDialogById: (id: string) => DialogConfig | undefined
}

export const useDialogStore = create<DialogState>()(
  devtools(
    (set, get) => ({
      stack: [],

      open: <TId extends DialogId>(
        dialogId: TId,
        data: DialogRegistryMap[TId],
        meta?: DialogMeta
      ) => {
        return new Promise<DialogResult>((resolve, reject) => {
          const config: DialogConfig<TId> = {
            id: nanoid(),
            dialogId,
            data,
            meta,
            _resolve: resolve,
            _reject: reject
          }

          set(
            (state) => ({ stack: [...state.stack, config as DialogConfig] }),
            undefined,
            `dialog/open:${dialogId}`
          )
        })
      },

      close: (id: string, result?: DialogResult) => {
        const dialog = get().stack.find((d) => d.id === id)

        if (dialog?._resolve) {
          dialog._resolve(result ?? {})
        }

        set(
          (state) => ({ stack: state.stack.filter((d) => d.id !== id) }),
          undefined,
          `dialog/close:${dialog?.dialogId}`
        )
      },

      closeAll: () => {
        const { stack } = get()
        stack.forEach((d) => d._resolve?.({}))
        set({ stack: [] }, undefined, 'dialog/closeAll')
      },

      update: (id, data) => {
        set(
          (state) => ({
            stack: state.stack.map((d) =>
              d.id === id ? { ...d, data: { ...d.data, ...data } } : d
            )
          }),
          undefined,
          'dialog/update'
        )
      },

      // Selectors
      getTopDialog: () => {
        const { stack } = get()
        return stack[stack.length - 1]
      },

      isOpen: (dialogId) => {
        return get().stack.some((d) => d.dialogId === dialogId)
      },

      getDialogById: (id) => {
        return get().stack.find((d) => d.id === id)
      }
    }),
    { name: 'dialog-store' }
  )
)
