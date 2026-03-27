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
import { Collection } from '@/features/collections/types'
import { ColumnDef } from '@tanstack/react-table'
import {
  Activity,
  Calendar,
  Link2,
  MoreHorizontal,
  SquarePen,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getCollectionColumns = (
  onOpenDrawer?: (row: Collection) => void
): ColumnDef<Collection>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => {
          e.stopPropagation()
        }}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader label='Tên bộ sưu tập' column={column} />,
    cell: ({ row }) => <div className='max-w-75 truncate font-medium'>{row.original.title}</div>,
    meta: {
      label: 'Tên bộ sưu tập',
      placeholder: 'Tìm bộ sưu tập theo tên...',
      variant: 'text',
      icon: Tag
    },
    enableColumnFilter: true
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader label='Slug' column={column} />,
    cell: ({ row }) => <div className='truncate'>{row.original.slug}</div>,
    meta: {
      label: 'Slug',
      placeholder: 'Tìm theo slug...',
      variant: 'text',
      icon: Link2
    }
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader label='Trạng Thái' column={column} />,
    cell: ({ row }) => {
      const isActive = row.original.isActive
      const Icon = isActive ? CheckCircle2 : XCircle

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon size={14} className='mr-1' />
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    meta: {
      label: 'Trạng Thái',
      variant: 'multiSelect',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ],
      icon: Activity
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
      const collection = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button
            variant='ghost'
            onClick={(event) => {
              event.stopPropagation()
              onOpenDrawer?.(collection)
            }}
          >
            <SquarePen className='h-4 w-4' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-8 w-8 p-0'
                onClick={(event) => event.stopPropagation()}
              >
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation()
                  navigator.clipboard.writeText(collection.id)
                  toast.success('Collection ID copied to clipboard')
                }}
              >
                Copy collection ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit collection</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete collection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
