'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/common/date-range-picker'
import { ExportCsvButton } from '@/components/common/export-csv-button'
import { TypographyH3 } from '@/components/common/typography'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/route.constant'
import { columns } from '@/features/orders/components/columns'
import { useOrderQueryParams } from '@/features/orders/hooks/use-order-query-params'
import { useOrders } from '@/features/orders/hooks/use-orders'
import { Order } from '@/features/orders/types/order.types'
import { useDataTable } from '@/hooks/use-data-table'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
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
  } = useOrderQueryParams(memoizedColumns)

  const { data, isLoading, error } = useOrders({
    page,
    limit: perPage,
    sortBy,
    sortOrder,
    status,
    search,
    startDate,
    endDate,
    timezone
  })

  const totalPages = data?.meta && 'totalPages' in data.meta ? data.meta.totalPages : 0

  const { table } = useDataTable({
    data: data?.data || [],
    columns: memoizedColumns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
    initialState: {
      sorting: sorting.length > 0 ? sorting : [{ id: 'createdAt', desc: true }],
      pagination: { pageSize: perPage, pageIndex: page - 1 }
    }
  })

  if (error) {
    throw error
  }

  const handleOnRowClick = (order: Order) => {
    router.push(ROUTES.ADMIN.ORDER.DETAIL(order.id))
  }

  return (
    <div>
      <div className='flex items-start justify-between pb-4'>
        <TypographyH3>Danh sach don hang</TypographyH3>
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
        <DataTable table={table} onRowClick={handleOnRowClick}>
          <DataTableToolbar table={table}>
            <ExportCsvButton
              data={data?.data || []}
              filename='orders.csv'
              fields={['id', 'code', 'status', 'totalPrice', 'paymentMethod', 'createdAt']}
              transform={(order) => ({
                ID: order.id,
                Code: order.code,
                Status: order.status,
                'Total Price': order.totalPrice,
                'Payment Method': order.paymentMethod,
                'Created At': new Date(order.createdAt).toLocaleDateString('vi-VN')
              })}
            />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  )
}
