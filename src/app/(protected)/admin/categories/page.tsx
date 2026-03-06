'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { getColumns } from '@/features/categories/components/columns'
import { UpsertCategoryForm } from '@/features/categories/components/upsert-category-form'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { useCategoryQueryParams } from '@/features/categories/hooks/use-category-query-params'
import { Category } from '@/features/categories/types'
import { useDataTable } from '@/hooks/use-data-table'
import { Plus, Trash2 } from 'lucide-react'

export default function Page() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

  const handleOpenDrawer = (category: Category | null) => {
    setSelectedCategory(category)
    setOpenDrawer(true)
  }

  const memoizedColumns = React.useMemo(() => getColumns(handleOpenDrawer), [])

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

  // If you want to throw the error to be caught by a parent error boundary, you can uncomment this block
  if (error) {
    throw error
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
        <React.Fragment>
          <DataTable table={table} onRowClick={handleOpenDrawer}>
            <DataTableToolbar table={table}>
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                  variant='outline'
                  className='text-xs'
                  onClick={() => {
                    const selectedRows = table.getFilteredSelectedRowModel().rows
                    console.log(
                      'Selected products:',
                      selectedRows.map((row) => row.original)
                    )
                  }}
                >
                  <Trash2 />
                  <span>Xóa</span>({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}

              <Button
                variant={'outline'}
                className='text-xs'
                onClick={() => handleOpenDrawer(null)}
              >
                <Plus />
                <span>Thêm Danh Mục</span>
              </Button>

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

          <Drawer direction='right' open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger></DrawerTrigger>
            <DrawerContent className='w-full max-w-full'>
              <DrawerHeader>
                <DrawerTitle>
                  {selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
                </DrawerTitle>
              </DrawerHeader>
              <div className='px-2'>
                <UpsertCategoryForm
                  category={selectedCategory}
                  onSuccess={() => setOpenDrawer(false)}
                />
              </div>
              {/* <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button className='w-full' variant='outline'>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter> */}
            </DrawerContent>
          </Drawer>
        </React.Fragment>
      )}
    </div>
  )
}
