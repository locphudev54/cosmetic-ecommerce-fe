import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import React from 'react'

interface SelectedProductFilterBadgeProps {
  selectedItems: { id: string; name: string }[]
  onClear?: () => void
}

export default function SelectedProductFilterBadge({
  selectedItems,
  onClear
}: SelectedProductFilterBadgeProps) {
  return (
    <Badge variant='outline' className='text-tiny flex items-center'>
      <span className='mr-1 font-normal text-gray-600'>Thương hiệu:</span>
      {selectedItems.map((item, index) => (
        <div key={index} className='font-bold text-gray-500'>
          <span key={item.id} className=''>
            {item.name}
          </span>
          {index < selectedItems.length - 1 && <span className='mr-1'>, </span>}
        </div>
      ))}

      <Button
        variant='ghost'
        size='icon'
        className='ml-2 h-4 w-4 rounded-full p-0 text-gray-500 hover:bg-gray-200'
        onClick={onClear}
      >
        <X className='h-3 w-3' strokeWidth={1} />
      </Button>
    </Badge>
  )
}
