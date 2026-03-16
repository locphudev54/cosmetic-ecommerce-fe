'use client'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { BadgeOverflow } from '@/components/ui/badge-overflow'
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
import { Attribute } from '@/features/attributes/types'
import { ColumnDef } from '@tanstack/react-table'
import {
  Activity,
  Calendar,
  CheckCircle2,
  Folder,
  MoreHorizontal,
  SquarePen,
  Tag,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

const getStatusVariant = (isGlobalFilter: boolean) => {
  return isGlobalFilter ? 'outline' : 'destructive'
}

const formatDate = (date: string | Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getColumns = (onOpenDrawer: (row: Attribute) => void): ColumnDef<Attribute>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onClick={(e) => {
          e.stopPropagation()
        }}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onClick={(e) => {
          e.stopPropagation()
        }}
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
    header: ({ column }) => <DataTableColumnHeader label='Tên Thuộc Tính' column={column} />,
    cell: ({ row }) => <div className='max-w-75 truncate font-medium'>{row.original.name}</div>,
    meta: {
      label: 'Tên Thuộc Tính',
      placeholder: 'Tìm thuộc tính theo tên...',
      variant: 'text',
      icon: Tag
    },
    enableColumnFilter: true
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader label='Slug' column={column} />,
    cell: ({ row }) => <div className='max-w-32 truncate'>{row.original.slug}</div>,
    meta: {
      label: 'Slug',
      placeholder: 'Tìm theo slug...',
      variant: 'text',
      icon: Folder
    }
  },
  {
    id: 'values',
    accessorFn: (row) => row.values.map((v) => v.value).join(', '),
    header: ({ column }) => <DataTableColumnHeader label='Giá Trị' column={column} />,
    cell: ({ row }) => {
      const attributeValues = row.original.values.map((v) => v.value)
      return (
        <BadgeOverflow
          items={attributeValues.map((value) => ({ name: value }))}
          getBadgeLabel={(item) => item.name}
          renderBadge={(item, label) => <Badge variant={'secondary'}>{label}</Badge>}
        />
      )
    },
    meta: {
      label: 'Giá Trị',
      placeholder: 'Tìm theo giá trị...',
      variant: 'text',
      icon: Tag
    },
    enableColumnFilter: true,
    size: 300
  },
  {
    id: 'isGlobalFilter',
    accessorKey: 'isGlobalFilter',
    header: ({ column }) => <DataTableColumnHeader label='Bộ Lọc Toàn Cục' column={column} />,
    cell: ({ row }) => {
      const isGlobalFilter = row.original.isGlobalFilter
      const Icon = isGlobalFilter === true ? CheckCircle2 : XCircle

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon size={14} className='mr-1' />
          {isGlobalFilter === true ? 'Có' : 'Không'}
        </Badge>
      )
    },
    meta: {
      label: 'Bộ Lọc Toàn Cục',
      variant: 'multiSelect',
      options: [
        { label: 'Có', value: 'true' },
        { label: 'Không', value: 'false' }
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
      const attribute = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button variant='ghost' onClick={() => onOpenDrawer(attribute)}>
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
                  navigator.clipboard.writeText(attribute.id)
                  toast.success('Attribute ID copied to clipboard')
                }}
              >
                Copy attribute ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit attribute</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete attribute</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
