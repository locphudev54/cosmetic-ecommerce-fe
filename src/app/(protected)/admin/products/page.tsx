'use client'

import * as React from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { columns } from '@/features/product/components/columns'
import { useProducts } from '@/features/product/hooks/use-products'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/constants/route.constant'

export default function Page() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1))
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10))

  const { data, isLoading, error } = useProducts({
    page,
    limit: perPage
  })

  const memoizedColumns = React.useMemo(() => columns, [])

  const { table } = useDataTable({
    data: data?.data || [],
    columns: memoizedColumns,
    pageCount: data?.meta?.totalPages ?? 0,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      pagination: { pageSize: perPage, pageIndex: page - 1 }
    }
  })

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center justify-between'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
          <p className='text-muted-foreground'>Manage your products and view their details.</p>
        </div>
        <div>
          <Link href={ROUTES.ADMIN.PRODUCT.NEW}>
            <Button>Create Product</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-100 w-full' />
        </div>
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  )
}
