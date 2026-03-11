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
import { ProductStatus } from '@/enums'
import { Product } from '@/features/product/types'
import { ColumnDef } from '@tanstack/react-table'
import {
  Activity,
  Calendar,
  DollarSign,
  Edit2,
  Eye,
  MapPin,
  MoreHorizontal,
  Package,
  SquarePen,
  Tag
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const getStatusVariant = (status: ProductStatus | null) => {
  switch (status) {
    case ProductStatus.PUBLISHED:
      return 'outline'
    case ProductStatus.DRAFT:
      return 'warning'
    case ProductStatus.ARCHIVED:
      return 'destructive'
    default:
      return 'default'
  }
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numPrice)
}

const formatDate = (date: string | Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const columns: ColumnDef<Product>[] = [
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
        checked={row.getIsSelected()}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40
  },
  // {
  //   id: 'code',
  //   accessorKey: 'code',
  //   header: ({ column }) => <DataTableColumnHeader label='Mã Sản Phẩm' column={column} />,
  //   cell: ({ row }) => <div className='font-medium'>{row.getValue('code')}</div>,
  //   meta: {
  //     label: 'Code',
  //     placeholder: 'Lọc theo mã..',
  //     variant: 'text',
  //     icon: Hash
  //   },
  //   enableColumnFilter: true,
  //   enableSorting: false,
  //   enableHiding: true
  // },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader label='Name' column={column} />,
    cell: ({ row, cell }) => <div className='max-w-75 truncate'>{row.getValue('name')}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Tìm sản phẩm theo mã / tên / mô tả...',
      variant: 'text',
      icon: Tag
    },
    enableColumnFilter: true
  },
  {
    id: 'brand',
    accessorKey: 'brand', // Note: accessorKey for object might need accessorFn if filtering logic expects string. But if it's nested, maybe accessorFn is better for filtering?
    // The original code used accessorKey "brand" and in cell accessed row.original.brand.name.
    // If I want to filter by brand name, I should probably use accessorFn or setup filter properly.
    // For now I'll stick to original accessorKey but maybe add accessorFn for sorting/filtering on name?
    accessorFn: (row) => row.brand?.name,
    header: ({ column }) => <DataTableColumnHeader label='Brand' column={column} />,
    cell: ({ row }) => {
      const brand = row.original.brand
      return <div>{brand?.name || 'N/A'}</div>
    },
    meta: {
      label: 'Brand',
      placeholder: 'Search brand...',
      variant: 'text',
      icon: Package
    },
    enableSorting: false
  },
  {
    id: 'countryOfOrigin',
    accessorFn: (row) => row.countryOfOrigin?.name,
    header: ({ column }) => <DataTableColumnHeader label='Country' column={column} />,
    cell: ({ row }) => {
      const country = row.original.countryOfOrigin
      return <div>{country?.name || 'N/A'}</div>
    },
    meta: {
      label: 'Country',
      placeholder: 'Search country...',
      variant: 'text',
      icon: MapPin
    },
    enableSorting: false
  },
  {
    id: 'basePrice',
    accessorKey: 'basePrice',
    header: ({ column }) => <DataTableColumnHeader label='Base Price' column={column} />,
    cell: ({ row }) => formatPrice(row.getValue('basePrice')),
    meta: {
      label: 'Base Price',
      placeholder: 'Filter price...',
      variant: 'number',
      icon: DollarSign
    }
    // enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader label='Trạng thái' column={column} />,
    cell: ({ row }) => {
      const status = row.getValue('status') as ProductStatus | null
      return <Badge variant={getStatusVariant(status)}>{status || 'UNKNOWN'}</Badge>
    },
    meta: {
      label: 'Tình trạng',
      variant: 'multiSelect',
      options: [
        { label: 'Published', value: ProductStatus.PUBLISHED },
        { label: 'Draft', value: ProductStatus.DRAFT },
        { label: 'Archived', value: ProductStatus.ARCHIVED }
      ],
      icon: Activity
    },
    enableColumnFilter: true
  },
  {
    id: 'views',
    accessorKey: 'views',
    header: ({ column }) => <DataTableColumnHeader label='Views' column={column} />,
    cell: ({ row }) => {
      const views = row.getValue('views') as number | null
      return <div className='text-center'>{views || 0}</div>
    },
    meta: {
      label: 'Views',
      variant: 'number',
      icon: Eye
    }
    // enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader label='Created At' column={column} />,
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
    meta: {
      label: 'Created At',
      variant: 'date',
      icon: Calendar
    }
    // enableColumnFilter: true
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      return (
        <div className='flex items-center justify-end'>
          <Button variant='ghost' size={'icon-sm'}>
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit product</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Delete product</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
