'use client'

import { Input } from '@/components/ui/input'
import React from 'react'

type LocComponentVipProps =
  | { value: string; onChange: (value: string) => void }
  | { defaultValue?: string }

function LocComponentVip(props: LocComponentVipProps) {
  const isControlled = 'value' in props

  const [internalValue, setInternalValue] = React.useState(
    isControlled ? '' : (props.defaultValue ?? '')
  )

  const value = isControlled ? props.value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    } else {
      props.onChange(newValue)
    }
  }

  return <Input value={value} onChange={handleChange} placeholder='Nhập giá trị...' />
}

export default React.memo(LocComponentVip)
