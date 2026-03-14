'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getBrandColumns } from '@/features/brands/components/columns'
import { useBrands, useDeleteBrand, useBrandQueryParams } from '@/features/brands/hooks'
import { Brand } from '@/features/brands/types'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialog } from '@/hooks/use-dialog'
import { Plus, Trash2 } from 'lucide-react'

export default function Page() {
  const dialog = useDialog()
  const deleteBrandMutation = useDeleteBrand()

  const handleOpenUpsertBrandDialog = React.useCallback(
    (brand: Brand | null) => {
      dialog.open('upsert-brand', { brand })
    },
    [dialog]
  )

  const handleOpenDeleteDialog = (items: Brand[]) => {
    dialog.open('delete-alert', {
      selectedItems: items,
      entityName: 'thương hiệu',
      deleteMutation: deleteBrandMutation,
      getItemName: (item: Brand) => item.name,
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      }
    })
  }

  const memoizedColumns = React.useMemo(
    () => getBrandColumns(handleOpenUpsertBrandDialog),
    [handleOpenUpsertBrandDialog]
  )

  const { page, perPage, sorting, search, sortBy, sortOrder } = useBrandQueryParams(memoizedColumns)

  const { data, isLoading, error } = useBrands({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search
  })

  const brandsList = data?.data || []

  const { table } = useDataTable({
    data: brandsList,
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
        <TypographyH3>Danh sách thương hiệu</TypographyH3>
        <div className='flex flex-col items-end gap-4'>
          <DateRangePicker align='end' locale='vi' className='font-medium' />
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full bg-white' />
          <Skeleton className='h-125 w-full bg-white' />
        </div>
      ) : (
        <DataTable table={table} onRowClick={handleOpenUpsertBrandDialog}>
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

            <Button
              variant={'outline'}
              className='text-sm'
              onClick={() => handleOpenUpsertBrandDialog(null)}
            >
              <Plus />
              <span>Thêm Thương Hiệu</span>
            </Button>

            <ExportCsvButton
              data={data?.data || []}
              filename='brands.csv'
              fields={['id', 'name', 'imageUrl', 'createdAt']}
              transform={(brand) => ({
                ID: brand.id,
                Name: brand.name,
                'Image URL': brand.imageUrl
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
