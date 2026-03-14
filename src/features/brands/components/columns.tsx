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
import { Brand } from '@/features/brands/types'
import { ColumnDef } from '@tanstack/react-table'
import { Calendar, MoreHorizontal, Package, SquarePen } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

const formatDate = (date: string | Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getBrandColumns = (onOpenDrawer: (row: Brand) => void): ColumnDef<Brand>[] => [
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
    header: ({ column }) => <DataTableColumnHeader label='Tên Thương Hiệu' column={column} />,
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.imageUrl && (
          <Image
            src={row.original.imageUrl}
            alt={row.original.name}
            width={32}
            height={32}
            className='rounded object-contain'
          />
        )}
        <span className='max-w-75 truncate font-medium'>{row.original.name}</span>
      </div>
    ),
    meta: {
      label: 'Tên Thương Hiệu',
      placeholder: 'Tìm thương hiệu theo tên...',
      variant: 'text',
      icon: Package
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
      const brand = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button variant='ghost' onClick={() => onOpenDrawer(brand)}>
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
                  navigator.clipboard.writeText(brand.id)
                  toast.success('Brand ID copied to clipboard')
                }}
              >
                Copy brand ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit brand</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete brand</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
