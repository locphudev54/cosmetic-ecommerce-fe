import { UseMutationResult } from '@tanstack/react-query'

import { Attribute } from '@/features/attributes/types'

// ─── Dialog IDs ──────────────────────────────────────────────────────────────
export type DialogId = 'upsert-attribute' | 'delete-alert' | 'confirm-action'

// ─── Per-Dialog Data Maps ────────────────────────────────────────────────────
export interface UpsertAttributeDialogData {
  attribute: Attribute | null
}

export interface DeleteAlertDialogData<T = any> {
  selectedItems: T[]
  entityName: string
  deleteMutation?: UseMutationResult<void, Error, string>
  bulkDeleteMutation?: UseMutationResult<void, Error, string[]>
  getItemName?: (item: T) => string
  onSuccess?: () => void
}

export interface ConfirmActionDialogData {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
}

// ─── Registry Map (DialogId → Data type) ─────────────────────────────────────
export interface DialogRegistryMap {
  'upsert-attribute': UpsertAttributeDialogData
  'delete-alert': DeleteAlertDialogData
  'confirm-action': ConfirmActionDialogData
}

// ─── Dialog Result Map (DialogId → Result type) ──────────────────────────────
export interface DialogResultMap {
  'upsert-attribute': { data: Attribute; actionType: 'create' | 'update' }
  'delete-alert': { confirmed: boolean }
  'confirm-action': { confirmed: boolean }
}

// ─── Dialog Meta ─────────────────────────────────────────────────────────────
export interface DialogMeta {
  className?: string
  title?: string
  description?: string
}

// ─── Dialog Result ───────────────────────────────────────────────────────────
export type DialogResult<TId extends DialogId = DialogId> = DialogResultMap[TId]

// ─── Dialog Config (one item in the stack) ───────────────────────────────────
export interface DialogConfig<TId extends DialogId = DialogId> {
  /** Unique instance id (auto-generated) */
  id: string
  /** Which dialog type to render */
  dialogId: TId
  /** Data passed to the dialog component */
  data: DialogRegistryMap[TId]
  /** Optional metadata */
  meta?: DialogMeta
  /** @internal – resolve fn for promise-based API */
  _resolve?: (result: any) => void
  /** @internal – reject fn for promise-based API */
  _reject?: (reason?: unknown) => void
}

// ─── Wrapper component props ─────────────────────────────────────────────────
export interface DialogWrapperProps<TId extends DialogId = DialogId> {
  config: DialogConfig<TId>
  onClose: (result?: DialogResult<TId>) => void
}
