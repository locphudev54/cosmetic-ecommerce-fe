'use client'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Order,
  OrderStatus,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from '@/features/orders/types/order.types'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import { ColumnDef } from '@tanstack/react-table'
import { Calendar, Hash, MoreHorizontal, User } from 'lucide-react'

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PENDING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID]: 'bg-emerald-100 text-emerald-800',
  [OrderStatus.PACKED]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.READY_TO_SHIP]: 'bg-cyan-100 text-cyan-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.RETURNED]: 'bg-orange-100 text-orange-800'
}

const formatDate = (date: string | Date | null) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onClick={(event) => {
          event.stopPropagation()
        }}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(event) => {
          event.stopPropagation()
        }}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader label='Ma don' column={column} />,
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('code') || '—'}</div>,
    meta: {
      label: 'Ma don',
      placeholder: 'Tim theo ma don...',
      variant: 'text',
      icon: Hash
    },
    enableColumnFilter: true
  },
  {
    id: 'customer',
    accessorFn: (row) =>
      row.user?.fullName || row.shippingInfo?.fullName || row.user?.email || row.shippingInfo?.email,
    header: ({ column }) => <DataTableColumnHeader label='Khach hang' column={column} />,
    cell: ({ row }) => {
      const order = row.original
      const name =
        order.user?.fullName ||
        order.shippingInfo?.fullName ||
        order.user?.email ||
        order.shippingInfo?.email ||
        '—'
      return <div className='max-w-60 truncate'>{name}</div>
    },
    meta: {
      label: 'Khach hang',
      variant: 'text',
      icon: User
    },
    enableSorting: false,
    enableColumnFilter: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader label='Trang thai' column={column} />,
    cell: ({ row }) => {
      const status = row.getValue('status') as OrderStatus
      return (
        <Badge variant='secondary' className={`${STATUS_COLORS[status]} border-0`}>
          {ORDER_STATUS_LABELS[status] || status}
        </Badge>
      )
    },
    meta: {
      label: 'Trang thai',
      variant: 'multiSelect',
      options: Object.values(OrderStatus).map((status) => ({
        label: ORDER_STATUS_LABELS[status],
        value: status
      }))
    },
    enableColumnFilter: true
  },
  {
    id: 'paymentMethod',
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader label='Thanh toan' column={column} />,
    cell: ({ row }) => {
      const method = row.getValue('paymentMethod') as Order['paymentMethod']
      return <div>{PAYMENT_METHOD_LABELS[method] || method}</div>
    },
    enableSorting: false
  },
  {
    id: 'totalPrice',
    accessorKey: 'totalPrice',
    header: ({ column }) => <DataTableColumnHeader label='Tong tien' column={column} />,
    cell: ({ row }) => formatNumberToVnCurrency(Number(row.getValue('totalPrice')))
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader label='Ngay tao' column={column} />,
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
    meta: {
      label: 'Ngay tao',
      variant: 'date',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original

      return (
        <div className='flex items-center justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
