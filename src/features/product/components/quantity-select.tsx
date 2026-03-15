'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  initialValue?: number
  max?: number
  min?: number
  className?: string
  classNameInput?: string
  onChange?: (quantity: number) => void
}

export default function QuantitySelect({
  initialValue = 1,
  max,
  min = 1,
  onChange,
  className = '',
  classNameInput = ''
}: Props) {
  const [quantity, setQuantity] = useState<number>(initialValue)

  useEffect(() => {
    setQuantity(initialValue)
  }, [initialValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = Number(e.target.value)
    if (isNaN(numberValue)) return

    if (max && numberValue > max) {
      setQuantity(max)
      onChange?.(max)
      toast.error(`Số lượng phải < ${max}`)
      return
    }

    if (numberValue < min) {
      setQuantity(min)
      onChange?.(min)
      toast.error('Số lượng phải > 0')
      return
    }

    setQuantity(numberValue)
    onChange?.(numberValue)
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    if (max && newQuantity > max) {
      toast.error(`Số lượng phải < ${max}`)
      return
    }
    setQuantity(newQuantity)
    onChange?.(newQuantity)
  }

  const handleDecrease = () => {
    const newQuantity = quantity - 1
    if (newQuantity < min) {
      toast.error('Số lượng phải > 0')
      return
    }
    setQuantity(newQuantity)
    onChange?.(newQuantity)
  }

  return (
    <div className={cn('inline-flex items-center gap-x-2', className)}>
      <Button
        type='button'
        variant={'outline'}
        size={'icon'}
        className='shrink-0'
        onClick={handleDecrease}
      >
        <Minus />
      </Button>
      <Input
        value={quantity}
        className={cn(
          'mb-[1px] aspect-square w-16 border-gray-300 bg-white text-center text-sm placeholder:text-center focus:outline-none dark:bg-slate-800',
          classNameInput
        )}
        pattern='[0-9]'
        onChange={handleInputChange}
      />
      <Button
        type='button'
        variant={'outline'}
        size={'icon'}
        className='shrink-0'
        onClick={handleIncrease}
      >
        <Plus />
      </Button>
    </div>
  )
}
