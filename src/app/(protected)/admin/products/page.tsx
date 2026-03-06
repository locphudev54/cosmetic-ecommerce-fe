'use client'

import * as React from 'react'

import { TypographyH3 } from '@/components/common/typography'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/route.constant'
import { columns } from '@/features/product/components/columns'
import { useProducts } from '@/features/product/hooks/use-products'
import { useProductQueryParams } from '@/features/product/hooks/use-product-query-params'
import { useDataTable } from '@/hooks/use-data-table'
import { Plus, Trash, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/common/date-range-picker'

export default function Page() {
  const memoizedColumns = React.useMemo(() => columns, [])

  const {
    page,
    perPage,
    sorting,
    status,
    search,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    timezone
  } = useProductQueryParams(memoizedColumns)

  const { data, isLoading, error } = useProducts({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    search,
    status,
    startDate,
    endDate,
    timezone
  })

  const { table } = useDataTable({
    data: data?.data || [],
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

  // If you want to handle the error locally in this component, you can use this block
  // if (error) {
  //   return (
  //     <div className='flex h-screen items-center justify-center'>
  //       <Card className='w-full max-w-md'>
  //         <CardHeader>
  //           <CardTitle>Error</CardTitle>
  //           <CardDescription>Failed to load products</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <p className='text-muted-foreground text-sm'>
  //             {error instanceof Error ? error.message : 'An unknown error occurred'}
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div>
      <div className='flex items-start justify-between pb-4'>
        <TypographyH3>Danh sách sản phẩm</TypographyH3>
        <div className='flex flex-col items-end gap-4'>
          <Link href={ROUTES.ADMIN.PRODUCT.NEW}>
            <Button variant={'blue_gradient'}>
              <span>Thêm sản phẩm</span>
              <Plus />
            </Button>
          </Link>
          <DateRangePicker align='end' locale='vi' className='font-medium' />
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full bg-white' />
          <Skeleton className='h-[500px] w-full bg-white' />
        </div>
      ) : (
        <DataTable table={table}>
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
            <ExportCsvButton
              data={data?.data || []}
              filename='products.csv'
              // headers={['ID', 'Name', 'Slug', 'Status', 'Base Price', 'Created At']}
              fields={['id', 'name', 'slug', 'status', 'basePrice', 'createdAt']}
              transform={(product) => ({
                ID: product.id,
                Name: product.name,
                Slug: product.slug,
                Status: product.status,
                'Base Price': product.basePrice,
                'Created At': new Date(product.createdAt).toLocaleDateString()
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
