'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/route.constant'
import { getCollectionColumns } from '@/features/collections/components'
import {
  useBulkDeleteCollections,
  useCollectionQueryParams,
  useCollections,
  useDeleteCollection
} from '@/features/collections/hooks'
import { Collection } from '@/features/collections/types'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialog } from '@/hooks/use-dialog'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const dialog = useDialog()
  const router = useRouter()

  const deleteCollectionMutation = useDeleteCollection()
  const bulkDeleteCollectionsMutation = useBulkDeleteCollections()

  const handleOpenDeleteDialog = (items: Collection[]) => {
    dialog.open('delete-alert', {
      selectedItems: items,
      entityName: 'bộ sưu tập',
      deleteMutation: deleteCollectionMutation,
      bulkDeleteMutation: bulkDeleteCollectionsMutation,
      getItemName: (item: Collection) => item.title,
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      }
    })
  }

  const memoizedColumns = React.useMemo(() => getCollectionColumns(), [])

  const {
    page,
    perPage,
    sorting,
    isActive,
    search,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    timezone
  } = useCollectionQueryParams(memoizedColumns)

  const { data, isLoading, error } = useCollections({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search,
    isActive,
    startDate,
    endDate,
    timezone
  })

  const collectionsList = data?.data || []

  const { table } = useDataTable({
    data: collectionsList,
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

  const handleOnRowClick = (collection: Collection) => {
    router.push(ROUTES.ADMIN.COLLECTION.EDIT(collection.id))
  }

  return (
    <div>
      <div className='flex items-start justify-between pb-4'>
        <TypographyH3>Danh sách bộ sưu tập</TypographyH3>
        <div className='flex flex-col items-end gap-4'>
          <Link href={ROUTES.ADMIN.COLLECTION.NEW}>
            <Button variant={'blue_gradient'}>
              <span>Thêm bộ sưu tập</span>
              <Plus />
            </Button>
          </Link>
          <DateRangePicker align='end' locale='vi' className='font-medium' />
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full bg-white' />
          <Skeleton className='h-125 w-full bg-white' />
        </div>
      ) : (
        <DataTable table={table} onRowClick={handleOnRowClick}>
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

            <ExportCsvButton
              data={data?.data || []}
              filename='collections.csv'
              fields={['id', 'title', 'slug', 'isActive', 'createdAt']}
              transform={(collection) => ({
                ID: collection.id,
                Title: collection.title,
                Slug: collection.slug,
                'Is Active': collection.isActive,
                'Created At': new Date(collection.createdAt).toLocaleDateString()
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
