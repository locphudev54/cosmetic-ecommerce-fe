'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getCountryOfOriginColumns } from '@/features/country-of-origin/components/columns'
import {
  useCountriesOfOrigin,
  useDeleteCountryOfOrigin,
  useCountryOfOriginQueryParams
} from '@/features/country-of-origin/hooks'
import { CountryOfOrigin } from '@/features/country-of-origin/types'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialog } from '@/hooks/use-dialog'
import { Plus, Trash2 } from 'lucide-react'

export default function Page() {
  const dialog = useDialog()
  const deleteCountryOfOriginMutation = useDeleteCountryOfOrigin()

  const handleOpenUpsertDialog = React.useCallback(
    (countryOfOrigin: CountryOfOrigin | null) => {
      dialog.open('upsert-country-of-origin', { countryOfOrigin })
    },
    [dialog]
  )

  const handleOpenDeleteDialog = (items: CountryOfOrigin[]) => {
    dialog.open('delete-alert', {
      selectedItems: items,
      entityName: 'xuất xứ',
      deleteMutation: deleteCountryOfOriginMutation,
      getItemName: (item: CountryOfOrigin) => item.name,
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      }
    })
  }

  const memoizedColumns = React.useMemo(
    () => getCountryOfOriginColumns(handleOpenUpsertDialog),
    [handleOpenUpsertDialog]
  )

  const { page, perPage, sorting, search, sortBy, sortOrder } =
    useCountryOfOriginQueryParams(memoizedColumns)

  const { data, isLoading, error } = useCountriesOfOrigin({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search
  })

  const countriesList = data?.data || []

  const { table } = useDataTable({
    data: countriesList,
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
        <TypographyH3>Danh sách xuất xứ</TypographyH3>
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
        <DataTable table={table} onRowClick={handleOpenUpsertDialog}>
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
              onClick={() => handleOpenUpsertDialog(null)}
            >
              <Plus />
              <span>Thêm Xuất Xứ</span>
            </Button>

            <ExportCsvButton
              data={data?.data || []}
              filename='countries-of-origin.csv'
              fields={['id', 'name', 'createdAt']}
              transform={(country) => ({
                ID: country.id,
                Name: country.name
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
