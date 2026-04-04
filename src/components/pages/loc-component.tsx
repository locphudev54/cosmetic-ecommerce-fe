'use client'

import { Input } from '@/components/ui/input'
import React from 'react'

type ControlledProps = {
  initialValue: string
  onChange: (value: string) => void
}

type UncontrolledProps = {
  initialValue?: undefined
  onChange?: undefined
}

type LocComponentProps = ControlledProps | UncontrolledProps

function LocComponent({ initialValue, onChange }: LocComponentProps) {
  // Version 1 (with effective value and controlled check)
  // const [value, setValue] = React.useState('')
  // const effectiveValue = initialValue !== undefined ? initialValue : value
  // const isControlled = initialValue !== undefined

  // const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value
  //   if (!isControlled) {
  //     setValue(newValue)
  //   }

  //   onChange?.(newValue)
  // }

  // Version 2 (single source of truth with syncing) - More complex but keeps a single source of truth and syncs if initialValue changes
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    if (initialValue !== undefined && initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue, value])

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  // Version 3 (simpler approach) - Not truly controlled, but works for demonstration - Not good about syncing if initialValue changes after mount
  // This approach will cause unnecessary re-renders if used in a parent component that changes the initialValue
  // and doesn't allow the parent to control the value after initial mount. It's simpler but less flexible.
  // const [value, setValue] = React.useState('')

  // React.useEffect(() => {
  //   if (initialValue !== undefined) {
  //     setValue(initialValue)
  //   }
  // }, [initialValue])

  // const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value
  //   setValue(newValue)
  //   onChange?.(newValue)
  // }

  return (
    // Version 1
    // <Input
    //   value={effectiveValue}
    //   onChange={handleValueChange}
    //   placeholder='Nhập giá trị...'
    //   className='w-full max-w-sm'
    // />

    // Version 2 & 3
    <Input
      value={value}
      onChange={handleValueChange}
      placeholder='Nhập giá trị...'
      className='w-full max-w-sm'
    />
  )
}

export default React.memo(LocComponent)
