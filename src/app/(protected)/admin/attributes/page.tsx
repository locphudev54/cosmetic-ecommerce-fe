'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getColumns } from '@/features/attributes/components/columns'
import { useAttributes } from '@/features/attributes/hooks/use-attributes'
import {
  useBulkDeleteAttributes,
  useDeleteAttribute
} from '@/features/attributes/hooks/use-attributes'
import { useAttributeQueryParams } from '@/features/attributes/hooks/use-attribute-query-params'
import { Attribute } from '@/features/attributes/types'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialog } from '@/hooks/use-dialog'
import { Plus, Trash2 } from 'lucide-react'

export default function Page() {
  const dialog = useDialog()

  const deleteAttributeMutation = useDeleteAttribute()
  const bulkDeleteAttributesMutation = useBulkDeleteAttributes()

  const handleOpenDialog = React.useCallback(
    (attribute: Attribute | null) => {
      dialog.open('upsert-attribute', { attribute })
    },
    [dialog]
  )

  const handleOpenDeleteDialog = (items: Attribute[]) => {
    dialog.open('delete-alert', {
      selectedItems: items,
      entityName: 'thuộc tính',
      deleteMutation: deleteAttributeMutation,
      bulkDeleteMutation: bulkDeleteAttributesMutation,
      getItemName: (item: Attribute) => item.name,
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      }
    })
  }

  const memoizedColumns = React.useMemo(() => getColumns(handleOpenDialog), [handleOpenDialog])

  const { page, perPage, sorting, search, sortBy, sortOrder } =
    useAttributeQueryParams(memoizedColumns)

  const { data, isLoading, error } = useAttributes({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search
  })

  const attributesList = data?.data || []

  const { table } = useDataTable({
    data: attributesList,
    columns: memoizedColumns,
    pageCount: data?.meta?.totalPages ?? 0,
    getRowId: (row) => row.id,
    initialState: {
      sorting: sorting.length > 0 ? sorting : [{ id: 'createdAt', desc: true }],
      pagination: { pageSize: perPage, pageIndex: page - 1 }
    }
  })

  if (error) {
    throw error
  }

  return (
    <div>
      <div className='flex items-start justify-between pb-4'>
        <TypographyH3>Danh sách thuộc tính</TypographyH3>
        <div className='flex flex-col items-end gap-4'>
          <DateRangePicker align='end' locale='vi' className='font-medium' />
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full bg-white' />
          <Skeleton className='h-[500px] w-full bg-white' />
        </div>
      ) : (
        <DataTable table={table} onRowClick={handleOpenDialog}>
          <DataTableToolbar table={table}>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant='destructive'
                className='text-sm'
                onClick={() => {
                  const selectedRows = table.getFilteredSelectedRowModel().rows
                  handleOpenDeleteDialog(selectedRows.map((row) => row.original))
                }}
              >
                <Trash2 />
                <span>Xóa</span>({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}

            <Button variant={'outline'} className='text-sm' onClick={() => handleOpenDialog(null)}>
              <Plus />
              <span>Thêm Thuộc Tính</span>
            </Button>

            <ExportCsvButton
              data={data?.data || []}
              filename='attributes.csv'
              fields={['id', 'name', 'slug', 'isGlobalFilter', 'createdAt']}
              transform={(attribute) => ({
                ID: attribute.id,
                Name: attribute.name,
                Slug: attribute.slug,
                'Is Global Filter': attribute.isGlobalFilter,
                Values: attribute.values.map((v) => v.value).join('; '),
                'Created At': new Date(attribute.createdAt).toLocaleDateString()
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
