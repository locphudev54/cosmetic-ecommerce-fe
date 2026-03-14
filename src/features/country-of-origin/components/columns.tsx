'use client'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
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
import { CountryOfOrigin } from '@/features/country-of-origin/types'
import { ColumnDef } from '@tanstack/react-table'
import { Calendar, Globe, MoreHorizontal, SquarePen } from 'lucide-react'
import { toast } from 'sonner'

const formatDate = (date: string | Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getCountryOfOriginColumns = (
  onOpenDrawer: (row: CountryOfOrigin) => void
): ColumnDef<CountryOfOrigin>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader label='Tên Xuất Xứ' column={column} />,
    cell: ({ row }) => <div className='max-w-75 truncate font-medium'>{row.original.name}</div>,
    meta: {
      label: 'Tên Xuất Xứ',
      placeholder: 'Tìm xuất xứ theo tên...',
      variant: 'text',
      icon: Globe
    },
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader label='Ngày Tạo' column={column} />,
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
    meta: {
      label: 'Ngày Tạo',
      variant: 'date',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const country = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button variant='ghost' onClick={() => onOpenDrawer(country)}>
            <SquarePen className='h-4 w-4' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(country.id)
                  toast.success('Country of Origin ID copied to clipboard')
                }}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
