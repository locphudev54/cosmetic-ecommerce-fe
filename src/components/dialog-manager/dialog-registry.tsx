'use client'

import type { ComponentType } from 'react'

import type { DialogId, DialogWrapperProps } from '@/types/dialog.types'
import { UpsertAttributeDialog } from '@/components/dialog-manager/dialogs/upsert-attribute-dialog'
import { DeleteAlertDialogWrapper } from '@/components/dialog-manager/dialogs/delete-alert-dialog-wrapper'
import { ConfirmActionDialog } from '@/components/dialog-manager/dialogs/confirm-action-dialog'

/**
 * Central mapping from DialogId → wrapper component.
 *
 * To register a new dialog:
 * 1. Add a new entry to the `DialogId` union in `dialog.types.ts`
 * 2. Define the data interface in `DialogRegistryMap`
 * 3. Create a wrapper component in `dialogs/`
 * 4. Add it here
 */

export const dialogRegistry: Record<DialogId, ComponentType<DialogWrapperProps<any>>> = {
  'upsert-attribute': UpsertAttributeDialog,
  'delete-alert': DeleteAlertDialogWrapper,
  'confirm-action': ConfirmActionDialog
}
