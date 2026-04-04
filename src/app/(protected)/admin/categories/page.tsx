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
import { getColumns } from '@/features/categories/components/columns'
import {
  useBulkDeleteCategories,
  useCategories,
  useDeleteCategory
} from '@/features/categories/hooks/use-categories'
import { useCategoryQueryParams } from '@/features/categories/hooks/use-category-query-params'
import { Category } from '@/features/categories/types'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialog } from '@/hooks/use-dialog'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const dialog = useDialog()

  const deleteCategoryMutation = useDeleteCategory()
  const bulkDeleteCategoriesMutation = useBulkDeleteCategories()

  const router = useRouter()

  const handleOpenDeleteDialog = (items: Category[]) => {
    dialog.open('delete-alert', {
      selectedItems: items,
      entityName: 'danh mục',
      deleteMutation: deleteCategoryMutation,
      bulkDeleteMutation: bulkDeleteCategoriesMutation,
      getItemName: (item: Category) => item.name,
      onSuccess: () => {
        table.toggleAllRowsSelected(false)
      }
    })
  }

  const memoizedColumns = React.useMemo(() => getColumns(), [])

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
  } = useCategoryQueryParams(memoizedColumns)

  const { data, isLoading, error } = useCategories({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search,
    isDeleted: false,
    isActive,
    startDate,
    endDate,
    timezone,
    includeParent: true,
    includeProductCount: true
  })

  const categoriesList = data?.data || []

  const { table } = useDataTable({
    data: categoriesList,
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

  const handleOnRowClick = (category: Category) => {
    router.push(ROUTES.ADMIN.CATEGORY.EDIT(category.id))
  }

  return (
    <div>
      <div className='flex items-start justify-between pb-4'>
        <TypographyH3>Danh sách danh mục</TypographyH3>
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

            <Link
              href={{
                pathname: ROUTES.ADMIN.CATEGORY.NEW
              }}
            >
              <Button variant={'outline'} className='text-sm'>
                <Plus />
                <span>Thêm Danh Mục</span>
              </Button>
            </Link>

            <ExportCsvButton
              data={data?.data || []}
              filename='categories.csv'
              fields={['id', 'name', 'slug', 'depth', 'isActive', 'productCount', 'createdAt']}
              transform={(category) => ({
                ID: category.id,
                Name: category.name,
                Slug: category.slug,
                Depth: category.depth,
                'Is Active': category.isActive,
                'Product Count': category.productCount || 0,
                'Created At': new Date(category.createdAt).toLocaleDateString()
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
