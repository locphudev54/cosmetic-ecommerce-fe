'use client'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Category } from '@/features/categories/types'
import { ColumnDef } from '@tanstack/react-table'
import { Activity, Calendar, Edit2, Eye, MoreHorizontal, Tag, Folder } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { UpsertCategoryForm } from '@/features/categories/components/upsert-category-form'
import { Checkbox } from '@/components/ui/checkbox'

const getStatusVariant = (isActive: boolean) => {
  return isActive ? 'outline' : 'destructive'
}

const formatDate = (date: string | Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getColumns = (onOpenDrawer: (row: Category) => void): ColumnDef<Category>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader label='Tên Danh Mục' column={column} />,
    cell: ({ row }) => <div className='max-w-75 truncate'>{row.original.name}</div>,
    meta: {
      label: 'Tên Danh Mục',
      placeholder: 'Tìm danh mục theo tên...',
      variant: 'text',
      icon: Tag
    },
    enableColumnFilter: true
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: ({ column }) => <DataTableColumnHeader label='Slug' column={column} />,
    cell: ({ row }) => <div className='font-medium'>{row.original.slug}</div>,
    meta: {
      label: 'Slug',
      placeholder: 'Tìm theo slug...',
      variant: 'text',
      icon: Folder
    }
  },
  {
    id: 'parent',
    accessorFn: (row) => row.parent?.name,
    header: ({ column }) => <DataTableColumnHeader label='Danh Mục Cha' column={column} />,
    cell: ({ row }) => <div className='font-normal'>{row.original.parent?.name || ''}</div>,
    meta: {
      label: 'Danh Mục Cha',
      placeholder: 'Tìm theo danh mục cha...',
      variant: 'text',
      icon: Folder
    },
    enableColumnFilter: true
  },
  {
    id: 'depth',
    accessorKey: 'depth',
    header: ({ column }) => <DataTableColumnHeader label='Cấp Độ' column={column} />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('depth')}</div>,
    meta: {
      label: 'Cấp Độ',
      variant: 'number',
      icon: Eye
    }
  },
  {
    id: 'productCount',
    accessorKey: 'productCount',
    header: ({ column }) => <DataTableColumnHeader label='Số Sản Phẩm' column={column} />,
    cell: ({ row }) => {
      const count = row.getValue('productCount') as number | undefined
      return <div className='text-center'>{count || 0}</div>
    },
    meta: {
      label: 'Số Sản Phẩm',
      variant: 'number',
      icon: Tag
    }
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader label='Trạng Thái' column={column} />,
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return <Badge variant={getStatusVariant(isActive)}>{isActive ? 'Active' : 'Inactive'}</Badge>
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
  // {
  //   id: 'createdAt',
  //   accessorKey: 'createdAt',
  //   header: ({ column }) => <DataTableColumnHeader label='Ngày Tạo' column={column} />,
  //   cell: ({ row }) => formatDate(row.getValue('createdAt')),
  //   meta: {
  //     label: 'Ngày Tạo',
  //     variant: 'date',
  //     icon: Calendar
  //   }
  // },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button variant='ghost' onClick={() => onOpenDrawer(category)}>
            <Edit2 className='h-4 w-4' />
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id)}>
                Copy category ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit category</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete category</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
